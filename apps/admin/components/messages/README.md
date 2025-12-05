# Team Chat & Messaging Components

UI components for the team chat and messaging system, supporting team channels, direct messages, and internal tickets.

## Components

### ConversationSidebar
Left sidebar showing all conversations grouped by type (channels, DMs, internal tickets).

```tsx
import { ConversationSidebar } from '@/components/messages';

<ConversationSidebar
  conversations={conversations}
  selectedId={selectedConversationId}
  onSelect={(conv) => setSelectedConversation(conv)}
  onNewChannel={() => setShowNewChannelModal(true)}
  onNewDM={() => setShowNewDMModal(true)}
  currentUserId={userId}
  canAccessInternalTickets={true}
/>
```

### ChannelHeader
Header bar for conversation view with title, description, and actions.

```tsx
import { ChannelHeader } from '@/components/messages';

<ChannelHeader
  conversation={selectedConversation}
  isStarred={false}
  onStar={() => toggleStar()}
  onArchive={() => archiveConversation()}
  onLeave={() => leaveConversation()}
/>
```

### MessageList
Messages display with support for threads, attachments, and private notes.

```tsx
import { MessageList } from '@/components/messages';

<MessageList
  messages={messages}
  conversationType="team_channel"
  currentUserId={userId}
  loading={false}
  onExpandThread={(threadId) => loadThread(threadId)}
/>
```

### MessageComposer
Input area for composing and sending messages with attachments.

```tsx
import { MessageComposer } from '@/components/messages';

<MessageComposer
  onSend={(content, isPrivate, attachments) => sendMessage(content, isPrivate, attachments)}
  allowPrivateNotes={true}
  placeholder="Type a message..."
  typingUsers={['Alice', 'Bob']}
  onTyping={(typing) => updateTypingStatus(typing)}
/>
```

### ParticipantList
List of conversation participants with roles and online status.

```tsx
import { ParticipantList } from '@/components/messages';

<ParticipantList
  participants={participants}
  currentUserId={userId}
  canManage={true}
  onAddParticipant={() => openAddParticipantModal()}
  onRemoveParticipant={(id) => removeParticipant(id)}
/>
```

### NewChannelModal
Modal for creating a new team channel.

```tsx
import { NewChannelModal } from '@/components/messages';

<NewChannelModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onCreate={(data) => createChannel(data)}
  availableUsers={users}
  loading={isCreating}
/>
```

### NewDMModal
Modal for starting a direct message conversation.

```tsx
import { NewDMModal } from '@/components/messages';

<NewDMModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onCreate={(userIds) => startDM(userIds)}
  availableUsers={users}
  loading={isCreating}
/>
```

### OnlineIndicator
Small status indicator dot showing user presence state.

```tsx
import { OnlineIndicator } from '@/components/messages';

<OnlineIndicator status="online" />
```

### UnreadBadge
Badge showing unread message count.

```tsx
import { UnreadBadge } from '@/components/messages';

<UnreadBadge count={5} />
```

## Complete Example

Here's a complete example of a messaging page:

