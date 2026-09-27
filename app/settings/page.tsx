'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Sliders,
  Sparkles,
  Wrench,
  BrainCircuit,
  Eye,
  CreditCard,
  Database,
  Check,
  Download,
  Trash2,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';
import { INITIAL_PREFERENCES, MOCK_MODELS, MOCK_TOOLS, MOCK_USER } from '@/lib/mockData';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function DedicatedSettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'models' | 'tools' | 'appearance' | 'data'>('general');
  const [preferences, setPreferences] = useState(INITIAL_PREFERENCES);
  const [tools, setTools] = useState(MOCK_TOOLS);
  const [savedNotice, setSavedNotice] = useState(false);

  const showSaved = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleToggleTool = (toolId: string) => {
    setTools((prev) =>
      prev.map((t) => (t.id === toolId ? { ...t, isEnabled: !t.isEnabled } : t))
    );
    showSaved();
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ exportDate: new Date().toISOString(), preferences, user: MOCK_USER }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aura-settings-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-border px-4 sm:px-8 flex items-center justify-between bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Chat</span>
          </Link>
          <span className="text-border">/</span>
          <span className="text-sm font-semibold text-foreground">Settings</span>
        </div>

        <div className="flex items-center gap-3">
          {savedNotice && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Saved</span>
            </motion.div>
          )}

          <Link
            href="/plan"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pro Workspace</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 flex flex-col md:flex-row gap-8">
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Preferences
            </div>
            {[
              { id: 'general', label: 'General', icon: Sliders },
              { id: 'models', label: 'Model Defaults', icon: Sparkles },
              { id: 'tools', label: 'Connectors & Tools', icon: Wrench },
              { id: 'appearance', label: 'Appearance', icon: Eye },
              { id: 'data', label: 'Data Controls', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${
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
          <div className="pt-4 border-t border-border space-y-1">
            <div className="px-3 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Dedicated Pages
            </div>
            <Link
              href="/memory"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BrainCircuit className="w-4 h-4 text-indigo-500" />
                <span>Memory & Knowledge</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <Link
              href="/plan"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                <span>Plan & Billing</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>
        </aside>

        {/* Right Content Panel */}
        <main className="flex-1 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">General Preferences</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage chat submission keys, audio feedback, and layout densities.
                </p>
              </div>

              <div className="divide-y divide-border/60">
                <div className="flex items-center justify-between py-4">
                  <div>
                    <div className="font-semibold text-sm text-foreground">Send on Enter</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Press Enter to send message; use Shift + Enter for a new paragraph.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.sendOnEnter}
                    onChange={(e) => {
                      setPreferences((p) => ({ ...p, sendOnEnter: e.target.checked }));
                      showSaved();
                    }}
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-border bg-card cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <div className="font-semibold text-sm text-foreground">Code Block Line Numbers</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Display left-hand gutter line numbering inside code blocks.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.codeLineNumbers}
                    onChange={(e) => {
                      setPreferences((p) => ({ ...p, codeLineNumbers: e.target.checked }));
                      showSaved();
                    }}
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-border bg-card cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <div className="font-semibold text-sm text-foreground">Audio / Sound Effects</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Play subtle tones when responses conclude or tools finish.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.soundEnabled}
                    onChange={(e) => {
                      setPreferences((p) => ({ ...p, soundEnabled: e.target.checked }));
                      showSaved();
                    }}
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-border bg-card cursor-pointer"
                  />
                </div>

                <div className="py-4">
                  <div className="font-semibold text-sm text-foreground mb-1">
                    Simulated Response Speed
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    Latency between token chunks: {preferences.streamSpeedMs}ms
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={preferences.streamSpeedMs}
                    onChange={(e) => {
                      setPreferences((p) => ({ ...p, streamSpeedMs: Number(e.target.value) }));
                      showSaved();
                    }}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Model Defaults Tab */}
          {activeTab === 'models' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Model Defaults & System Instructions</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure default foundation models and overarching persona instructions.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Default Architecture
                  </label>
                  <select
                    value={preferences.defaultModelId}
                    onChange={(e) => {
                      setPreferences((p) => ({ ...p, defaultModelId: e.target.value }));
                      showSaved();
                    }}
                    className="w-full p-3 rounded-xl bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary/50"
                  >
                    {MOCK_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.contextWindow}) — {m.speed}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Custom System Instructions
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    These instructions are prepended to every conversation to steer tone, formatting, and behavioral guidelines.
                  </p>
                  <textarea
                    rows={5}
                    value={preferences.systemInstructions}
                    onChange={(e) => {
                      setPreferences((p) => ({ ...p, systemInstructions: e.target.value }));
                      showSaved();
                    }}
                    className="w-full p-3.5 rounded-xl bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary/50 leading-relaxed font-sans"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Connectors & Tools Tab */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Connected Tools & Integrations</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage external API bridges, sandboxes, and web search permissions.
                </p>
              </div>

              <div className="space-y-3">
                {tools.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl border border-border bg-secondary/20 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-sm text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleTool(t.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                        t.isEnabled ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ${
                          t.isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Appearance & Theme</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose visual themes and code palette styles.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    if (theme === 'light') toggleTheme();
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                      : 'border-border bg-secondary/30 hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 font-semibold text-sm text-foreground">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>Dark Theme</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deep charcoal background with GitHub Dark syntax highlighting.
                  </p>
                </button>

                <button
                  onClick={() => {
                    if (theme === 'dark') toggleTheme();
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                      : 'border-border bg-secondary/30 hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 font-semibold text-sm text-foreground">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Light Theme</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Clean high-contrast background with GitHub Light syntax highlighting.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Data Controls Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Data & Privacy Controls</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Export conversations and settings or clear your local cache.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-secondary/20 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-foreground">Export All Data</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Download a JSON archive containing conversations, preferences, and memories.
                  </div>
                </div>
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-destructive/20 bg-destructive/5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-destructive">Wipe All Local Storage</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Permanently delete cached chats and reset preferences to default.
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all local settings?')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset App</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
