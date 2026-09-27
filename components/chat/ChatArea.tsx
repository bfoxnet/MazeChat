'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { Conversation, Message } from '@/types/chat';
import { MessageItem } from './MessageItem';
import { PromptSuggestions } from './PromptSuggestions';
import { IncognitoBanner } from './IncognitoBanner';

interface ChatAreaProps {
  conversation: Conversation | null;
  activeModelName?: string;
  userName?: string;
  isStreaming?: boolean;
  onSendMessage: (text: string) => void;
  onEditSubmit: (messageId: string, newContent: string) => void;
  onRegenerate: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onFeedback: (messageId: string, type: 'like' | 'dislike') => void;
  onExitIncognito?: () => void;
}

export function ChatArea({
  conversation,
  activeModelName,
  userName = 'User',
  isStreaming = false,
  onSendMessage,
  onEditSubmit,
  onRegenerate,
  onDeleteMessage,
  onFeedback,
  onExitIncognito,
}: ChatAreaProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);
  const [prevConversationId, setPrevConversationId] = useState(conversation?.id);
  const userScrolledUpRef = useRef(false);

  // Reset jump button if conversation changes
  if (conversation?.id !== prevConversationId) {
    setPrevConversationId(conversation?.id);
    setShowJumpToBottom(false);
  }

  const messages = useMemo(() => conversation?.messages || [], [conversation?.messages]);
  const isIncognito = conversation?.isIncognito || false;

  // Reset scroll and lock to bottom when conversation changes
  useEffect(() => {
    userScrolledUpRef.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [conversation?.id]);

  // Keep pinned to bottom during streaming or when new messages arrive (unless user explicitly scrolled up)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (!userScrolledUpRef.current) {
      // Instant pinning during stream prevents smooth-scroll lag and false button triggers
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isStreaming]);

  // Track scroll position cleanly with hysteresis
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

    // If near the bottom, reset userScrolledUp and hide "Latest"
    if (distanceFromBottom <= 50) {
      userScrolledUpRef.current = false;
      setShowJumpToBottom(false);
    } else if (distanceFromBottom > 120) {
      // Only show "Latest" if user has intentionally scrolled up to read history
      userScrolledUpRef.current = true;
      setShowJumpToBottom(true);
    }
  };

  const scrollToBottom = () => {
    userScrolledUpRef.current = false;
    setShowJumpToBottom(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative flex-1 h-full min-h-0 flex flex-col bg-background text-foreground overflow-hidden transition-colors duration-200">
      {/* Incognito Top Banner */}
      {isIncognito && onExitIncognito && (
        <IncognitoBanner onExitIncognito={onExitIncognito} />
      )}

      {/* Main Scrollable Viewport */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden"
      >
        {messages.length === 0 ? (
          <PromptSuggestions
            onSelectPrompt={onSendMessage}
            userName={userName}
          />
        ) : (
          <div className="pt-3 pb-6">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                userName={userName}
                onEditSubmit={onEditSubmit}
                onRegenerate={onRegenerate}
                onDelete={onDeleteMessage}
                onFeedback={onFeedback}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating "Jump to Latest" Pill */}
      <AnimatePresence>
        {showJumpToBottom && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            onClick={scrollToBottom}
            aria-label="Jump to latest message"
            className="absolute bottom-4 right-8 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-foreground border border-border shadow-xl backdrop-blur-md text-xs font-medium cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Latest</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
