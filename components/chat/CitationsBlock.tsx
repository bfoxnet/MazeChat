'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Globe } from 'lucide-react';
import { Citation } from '@/types/chat';

interface CitationsBlockProps {
  citations: Citation[];
}

export function CitationsBlock({ citations }: CitationsBlockProps) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="my-3 space-y-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <Globe className="w-3.5 h-3.5 text-blue-500" />
        <span>Sources ({citations.length})</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {citations.map((cite, idx) => (
          <motion.a
            key={idx}
            href={cite.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition-colors text-xs group max-w-xs shadow-xs"
          >
            <div className="w-4 h-4 rounded-full bg-card border border-border flex items-center justify-center shrink-0 text-[10px] text-muted-foreground font-mono">
              {idx + 1}
            </div>
            <div className="truncate">
              <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate block">
                {cite.title}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono block">
                {cite.domain}
              </span>
            </div>
            <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-foreground ml-auto shrink-0 transition-colors" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
