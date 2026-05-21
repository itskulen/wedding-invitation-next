'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface TypingTextProps {
  text: string;
  speed?: number;
  startDelay?: number;
  showCursor?: boolean;
  className?: string;
}

export default function TypingText({
  text,
  speed = 42,
  startDelay = 0,
  showCursor = true,
  className = '',
}: TypingTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [typed, setTyped] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (!isInView) return;

    let index = 0;
    const timeoutId = window.setTimeout(() => {
      const typeId = window.setInterval(() => {
        index += 1;
        setTyped(text.slice(0, index));
        if (index >= text.length) {
          window.clearInterval(typeId);
        }
      }, speed);
    }, startDelay);

    return () => window.clearTimeout(timeoutId);
  }, [isInView, text, speed, startDelay]);

  useEffect(() => {
    if (!showCursor) return;
    const cursorId = window.setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 520);
    return () => window.clearInterval(cursorId);
  }, [showCursor]);

  return (
    <span ref={ref} className={className}>
      {typed}
      {showCursor && typed.length < text.length ? (
        <span className={cursorVisible ? 'opacity-100' : 'opacity-0'}>|</span>
      ) : null}
    </span>
  );
}
