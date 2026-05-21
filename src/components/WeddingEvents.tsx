'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, Calendar, Gift,  Sparkles } from 'lucide-react';
import TypingText from './TypingText';

interface Event {
  id: string;
  label: string;
  sublabel: string;
  weekday: string;
  day: number;
  month: string;
  year: string;
  time: string;
  dress: string;
  location: string;
  locationShort: string;
}

const events: Event[] = [
  {
    id: 'akad',
    label: 'Akad Nikah',
    sublabel: '',
    weekday: 'Saturday',
    day: 4,
    month: 'July',
    year: '2026',
    time: '14:00 WIB',
    dress: '',
    location: "D'Girijati Hotel & Beach Club, Purwosari, Gunungkidul Regency, Special Region of Yogyakarta 55872",
    locationShort: "D'Girijati Hotel & Beach Club",
  },
  {
    id: 'resepsi',
    label: 'Resepsi',
    sublabel: '',
    weekday: 'Saturday',
    day: 4,
    month: 'July',
    year: '2026',
    time: '16:00 WIB',
    dress: '',
    location: "D'Girijati Hotel & Beach Club, Purwosari, Gunungkidul Regency, Special Region of Yogyakarta 55872",
    locationShort: "D'Girijati Hotel & Beach Club",
  },
];

const timeline = [
  { time: '13:00', event: 'Seserahan', icon: '', desc: 'Exchange of gifts' },
  { time: '14:00', event: 'Akad Nikah', icon: '', desc: 'Marriage contract' },
  { time: '16:10', event: 'Opening Resepsi', icon: '', desc: 'Reception begins' },
  { time: '17:30', event: 'Closing', icon: '', desc: 'Thank you & farewell' },
];

// ── Animated Saturday letters ──────────────────────────────────────────────
function WaveText({ text }: { text: string }) {
  return (
    <span className="inline-flex">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.08,
          }}
          style={{ display: 'inline-block' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// ── Floating sparkle particles around the date ────────────────────────────
const sparkles = [
  { x: -28, y: -20, size: 5, delay: 0 },
  { x: 28, y: -18, size: 4, delay: 0.4 },
  { x: -22, y: 24, size: 3.5, delay: 0.8 },
  { x: 24, y: 22, size: 4, delay: 1.2 },
  { x: 0, y: -32, size: 3, delay: 0.6 },
  { x: -36, y: 2, size: 3, delay: 1.0 },
  { x: 36, y: 4, size: 3.5, delay: 0.2 },
];

function FloatingSparkles() {
  return (
    <>
      {sparkles.map((s, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `calc(50% + ${s.x}px)`,
            top: `calc(50% + ${s.y}px)`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: '#d4a843',
          }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.5, 1.3, 0.5],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        />
      ))}
    </>
  );
}

