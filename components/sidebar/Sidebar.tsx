'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  SquarePen,
  Search,
  X,
  EyeOff,
  Folder,
  ChevronDown,
  ChevronRight,
  Pin,
  Sparkles,
  Settings,
  Plus,
} from 'lucide-react';
import { Conversation, Folder as FolderType, UserProfile } from '@/types/chat';
import { STATIC_BASE_TIME } from '@/lib/mockData';
import { ChatItem } from './ChatItem';

interface SidebarProps {
  mobileOpen: boolean;
  desktopOpen: boolean;
  onCloseMobile: () => void;
  conversations: Conversation[];
  activeChatId: string | null;
  folders: FolderType[];
  user: UserProfile;
  isIncognitoActive: boolean;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onStartIncognito: () => void;
  onRenameChat: (id: string, currentTitle: string) => void;
  onTogglePin: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onMoveToFolder: (id: string, folderId: string | null) => void;
  onCreateFolder: (name: string) => void;
  onOpenSettings: (tab?: string) => void;
  onOpenUpgrade: () => void;
}

export function Sidebar({
  mobileOpen,
  desktopOpen,
  onCloseMobile,
  conversations,
  activeChatId,
  folders,
  user,
  isIncognitoActive,
  onSelectChat,
  onNewChat,
  onStartIncognito,
  onRenameChat,
  onTogglePin,
  onDeleteChat,
  onMoveToFolder,
  onCreateFolder,
  onOpenSettings,
  onOpenUpgrade,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFolderSectionOpen, setIsFolderSectionOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [referenceTime] = useState(() => STATIC_BASE_TIME);

  // Filter conversations
  const filteredChats = useMemo(() => {
    return conversations
      .filter((c) => !c.isIncognito)
      .filter((c) => {
        if (!searchQuery.trim()) return true;
        return c.title.toLowerCase().includes(searchQuery.toLowerCase());
      });
  }, [conversations, searchQuery]);

  // Pinned chats
  const pinnedChats = useMemo(() => {
    return filteredChats.filter((c) => c.isPinned);
  }, [filteredChats]);

  // Grouped by time
  const groupedChats = useMemo(() => {
    const oneDay = 1000 * 60 * 60 * 24;
    const unpinned = filteredChats.filter((c) => !c.isPinned && !c.folderId);

    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const previous7Days: Conversation[] = [];
    const older: Conversation[] = [];

    unpinned.forEach((chat) => {
      const diff = referenceTime - chat.updatedAt;
      if (diff < oneDay) {
        today.push(chat);
      } else if (diff < oneDay * 2) {
        yesterday.push(chat);
      } else if (diff < oneDay * 7) {
        previous7Days.push(chat);
      } else {
        older.push(chat);
      }
    });

    return { today, yesterday, previous7Days, older };
  }, [filteredChats, referenceTime]);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowFolderInput(false);
    }
  };

  const usagePercent = Math.round(
    (user.usage.fastQueriesUsed / user.usage.fastQueriesLimit) * 100
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-68 sm:w-72 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 ease-in-out select-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          desktopOpen
            ? 'md:translate-x-0 md:w-68 md:sm:w-72'
            : 'md:-translate-x-full md:w-0 md:border-none md:overflow-hidden'
        }`}
      >
        {/* Top Action Header: New Chat & Search */}
        <div className="p-3 space-y-2 border-b border-sidebar-border">
          <div className="flex items-center gap-1.5">
            {/* New Chat Button (ChatGPT / Claude style) */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onNewChat();
                onCloseMobile();
              }}
              className="flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-secondary hover:bg-muted border border-border text-foreground text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <SquarePen className="w-4 h-4 text-primary" />
                <span>New chat</span>
              </div>
              <kbd className="hidden sm:inline text-xs text-muted-foreground font-mono">
                ⌘N
              </kbd>
            </motion.button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-7 py-2 rounded-xl bg-secondary/60 border border-border text-xs sm:text-[13.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Incognito Chat Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onStartIncognito();
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl border text-xs sm:text-[13.5px] font-medium transition-all cursor-pointer ${
              isIncognitoActive
                ? 'bg-violet-500/15 border-violet-500/30 text-violet-600 dark:text-violet-300'
                : 'bg-sidebar hover:bg-secondary border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <EyeOff className="w-3.5 h-3.5 text-violet-500" />
              <span>Temporary chat</span>
            </div>
            <span className="text-[11px] text-violet-500 font-mono">Unsaved</span>
          </motion.button>
        </div>

        {/* Scrollable Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
          {/* Pinned Chats */}
          {pinnedChats.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Pin className="w-3 h-3 text-amber-500 fill-current" />
                <span>Pinned</span>
              </div>
              <div className="space-y-0.5">
                {pinnedChats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    folders={folders}
                    onSelect={() => {
                      onSelectChat(chat.id);
                      onCloseMobile();
                    }}
                    onRename={onRenameChat}
                    onTogglePin={onTogglePin}
                    onDelete={onDeleteChat}
                    onMoveToFolder={onMoveToFolder}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Folders & Projects Section */}
          <div>
            <div className="flex items-center justify-between px-2 pb-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <button
                onClick={() => setIsFolderSectionOpen(!isFolderSectionOpen)}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                {isFolderSectionOpen ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                <span>Projects</span>
              </button>

              <button
                onClick={() => setShowFolderInput(true)}
                className="hover:text-foreground transition-colors p-0.5"
                title="Create new folder"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {showFolderInput && (
              <form onSubmit={handleCreateFolder} className="px-2 py-1 flex gap-1">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name..."
                  autoFocus
                  className="flex-1 px-2.5 py-1 rounded-lg bg-secondary border border-border text-xs text-foreground focus:outline-none focus:border-primary/50"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowFolderInput(false)}
                  className="px-1.5 py-1 text-muted-foreground hover:text-foreground text-xs"
                >
                  ✕
                </button>
              </form>
            )}

            {isFolderSectionOpen && (
              <div className="space-y-1 mt-1 pl-1">
                {folders.map((folder) => {
                  const folderChats = filteredChats.filter((c) => c.folderId === folder.id);
                  return (
                    <div key={folder.id} className="space-y-0.5">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-foreground/80 hover:bg-secondary/60">
                        <Folder className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate flex-1">{folder.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {folderChats.length}
                        </span>
                      </div>

                      <div className="pl-3 space-y-0.5 border-l border-border ml-3">
                        {folderChats.map((chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={activeChatId === chat.id}
                            folders={folders}
                            onSelect={() => {
                              onSelectChat(chat.id);
                              onCloseMobile();
                            }}
                            onRename={onRenameChat}
                            onTogglePin={onTogglePin}
                            onDelete={onDeleteChat}
                            onMoveToFolder={onMoveToFolder}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Today Group */}
          {groupedChats.today.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[11px] font-semibold text-muted-foreground">
                Today
              </div>
              <div className="space-y-0.5">
                {groupedChats.today.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    folders={folders}
                    onSelect={() => {
                      onSelectChat(chat.id);
                      onCloseMobile();
                    }}
                    onRename={onRenameChat}
                    onTogglePin={onTogglePin}
                    onDelete={onDeleteChat}
                    onMoveToFolder={onMoveToFolder}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Yesterday Group */}
          {groupedChats.yesterday.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[11px] font-semibold text-muted-foreground">
                Yesterday
              </div>
              <div className="space-y-0.5">
                {groupedChats.yesterday.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    folders={folders}
                    onSelect={() => {
                      onSelectChat(chat.id);
                      onCloseMobile();
                    }}
                    onRename={onRenameChat}
                    onTogglePin={onTogglePin}
                    onDelete={onDeleteChat}
                    onMoveToFolder={onMoveToFolder}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Previous 7 Days */}
          {groupedChats.previous7Days.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[11px] font-semibold text-muted-foreground">
                Previous 7 Days
              </div>
              <div className="space-y-0.5">
                {groupedChats.previous7Days.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    folders={folders}
                    onSelect={() => {
                      onSelectChat(chat.id);
                      onCloseMobile();
                    }}
                    onRename={onRenameChat}
                    onTogglePin={onTogglePin}
                    onDelete={onDeleteChat}
                    onMoveToFolder={onMoveToFolder}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Older */}
          {groupedChats.older.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[11px] font-semibold text-muted-foreground">
                Older
              </div>
              <div className="space-y-0.5">
                {groupedChats.older.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChatId === chat.id}
                    folders={folders}
                    onSelect={() => {
                      onSelectChat(chat.id);
                      onCloseMobile();
                    }}
                    onRename={onRenameChat}
                    onTogglePin={onTogglePin}
                    onDelete={onDeleteChat}
                    onMoveToFolder={onMoveToFolder}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredChats.length === 0 && (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No conversations found.
            </div>
          )}
        </div>

        {/* Footer: User Tier & Settings */}
        <div className="p-3 border-t border-sidebar-border bg-sidebar space-y-2">
          {/* Plan Meter */}
          <Link
            href="/plan"
            onClick={onCloseMobile}
            className="block p-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/40 transition-colors group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs sm:text-[13px] mb-1.5">
              <span className="font-semibold text-foreground/90 group-hover:text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                {user.planTier}
              </span>
              <span className="text-xs text-muted-foreground font-mono tabular-nums">
                {user.usage.fastQueriesUsed} / {user.usage.fastQueriesLimit}
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
          </Link>

          <div className="flex items-center justify-between pt-0.5 text-muted-foreground text-xs sm:text-[13px]">
            <Link
              href="/settings"
              onClick={onCloseMobile}
              className="flex items-center gap-1.5 hover:text-foreground font-medium transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            <span className="text-[11px] text-muted-foreground font-mono">v4.5 Pro</span>
          </div>
        </div>
      </aside>
    </>
  );
}
