'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MoreHorizontal,
  Pin,
  PinOff,
  Edit2,
  Trash2,
  FolderPlus,
} from 'lucide-react';
import { Conversation, Folder } from '@/types/chat';

interface ChatItemProps {
  chat: Conversation;
  isActive: boolean;
  folders: Folder[];
  onSelect: () => void;
  onRename: (id: string, currentTitle: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveToFolder: (id: string, folderId: string | null) => void;
}

export function ChatItem({
  chat,
  isActive,
  folders,
  onSelect,
  onRename,
  onTogglePin,
  onDelete,
  onMoveToFolder,
}: ChatItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [folderSubmenuOpen, setFolderSubmenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setFolderSubmenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15 }}
      className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] sm:text-sm transition-colors select-none ${
        isActive
          ? 'bg-secondary text-foreground font-medium shadow-xs'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
      }`}
    >
      {/* Clickable Area */}
      <button
        onClick={onSelect}
        className="flex-1 flex items-center gap-2 min-w-0 text-left overflow-hidden"
      >
        <span className="truncate">{chat.title || 'New Chat'}</span>
        {chat.isPinned && (
          <Pin className="w-2.5 h-2.5 text-amber-500 shrink-0 fill-current ml-auto" />
        )}
      </button>

      {/* Action Trigger */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          aria-label="Conversation options"
          className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted text-muted-foreground hover:text-foreground transition-opacity"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>

        {/* Action Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-6 w-44 rounded-2xl bg-popover border border-border shadow-2xl z-50 p-1.5 space-y-0.5 text-xs text-popover-foreground"
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onRename(chat.id, chat.title);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors text-left"
              >
                <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Rename</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onTogglePin(chat.id);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors text-left"
              >
                {chat.isPinned ? (
                  <>
                    <PinOff className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Unpin</span>
                  </>
                ) : (
                  <>
                    <Pin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Pin to top</span>
                  </>
                )}
              </button>

              {/* Move to folder */}
              <div className="relative">
                <button
                  onClick={() => setFolderSubmenuOpen(!folderSubmenuOpen)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <FolderPlus className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Folder</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">▸</span>
                </button>

                {folderSubmenuOpen && (
                  <div className="absolute left-full top-0 ml-1 w-40 rounded-2xl bg-popover border border-border shadow-2xl z-50 p-1 space-y-0.5 text-xs text-popover-foreground">
                    <button
                      onClick={() => {
                        onMoveToFolder(chat.id, null);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground"
                    >
                      No folder
                    </button>
                    {folders.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          onMoveToFolder(chat.id, f.id);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-secondary text-foreground/90 hover:text-foreground truncate"
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="my-1 border-t border-border" />

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(chat.id);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
