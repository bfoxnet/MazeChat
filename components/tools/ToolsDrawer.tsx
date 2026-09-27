'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  X,
  Globe,
  Code2,
  Calendar,
  FolderKanban,
  GitBranch,
  Wrench,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AITool } from '@/types/chat';
import { Button } from '@/components/ui/button';

interface ToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tools: AITool[];
  onToggleTool: (toolId: string) => void;
}

export function ToolsDrawer({ isOpen, onClose, tools, onToggleTool }: ToolsDrawerProps) {
  if (!isOpen) return null;

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-4 h-4 text-blue-400" />;
      case 'Code':
        return <Code2 className="w-4 h-4 text-emerald-400" />;
      case 'Calendar':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'FolderKanban':
        return <FolderKanban className="w-4 h-4 text-cyan-400" />;
      case 'GitBranch':
        return <GitBranch className="w-4 h-4 text-purple-400" />;
      default:
        return <Wrench className="w-4 h-4 text-zinc-400" />;
    }
  };

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
        className="relative z-10 w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-card-foreground"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/40">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              AI Tools & Connectors
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Available tools that Aura can autonomously invoke during chat.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tools List */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
          {tools.map((tool) => (
            <motion.div
              key={tool.id}
              whileHover={{ scale: 1.01 }}
              className="p-3.5 rounded-2xl border border-border bg-secondary/30 flex items-start justify-between gap-4 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-card border border-border shrink-0 mt-0.5">
                  {getToolIcon(tool.iconName)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground">{tool.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-secondary border border-border text-muted-foreground font-mono">
                      {tool.category}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground font-mono">
                    {tool.status === 'connected' ? (
                      <span className="flex items-center gap-1 text-emerald-500">
                        <CheckCircle2 className="w-3 h-3" />
                        Connected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-500">
                        <AlertCircle className="w-3 h-3" />
                        Auth required
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => onToggleTool(tool.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  tool.isEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                    tool.isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-secondary/30 flex items-center justify-end">
          <Button
            size="sm"
            variant="secondary"
            onClick={onClose}
            className="rounded-xl"
          >
            Done
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
