'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathBlockProps {
  math: string;
  block?: boolean;
}

export function MathBlock({ math, block = false }: MathBlockProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return null;
    }
  }, [math, block]);

  if (!html) {
    return (
      <code className="text-amber-500 font-mono text-xs px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
        {block ? `$$${math}$$` : `$${math}$`}
      </code>
    );
  }

  if (block) {
    return (
      <div className="my-3.5 py-2.5 px-4 overflow-x-auto rounded-xl bg-secondary/50 border border-border text-center select-text">
        <span
          className="inline-block text-foreground text-sm md:text-base"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }

  return (
    <span
      className="inline-block px-1 align-baseline text-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
