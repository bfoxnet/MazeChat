'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const getPositionClass = () => {
    switch (side) {
      case 'bottom':
        return 'top-full mt-1.5 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-1.5 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-1.5 top-1/2 -translate-y-1/2';
      default:
        return 'bottom-full mb-1.5 left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div
      className={cn('relative inline-flex items-center', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 pointer-events-none px-2 py-1 text-[11px] font-medium text-zinc-200 bg-zinc-900 border border-zinc-700/80 rounded-md shadow-md whitespace-nowrap animate-in fade-in zoom-in-95 duration-100',
            getPositionClass()
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
