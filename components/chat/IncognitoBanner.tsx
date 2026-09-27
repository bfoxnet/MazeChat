'use client';

import React from 'react';
import { EyeOff, X } from 'lucide-react';

interface IncognitoBannerProps {
  onExitIncognito: () => void;
}

export function IncognitoBanner({ onExitIncognito }: IncognitoBannerProps) {
  return (
    <div className="w-full bg-gradient-to-r from-violet-500/15 via-purple-500/10 to-transparent border-b border-violet-500/30 px-4 py-2 text-xs flex items-center justify-between text-violet-900 dark:text-violet-200 select-none shadow-xs">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-violet-500/20 text-violet-600 dark:text-violet-300">
          <EyeOff className="w-3.5 h-3.5" />
        </div>
        <span className="font-semibold text-violet-950 dark:text-violet-100">Temporary Session:</span>
        <span className="hidden sm:inline opacity-80">
          Messages in this temporary session are not saved to your chat history or memory.
        </span>
      </div>

      <button
        onClick={onExitIncognito}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-violet-500/20 text-violet-700 dark:text-violet-300 transition-colors text-[11px] font-medium"
      >
        <span>Exit Temporary Chat</span>
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
