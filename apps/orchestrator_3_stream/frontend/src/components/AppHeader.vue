<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-title">
        <div class="logo-brand-group">
          <img
            src="../assets/logo-ol.png"
            alt="Ozean Licht - Agentic Ozean"
            class="header-logo"
          />
          <div class="brand-text-group">
            <span class="brand-text">Agentic Ozean</span>
            <span class="header-subtitle">LIVE LOG STREAM</span>
          </div>
        </div>
        <div class="connection-status">
          <span class="status-indicator" :class="{ online: store.isConnected }"></span>
          <span class="status-text">{{
            store.isConnected ? "Connected" : "Disconnected"
          }}</span>
        </div>
      </div>
      <div class="header-right">
        <div class="header-stats">
          <div class="stat-item stat-pill">
            <span class="stat-label">Active:</span>
            <span class="stat-value">{{ headerBar.activeAgentCount }}</span>
          </div>
          <div class="stat-item stat-pill">
            <span class="stat-label">Running:</span>
            <span class="stat-value">{{ headerBar.runningAgentCount }}</span>
          </div>
          <div class="stat-item stat-pill">
            <span class="stat-label">Logs:</span>
            <span class="stat-value">{{ headerBar.logCount }}</span>
          </div>
          <div class="stat-item stat-pill">
            <span class="stat-label">Cost:</span>
            <span class="stat-value">${{ headerBar.formattedCost }}</span>
          </div>
        </div>

        <div class="header-actions">
          <button
            class="btn-refresh"
            :class="{ loading: store.isRefreshing }"
            :disabled="store.isRefreshing"
            @click="handleRefreshContext"
            title="Refresh context and reload all data"
            aria-label="Refresh orchestrator context"
          >
            <span v-if="!store.isRefreshing">
              ↻ REFRESH
            </span>
            <span v-else class="loading-spinner">⟳ REFRESHING...</span>
          </button>
          <button class="btn-clear" @click="headerBar.clearEventStream">
            CLEAR ALL
          </button>
          <button
            class="btn-prompt"
            :class="{ active: store.commandInputVisible }"
            @click="store.toggleCommandInput"
            title="Toggle command input (Cmd+K / Ctrl+K)"
          >
            PROMPT <span class="btn-hint">(Cmd+K)</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useHeaderBar } from "../composables/useHeaderBar";
import { useOrchestratorStore } from '../stores/orchestratorStore';

// Use header bar composable for state management
const headerBar = useHeaderBar();

// Use store for command input visibility
const store = useOrchestratorStore();

// Handle context refresh
async function handleRefreshContext() {
  await store.refreshContext();
}
</script>

<style scoped>
/* Header */
.app-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: var(--spacing-sm) var(--spacing-lg);
  max-height: 80px;
  overflow: hidden;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
}

.header-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.logo-brand-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.brand-text-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-logo {
  height: 48px;
  width: 48px;
  object-fit: contain;
  transition: opacity 0.2s ease;
}

.header-logo:hover {
  opacity: 0.9;
}

.brand-text {
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.1rem;
  font-weight: 400;
  color: white;
  letter-spacing: 0.05em;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 0.7rem;
  color: var(--accent-primary);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.7rem;
  color: var(--text-muted);
  padding-left: var(--spacing-sm);
  margin-left: var(--spacing-sm);
  border-left: 1px solid var(--border-color);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
}

.status-indicator.online {
  background: var(--status-success);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.status-text {
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.header-stats {
  display: flex;
  gap: var(--spacing-xl);
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
  padding-left: var(--spacing-xl);
  border-left: 1px solid var(--border-color);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
}

.stat-label {
  color: var(--text-muted);
  font-weight: 500;
}

.stat-value {
  color: var(--text-primary);
  font-weight: 700;
  font-family: var(--font-mono);
}

/* Stat Pills - Flat Gray Badge Style */
.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--bg-tertiary);
  border-radius: 10px;
  font-size: 0.7rem;
  border: 1px solid var(--border-light);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.stat-pill:hover {
  background: var(--bg-quaternary);
  border-color: var(--border-color);
}

.stat-pill .stat-label {
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.65rem;
}

.stat-pill .stat-value {
  color: var(--text-primary);
  font-weight: 700;
  font-family: var(--font-mono);
  font-size: 0.7rem;
}

/* Action Buttons */
.btn-prompt,
.btn-clear,
.btn-refresh {
  padding: 6px 10px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  border-radius: 4px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-hint {
  font-size: 0.6rem;
  font-weight: 500;
  opacity: 0.7;
  margin-left: 0.25rem;
}

.btn-prompt:hover,
.btn-clear:hover,
.btn-refresh:hover:not(:disabled) {
  background: var(--bg-quaternary);
  color: var(--text-primary);
  border-color: var(--accent-primary);
  transform: translateY(-1px);
}

.btn-prompt.active {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-refresh.loading {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
}

.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1200px) {
  .header-stats {
    gap: var(--spacing-md);
  }
}

@media (max-width: 1024px) {
  .header-logo {
    height: 28px;
  }

  .header-subtitle {
    font-size: 0.75rem;
  }
}

@media (max-width: 650px) {
  .header-logo {
    height: 24px;
  }
}
</style>