// ── Animated Date Card ─────────────────────────────────────────────────────
function DateDisplay({ event }: { event: Event }) {
  return (
    <div className="flex flex-col items-center py-6 px-4">

      {/* Saturday — wave animation */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#8a7060] mb-1"
      >
        <WaveText text={event.weekday} />
      </motion.div>

      {/* Decorative line above date */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mb-2 h-px w-16 origin-center"
        style={{ background: 'linear-gradient(to right, transparent, #c4a882, transparent)' }}
      />

      {/* The big "4" — shimmer glow pulse */}
      <div className="relative flex items-center justify-center my-1">
        <FloatingSparkles />

        {/* Glow behind the number */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ opacity: [0.2, 0.55, 0.2], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'radial-gradient(ellipse, rgba(212,168,67,0.35) 0%, transparent 70%)',
            filter: 'blur(12px)',
            width: 100,
            height: 100,
          }}
        />

        <motion.span
          className="relative font-serif font-bold leading-none select-none"
          style={{
            fontSize: 'clamp(5rem, 14vw, 7.5rem)',
            background: 'linear-gradient(160deg, #8a6a30 0%, #d4a843 45%, #c49030 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 8px rgba(180,130,40,0.3))',
          }}
          animate={{ scale: [1, 1.025, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {event.day}
        </motion.span>
      </div>

      {/* Decorative line below date */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-2 h-px w-16 origin-center"
        style={{ background: 'linear-gradient(to right, transparent, #c4a882, transparent)' }}
      />

      {/* July — elegant fade with gold script */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="mt-2 text-center"
      >
        <span
          className="block font-great-vibes leading-none text-[#4A3E35]"
          style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)' }}
        >
          {event.month}
        </span>
        <motion.span
          className="block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8a7060] mt-0.5"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          {event.year}
        </motion.span>
      </motion.div>

      {/* Time pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-4 flex items-center gap-2 rounded-full border border-[rgba(196,168,130,0.5)] px-4 py-1.5"
        style={{ background: 'linear-gradient(135deg, rgba(255,248,235,0.9), rgba(245,235,210,0.9))' }}
      >
        <Clock size={13} className="text-[#b8935a]" />
        <span className="text-[0.75rem] font-semibold tracking-[0.1em] text-[#4A3E35]">
          {event.time}
        </span>
      </motion.div>

      {/* Dress code */}
      <p className="mt-1.5 text-[0.62rem] uppercase tracking-[0.14em] text-[#a09080]">
        {event.dress}
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function WeddingEvents() {
  const [activeEvent, setActiveEvent] = useState<'akad' | 'resepsi'>('akad');
  const currentEvent = events.find((e) => e.id === activeEvent)!;

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
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '55%', height: '50%', background: 'radial-gradient(ellipse, rgba(192,100,80,0.07) 0%, transparent 70%)', filter: 'blur(10px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-8%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(160,60,70,0.06) 0%, transparent 70%)', filter: 'blur(10px)' }} />
          <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '40%', background: 'radial-gradient(ellipse, rgba(210,170,100,0.04) 0%, transparent 70%)', filter: 'blur(8px)' }} />
        </div>

        {/* ── Botanical corners ── */}
        <motion.div className="pointer-events-none absolute left-0 top-0" style={{ width: 'clamp(80px,16vw,140px)', opacity: 0.17, transform: 'scaleX(-1)', zIndex: 1 }} animate={{ y: [0, -7, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0 }} aria-hidden>
          <img src="/bung6.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
        </motion.div>
        <motion.div className="pointer-events-none absolute right-0 top-0" style={{ width: 'clamp(60px,11vw,100px)', opacity: 0.14, zIndex: 1 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} aria-hidden>
          <img src="/bung1.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
        </motion.div>
        <motion.div className="pointer-events-none absolute bottom-0 left-0" style={{ width: 'clamp(80px,16vw,140px)', opacity: 0.16, zIndex: 1 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }} aria-hidden>
          <img src="/bung4.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
        </motion.div>
        <motion.div className="pointer-events-none absolute bottom-0 right-0" style={{ width: 'clamp(80px,16vw,140px)', opacity: 0.15, transform: 'scaleY(-1)', zIndex: 1 }} animate={{ y: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} aria-hidden>
          <img src="/bung3.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
        </motion.div>

        {/* ── Content ── */}
        <div className="relative p-5" style={{ zIndex: 10 }}>

          {/* Title */}
          <div className="mb-5 flex items-center justify-center gap-3">
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(184,160,120,0.6))' }} />
            <h2 className="font-great-vibes text-[clamp(2.2rem,4.8vw,3.4rem)] leading-tight text-[#4A3E35]">
              <TypingText text="Wedding Events" speed={40} />
            </h2>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(184,160,120,0.6))' }} />
          </div>

          {/* ── Event Tab Switcher ── */}
          <div className="mb-5 flex rounded-2xl border border-[rgba(184,160,120,0.3)] bg-white/40 p-1 gap-1">
            {events.map((e) => (
              <button
                key={e.id}
                onClick={() => setActiveEvent(e.id as 'akad' | 'resepsi')}
                className="relative flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-300"
                style={{ color: activeEvent === e.id ? '#4A3E35' : '#8a7060' }}
              >
                {activeEvent === e.id && (
                  <motion.div
                    layoutId="event-tab"
                    className="absolute inset-0 rounded-xl border border-[rgba(196,168,130,0.4)] shadow-sm"
                    style={{ background: 'linear-gradient(135deg, rgba(255,250,240,0.95), rgba(245,235,215,0.9))' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center gap-0.5">
                  <span>{e.label}</span>
                  <span className="text-[0.6rem] font-normal uppercase tracking-[0.12em] opacity-70">{e.sublabel}</span>
                </span>
              </button>
            ))}
          </div>

          {/* ── Animated Date Card ── */}
          <div
            className="mb-5 overflow-hidden rounded-2xl border border-[rgba(196,168,130,0.3)] shadow-[0_8px_24px_rgba(60,35,20,0.1)]"
            style={{ background: 'linear-gradient(160deg, rgba(255,251,242,0.95) 0%, rgba(248,238,220,0.9) 100%)' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEvent}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <DateDisplay event={currentEvent} />
              </motion.div>
            </AnimatePresence>

            {/* Location strip at bottom of date card */}
            <div className="border-t border-[rgba(196,168,130,0.2)] px-4 py-3 flex items-start gap-2.5">
              <MapPin size={14} className="mt-0.5 shrink-0 text-[#b8935a]" />
              <p className="text-[0.75rem] leading-relaxed text-[#6B5F57]">
                {currentEvent.location}
              </p>
            </div>
          </div>

          {/* ── Program & Map row ── */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

            {/* Program Timeline */}
            <div
              className="rounded-2xl border border-[rgba(196,168,130,0.25)] p-4 group"
              style={{ background: 'rgba(255,251,242,0.7)' }}
            >
              <div className="mb-4 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Clock size={15} className="text-[#b8935a]" />
                </motion.div>
                <h3 className="font-serif text-base font-semibold text-[#4A3E35]">Program</h3>
              </div>

              <div className="space-y-2">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 6 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      type: 'spring',
                      stiffness: 400,
                      damping: 30
                    }}
                    viewport={{ once: true }}
                    className="relative cursor-pointer group/item"
                  >
                    {/* Background glow on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(212,168,67,0.1), rgba(196,168,130,0.05))',
                      }}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300">
                      {/* Timeline number indicator */}
                      <motion.div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#b8935a] bg-white text-sm font-bold text-[#b8935a]"
                        whileHover={{ 
                          scale: 1.15,
                          boxShadow: '0 0 12px rgba(184,147,90,0.4)'
                        }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        {index + 1}
                      </motion.div>

                      {/* Time */}
                      <div className="min-w-[2.5rem]">
                        <motion.span
                          className="block text-[0.75rem] font-bold tracking-wider text-[#b8935a]"
                          whileHover={{ fontSize: '0.85rem' }}
                        >
                          {item.time}
                        </motion.span>
                      </div>

                      {/* Icon & Event */}
                      <div className="flex-1 flex items-center gap-2">
                        <motion.span
                          className="text-lg"
                          animate={{ y: [0, -3, 0] }}
                          transition={{ 
                            duration: 2.5, 
                            repeat: Infinity,
                            delay: index * 0.2
                          }}
                        >
                          {item.icon}
                        </motion.span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#4A3E35] group-hover/item:text-[#d4a843] transition-colors">
                            {item.event}
                          </p>
                          <p className="text-[0.65rem] text-[#8a7060] group-hover/item:text-[#b8935a] transition-colors">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {/* Arrow indicator on hover */}
                      <motion.div
                        className="shrink-0"
                        initial={{ opacity: 0, x: -8 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" className="text-[#b8935a]">
                          <path 
                            d="M3 8h10M10 5l3 3-3 3" 
                            stroke="currentColor" 
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Connecting line to next item */}
                    {index < timeline.length - 1 && (
                      <motion.div
                        className="absolute left-[15px] top-full h-2 w-0.5 origin-top"
                        style={{
                          background: 'linear-gradient(to bottom, rgba(196,168,130,0.6), rgba(196,168,130,0.2))',
                        }}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div
              className="rounded-2xl border border-[rgba(196,168,130,0.25)] overflow-hidden"
              style={{ background: 'rgba(255,251,242,0.7)', minHeight: 220 }}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(196,168,130,0.2)]">
                <MapPin size={15} className="text-[#b8935a]" />
                <h3 className="font-serif text-base font-semibold text-[#4A3E35]">Location</h3>
              </div>
              <iframe
                title="Wedding location map"
                src="https://www.google.com/maps?q=Dgirijati+Resort+Jogjakarta&output=embed"
                className="w-full border-0"
                style={{ minHeight: 175 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Bottom decorative line */}
          <div className="mt-5 flex items-center gap-3">
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(184,160,120,0.4))' }} />
            <Calendar size={12} className="text-[#c4a882] opacity-60" />
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(184,160,120,0.4))' }} />
          </div>

        </div>
      </Card>
    </motion.section>
  );
}
