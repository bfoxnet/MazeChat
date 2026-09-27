'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Share2,
  SquarePen,
  Settings,
  BrainCircuit,
  LogOut,
  Sparkles,
  HelpCircle,
  Sun,
  Moon,
  CreditCard,
} from 'lucide-react';
import { AIModel, Conversation, UserProfile } from '@/types/chat';
import { ModelPicker } from './ModelPicker';
import { Tooltip } from '@/components/ui/tooltip';
import { useTheme } from '@/components/theme/ThemeProvider';

interface ChatHeaderProps {
  conversation: Conversation | null;
  models: AIModel[];
  selectedModelId: string;
  user: UserProfile;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onSelectModel: (modelId: string) => void;
  onOpenSettings: (initialTab?: string) => void;
  onOpenTools: () => void;
  onOpenShortcuts: () => void;
  onOpenUpgrade: () => void;
  onNewChat?: () => void;
}

export function ChatHeader({
  conversation,
  models,
  selectedModelId,
  user,
  sidebarOpen,
  onToggleSidebar,
  onSelectModel,
  onOpenSettings,
  onOpenShortcuts,
  onOpenUpgrade,
  onNewChat,
}: ChatHeaderProps) {
  const { theme, mounted, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDark = mounted ? theme === 'dark' : true;

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-13 border-b border-border/80 bg-background/85 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between z-30 select-none transition-colors duration-200">
      {/* Zone 1: Sidebar Toggle & Model Picker */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Tooltip content={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </motion.button>
        </Tooltip>

        {/* New Chat quick button (like ChatGPT) */}
        {onNewChat && (
          <Tooltip content="New chat (Cmd+N)">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onNewChat}
              aria-label="New chat"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <SquarePen className="w-4 h-4" />
            </motion.button>
          </Tooltip>
        )}

        <ModelPicker
          models={models}
          selectedModelId={selectedModelId}
          onSelectModel={onSelectModel}
        />
      </div>

      {/* Zone 2: Title or Incognito Status */}
      <div className="hidden md:flex items-center gap-2 max-w-sm truncate text-xs text-muted-foreground">
        {conversation?.isIncognito ? (
          <span className="text-violet-500 font-medium">Temporary session</span>
        ) : (
          <span className="truncate">{conversation?.title || ''}</span>
        )}
      </div>

      {/* Zone 3: Theme Toggle, Share, Plan & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Light / Dark Mode Toggle */}
        <Tooltip content={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            aria-label="Toggle light or dark theme"
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </motion.button>
        </Tooltip>

        {/* Share Button (ChatGPT style) */}
        <Tooltip content={shareCopied ? 'Link copied!' : 'Share conversation'}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{shareCopied ? 'Copied!' : 'Share'}</span>
          </motion.button>
        </Tooltip>

        {/* User Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            aria-label="Account menu"
            className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-border transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground text-sm font-semibold shadow-xs">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
          </motion.button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 mt-2 w-72 rounded-2xl bg-popover border border-border shadow-2xl z-50 p-2 text-popover-foreground"
              >
                {/* Profile Card */}
                <div className="px-3.5 py-3 border-b border-border/80">
                  <div className="font-semibold text-foreground text-sm">{user.name}</div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-flex items-center text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                      {user.planTier}
                    </span>
                    <Link
                      href="/plan"
                      onClick={() => setUserMenuOpen(false)}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Manage
                    </Link>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1.5 space-y-0.5">
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-left text-sm text-foreground/90 hover:text-foreground font-medium"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span>Settings</span>
                  </Link>

                  <Link
                    href="/memory"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-left text-sm text-foreground/90 hover:text-foreground font-medium"
                  >
                    <BrainCircuit className="w-4 h-4 text-muted-foreground" />
                    <span>Memory & Knowledge</span>
                  </Link>

                  <Link
                    href="/plan"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-primary hover:bg-primary/10 transition-colors text-left text-sm font-semibold"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4" />
                      <span>Plan & Billing</span>
                    </div>
                    <span className="text-[11px] font-mono opacity-80">Pro</span>
                  </Link>

                  <button
                    onClick={() => {
                      toggleTheme();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-left text-sm text-foreground/90 hover:text-foreground cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                      <span>Theme: {isDark ? 'Dark' : 'Light'}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">Toggle</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenShortcuts();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors text-left text-sm text-foreground/90 hover:text-foreground cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    <span>Keyboard Shortcuts</span>
                  </button>
                </div>

                <div className="pt-1.5 border-t border-border">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-destructive hover:bg-destructive/10 transition-colors text-left text-sm font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
