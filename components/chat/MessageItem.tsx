'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Check, X, AlertTriangle, Edit3 } from 'lucide-react';
import { Message } from '@/types/chat';
import { MessageContent } from './MessageContent';
import { ThinkingBlock } from './ThinkingBlock';
import { ToolCallBlock } from './ToolCallBlock';
import { CitationsBlock } from './CitationsBlock';
import { MessageActions } from './MessageActions';
import { Button } from '@/components/ui/button';

interface MessageItemProps {
  message: Message;
  userName?: string;
  onEditSubmit?: (messageId: string, newContent: string) => void;
  onRegenerate?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onFeedback?: (messageId: string, type: 'like' | 'dislike') => void;
}

export function MessageItem({
  message,
  userName = 'User',
  onEditSubmit,
  onRegenerate,
  onDelete,
  onFeedback,
}: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(message.content);

  const isUser = message.role === 'user';

  const handleSaveEdit = () => {
    if (editDraft.trim() && onEditSubmit) {
      onEditSubmit(message.id, editDraft.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditDraft(message.content);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="py-2.5 sm:py-3.5 px-3 sm:px-6 group"
    >
      <div className="max-w-3xl mx-auto">
        {/* ================================================================ */}
        {/* USER MESSAGE: Claude/ChatGPT Style (Clean Right-Aligned Prompt)  */}
        {/* ================================================================ */}
        {isUser ? (
          <div className="flex flex-col items-end">
            {/* Attached Files Chips */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-end mb-2">
                {message.attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-secondary border border-border text-xs text-foreground/80"
                  >
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span className="font-medium truncate max-w-[150px]">{file.name}</span>
                    <span className="text-[10px] text-muted-foreground">({file.size})</span>
                  </div>
                ))}
              </div>
            )}

            {isEditing ? (
              /* Inline Edit Mode */
              <div className="w-full max-w-2xl bg-card border border-primary/60 rounded-2xl p-3 shadow-lg space-y-2">
                <textarea
                  value={editDraft}
                  onChange={(e) => setEditDraft(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none resize-none leading-relaxed min-h-[80px]"
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-border">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSaveEdit}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save & Resubmit</span>
                  </Button>
                </div>
              </div>
            ) : (
              /* Normal User Prompt - Claude Card Style */
              <div className="relative group/prompt flex items-center gap-2 max-w-[88%] sm:max-w-[78%]">
                <button
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit prompt"
                  className="opacity-0 group-hover/prompt:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-opacity"
                  title="Edit message"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <div className="bg-secondary/80 hover:bg-secondary border border-border/60 text-foreground text-[15px] leading-relaxed px-4 py-2.5 rounded-2xl shadow-xs transition-colors whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ====================================================================== */
          /* ASSISTANT MESSAGE: Claude/ChatGPT Style (No AI Logo/Title, Pure Flow)  */
          /* ====================================================================== */
          <div className="space-y-3 px-1 sm:px-2">
            {/* Reasoning Trace (Claude-style Thinking Accordion) */}
            {message.reasoning && (
              <ThinkingBlock
                reasoning={message.reasoning}
                isStreaming={message.isStreaming}
              />
            )}

            {/* Tool Calls */}
            {message.toolCalls && message.toolCalls.length > 0 && (
              <div className="space-y-2 my-2">
                {message.toolCalls.map((tc) => (
                  <ToolCallBlock key={tc.id} toolCall={tc} />
                ))}
              </div>
            )}

            {/* Citations */}
            {message.citations && message.citations.length > 0 && (
              <CitationsBlock citations={message.citations} />
            )}

            {/* Error Message */}
            {message.error ? (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5 my-2">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Generation Interrupted</div>
                  <div className="text-xs opacity-80 mt-0.5">{message.error}</div>
                </div>
              </div>
            ) : (
              /* Pure Editorial Markdown Flow with comfortable breathing room */
              <div className="text-[15px] leading-relaxed text-foreground selection:bg-indigo-500/20">
                <MessageContent
                  content={message.content}
                  isStreaming={message.isStreaming}
                />
              </div>
            )}

            {/* Action Toolbar on Bottom */}
            {!message.isStreaming && (
              <div className="pt-0.5">
                <MessageActions
                  role={message.role}
                  content={message.content}
                  feedback={message.feedback}
                  onRegenerate={onRegenerate ? () => onRegenerate(message.id) : undefined}
                  onDelete={onDelete ? () => onDelete(message.id) : undefined}
                  onFeedback={
                    onFeedback
                      ? (type) => onFeedback(message.id, type)
                      : undefined
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
