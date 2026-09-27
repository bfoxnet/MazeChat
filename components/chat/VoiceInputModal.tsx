'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, Check, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscribe: (text: string) => void;
}

const MOCK_PHRASES = [
  'Architect a high-performance Redis cache layer with LRU eviction and write-behind persistence...',
  'Compare the algorithmic complexity of topological sort using Kahn\'s algorithm versus depth-first search...',
  'Can you search for recent benchmarks comparing WebAssembly GC against native V8 engine execution?',
  'Draft a comprehensive pull request description detailing the migration from REST to gRPC...',
];

const WAVEFORM_HEIGHTS = [28, 48, 64, 36, 58, 44, 32, 52, 40, 30, 46, 24];

export function VoiceInputModal({ isOpen, onClose, onTranscribe }: VoiceInputModalProps) {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const targetPhrase = MOCK_PHRASES[0];
    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex < targetPhrase.length) {
        setTranscript(targetPhrase.slice(0, charIndex + 2));
        charIndex += 2;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => {
      clearInterval(interval);
      setTranscript('');
      setIsRecording(true);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFinish = () => {
    if (transcript.trim()) {
      onTranscribe(transcript.trim());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
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
        className="relative z-10 w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl text-center text-card-foreground"
      >
        {/* Animated Wave Visualizer */}
        <div className="flex items-center justify-center gap-1.5 h-16 my-4">
          {WAVEFORM_HEIGHTS.map((height, i) => (
            <motion.div
              key={i}
              animate={isRecording ? { height: [height * 0.4, height, height * 0.4] } : { height: 8 }}
              transition={isRecording ? { repeat: Infinity, duration: 1, delay: i * 0.08 } : { duration: 0.2 }}
              className="w-1.5 rounded-full bg-gradient-to-t from-primary to-purple-400"
            />
          ))}
        </div>

        {/* Status Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-mono mb-3">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>{isRecording ? 'Listening for speech...' : 'Recording paused'}</span>
        </div>

        {/* Real-time Transcription Stream */}
        <div className="min-h-[72px] p-3.5 rounded-2xl bg-secondary/50 border border-border text-foreground text-sm text-left font-sans italic leading-relaxed">
          {transcript || 'Listening...'}
          {isRecording && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 mt-6">
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="rounded-xl text-muted-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsRecording(!isRecording)}
              className="rounded-xl"
            >
              {isRecording ? (
                <>
                  <Square className="w-3.5 h-3.5 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 mr-1" />
                  Resume
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={handleFinish}
              className="rounded-xl"
            >
              <Check className="w-4 h-4 mr-1" />
              Use Text
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
