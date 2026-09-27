'use client';

import React from 'react';
import { motion } from 'motion/react';
import { X, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘ / Ctrl + N', description: 'Start a new conversation' },
    { key: '⌘ / Ctrl + K', description: 'Search conversation history' },
    { key: '⌘ / Ctrl + /', description: 'Open keyboard shortcuts dialog' },
    { key: 'Enter', description: 'Send current message' },
    { key: 'Shift + Enter', description: 'Insert newline in input box' },
    { key: 'Esc', description: 'Close any active modal or drawer' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden text-card-foreground"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-secondary/40">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/40 border border-border text-xs"
            >
              <span className="text-foreground/90">{sc.description}</span>
              <kbd className="px-2 py-1 rounded-md bg-secondary border border-border font-mono text-[11px] text-foreground shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 bg-secondary/20 border-t border-border text-center">
          <Button
            size="sm"
            variant="secondary"
            onClick={onClose}
            className="w-full rounded-xl"
          >
            Got it
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
