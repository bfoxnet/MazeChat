'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Check, Copy, Terminal } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import { useTheme } from '@/components/theme/ThemeProvider';

interface CodeBlockProps {
  language?: string;
  code: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ language = 'typescript', code, showLineNumbers = true }: CodeBlockProps) {
  const { theme: globalTheme, mounted } = useTheme();
  const [copied, setCopied] = useState(false);
  const isDark = mounted ? globalTheme === 'dark' : true;

  const cleanCode = code.replace(/\n$/, '');
  const lines = useMemo(() => cleanCode.split('\n'), [cleanCode]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const normalizedLang = useMemo(() => {
    const l = (language || 'text').toLowerCase();
    if (l === 'ts') return 'typescript';
    if (l === 'js') return 'javascript';
    if (l === 'py') return 'python';
    if (l === 'sh' || l === 'shell') return 'bash';
    if (l === 'rs') return 'rust';
    return l;
  }, [language]);

  // Tokenize each line with Prism
  const highlightedTokens = useMemo(() => {
    const grammar = Prism.languages[normalizedLang] || Prism.languages.typescript || Prism.languages.javascript;
    try {
      return lines.map((line) => Prism.tokenize(line, grammar));
    } catch {
      return lines.map((line) => [line]);
    }
  }, [lines, normalizedLang]);

  // Render tokens recursively with exact GitHub Dark / Light color specs
  const renderToken = (token: string | Prism.Token, key: string | number): React.ReactNode => {
    if (typeof token === 'string') {
      return <span key={key}>{token}</span>;
    }

    const type = token.type;
    let colorClass = '';

    if (isDark) {
      // GitHub Dark Theme Palette
      switch (type) {
        case 'keyword':
        case 'boolean':
        case 'important':
          colorClass = 'text-[#ff7b72] font-medium'; // red-pink
          break;
        case 'function':
        case 'function-variable':
        case 'method':
          colorClass = 'text-[#d2a8ff]'; // purple
          break;
        case 'string':
        case 'char':
        case 'attr-value':
          colorClass = 'text-[#a5d6ff]'; // light cyan-blue
          break;
        case 'number':
          colorClass = 'text-[#79c0ff]'; // blue
          break;
        case 'class-name':
        case 'constant':
          colorClass = 'text-[#ffa657] font-medium'; // orange
          break;
        case 'comment':
        case 'prolog':
        case 'doctype':
        case 'cdata':
          colorClass = 'text-[#8b949e] italic'; // muted gray
          break;
        case 'operator':
          colorClass = 'text-[#ff7b72]';
          break;
        case 'punctuation':
          colorClass = 'text-[#c9d1d9]';
          break;
        case 'property':
        case 'variable':
          colorClass = 'text-[#79c0ff]';
          break;
        default:
          colorClass = 'text-[#e6edf3]';
      }
    } else {
      // GitHub Light Theme Palette
      switch (type) {
        case 'keyword':
        case 'boolean':
        case 'important':
          colorClass = 'text-[#cf222e] font-medium'; // red
          break;
        case 'function':
        case 'function-variable':
        case 'method':
          colorClass = 'text-[#8250df]'; // purple
          break;
        case 'string':
        case 'char':
        case 'attr-value':
          colorClass = 'text-[#0a3069]'; // dark blue
          break;
        case 'number':
          colorClass = 'text-[#0550ae]'; // blue
          break;
        case 'class-name':
        case 'constant':
          colorClass = 'text-[#953800] font-medium'; // orange-brown
          break;
        case 'comment':
        case 'prolog':
        case 'doctype':
        case 'cdata':
          colorClass = 'text-[#6e7781] italic'; // muted gray
          break;
        case 'operator':
          colorClass = 'text-[#cf222e]';
          break;
        case 'punctuation':
          colorClass = 'text-[#24292f]';
          break;
        case 'property':
        case 'variable':
          colorClass = 'text-[#953800]';
          break;
        default:
          colorClass = 'text-[#1f2328]';
      }
    }

    if (Array.isArray(token.content)) {
      return (
        <span key={key} className={colorClass}>
          {token.content.map((child, idx) => renderToken(child, idx))}
        </span>
      );
    }

    if (typeof token.content === 'object' && token.content !== null) {
      return (
        <span key={key} className={colorClass}>
          {renderToken(token.content as Prism.Token, 0)}
        </span>
      );
    }

    return (
      <span key={key} className={colorClass}>
        {token.content}
      </span>
    );
  };

  return (
    <div
      className={`my-3.5 rounded-2xl border overflow-hidden shadow-xs text-sm transition-colors duration-200 ${
        isDark
          ? 'bg-[#0d1117] border-[#30363d] text-[#e6edf3]'
          : 'bg-[#ffffff] border-[#d0d7de] text-[#1f2328]'
      }`}
    >
      {/* Code Header Bar (GitHub Style) */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 border-b select-none transition-colors duration-200 ${
          isDark
            ? 'bg-[#161b22] border-[#30363d] text-[#8b949e]'
            : 'bg-[#f6f8fa] border-[#d0d7de] text-[#656d76]'
        }`}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 opacity-80" />
          <span className="font-sans font-semibold text-sm lowercase">
            {normalizedLang}
          </span>
          <span className="text-xs opacity-75">
            · {lines.length} {lines.length === 1 ? 'line' : 'lines'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Copy Button */}
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Copy code to clipboard"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-sans transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-[#21262d] text-[#8b949e] hover:text-[#e6edf3]'
                : 'hover:bg-[#eaeef2] text-[#656d76] hover:text-[#1f2328]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Code Content with Google Sans Code & Ligatures Support */}
      <div
        className="p-4 overflow-x-auto code-ligatures text-[13px] sm:text-[13.5px] leading-relaxed select-text"
        style={{
          fontFamily: "'Google Sans Code', 'JetBrains Mono', 'Fira Code', monospace",
          fontVariantLigatures: 'normal',
          fontFeatureSettings: '"liga" 1, "calt" 1',
        }}
      >
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((_, idx) => (
              <tr
                key={idx}
                className={isDark ? 'hover:bg-[#161b22]/50' : 'hover:bg-[#f6f8fa]'}
              >
                {showLineNumbers && (
                  <td
                    className={`pr-4 py-0.5 text-right select-none text-[11px] w-8 align-top tabular-nums font-mono ${
                      isDark ? 'text-[#6e7681]' : 'text-[#8c959f]'
                    }`}
                  >
                    {idx + 1}
                  </td>
                )}
                <td
                  className="py-0.5 whitespace-pre align-top code-ligatures"
                  style={{
                    fontFamily: "'Google Sans Code', 'JetBrains Mono', 'Fira Code', monospace",
                    fontVariantLigatures: 'normal',
                    fontFeatureSettings: '"liga" 1, "calt" 1',
                  }}
                >
                  {highlightedTokens[idx]?.map((token, tIdx) => renderToken(token, tIdx))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
