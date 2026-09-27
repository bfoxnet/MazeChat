'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sliders,
  Sparkles,
  Wrench,
  BrainCircuit,
  Eye,
  Database,
  Plus,
  Trash2,
  Download,
  Check,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import {
  AIModel,
  AITool,
  MemoryEntry,
  UserPreferences,
  UserProfile,
} from '@/types/chat';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme/ThemeProvider';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  models: AIModel[];
  tools: AITool[];
  onToggleTool: (toolId: string) => void;
  memories: MemoryEntry[];
  onAddMemory: (fact: string, category: 'preference' | 'work' | 'technical' | 'personal') => void;
  onDeleteMemory: (id: string) => void;
  user: UserProfile;
  onOpenUpgrade: () => void;
  onClearAllChats: () => void;
  onExportChats: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  initialTab = 'general',
  preferences,
  onUpdatePreferences,
  models,
  tools,
  onToggleTool,
  memories,
  onAddMemory,
  onDeleteMemory,
  user,
  onOpenUpgrade,
  onClearAllChats,
  onExportChats,
}: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [newFact, setNewFact] = useState('');
  const [newCategory, setNewCategory] = useState<'preference' | 'work' | 'technical' | 'personal'>('preference');
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleAddMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFact.trim()) {
      onAddMemory(newFact.trim(), newCategory);
      setNewFact('');
    }
  };

  const showSaved = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
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
        className="relative z-10 w-full max-w-4xl min-h-[580px] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] text-card-foreground"
      >
        {/* Left Navigation Tabs */}
        <div className="w-full md:w-64 bg-secondary/30 border-b md:border-b-0 md:border-r border-border p-3.5 flex md:flex-col justify-between gap-1 overflow-x-auto shrink-0 select-none">
          <div className="space-y-1">
            <div className="hidden md:block px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Settings
            </div>

            {[
              { id: 'general', label: 'General', icon: Sliders },
              { id: 'model', label: 'Model Defaults', icon: Sparkles },
              { id: 'connectors', label: 'Connectors & Tools', icon: Wrench },
              { id: 'memory', label: 'Custom Memory', icon: BrainCircuit },
              { id: 'appearance', label: 'Appearance', icon: Eye },
              { id: 'plan', label: 'Plan & Usage', icon: CreditCard },
              { id: 'data', label: 'Data Controls', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors cursor-pointer w-full text-left ${
                    isActive
                      ? 'bg-secondary text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Links to Dedicated Pages */}
          <div className="hidden md:block pt-3 border-t border-border/80 space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Dedicated Pages
            </div>
            <Link
              href="/settings"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              <span>Full Settings Page</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/memory"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              <span>Dedicated Memory</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/plan"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-primary font-medium hover:bg-primary/10 transition-colors"
            >
              <span>Dedicated Plan</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/20 select-none">
            <h2 className="text-lg font-semibold text-foreground capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-foreground/90">
            {/* Tab: General */}
            {activeTab === 'general' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <div className="font-semibold text-foreground text-sm">Send on Enter</div>
                    <div className="text-muted-foreground text-xs mt-0.5">
                      Press Enter to submit messages; Shift + Enter for a new line.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.sendOnEnter}
                    onChange={(e) => {
                      onUpdatePreferences({ sendOnEnter: e.target.checked });
                      showSaved();
                    }}
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-border bg-card"
                  />
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <div className="font-semibold text-foreground">Code Block Line Numbers</div>
                    <div className="text-muted-foreground text-[11px] mt-0.5">
                      Display line numbers in code snippets.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.codeLineNumbers}
                    onChange={(e) => {
                      onUpdatePreferences({ codeLineNumbers: e.target.checked });
                      showSaved();
                    }}
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-border bg-card"
                  />
                </div>

                <div>
                  <div className="font-semibold text-foreground mb-1">Simulated Stream Speed</div>
                  <div className="text-muted-foreground text-[11px] mb-2">
                    Adjust token delivery speed ({preferences.streamSpeedMs}ms / token).
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={preferences.streamSpeedMs}
                    onChange={(e) => {
                      onUpdatePreferences({ streamSpeedMs: Number(e.target.value) });
                      showSaved();
                    }}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            )}

            {/* Tab: Model Defaults */}
            {activeTab === 'model' && (
              <div className="space-y-5">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Default Architecture
                  </label>
                  <select
                    value={preferences.defaultModelId}
                    onChange={(e) => {
                      onUpdatePreferences({ defaultModelId: e.target.value });
                      showSaved();
                    }}
                    className="w-full p-2.5 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:border-primary/50"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.contextWindow}) — {m.speed}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    System Instructions & Custom Prompt
                  </label>
                  <p className="text-[11px] text-muted-foreground mb-2">
                    Instructions applied to all new conversations.
                  </p>
                  <textarea
                    rows={4}
                    value={preferences.systemInstructions}
                    onChange={(e) => onUpdatePreferences({ systemInstructions: e.target.value })}
                    className="w-full p-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:border-primary/50 leading-relaxed font-sans"
                  />
                </div>
              </div>
            )}

            {/* Tab: Connectors & Tools */}
            {activeTab === 'connectors' && (
              <div className="space-y-3">
                <p className="text-muted-foreground mb-2">
                  Enable or disable external tool invocation permissions.
                </p>
                {tools.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-2xl border border-border bg-secondary/30 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-foreground">{t.name}</div>
                      <div className="text-[11px] text-muted-foreground">{t.description}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleTool(t.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                        t.isEnabled ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
                          t.isEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Memory Management */}
            {activeTab === 'memory' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <div className="font-semibold text-foreground">Enable Context Memory</div>
                    <div className="text-[11px] text-muted-foreground">
                      Allows Aura to remember user preferences across sessions.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.enableMemory}
                    onChange={(e) => {
                      onUpdatePreferences({ enableMemory: e.target.checked });
                      showSaved();
                    }}
                    className="w-4 h-4 rounded text-primary"
                  />
                </div>

                <form onSubmit={handleAddMemorySubmit} className="p-3.5 rounded-2xl bg-secondary/30 border border-border space-y-2">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-primary" />
                    <span>Add Custom Memory Fact</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFact}
                      onChange={(e) => setNewFact(e.target.value)}
                      placeholder="e.g. Preferred language: TypeScript..."
                      className="flex-1 p-2 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none focus:border-primary/50"
                    />
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="p-2 rounded-xl bg-card border border-border text-xs text-foreground"
                    >
                      <option value="preference">Preference</option>
                      <option value="technical">Technical</option>
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                    </select>
                    <Button
                      type="submit"
                      size="sm"
                      variant="primary"
                      disabled={!newFact.trim()}
                      className="rounded-xl"
                    >
                      Save
                    </Button>
                  </div>
                </form>

                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Stored Memories ({memories.length})
                  </div>
                  {memories.map((mem) => (
                    <div
                      key={mem.id}
                      className="p-2.5 rounded-xl border border-border bg-secondary/20 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-foreground leading-snug">{mem.fact}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                          {mem.category} · Added {mem.dateAdded}
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteMemory(mem.id)}
                        className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-secondary transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Appearance */}
            {activeTab === 'appearance' && (
              <div className="space-y-4">
                <div className="font-semibold text-foreground">Theme & Interface Contrast</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('dark');
                      onUpdatePreferences({ theme: 'dark' });
                      showSaved();
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-secondary text-foreground shadow-xs'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs">Obsidian Dark</div>
                      <div className="text-[11px] opacity-70 mt-0.5">Deep slate & high contrast</div>
                    </div>
                    {theme === 'dark' && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTheme('light');
                      onUpdatePreferences({ theme: 'light' });
                      showSaved();
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      theme === 'light'
                        ? 'border-primary bg-secondary text-foreground shadow-xs'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs">Minimal Light</div>
                      <div className="text-[11px] opacity-70 mt-0.5">Clean white & crisp typography</div>
                    </div>
                    {theme === 'light' && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Plan & Usage */}
            {activeTab === 'plan' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{user.planTier}</div>
                    <div className="text-xs text-primary mt-0.5">
                      High-throughput priority cluster.
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={onOpenUpgrade}
                    className="rounded-xl"
                  >
                    Change Tier
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Fast Queries (Aura 3.5 Flash)</span>
                      <span className="font-mono text-muted-foreground tabular-nums">
                        {user.usage.fastQueriesUsed} / {user.usage.fastQueriesLimit}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(user.usage.fastQueriesUsed / user.usage.fastQueriesLimit) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Deep Reasoning Queries (Aura Sonar / Thinker)</span>
                      <span className="font-mono text-muted-foreground tabular-nums">
                        {user.usage.deepQueriesUsed} / {user.usage.deepQueriesLimit}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary/70"
                        style={{
                          width: `${(user.usage.deepQueriesUsed / user.usage.deepQueriesLimit) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Data Controls */}
            {activeTab === 'data' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl border border-border bg-secondary/30 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">Export All Chat History</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Download all conversation records in JSON.
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={onExportChats}
                    className="rounded-xl flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </Button>
                </div>

                <div className="p-3.5 rounded-2xl border border-destructive/30 bg-destructive/5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-destructive">Clear All Conversations</div>
                    <div className="text-[11px] text-destructive/70 mt-0.5">
                      Permanently wipe all conversation sessions.
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={onClearAllChats}
                    className="rounded-xl flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-border bg-secondary/20 flex items-center justify-between">
            <span className="text-emerald-500 text-xs flex items-center gap-1">
              {savedToast && (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </>
              )}
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={onClose}
              className="rounded-xl"
            >
              Done
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
