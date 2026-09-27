'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_PREFERENCES,
  MOCK_FOLDERS,
  MOCK_MEMORIES,
  MOCK_MODELS,
  MOCK_TOOLS,
  MOCK_USER,
} from '@/lib/mockData';
import {
  Attachment,
  Conversation,
  Folder,
  MemoryEntry,
  Message,
  UserPreferences,
  UserProfile,
} from '@/types/chat';
import { generateMockAIResponse } from '@/lib/chatSimulator';
import { ChatHeader } from '@/components/header/ChatHeader';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { ToolsDrawer } from '@/components/tools/ToolsDrawer';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { ShortcutsModal } from '@/components/modals/ShortcutsModal';
import { RenameModal } from '@/components/modals/RenameModal';
import { VoiceInputModal } from '@/components/chat/VoiceInputModal';

export default function ChatAppPage() {
  // Main State
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState<string | null>(INITIAL_CONVERSATIONS[0].id);
  const [incognitoChat, setIncognitoChat] = useState<Conversation | null>(null);
  const [folders, setFolders] = useState<Folder[]>(MOCK_FOLDERS);
  const [models] = useState(MOCK_MODELS);
  const [selectedModelId, setSelectedModelId] = useState(MOCK_MODELS[0].id);
  const [tools, setTools] = useState(MOCK_TOOLS);
  const [memories, setMemories] = useState<MemoryEntry[]>(MOCK_MEMORIES);
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_PREFERENCES);

  // UI Drawer / Modal States
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [toolsDrawerOpen, setToolsDrawerOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState('general');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [renameModalState, setRenameModalState] = useState<{ isOpen: boolean; chatId: string; title: string }>({
    isOpen: false,
    chatId: '',
    title: '',
  });

  // Streaming State & Ref
  const [isStreaming, setIsStreaming] = useState(false);
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<boolean>(false);

  // Determine current active conversation
  const currentConversation: Conversation | null = incognitoChat
    ? incognitoChat
    : conversations.find((c) => c.id === activeChatId) || null;

  const currentModel = models.find((m) => m.id === selectedModelId) || models[0];

  // Helper to update current conversation messages
  const updateCurrentChatMessages = useCallback(
    (updater: (msgs: Message[]) => Message[]) => {
      if (incognitoChat) {
        setIncognitoChat((prev) => (prev ? { ...prev, messages: updater(prev.messages) } : null));
      } else if (activeChatId) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeChatId
              ? { ...c, messages: updater(c.messages), updatedAt: Date.now() }
              : c
          )
        );
      }
    },
    [incognitoChat, activeChatId]
  );

  // Clean stop streaming handler
  const handleStopStreaming = useCallback(() => {
    abortControllerRef.current = true;
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    setIsStreaming(false);

    // Turn off streaming flag on the last assistant message
    updateCurrentChatMessages((msgs) => {
      const last = msgs[msgs.length - 1];
      if (last && last.role === 'assistant') {
        return [...msgs.slice(0, -1), { ...last, isStreaming: false }];
      }
      return msgs;
    });
  }, [updateCurrentChatMessages]);

  // Execute Simulated AI Stream
  const executeAIResponseStream = useCallback(
    (userPrompt: string, attachments: Attachment[] = [], useWebSearch = false) => {
      abortControllerRef.current = false;
      setIsStreaming(true);

      const activeToolNames = tools.filter((t) => t.isEnabled).map((t) => t.id);
      const simulated = generateMockAIResponse(userPrompt, selectedModelId, useWebSearch, activeToolNames);

      const assistantMsgId = `msg-asst-${Date.now()}`;

      // Create initial assistant message with running tool or thinking state
      const initialAssistantMessage: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
        modelId: selectedModelId,
        reasoning: simulated.reasoning
          ? { ...simulated.reasoning, isThinking: true }
          : undefined,
        toolCalls: simulated.toolCalls
          ? simulated.toolCalls.map((tc) => ({ ...tc, status: 'running' }))
          : undefined,
        citations: simulated.citations,
        isStreaming: true,
      };

      updateCurrentChatMessages((msgs) => [...msgs, initialAssistantMessage]);

      // Stage 1: Simulate thinking or tool execution for 1.2 seconds
      setTimeout(() => {
        if (abortControllerRef.current) return;

        // Resolve tool running -> completed, thinking -> concluded
        updateCurrentChatMessages((msgs) => {
          return msgs.map((m) => {
            if (m.id === assistantMsgId) {
              return {
                ...m,
                reasoning: m.reasoning ? { ...m.reasoning, isThinking: false } : undefined,
                toolCalls: m.toolCalls ? m.toolCalls.map((tc) => ({ ...tc, status: 'completed' })) : undefined,
              };
            }
            return m;
          });
        });

        // Stage 2: Stream content text incrementally
        const fullContent = simulated.content;
        let charIndex = 0;
        const chunkSize = 4; // chunk characters to simulate fast token stream

        streamTimerRef.current = setInterval(() => {
          if (abortControllerRef.current) {
            if (streamTimerRef.current) clearInterval(streamTimerRef.current);
            return;
          }

          charIndex += chunkSize;
          if (charIndex >= fullContent.length) {
            // Streaming finished
            if (streamTimerRef.current) clearInterval(streamTimerRef.current);
            streamTimerRef.current = null;
            setIsStreaming(false);

            updateCurrentChatMessages((msgs) => {
              return msgs.map((m) => {
                if (m.id === assistantMsgId) {
                  return {
                    ...m,
                    content: fullContent,
                    isStreaming: false,
                  };
                }
                return m;
              });
            });

            // Increment usage meter
            setUser((prev) => ({
              ...prev,
              usage: {
                ...prev.usage,
                fastQueriesUsed: Math.min(prev.usage.fastQueriesLimit, prev.usage.fastQueriesUsed + 1),
                deepQueriesUsed: selectedModelId.includes('thinker') || selectedModelId.includes('sonar')
                  ? Math.min(prev.usage.deepQueriesLimit, prev.usage.deepQueriesUsed + 1)
                  : prev.usage.deepQueriesUsed,
              },
            }));
          } else {
            // Update partial stream
            const partial = fullContent.slice(0, charIndex);
            updateCurrentChatMessages((msgs) => {
              return msgs.map((m) => {
                if (m.id === assistantMsgId) {
                  return { ...m, content: partial };
                }
                return m;
              });
            });
          }
        }, preferences.streamSpeedMs || 14);
      }, 1000);
    },
    [tools, selectedModelId, updateCurrentChatMessages, preferences.streamSpeedMs]
  );

  // Send message from chat input or suggestions
  const handleSendMessage = useCallback(
    (text: string, attachments: Attachment[] = [], useWebSearch = false) => {
      if (!text.trim() && attachments.length === 0) return;
      if (isStreaming) return;

      const userMessage: Message = {
        id: `msg-user-${Date.now()}`,
        role: 'user',
        content: text,
        createdAt: Date.now(),
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      // If no current chat or empty conversation, handle conversation initialization
      if (!currentConversation || currentConversation.messages.length === 0) {
        const smartTitle = text.slice(0, 36) + (text.length > 36 ? '...' : '');

        if (incognitoChat) {
          setIncognitoChat((prev) =>
            prev
              ? { ...prev, title: smartTitle, messages: [userMessage] }
              : null
          );
        } else if (activeChatId) {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeChatId
                ? { ...c, title: smartTitle, messages: [userMessage], updatedAt: Date.now() }
                : c
            )
          );
        }
      } else {
        updateCurrentChatMessages((msgs) => [...msgs, userMessage]);
      }

      // Trigger assistant stream
      executeAIResponseStream(text, attachments, useWebSearch);
    },
    [isStreaming, currentConversation, incognitoChat, activeChatId, updateCurrentChatMessages, executeAIResponseStream]
  );

  // Edit user message
  const handleEditUserMessage = useCallback(
    (messageId: string, newContent: string) => {
      if (isStreaming) handleStopStreaming();

      // Find message index
      const msgs = currentConversation?.messages || [];
      const targetIndex = msgs.findIndex((m) => m.id === messageId);
      if (targetIndex === -1) return;

      const updatedUserMsg: Message = {
        ...msgs[targetIndex],
        content: newContent,
      };

      // Trim all messages following this edited turn
      const trimmedMsgs = [...msgs.slice(0, targetIndex), updatedUserMsg];

      updateCurrentChatMessages(() => trimmedMsgs);

      // Trigger fresh assistant stream with the updated content
      executeAIResponseStream(newContent, updatedUserMsg.attachments, false);
    },
    [isStreaming, handleStopStreaming, currentConversation, updateCurrentChatMessages, executeAIResponseStream]
  );

  // Regenerate assistant message
  const handleRegenerate = useCallback(
    (assistantMessageId: string) => {
      if (isStreaming) handleStopStreaming();

      const msgs = currentConversation?.messages || [];
      const asstIndex = msgs.findIndex((m) => m.id === assistantMessageId);
      if (asstIndex <= 0) return;

      const userMsg = msgs[asstIndex - 1];
      if (userMsg.role !== 'user') return;

      // Slice out the assistant message and re-run
      const trimmedMsgs = msgs.slice(0, asstIndex);
      updateCurrentChatMessages(() => trimmedMsgs);

      executeAIResponseStream(userMsg.content, userMsg.attachments, false);
    },
    [isStreaming, handleStopStreaming, currentConversation, updateCurrentChatMessages, executeAIResponseStream]
  );

  // Delete single message
  const handleDeleteMessage = useCallback(
    (messageId: string) => {
      updateCurrentChatMessages((msgs) => msgs.filter((m) => m.id !== messageId));
    },
    [updateCurrentChatMessages]
  );

  // Feedback (like/dislike)
  const handleFeedback = useCallback(
    (messageId: string, type: 'like' | 'dislike') => {
      updateCurrentChatMessages((msgs) =>
        msgs.map((m) => {
          if (m.id === messageId) {
            return {
              ...m,
              feedback: m.feedback === type ? null : type,
            };
          }
          return m;
        })
      );
    },
    [updateCurrentChatMessages]
  );

  // New Chat
  const handleNewChat = useCallback(() => {
    if (isStreaming) handleStopStreaming();
    setIncognitoChat(null);

    const newChat: Conversation = {
      id: `chat-${Date.now()}`,
      title: 'New Conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: selectedModelId,
      messages: [],
    };

    setConversations((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }, [isStreaming, handleStopStreaming, selectedModelId]);

  // Start Incognito Chat
  const handleStartIncognito = useCallback(() => {
    if (isStreaming) handleStopStreaming();

    const tempChat: Conversation = {
      id: `incognito-${Date.now()}`,
      title: 'Incognito Session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      modelId: selectedModelId,
      isIncognito: true,
      messages: [],
    };

    setIncognitoChat(tempChat);
  }, [isStreaming, handleStopStreaming, selectedModelId]);

  // Exit Incognito
  const handleExitIncognito = useCallback(() => {
    setIncognitoChat(null);
  }, []);

  // Rename Conversation
  const handleOpenRename = useCallback((id: string, currentTitle: string) => {
    setRenameModalState({
      isOpen: true,
      chatId: id,
      title: currentTitle,
    });
  }, []);

  const handleSaveRename = useCallback((newTitle: string) => {
    if (!renameModalState.chatId) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === renameModalState.chatId ? { ...c, title: newTitle } : c))
    );
  }, [renameModalState.chatId]);

  // Toggle Pin
  const handleTogglePin = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  }, []);

  // Delete Conversation
  const handleDeleteChat = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (activeChatId === id) {
          setActiveChatId(next.length > 0 ? next[0].id : null);
        }
        return next;
      });
    },
    [activeChatId]
  );

  // Move to folder
  const handleMoveToFolder = useCallback((id: string, folderId: string | null) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, folderId } : c))
    );
  }, []);

  // Create folder
  const handleCreateFolder = useCallback((name: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      color: '#6366f1',
      isExpanded: true,
    };
    setFolders((prev) => [...prev, newFolder]);
  }, []);

  // Toggle tool
  const handleToggleTool = useCallback((toolId: string) => {
    setTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, isEnabled: !t.isEnabled } : t))
    );
  }, []);

  // Memory management
  const handleAddMemory = useCallback(
    (fact: string, category: 'preference' | 'work' | 'technical' | 'personal') => {
      const newEntry: MemoryEntry = {
        id: `mem-${Date.now()}`,
        fact,
        category,
        confidence: 0.95,
        dateAdded: new Date().toISOString().split('T')[0],
      };
      setMemories((prev) => [newEntry, ...prev]);
    },
    []
  );

  const handleDeleteMemory = useCallback((id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // Export conversations
  const handleExportChats = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(conversations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aura_chat_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [conversations]);

  // Clear all chats
  const handleClearAllChats = useCallback(() => {
    if (confirm('Are you sure you want to permanently clear all conversation history?')) {
      setConversations([]);
      handleNewChat();
    }
  }, [handleNewChat]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + N -> New Chat
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewChat();
      }
      // Cmd/Ctrl + / -> Shortcuts Dialog
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShortcutsModalOpen(true);
      }
      // Escape -> close any open modal
      if (e.key === 'Escape') {
        setToolsDrawerOpen(false);
        setSettingsModalOpen(false);
        setUpgradeModalOpen(false);
        setShortcutsModalOpen(false);
        setVoiceModalOpen(false);
        setRenameModalState((s) => ({ ...s, isOpen: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewChat]);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans transition-colors duration-200">
      {/* Responsive Collapsible Sidebar */}
      <Sidebar
        mobileOpen={mobileDrawerOpen}
        desktopOpen={desktopSidebarOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
        conversations={conversations}
        activeChatId={incognitoChat ? null : activeChatId}
        folders={folders}
        user={user}
        isIncognitoActive={!!incognitoChat}
        onSelectChat={(id) => {
          setIncognitoChat(null);
          setActiveChatId(id);
          setMobileDrawerOpen(false);
        }}
        onNewChat={() => {
          handleNewChat();
          setMobileDrawerOpen(false);
        }}
        onStartIncognito={() => {
          handleStartIncognito();
          setMobileDrawerOpen(false);
        }}
        onRenameChat={handleOpenRename}
        onTogglePin={handleTogglePin}
        onDeleteChat={handleDeleteChat}
        onMoveToFolder={handleMoveToFolder}
        onCreateFolder={handleCreateFolder}
        onOpenSettings={(tab) => {
          setSettingsInitialTab(tab || 'general');
          setSettingsModalOpen(true);
        }}
        onOpenUpgrade={() => setUpgradeModalOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <ChatHeader
          conversation={currentConversation}
          models={models}
          selectedModelId={selectedModelId}
          user={user}
          sidebarOpen={desktopSidebarOpen}
          onToggleSidebar={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
              setMobileDrawerOpen((prev) => !prev);
            } else {
              setDesktopSidebarOpen((prev) => !prev);
            }
          }}
          onSelectModel={setSelectedModelId}
          onOpenSettings={(tab) => {
            setSettingsInitialTab(tab || 'general');
            setSettingsModalOpen(true);
          }}
          onOpenTools={() => setToolsDrawerOpen(true)}
          onOpenShortcuts={() => setShortcutsModalOpen(true)}
          onOpenUpgrade={() => setUpgradeModalOpen(true)}
          onNewChat={handleNewChat}
        />

        {/* Chat Stream Viewport */}
        <ChatArea
          conversation={currentConversation}
          activeModelName={currentModel.name}
          userName={user.name}
          isStreaming={isStreaming}
          onSendMessage={(text) => handleSendMessage(text, [], false)}
          onEditSubmit={handleEditUserMessage}
          onRegenerate={handleRegenerate}
          onDeleteMessage={handleDeleteMessage}
          onFeedback={handleFeedback}
          onExitIncognito={handleExitIncognito}
        />

        {/* Bottom Multi-Line Input Box */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onStopStreaming={handleStopStreaming}
          isStreaming={isStreaming}
          onOpenTools={() => setToolsDrawerOpen(true)}
          onStartVoice={() => setVoiceModalOpen(true)}
          activeModelName={currentModel.name}
          isIncognito={!!incognitoChat}
        />
      </div>

      {/* Tools & Connectors Drawer */}
      <ToolsDrawer
        isOpen={toolsDrawerOpen}
        onClose={() => setToolsDrawerOpen(false)}
        tools={tools}
        onToggleTool={handleToggleTool}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        initialTab={settingsInitialTab}
        preferences={preferences}
        onUpdatePreferences={(updated) => setPreferences((p) => ({ ...p, ...updated }))}
        models={models}
        tools={tools}
        onToggleTool={handleToggleTool}
        memories={memories}
        onAddMemory={handleAddMemory}
        onDeleteMemory={handleDeleteMemory}
        user={user}
        onOpenUpgrade={() => {
          setSettingsModalOpen(false);
          setUpgradeModalOpen(true);
        }}
        onClearAllChats={handleClearAllChats}
        onExportChats={handleExportChats}
      />

      {/* Upgrade / Pricing Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        user={user}
        onSelectTier={(tier) => {
          setUser((u) => ({ ...u, planTier: tier }));
          alert(`Successfully switched workspace tier to: ${tier}!`);
        }}
      />

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* Rename Chat Modal */}
      <RenameModal
        key={renameModalState.chatId}
        isOpen={renameModalState.isOpen}
        onClose={() => setRenameModalState((s) => ({ ...s, isOpen: false }))}
        currentTitle={renameModalState.title}
        onSave={handleSaveRename}
      />

      {/* Voice Input Simulation Modal */}
      <VoiceInputModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onTranscribe={(text) => handleSendMessage(text, [], false)}
      />
    </div>
  );
}
