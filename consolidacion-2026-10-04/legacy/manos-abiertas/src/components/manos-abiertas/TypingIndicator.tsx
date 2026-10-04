'use client';

import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/50 rounded-2xl w-fit">
      <motion.div
        className="w-2 h-2 rounded-full bg-primary"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-primary"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-primary"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
}

interface StreamingTextProps {
  text: string;
  isStreaming?: boolean;
}

export function StreamingText({ text, isStreaming = false }: StreamingTextProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
      {isStreaming && <TypingIndicator />}
    </div>
  );
}
