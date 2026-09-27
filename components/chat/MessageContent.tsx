'use client';

import React from 'react';
import { CodeBlock } from './CodeBlock';
import { MathBlock } from './MathBlock';

interface MessageContentProps {
  content: string;
  isStreaming?: boolean;
}

export function MessageContent({ content, isStreaming }: MessageContentProps) {
  // Parse inline elements (bold, italic, code, links, inline math)
  const renderInlineFormatted = (text: string): React.ReactNode[] => {
    const regex = /(\$(?:\\.|[^$\\])+\$|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Inline math: $...$
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const math = part.slice(1, -1);
        return <MathBlock key={index} math={math} block={false} />;
      }

      // Inline code: `...`
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={index}
            className="code-ligatures px-1.5 py-0.5 mx-0.5 text-[14px] font-mono font-medium rounded-md bg-secondary text-primary border border-border"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Bold: **...**
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={index} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Italic: *...*
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return (
          <em key={index} className="italic opacity-90">
            {part.slice(1, -1)}
          </em>
        );
      }

      // Link: [text](url)
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline underline-offset-2 transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  // Parse top-level blocks: Code blocks, block math ($$...$$), tables, headers, lists, quotes, paragraphs
  const renderBlocks = () => {
    const blockTokens: { type: 'code' | 'math' | 'text'; content: string; language?: string }[] = [];

    let remaining = content;

    while (remaining.length > 0) {
      const codeIndex = remaining.indexOf('```');
      const mathIndex = remaining.indexOf('$$');

      if (codeIndex === -1 && mathIndex === -1) {
        blockTokens.push({ type: 'text', content: remaining });
        break;
      }

      const hasCode = codeIndex !== -1;
      const hasMath = mathIndex !== -1;

      if (hasCode && (!hasMath || codeIndex < mathIndex)) {
        if (codeIndex > 0) {
          blockTokens.push({ type: 'text', content: remaining.slice(0, codeIndex) });
        }
        const afterStart = remaining.slice(codeIndex + 3);
        const endCode = afterStart.indexOf('```');

        if (endCode === -1) {
          const newlineIdx = afterStart.indexOf('\n');
          const lang = newlineIdx !== -1 ? afterStart.slice(0, newlineIdx).trim() : '';
          const code = newlineIdx !== -1 ? afterStart.slice(newlineIdx + 1) : afterStart;
          blockTokens.push({ type: 'code', content: code, language: lang || 'plaintext' });
          break;
        } else {
          const codeChunk = afterStart.slice(0, endCode);
          const newlineIdx = codeChunk.indexOf('\n');
          const lang = newlineIdx !== -1 ? codeChunk.slice(0, newlineIdx).trim() : '';
          const code = newlineIdx !== -1 ? codeChunk.slice(newlineIdx + 1) : codeChunk;
          blockTokens.push({ type: 'code', content: code, language: lang || 'plaintext' });
          remaining = afterStart.slice(endCode + 3);
        }
      } else if (hasMath) {
        if (mathIndex > 0) {
          blockTokens.push({ type: 'text', content: remaining.slice(0, mathIndex) });
        }
        const afterStart = remaining.slice(mathIndex + 2);
        const endMath = afterStart.indexOf('$$');

        if (endMath === -1) {
          blockTokens.push({ type: 'math', content: afterStart });
          break;
        } else {
          const math = afterStart.slice(0, endMath);
          blockTokens.push({ type: 'math', content: math });
          remaining = afterStart.slice(endMath + 2);
        }
      }
    }

    return blockTokens.map((token, blockIdx) => {
      if (token.type === 'code') {
        return (
          <CodeBlock
            key={blockIdx}
            language={token.language}
            code={token.content}
          />
        );
      }

      if (token.type === 'math') {
        return <MathBlock key={blockIdx} math={token.content} block={true} />;
      }

      return (
        <div key={blockIdx} className="space-y-2.5">
          {renderTextLines(token.content)}
        </div>
      );
    });
  };

  const renderTextLines = (rawText: string) => {
    const lines = rawText.split('\n');
    const nodes: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        i++;
        continue;
      }

      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        nodes.push(<hr key={i} className="my-4 border-border" />);
        i++;
        continue;
      }

      if (trimmed.startsWith('# ')) {
        nodes.push(
          <h1 key={i} className="text-xl font-bold text-foreground mt-5 mb-2.5 tracking-tight">
            {renderInlineFormatted(trimmed.slice(2))}
          </h1>
        );
        i++;
        continue;
      }
      if (trimmed.startsWith('## ')) {
        nodes.push(
          <h2 key={i} className="text-lg font-bold text-foreground mt-4 mb-2 tracking-tight">
            {renderInlineFormatted(trimmed.slice(3))}
          </h2>
        );
        i++;
        continue;
      }
      if (trimmed.startsWith('### ')) {
        nodes.push(
          <h3 key={i} className="text-base font-semibold text-foreground mt-3.5 mb-1.5">
            {renderInlineFormatted(trimmed.slice(4))}
          </h3>
        );
        i++;
        continue;
      }
      if (trimmed.startsWith('#### ')) {
        nodes.push(
          <h4 key={i} className="text-sm font-semibold text-foreground mt-3 mb-1">
            {renderInlineFormatted(trimmed.slice(5))}
          </h4>
        );
        i++;
        continue;
      }

      if (trimmed.startsWith('>')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
          i++;
        }
        nodes.push(
          <blockquote
            key={`quote-${i}`}
            className="border-l-2 border-primary pl-4 py-1 text-[14px] text-foreground/85 italic bg-secondary/30 rounded-r-lg my-2.5"
          >
            {quoteLines.map((ql, qIdx) => (
              <p key={qIdx}>{renderInlineFormatted(ql)}</p>
            ))}
          </blockquote>
        );
        continue;
      }

      if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }
        if (tableLines.length >= 2) {
          nodes.push(renderTable(tableLines, i));
          continue;
        }
      }

      if (/^[-*+]\s+/.test(trimmed)) {
        const listItems: string[] = [];
        while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
          listItems.push(lines[i].trim().replace(/^[-*+]\s+/, ''));
          i++;
        }
        nodes.push(
          <ul key={`ul-${i}`} className="space-y-1.5 my-2.5 pl-5 list-disc marker:text-primary text-[15px] text-foreground leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx}>
                {renderInlineFormatted(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        const listItems: string[] = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
          i++;
        }
        nodes.push(
          <ol key={`ol-${i}`} className="space-y-1.5 my-2.5 pl-6 list-decimal marker:text-muted-foreground marker:font-mono text-[15px] text-foreground leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx}>
                {renderInlineFormatted(item)}
              </li>
            ))}
          </ol>
        );
        continue;
      }

      nodes.push(
        <p key={i} className="text-[15px] leading-relaxed text-foreground">
          {renderInlineFormatted(line)}
        </p>
      );
      i++;
    }

    return nodes;
  };

  const renderTable = (tableLines: string[], keyIndex: number) => {
    const parseRow = (rowStr: string) => {
      return rowStr
        .slice(1, -1)
        .split('|')
        .map((cell) => cell.trim());
    };

    const header = parseRow(tableLines[0]);
    const isDivider = /^\|?[\s-:]+(\|[\s-:]+)+\|?$/.test(tableLines[1]);
    const bodyRows = tableLines.slice(isDivider ? 2 : 1).map(parseRow);

    return (
      <div key={`table-${keyIndex}`} className="my-3.5 overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-xs md:text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary text-foreground">
              {header.map((col, idx) => (
                <th key={idx} className="py-2.5 px-3.5 font-semibold">
                  {renderInlineFormatted(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-secondary/40 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="py-2.5 px-3.5 text-foreground/90 align-top">
                    {renderInlineFormatted(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="prose-chat text-foreground break-words leading-relaxed select-text">
      {renderBlocks()}
      {isStreaming && (
        <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
      )}
    </div>
  );
}
