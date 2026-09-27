export type Role = 'user' | 'assistant' | 'system';

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface ToolCall {
  id: string;
  name: string;
  label: string;
  status: 'running' | 'completed' | 'failed';
  input: Record<string, any>;
  result?: any;
  timestamp?: string;
}

export interface Citation {
  title: string;
  url: string;
  snippet: string;
  domain: string;
  favicon?: string;
}

export interface ReasoningTrace {
  isThinking?: boolean;
  thinkingTime?: number;
  steps: string[];
  content: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  modelId?: string;
  attachments?: Attachment[];
  reasoning?: ReasoningTrace;
  toolCalls?: ToolCall[];
  citations?: Citation[];
  feedback?: 'like' | 'dislike' | null;
  isStreaming?: boolean;
  error?: string | null;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  modelId: string;
  folderId?: string | null;
  isPinned?: boolean;
  isIncognito?: boolean;
  messages: Message[];
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
  isExpanded?: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  contextWindow: string;
  speed: 'Ultra Fast' | 'Balanced' | 'Deep Reasoning';
  capabilities: ('reasoning' | 'vision' | 'coding' | 'tools' | 'search')[];
  isDefault?: boolean;
}

export interface AITool {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  isEnabled: boolean;
  status: 'connected' | 'needs_auth' | 'disabled';
  lastUsed?: string;
}

export interface MemoryEntry {
  id: string;
  fact: string;
  category: 'preference' | 'work' | 'technical' | 'personal';
  confidence: number;
  dateAdded: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  planTier: 'Free' | 'Pro Workspace' | 'Enterprise';
  usage: {
    fastQueriesUsed: number;
    fastQueriesLimit: number;
    deepQueriesUsed: number;
    deepQueriesLimit: number;
    storageUsedGb: number;
    storageLimitGb: number;
    resetDays: number;
  };
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  sendOnEnter: boolean;
  systemInstructions: string;
  enableMemory: boolean;
  streamSpeedMs: number;
  defaultModelId: string;
  compactMode: boolean;
  soundEnabled: boolean;
  codeLineNumbers: boolean;
}
