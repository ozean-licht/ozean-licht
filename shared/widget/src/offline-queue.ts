/**
 * Offline Message Queue
 *
 * Manages offline message queuing using IndexedDB for persistent storage.
 * Messages are stored locally when offline and automatically sent when
 * connectivity is restored.
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { QueuedMessage, Attachment } from './types';

// ============================================================================
// Database Schema
// ============================================================================

interface SupportDB extends DBSchema {
  messages: {
    key: string;
    value: QueuedMessage;
  };
}

// ============================================================================
// Types
// ============================================================================

type SendMessageFunction = (
  conversationId: string,
  content: string,
  attachments: Attachment[]
) => Promise<{ success: boolean; messageId?: string; error?: string }>;

// ============================================================================
// OfflineQueue Class
// ============================================================================

/**
 * Manages a queue of messages to be sent when online
 */
export default class OfflineQueue {
  private db: IDBPDatabase<SupportDB> | null = null;
  private queue: QueuedMessage[] = [];
  private sendMessage: SendMessageFunction | null = null;
  private isProcessing = false;
  private readonly maxRetries = 5;
  private readonly dbName = 'ozean-support';
  private readonly dbVersion = 1;
  private readonly storeName = 'messages';

  constructor(sendMessageFn?: SendMessageFunction) {
    if (sendMessageFn) {
      this.sendMessage = sendMessageFn;
    }

    // Listen for online events to process queue
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.processQueue();
      });
    }
  }

  /**
   * Set or update the send message function
   */
  setSendMessageFunction(fn: SendMessageFunction): void {
    this.sendMessage = fn;
  }

  /**
   * Initialize the IndexedDB database
   */
  async init(): Promise<void> {
    try {
      this.db = await openDB<SupportDB>(this.dbName, this.dbVersion, {
        upgrade(db) {
          // Create messages object store if it doesn't exist
          if (!db.objectStoreNames.contains('messages')) {
            db.createObjectStore('messages', { keyPath: 'id' });
          }
        },
      });

      // Load pending messages from IndexedDB into memory
      await this.loadPendingMessages();
    } catch (error) {
      console.error('Failed to initialize offline queue database:', error);
      throw error;
    }
  }

  /**
   * Load all pending messages from IndexedDB into memory
   */
  private async loadPendingMessages(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      this.queue = await store.getAll();
      await tx.done;
    } catch (error) {
      console.error('Failed to load pending messages:', error);
      this.queue = [];
    }
  }

  /**
   * Add a message to the offline queue
   */
  async add(
    conversationId: string,
    content: string,
    attachments: Attachment[] = []
  ): Promise<QueuedMessage> {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }

    const message: QueuedMessage = {
      id: generateUUID(),
      conversationId,
      content,
      attachments,
      queuedAt: Date.now(),
      retryCount: 0,
    };

    // Add to memory queue
    this.queue.push(message);

    try {
      // Store in IndexedDB for persistence
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      await store.add(message);
      await tx.done;
    } catch (error) {
      console.error('Failed to store message in IndexedDB:', error);
      // Remove from memory queue if DB operation failed
      const index = this.queue.findIndex((m) => m.id === message.id);
      if (index > -1) {
        this.queue.splice(index, 1);
      }
      throw error;
    }

    // If online, immediately try to process the queue
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      // Don't await to avoid blocking
      this.processQueue().catch((error) => {
        console.error('Error processing queue after add:', error);
      });
    }

    return message;
  }

  /**
   * Process all messages in the queue
   */
  async processQueue(): Promise<void> {
    // Prevent concurrent processing
    if (this.isProcessing) {
      return;
    }

    // Check if we have a send function
    if (!this.sendMessage) {
      console.warn('Cannot process queue: sendMessage function not set');
      return;
    }

    // Check if we're online
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return;
    }

    this.isProcessing = true;

    try {
      // Process messages one at a time (in order)
      while (this.queue.length > 0) {
        const message = this.queue[0];

        try {
          // Attempt to send the message
          const result = await this.sendMessage(
            message.conversationId,
            message.content,
            message.attachments
          );

          if (result.success) {
            // Successfully sent - remove from queue
            await this.remove(message.id);
          } else {
            // Failed to send - increment retry count
            message.retryCount++;

            if (message.retryCount >= this.maxRetries) {
              // Max retries exceeded - give up and remove
              console.error(
                `Message ${message.id} failed after ${this.maxRetries} retries. Removing from queue.`,
                result.error
              );
              await this.remove(message.id);
            } else {
              // Update retry count in database
              await this.updateMessage(message);
              // Move to next message (will retry on next processQueue call)
              break;
            }
          }
        } catch (error) {
          // Network or other error - increment retry count
          console.error('Error sending message:', error);
          message.retryCount++;

          if (message.retryCount >= this.maxRetries) {
            // Max retries exceeded - give up and remove
            console.error(
              `Message ${message.id} failed after ${this.maxRetries} retries. Removing from queue.`
            );
            await this.remove(message.id);
          } else {
            // Update retry count and stop processing
            await this.updateMessage(message);
            break;
          }
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Update a message in the database (for retry count updates)
   */
  private async updateMessage(message: QueuedMessage): Promise<void> {
    if (!this.db) {
      return;
    }

    try {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      await store.put(message);
      await tx.done;
    } catch (error) {
      console.error('Failed to update message in IndexedDB:', error);
    }
  }

  /**
   * Remove a message from the queue
   */
  async remove(id: string): Promise<void> {
    // Remove from memory queue
    const index = this.queue.findIndex((m) => m.id === id);
    if (index > -1) {
      this.queue.splice(index, 1);
    }

    // Remove from IndexedDB
    if (this.db) {
      try {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        await store.delete(id);
        await tx.done;
      } catch (error) {
        console.error('Failed to remove message from IndexedDB:', error);
      }
    }
  }

  /**
   * Get all queued messages
   */
  getAll(): QueuedMessage[] {
    return [...this.queue];
  }

  /**
   * Clear all messages from the queue
   */
  async clear(): Promise<void> {
    this.queue = [];

    if (this.db) {
      try {
        const tx = this.db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        await store.clear();
        await tx.done;
      } catch (error) {
        console.error('Failed to clear messages from IndexedDB:', error);
      }
    }
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a RFC4122 version 4 compliant UUID
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
