'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  BrainCircuit,
  Plus,
  Trash2,
  Search,
  Check,
  Download,
  AlertTriangle,
  Sparkles,
  Sliders,
  ExternalLink,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { MOCK_MEMORIES } from '@/lib/mockData';
import { MemoryEntry } from '@/types/chat';

export default function DedicatedMemoryPage() {
  const [memories, setMemories] = useState<MemoryEntry[]>(MOCK_MEMORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'preference' | 'technical' | 'work' | 'personal'>('all');
  const [newFact, setNewFact] = useState('');
  const [newCategory, setNewCategory] = useState<'preference' | 'technical' | 'work' | 'personal'>('preference');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.trim()) return;

    const newEntry: MemoryEntry = {
      id: `mem-${Date.now()}`,
      fact: newFact.trim(),
      category: newCategory,
      confidence: 0.95,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    setMemories((prev) => [newEntry, ...prev]);
    setNewFact('');
    showToast('Memory fact saved to Aura knowledge graph');
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    showToast('Memory item removed');
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to wipe all stored memory facts?')) {
      setMemories([]);
      showToast('All memories cleared');
    }
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ exportedAt: new Date().toISOString(), memories }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aura-memory-graph-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredMemories = useMemo(() => {
    return memories.filter((mem) => {
      const matchesCategory = activeCategory === 'all' || mem.category === activeCategory;
      const matchesSearch = mem.fact.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [memories, activeCategory, searchQuery]);

  const getCategoryBadgeClass = (category: MemoryEntry['category']) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'work':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'preference':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'personal':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default:
        return 'bg-secondary text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
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
          <span className="text-sm font-semibold text-foreground">Custom Memory</span>
        </div>

        <div className="flex items-center gap-2">
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{toastMessage}</span>
            </motion.div>
          )}

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Graph</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-border rounded-3xl p-6 sm:p-8">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-semibold">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Contextual Memory Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Aura Long-Term Memory</h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Aura automatically captures user preferences, coding styles, and project constraints during chat to personalize subsequent responses across sessions.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-border/60">
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground font-mono">{memories.length}</div>
              <div className="text-xs text-muted-foreground">Stored Facts</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-emerald-500 font-mono">95% avg</div>
              <div className="text-[11px] text-muted-foreground">Confidence</div>
            </div>
          </div>
        </div>

        {/* Add New Memory Card */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
          <h2 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            <span>Teach Aura a Fact</span>
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Manually inject a permanent fact or guideline into Aura’s recall memory.
          </p>

          <form onSubmit={handleAddMemory} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newFact}
                onChange={(e) => setNewFact(e.target.value)}
                placeholder="e.g. Always write production code using Next.js 15 App Router and Tailwind v4..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />

              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
              >
                <option value="preference">User Preference</option>
                <option value="technical">Technical Architecture</option>
                <option value="work">Work & Guidelines</option>
                <option value="personal">Personal / Schedule</option>
              </select>

              <button
                type="submit"
                disabled={!newFact.trim()}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                Save Fact
              </button>
            </div>
          </form>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search learned facts..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All' },
                { id: 'preference', label: 'Preferences' },
                { id: 'technical', label: 'Technical' },
                { id: 'work', label: 'Work' },
                { id: 'personal', label: 'Personal' },
              ].map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-foreground text-background shadow-xs'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of Memories */}
          <div className="space-y-2.5">
            {filteredMemories.length === 0 ? (
              <div className="p-12 text-center bg-card border border-border rounded-3xl text-muted-foreground space-y-2">
                <BrainCircuit className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <div className="font-semibold text-sm text-foreground">No memory facts found</div>
                <div className="text-xs">Try adjusting your search query or category filter.</div>
              </div>
            ) : (
              filteredMemories.map((mem) => (
                <motion.div
                  key={mem.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="p-4 rounded-2xl bg-card border border-border hover:border-border/80 shadow-xs flex items-start justify-between gap-4 transition-colors"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(
                          mem.category
                        )}`}
                      >
                        {mem.category}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Added {mem.dateAdded}
                      </span>
                      <span className="text-[11px] text-emerald-500 font-mono">
                        {Math.round(mem.confidence * 100)}% confidence
                      </span>
                    </div>

                    <p className="text-sm sm:text-[14.5px] text-foreground leading-relaxed">
                      {mem.fact}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteMemory(mem.id)}
                    title="Delete fact"
                    className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer shrink-0 mt-0.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        {memories.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Showing {filteredMemories.length} of {memories.length} memories
            </span>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-destructive hover:bg-destructive/10 text-xs font-semibold transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Wipe All Memory</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
