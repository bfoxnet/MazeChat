'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUp,
  Square,
  Paperclip,
  Globe,
  Mic,
  X,
  FileCode,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Attachment } from '@/types/chat';

interface ChatInputProps {
  onSendMessage: (content: string, attachments: Attachment[], useWebSearch: boolean) => void;
  onStopStreaming?: () => void;
  isStreaming?: boolean;
  onOpenTools?: () => void;
  onStartVoice?: () => void;
  activeModelName?: string;
  isIncognito?: boolean;
}

const SAMPLE_ATTACHMENTS: Attachment[] = [
  { id: 'att-1', name: 'architecture-spec.md', size: '24 KB', type: 'text/markdown' },
  { id: 'att-2', name: 'telemetry-metrics.csv', size: '1.2 MB', type: 'text/csv' },
  { id: 'att-3', name: 'memory-leak-profile.json', size: '4.8 MB', type: 'application/json' },
];

export function ChatInput({
  onSendMessage,
  onStopStreaming,
  isStreaming = false,
  onOpenTools,
  onStartVoice,
  activeModelName = 'Aura 4.5 Sonar',
  isIncognito = false,
}: ChatInputProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea up to max 220px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!content.trim() && attachments.length === 0) || isStreaming) return;
    onSendMessage(content.trim(), attachments, useWebSearch);
    setContent('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleAddSampleFile = () => {
    const nextFile = SAMPLE_ATTACHMENTS[attachments.length % SAMPLE_ATTACHMENTS.length];
    if (!attachments.some((a) => a.id === nextFile.id)) {
      setAttachments([...attachments, { ...nextFile, id: `att-${Date.now()}` }]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 select-none">
      {/* Floating Input Box (Claude / ChatGPT Style) */}
      <motion.div
        layout
        transition={{ duration: 0.2 }}
        className={`relative rounded-3xl border bg-card/95 shadow-2xl backdrop-blur-xl transition-all duration-200 ${
          isIncognito
            ? 'border-violet-500/50 shadow-violet-950/20'
            : 'border-border hover:border-border/80 focus-within:border-primary/50'
        }`}
      >
        {/* Attachment Previews */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-1.5 p-3 pb-0"
            >
              {attachments.map((att) => (
                <motion.div
                  key={att.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-xl bg-secondary border border-border text-xs text-foreground"
                >
                  {att.type.includes('markdown') || att.type.includes('code') ? (
                    <FileCode className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                  )}
                  <span className="font-medium truncate max-w-[130px]">{att.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(att.id)}
                    className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={
            isIncognito
              ? 'Temporary chat: Messages are not saved to history...'
              : 'Message Aura...'
          }
          className="w-full bg-transparent px-5 pt-3.5 pb-2 text-foreground placeholder:text-muted-foreground text-base sm:text-[16.5px] focus:outline-none resize-none leading-relaxed min-h-[48px]"
        />

        {/* Bottom Bar Inside Input Box */}
        <div className="flex items-center justify-between px-3.5 pb-2.5 pt-1">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            {/* Attachment Button */}
            <motion.button
              type="button"
              onClick={handleAddSampleFile}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:text-foreground hover:bg-secondary transition-colors"
              title="Attach sample code or document"
            >
              <Paperclip className="w-4 h-4" />
            </motion.button>

            {/* Web Search Toggle Pill */}
            <motion.button
              type="button"
              onClick={() => setUseWebSearch(!useWebSearch)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                useWebSearch
                  ? 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
                  : 'hover:text-foreground hover:bg-secondary text-muted-foreground'
              }`}
              title="Search the web for up-to-date sources"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[11px]">Search</span>
            </motion.button>

            {/* Tools Quick Menu */}
            {onOpenTools && (
              <motion.button
                type="button"
                onClick={onOpenTools}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium hover:text-foreground hover:bg-secondary transition-colors text-muted-foreground"
                title="Manage AI Connectors"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px]">Tools</span>
              </motion.button>
            )}

            {/* Voice Input */}
            {onStartVoice && (
              <motion.button
                type="button"
                onClick={onStartVoice}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:text-foreground hover:bg-secondary transition-colors"
                title="Voice input simulation"
              >
                <Mic className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Right Action: Send / Stop Button */}
          <div className="flex items-center">
            {isStreaming ? (
              <motion.button
                type="button"
                onClick={onStopStreaming}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center shadow-md transition-colors"
                title="Stop response"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={!content.trim() && attachments.length === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  content.trim() || attachments.length > 0
                    ? 'bg-foreground text-background shadow-md cursor-pointer'
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                }`}
                title="Send message (Enter)"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Subtle Caption */}
      <div className="text-xs sm:text-[12.5px] text-muted-foreground text-center mt-2 tracking-tight">
        Aura may generate inaccurate results. Verify technical code and calculations.
      </div>
    </div>
  );
}
