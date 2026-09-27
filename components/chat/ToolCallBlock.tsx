'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  Globe,
  Code2,
  Calendar,
  FolderKanban,
  GitBranch,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { ToolCall } from '@/types/chat';

interface ToolCallBlockProps {
  toolCall: ToolCall;
}

export function ToolCallBlock({ toolCall }: ToolCallBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getToolIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('search') || lower.includes('web')) return <Globe className="w-3.5 h-3.5 text-blue-400" />;
    if (lower.includes('python') || lower.includes('code')) return <Code2 className="w-3.5 h-3.5 text-emerald-400" />;
    if (lower.includes('calendar')) return <Calendar className="w-3.5 h-3.5 text-amber-400" />;
    if (lower.includes('drive')) return <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />;
    if (lower.includes('github') || lower.includes('git')) return <GitBranch className="w-3.5 h-3.5 text-purple-400" />;
    return <Wrench className="w-3.5 h-3.5 text-zinc-400" />;
  };

  return (
    <div className="my-2.5 rounded-2xl border border-border bg-card overflow-hidden text-xs max-w-2xl shadow-xs">
      {/* Header Bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-secondary/60 text-left transition-colors select-none group"
      >
        <div className="flex items-center gap-2">
          {getToolIcon(toolCall.name)}
          <span className="font-medium text-foreground">{toolCall.name}</span>
          <span className="text-[11px] text-muted-foreground font-mono">({toolCall.label})</span>
        </div>

        <div className="flex items-center gap-2.5">
          {toolCall.status === 'running' && (
            <span className="flex items-center gap-1.5 text-[11px] text-amber-500 font-mono">
              <Loader2 className="w-3 h-3 animate-spin" />
              Running
            </span>
          )}
          {toolCall.status === 'completed' && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Finished
            </span>
          )}
          {toolCall.status === 'failed' && (
            <span className="flex items-center gap-1 text-[11px] text-destructive font-mono">
              <AlertCircle className="w-3 h-3" />
              Error
            </span>
          )}

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground group-hover:text-foreground"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-secondary/30 p-3 space-y-2.5"
          >
            <div>
              <div className="text-[10px] uppercase font-mono text-muted-foreground font-medium mb-1">
                Inputs
              </div>
              <pre className="p-2 rounded-lg bg-card text-foreground font-mono text-[11px] overflow-x-auto border border-border">
                {JSON.stringify(toolCall.input, null, 2)}
              </pre>
            </div>

            {toolCall.result && (
              <div>
                <div className="text-[10px] uppercase font-mono text-muted-foreground font-medium mb-1">
                  Returned Value
                </div>
                <pre className="p-2 rounded-lg bg-card text-primary font-mono text-[11px] overflow-x-auto border border-border">
                  {typeof toolCall.result === 'string'
                    ? toolCall.result
                    : JSON.stringify(toolCall.result, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
