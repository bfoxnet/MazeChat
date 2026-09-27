'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Sparkles, Zap, Brain, Code2 } from 'lucide-react';
import { AIModel } from '@/types/chat';

interface ModelPickerProps {
  models: AIModel[];
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

export function ModelPicker({ models, selectedModelId, onSelectModel }: ModelPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentModel = models.find((m) => m.id === selectedModelId) || models[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getModelIcon = (id: string) => {
    if (id.includes('flash')) return <Zap className="w-3.5 h-3.5 text-amber-400" />;
    if (id.includes('thinker')) return <Brain className="w-3.5 h-3.5 text-purple-400" />;
    if (id.includes('code')) return <Code2 className="w-3.5 h-3.5 text-emerald-400" />;
    return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button - Claude style model pill */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-secondary border border-transparent hover:border-border text-sm font-semibold text-foreground transition-colors"
      >
        <span className="shrink-0">{getModelIcon(currentModel.id)}</span>
        <span>{currentModel.name}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </motion.button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-popover border border-border shadow-2xl z-50 p-2 space-y-1 text-popover-foreground"
          >
            <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider select-none">
              Models
            </div>

            {models.map((model) => {
              const isSelected = model.id === currentModel.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    onSelectModel(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-colors flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-secondary text-foreground font-medium'
                      : 'hover:bg-secondary/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    <div className="p-1.5 rounded-lg bg-card border border-border shrink-0 mt-0.5">
                      {getModelIcon(model.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-foreground">{model.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {model.contextWindow}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {model.tagline}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-primary shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
