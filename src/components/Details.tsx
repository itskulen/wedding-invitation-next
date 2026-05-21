'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import TypingText from './TypingText';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// ── Flip number — animates every time value changes ────────────────────────
function FlipNumber({ value, isSeconds }: { value: number; isSeconds?: boolean }) {
  const display = String(value).padStart(2, '0');

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ height: '2.8rem', width: '100%', overflow: 'hidden' }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={display}
          initial={{ y: -32, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{    y:  32, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
          style={{
            position: 'absolute',
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
            fontWeight: 700,
            color: isSeconds ? '#b8793a' : '#4A3E35',
            lineHeight: 1,
          }}
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ── Single countdown unit box ──────────────────────────────────────────────
function CountUnit({
  value,
  label,
  isSeconds,
  delay,
}: {
  value: number;
  label: string;
  isSeconds?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, type: 'spring', stiffness: 140 }}
      viewport={{ once: true }}
      className="relative flex flex-col items-center"
    >
      {/* Live pulse ring on seconds */}
      {isSeconds && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{ opacity: [0, 0.5, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            border: '1px solid rgba(212,168,67,0.55)',
            borderRadius: 16,
          }}
        />
      )}

      {/* Box */}
      <div
        className="relative w-full flex flex-col items-center py-3 px-2 rounded-2xl"
        style={{
          background: isSeconds
            ? 'linear-gradient(160deg, rgba(255,248,228,0.95) 0%, rgba(248,236,200,0.9) 100%)'
            : 'linear-gradient(160deg, rgba(255,251,244,0.95) 0%, rgba(245,237,220,0.9) 100%)',
          border: `1px solid ${isSeconds ? 'rgba(212,168,67,0.35)' : 'rgba(184,160,120,0.3)'}`,
          boxShadow: isSeconds
            ? '0 8px 24px rgba(180,130,40,0.12), inset 0 1px 0 rgba(255,255,255,0.7)'
            : '0 6px 18px rgba(60,35,20,0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            width: 28,
            height: 1.5,
            borderRadius: 999,
            background: isSeconds
              ? 'linear-gradient(to right, transparent, #d4a843, transparent)'
              : 'linear-gradient(to right, transparent, rgba(184,160,120,0.6), transparent)',
            marginBottom: 6,
          }}
        />

        <FlipNumber value={value} isSeconds={isSeconds} />

        {/* Bottom accent line */}
        <div
          style={{
            width: 28,
            height: 1.5,
            borderRadius: 999,
            background: isSeconds
              ? 'linear-gradient(to right, transparent, #d4a843, transparent)'
              : 'linear-gradient(to right, transparent, rgba(184,160,120,0.6), transparent)',
            marginTop: 6,
            marginBottom: 4,
          }}
        />

        <span
          className="uppercase font-semibold tracking-[0.14em]"
          style={{
            fontSize: '0.58rem',
            color: isSeconds ? '#8a6a30' : '#8a7060',
          }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Details() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-07-04T14:00:00+07:00');

    const calc = (): TimeLeft => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days:    Math.floor(diff / 86_400_000),
        hours:   Math.floor((diff / 3_600_000) % 24),
        minutes: Math.floor((diff / 60_000) % 60),
        seconds: Math.floor((diff / 1_000) % 60),
      };
    };

    setTimeLeft(calc());
    const t = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(t);
  }, []);

  const units = [
    { key: 'days',    label: 'Days',    value: timeLeft.days    },
    { key: 'hours',   label: 'Hours',   value: timeLeft.hours   },
    { key: 'minutes', label: 'Minutes', value: timeLeft.minutes },
    { key: 'seconds', label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-4 px-4"
    >
      <Card
        className="relative overflow-hidden rounded-[24px] border border-[rgba(184,160,120,0.3)] shadow-[0_20px_45px_rgba(66,57,49,0.12)] backdrop-blur-sm"
        style={{ background: 'linear-gradient(150deg, #faf7f2 0%, #f5ede0 50%, #ede3d4 100%)' }}
      >
        {/* ── Watercolor wash ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
          <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(ellipse, rgba(192,100,80,0.07) 0%, transparent 70%)', filter: 'blur(12px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-8%', width: '55%', height: '55%', background: 'radial-gradient(ellipse, rgba(160,60,70,0.06) 0%, transparent 70%)', filter: 'blur(10px)' }} />
          <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)', width: '70%', height: '50%', background: 'radial-gradient(ellipse, rgba(212,168,67,0.04) 0%, transparent 70%)', filter: 'blur(8px)' }} />
        </div>

        {/* ── Botanical corners ── */}
        <motion.div className="pointer-events-none absolute left-0 top-0" style={{ width: 'clamp(80px,18vw,150px)', opacity: 0.17, transform: 'scaleX(-1)', zIndex: 1 }} animate={{ y: [0, -7, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0 }} aria-hidden>
          <img src="/bung6.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
        </motion.div>
        <motion.div className="pointer-events-none absolute right-0 top-0" style={{ width: 'clamp(60px,11vw,100px)', opacity: 0.14, zIndex: 1 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} aria-hidden>
          <img src="/bung1.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
        </motion.div>
        <motion.div className="pointer-events-none absolute bottom-0 left-0" style={{ width: 'clamp(80px,16vw,140px)', opacity: 0.15, zIndex: 1 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }} aria-hidden>
          <img src="/bung4.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
        </motion.div>
        <motion.div className="pointer-events-none absolute bottom-0 right-0" style={{ width: 'clamp(80px,16vw,140px)', opacity: 0.14, transform: 'scaleY(-1)', zIndex: 1 }} animate={{ y: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} aria-hidden>
          <img src="/bung3.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
        </motion.div>

        {/* ── Content ── */}
        <div className="relative p-6" style={{ zIndex: 10 }}>

          {/* Title */}
          <div className="mb-5 flex items-center justify-center gap-3">
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(184,160,120,0.6))' }} />
            <h2
              className="text-center leading-tight"
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: 'clamp(1.9rem, 5.5vw, 3rem)',
                color: '#4A3E35',
              }}
            >
              <TypingText text="Dear Family & Friends" speed={40} />
            </h2>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(184,160,120,0.6))' }} />
          </div>

          {/* Invitation text */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true }}
            className="mx-auto mb-6 max-w-sm text-center"
          >
            {/* Opening quote */}
            <div
              className="mb-1 font-serif leading-none"
              style={{ fontSize: '2rem', color: '#c4a882', opacity: 0.5 }}
              aria-hidden
            >
              "
            </div>
            <p
              className="leading-[1.85] tracking-[0.01em]"
              style={{ fontSize: 'clamp(0.85rem, 2.2vw, 0.95rem)', color: '#5a4e45' }}
            >
              With joy in our hearts, we invite you to celebrate our wedding day.
              We would be honored to have your presence as we begin this beautiful
              chapter together.
            </p>
            {/* Closing decorative line */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <div style={{ width: 32, height: 1, background: 'linear-gradient(to right, transparent, rgba(196,168,130,0.6))' }} />
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c4a882', opacity: 0.55 }} />
              <div style={{ width: 32, height: 1, background: 'linear-gradient(to left, transparent, rgba(196,168,130,0.6))' }} />
            </div>
          </motion.div>

          {/* Countdown label */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(184,160,120,0.45))' }} />
            <div className="text-center">
              <span
                className="block uppercase font-semibold tracking-[0.18em]"
                style={{ fontSize: '0.62rem', color: '#8a7060' }}
              >
                Counting down to
              </span>
              <span
                className="block"
                style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.4rem', color: '#4A3E35', lineHeight: 1.2 }}
              >
                Our Special Day
              </span>
            </div>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(184,160,120,0.45))' }} />
          </div>

          {/* Countdown grid */}
          <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
            {units.map((u, i) => (
              <CountUnit
                key={u.key}
                value={u.value}
                label={u.label}
                isSeconds={u.key === 'seconds'}
                delay={i * 0.08}
              />
            ))}
          </div>

          {/* Date reminder below */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-4 text-center"
          >
            <div className="mb-2 flex items-center justify-center gap-3">
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(184,160,120,0.35))' }} />
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c4a882', opacity: 0.4 }} />
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(184,160,120,0.35))' }} />
            </div>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a7060' }}>
              Saturday · 4th July 2026 · 14:00 WIB
            </p>
          </motion.div>

        </div>
      </Card>
    </motion.section>
  );
}
