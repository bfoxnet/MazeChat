'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronRight, Brain, Clock, Sparkles } from 'lucide-react';
import { ReasoningTrace } from '@/types/chat';

interface ThinkingBlockProps {
  reasoning: ReasoningTrace;
  isStreaming?: boolean;
}

export function ThinkingBlock({ reasoning, isStreaming }: ThinkingBlockProps) {
  const [isOpen, setIsOpen] = useState(isStreaming || false);
  const isThinking = isStreaming && reasoning.isThinking;

  return (
    <div className="my-3 text-xs">
      {/* Claude-style Minimalist Accordion Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 py-1 px-2.5 -ml-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors select-none group font-medium"
      >
        <div className="flex items-center gap-1.5">
          {isThinking ? (
            <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" />
          ) : (
            <Brain className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
          )}

          <span className="text-[13px] font-sans">
            {isThinking
              ? 'Reasoning through strategy...'
              : `Thought for ${reasoning.thinkingTime ? reasoning.thinkingTime.toFixed(1) : '2.4'}s`}
          </span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-muted-foreground group-hover:text-foreground"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      {/* Animated Accordion Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-3.5 my-2 border-l border-border space-y-2 text-muted-foreground text-xs leading-relaxed">
              {reasoning.steps && reasoning.steps.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {reasoning.steps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex items-start gap-2 text-foreground/80"
                    >
                      <span className="text-muted-foreground font-mono text-[11px] select-none mt-0.5">
                        {idx + 1}.
                      </span>
                      <span>{step}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {reasoning.content && (
                <div className="pt-1.5 text-muted-foreground italic text-[11px]">
                  {reasoning.content}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
