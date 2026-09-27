'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Code2, Sigma, Network, Globe, Sparkles } from 'lucide-react';
import { PROMPT_SUGGESTIONS } from '@/lib/mockData';

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
  activeModelName?: string;
  userName?: string;
}

export function PromptSuggestions({
  onSelectPrompt,
  userName = 'Ahmed',
}: PromptSuggestionsProps) {
  const getCategoryIcon = (category: string) => {
    if (category.includes('Code')) return <Code2 className="w-4 h-4 text-emerald-500" />;
    if (category.includes('Math')) return <Sigma className="w-4 h-4 text-amber-500" />;
    if (category.includes('System')) return <Network className="w-4 h-4 text-indigo-500" />;
    return <Globe className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center select-none">
      {/* Greeting Headline (Claude / ChatGPT style) */}
      <motion.h1
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground tracking-tight"
      >
        How can I help you today?
      </motion.h1>

      <motion.p
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="text-base sm:text-[16.5px] text-muted-foreground mt-3 max-w-lg leading-relaxed"
      >
        Ask questions, analyze documents, write code, or reason through complex problems.
      </motion.p>

      {/* Suggestion Cards */}
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full text-left"
      >
        {PROMPT_SUGGESTIONS.map((item, idx) => (
          <motion.button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex flex-col justify-between p-4 rounded-2xl border border-border/80 bg-secondary/40 hover:bg-secondary hover:border-primary/40 transition-colors group cursor-pointer text-left shadow-xs"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 rounded-md bg-secondary text-muted-foreground group-hover:text-foreground transition-colors">
                  {getCategoryIcon(item.category)}
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </span>
              </div>
            </div>

            <p className="text-[13px] sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-1">
              {item.prompt}
            </p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
