'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export default function Quote() {
  const [visibleChars, setVisibleChars] = useState(0);
  const fullText = "Looking back of my life, you're the only good that i've ever done. If it's not you, its not anyone";
  
  // Writing animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (visibleChars < fullText.length) {
        setVisibleChars((prev) => prev + 1);
      }
    }, 35); // Speed of typing
    return () => clearTimeout(timer);
  }, [visibleChars, fullText.length]);

  // Format text with line breaks
  const formatText = (text: string) => {
    const lines = [
      "Looking back of my life",
      "you're the only good that i've ever done",
      "If it's not you, its not anyone"
    ];
    
    let charCount = 0;
    return lines.map((line, lineIndex) => {
      const lineStart = charCount;
      const lineEnd = charCount + line.length;
      charCount = lineEnd + 2; // +2 for line break spacing
      
      return (
        <span key={lineIndex} className="block">
          {line.split('').map((char, i) => {
            const globalIndex = lineStart + i;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: globalIndex < visibleChars ? 1 : 0,
                }}
                transition={{ duration: 0.1 }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            );
          })}
        </span>
      );
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-4 px-4"
    >
      <Card className="relative overflow-hidden border border-[rgba(73,62,53,0.2)] rounded-[24px] p-6 shadow-[0_20px_45px_rgba(66,57,49,0.12)] text-center">
        
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 opacity-80"
          animate={{
            background: [
              'linear-gradient(135deg, #cac3bc 0%, #b8b3ad 100%)',
              'linear-gradient(135deg, #d4cdc4 0%, #c2bdb8 100%)',
              'linear-gradient(135deg, #cac3bc 0%, #b8b3ad 100%)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating light particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-200/40 rounded-full"
              style={{
                left: `${(i * 15) + 10}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Radial glow effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(212,168,67,0.15) 0%, transparent 70%)',
              'radial-gradient(circle at 50% 50%, rgba(212,168,67,0.25) 0%, transparent 70%)',
              'radial-gradient(circle at 50% 50%, rgba(212,168,67,0.15) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10">
          {/* Animated initials with glow */}
          <motion.h2
            className="font-great-vibes text-[clamp(2.6rem,5.5vw,3.8rem)] leading-tight mb-3 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="relative inline-block"
              animate={{
                textShadow: [
                  '0 0 10px rgba(212,168,67,0.3), 0 0 20px rgba(212,168,67,0.2)',
                  '0 0 20px rgba(212,168,67,0.5), 0 0 30px rgba(212,168,67,0.3)',
                  '0 0 10px rgba(212,168,67,0.3), 0 0 20px rgba(212,168,67,0.2)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              L & V
            </motion.span>
          </motion.h2>

          {/* Decorative line above quote */}
          <motion.div
            className="w-16 h-[1px] mx-auto mb-4 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          />

          {/* Quote text with writing animation */}
          <motion.div
            className="font-serif text-[clamp(1.45rem,2.6vw,2.35rem)] font-semibold leading-tight relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="m-0 relative">
              {formatText(fullText)}
            </p>
          </motion.div>

        </div>
      </Card>
    </motion.section>
  );
}