```tsx
'use client';

import { useState } from 'react';
import {
  ConversationSidebar,
  ChannelHeader,
  MessageList,
  MessageComposer,
  ParticipantList,
  NewChannelModal,
  NewDMModal,
} from '@/components/messages';
import { UnifiedConversation, UnifiedMessage } from '@/types/team-chat';

export default function MessagingPage() {
  const [conversations, setConversations] = useState<UnifiedConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<UnifiedConversation | null>(null);
  const [messages, setMessages] = useState<UnifiedMessage[]>([]);
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [showNewDMModal, setShowNewDMModal] = useState(false);

  const currentUserId = 'user-123'; // Get from auth

  const handleSendMessage = async (
    content: string,
    isPrivate: boolean,
    attachments: File[]
  ) => {
    // Send message via API
    console.log('Sending message:', { content, isPrivate, attachments });
  };

  const handleCreateChannel = async (data: {
    title: string;
    description: string;
    isPrivate: boolean;
    initialMemberIds: string[];
  }) => {
    // Create channel via API
    console.log('Creating channel:', data);
    setShowNewChannelModal(false);
  };

  const handleStartDM = async (userIds: string[]) => {
    // Start DM via API
    console.log('Starting DM with users:', userIds);
    setShowNewDMModal(false);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        selectedId={selectedConversation?.id}
        onSelect={setSelectedConversation}
        onNewChannel={() => setShowNewChannelModal(true)}
        onNewDM={() => setShowNewDMModal(true)}
        currentUserId={currentUserId}
        canAccessInternalTickets={true}
      />

      {/* Main conversation area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <ChannelHeader
              conversation={selectedConversation}
              isStarred={false}
              onStar={() => console.log('Toggle star')}
              onArchive={() => console.log('Archive')}
              onLeave={() => console.log('Leave')}
            />

            {/* Messages */}
            <MessageList
              messages={messages}
              conversationType={selectedConversation.type}
              currentUserId={currentUserId}
              loading={false}
              onExpandThread={(threadId) => console.log('Expand thread:', threadId)}
            />

            {/* Composer */}
            <MessageComposer
              onSend={handleSendMessage}
              allowPrivateNotes={selectedConversation.type === 'support'}
              placeholder="Type a message..."
              typingUsers={[]}
              onTyping={(typing) => console.log('Typing:', typing)}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#C4C8D4]">Select a conversation to start messaging</p>
          </div>
        )}
      </div>

      {/* Right sidebar - Participant list */}
      {selectedConversation && (
        <div className="w-64 border-l border-border bg-card/70 backdrop-blur-sm p-4">
          <ParticipantList
            participants={selectedConversation.participants || []}
            currentUserId={currentUserId}
            canManage={true}
            onAddParticipant={() => console.log('Add participant')}
            onRemoveParticipant={(id) => console.log('Remove participant:', id)}
          />
        </div>
      )}

      {/* Modals */}
      <NewChannelModal
        open={showNewChannelModal}
        onClose={() => setShowNewChannelModal(false)}
        onCreate={handleCreateChannel}
        availableUsers={[]}
        loading={false}
      />

      <NewDMModal
        open={showNewDMModal}
        onClose={() => setShowNewDMModal(false)}
        onCreate={handleStartDM}
        availableUsers={[]}
        loading={false}
      />
    </div>
  );
}
```

## Design System Compliance

All components follow the Ozean Licht design system:

- **Colors**: Primary (#0ec2bc), Background (#00070F), Card (#00111A), Border (#0E282E), Text (#C4C8D4)
- **Typography**: Montserrat for UI, weights 300-600 (never bold 700+)
- **Icons**: SVG icons in primary color, not emojis
- **Glass morphism**: backdrop-blur-sm with semi-transparent backgrounds
- **Hover states**: Primary color with opacity for interactive elements
- **Focus rings**: 2px primary color ring

## Type Definitions

All components use types from `@/types/team-chat`:
- `UnifiedConversation` - Base conversation type
- `TeamChannel` - Team channel specific
- `DirectMessage` - Direct message specific
- `InternalTicket` - Internal ticket specific
- `UnifiedMessage` - Message entity
- `ConversationParticipant` - Participant with role
- `PresenceStatus` - User online status

## Testing

Components are designed to be testable and accept all necessary props:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageComposer } from '@/components/messages';

test('sends message on button click', () => {
  const onSend = jest.fn();
  render(<MessageComposer onSend={onSend} />);

  const input = screen.getByPlaceholderText('Type a message...');
  fireEvent.change(input, { target: { value: 'Hello' } });

  const sendButton = screen.getByRole('button', { name: /send/i });
  fireEvent.click(sendButton);

  expect(onSend).toHaveBeenCalledWith('Hello', false, []);
});
```

## Performance Considerations

- **Auto-scroll**: MessageList uses `useEffect` with ref for smooth scrolling
- **Typing indicators**: Debounced to avoid excessive updates (1 second timeout)
- **Search**: Client-side filtering for instant results
- **Lazy loading**: Use virtualization for large conversation lists
- **Image optimization**: Use Next.js Image component for attachment previews
