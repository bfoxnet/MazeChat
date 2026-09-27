'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Copy,
  Check,
  RotateCw,
  Edit3,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Share2,
} from 'lucide-react';
import { Role } from '@/types/chat';
import { Tooltip } from '@/components/ui/tooltip';

interface MessageActionsProps {
  role: Role;
  content: string;
  feedback?: 'like' | 'dislike' | null;
  onEdit?: () => void;
  onRegenerate?: () => void;
  onDelete?: () => void;
  onFeedback?: (type: 'like' | 'dislike') => void;
}

export function MessageActions({
  role,
  content,
  feedback,
  onEdit,
  onRegenerate,
  onDelete,
  onFeedback,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop speech if message unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleToggleReadAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Prepare human-readable plain text without code fences and raw markdown tokens
    const cleanSpeech = content
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/\$\$[\s\S]*?\$\$/g, 'Formula omitted.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*#_~>|]/g, '')
      .trim();

    if (!cleanSpeech) return;

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex items-center gap-1 text-muted-foreground pt-1 select-none">
      {/* Copy Action */}
      <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'}>
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Copy message"
          className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </motion.button>
      </Tooltip>

      {/* Read Aloud (TTS) for Assistant Responses */}
      {role === 'assistant' && (
        <Tooltip content={isSpeaking ? 'Stop reading' : 'Read aloud'}>
          <motion.button
            onClick={handleToggleReadAloud}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label={isSpeaking ? 'Stop reading' : 'Read aloud'}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer relative ${
              isSpeaking
                ? 'bg-primary/15 text-primary'
                : 'hover:bg-secondary hover:text-foreground'
            }`}
          >
            {isSpeaking ? (
              <div className="flex items-center gap-1">
                <VolumeX className="w-3.5 h-3.5 text-primary" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              </div>
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </motion.button>
        </Tooltip>
      )}

      {/* Edit User Message */}
      {role === 'user' && onEdit && (
        <Tooltip content="Edit message">
          <motion.button
            onClick={onEdit}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Edit message"
            className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </motion.button>
        </Tooltip>
      )}

      {/* Regenerate Assistant Response */}
      {role === 'assistant' && onRegenerate && (
        <Tooltip content="Regenerate response">
          <motion.button
            onClick={onRegenerate}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Regenerate response"
            className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </motion.button>
        </Tooltip>
      )}

      {/* Thumbs Up / Down Feedback */}
      {role === 'assistant' && onFeedback && (
        <>
          <Tooltip content="Good response">
            <motion.button
              onClick={() => onFeedback('like')}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Good response"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                feedback === 'like'
                  ? 'text-emerald-500 bg-emerald-500/10'
                  : 'hover:text-foreground hover:bg-secondary'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </motion.button>
          </Tooltip>

          <Tooltip content="Bad response">
            <motion.button
              onClick={() => onFeedback('dislike')}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Bad response"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                feedback === 'dislike'
                  ? 'text-rose-500 bg-rose-500/10'
                  : 'hover:text-foreground hover:bg-secondary'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </motion.button>
          </Tooltip>
        </>
      )}

      {/* Share / Export Action for Assistant Messages */}
      {role === 'assistant' && (
        <Tooltip content={shareCopied ? 'Copied snippet!' : 'Share response'}>
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Share response"
            className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            {shareCopied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
          </motion.button>
        </Tooltip>
      )}

      {/* Delete Message */}
      {onDelete && (
        <Tooltip content="Delete message">
          <motion.button
            onClick={onDelete}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Delete message"
            className="p-1.5 rounded-lg hover:text-destructive hover:bg-destructive/10 transition-colors ml-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        </Tooltip>
      )}
    </div>
  );
}
