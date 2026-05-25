'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import TypingText from './TypingText';

interface Moment {
  src: string;
  size?: 'wide' | 'tall' | 'full' | 'standard';
  caption?: string;
}

const moments: Moment[] = [
  { src: '/PH1.jpg',    size: 'wide', caption: 'Beautiful memory' },
  { src: '/PH7.jpg',    size: 'wide', caption: 'Our day together' },
  { src: '/PH19.jpg',     size: 'tall', caption: 'Latifah' },
  { src: '/PH24.jpg',     size: 'tall', caption: 'Valen' },
  { src: '/PH5.jpg',     size: 'full', caption: 'Captured moment' },
  { src: '/PH8.jpg',                 caption: 'Happiness' },
  { src: '/PH9.jpg',    size: 'wide', caption: 'Warm smile' },
  { src: '/PH11.jpg',   size: 'wide', caption: 'Togetherness' },
  { src: '/PH20.jpg',    size: 'tall', caption: 'Beautiful time' },
  { src: '/PH18.jpg',    size: 'tall', caption: 'Sweet memory' },
  { src: '/PH14.jpg',                  caption: 'Our journey' },
  { src: '/PH23.jpg',                 caption: 'Joyful day' },
  { src: '/PH99.jpg',   size: 'tall', caption: 'Best moments' },
  { src: '/PH88.jpg',  size: 'tall',  caption: 'Memorable scene' },
  { src: '/PH87.jpg',  size: 'wide', caption: 'Lovely chapter' },
];


// ── Lightbox ───────────────────────────────────────────────────────────────
function Lightbox({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const moment = moments[index];
  const total = moments.length;

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNext, onPrev, onClose]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[580px] border-none bg-transparent p-0 shadow-none data-open:zoom-in-95 data-open:fade-in-0 data-closed:zoom-out-95 data-closed:fade-out-0">
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl border border-[rgba(184,160,120,0.3)] shadow-[0_32px_80px_rgba(40,25,15,0.3)]"
          style={{ background: 'linear-gradient(160deg, #faf6f0 0%, #f5ede0 45%, #ede3d4 100%)' }}
        >
          {/* ── Botanical corner decorations ── */}
          <div className="pointer-events-none absolute left-0 top-0" style={{ width: 110, opacity: 0.16, transform: 'scaleX(-1)', zIndex: 0 }} aria-hidden>
            <img src="/bung6.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
          </div>
          <div className="pointer-events-none absolute right-0 top-0" style={{ width: 80, opacity: 0.13, zIndex: 0 }} aria-hidden>
            <img src="/bung1.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
          </div>
          <div className="pointer-events-none absolute bottom-0 right-0" style={{ width: 120, opacity: 0.14, transform: 'scaleY(-1)', zIndex: 0 }} aria-hidden>
            <img src="/bung3.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0" style={{ width: 110, opacity: 0.13, zIndex: 0 }} aria-hidden>
            <img src="/bung4.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
          </div>

          {/* ── Watercolor blobs ── */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '50%', background: 'radial-gradient(ellipse, rgba(192,100,80,0.07) 0%, transparent 70%)', filter: 'blur(8px)' }} />
            <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: '55%', height: '45%', background: 'radial-gradient(ellipse, rgba(160,60,70,0.06) 0%, transparent 70%)', filter: 'blur(10px)' }} />
          </div>

          {/* ── Content ── */}
          <div className="relative p-5 sm:p-6" style={{ zIndex: 10 }}>
            <DialogTitle className="sr-only">{moment.caption}</DialogTitle>

            {/* Header — counter + caption */}
            <div className="mb-4 flex items-center justify-center gap-3">
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(184,160,120,0.7))' }} />
              <div className="text-center">
                <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[#8a7060]">
                  {index + 1} / {total}
                </span>
                <span className="block font-great-vibes text-[1.4rem] leading-tight text-[#4A3E35]">
                  {moment.caption}
                </span>
              </div>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(184,160,120,0.7))' }} />
            </div>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={moment.src}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="relative w-full overflow-hidden rounded-2xl border border-[rgba(184,160,120,0.25)] shadow-[0_12px_32px_rgba(60,35,20,0.18)]"
                style={{ aspectRatio: '4/3' }}
              >
                <img
                  src={moment.src}
                  alt={moment.caption || 'Moment'}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Inner vignette */}
                <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 40px rgba(40,20,10,0.1)', borderRadius: 'inherit' }} />
              </motion.div>
            </AnimatePresence>

            {/* Dot progress strip */}
            <div className="mt-3 flex justify-center gap-1 overflow-hidden">
              {moments.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === index ? 20 : 5,
                    height: 4,
                    borderRadius: 999,
                    background: i === index ? '#b8935a' : 'rgba(184,147,90,0.28)',
                    transition: 'all 0.35s ease',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={onPrev}
                className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(184,160,120,0.4)] bg-white/70 px-4 py-2 text-sm font-medium text-[#4A3E35] transition-all duration-300 hover:bg-white hover:shadow-md"
              >
                <ChevronLeft size={15} />
                Prev
              </button>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c4a882', opacity: 0.5 }} />
              <button
                onClick={onNext}
                className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(184,160,120,0.4)] bg-white/70 px-4 py-2 text-sm font-medium text-[#4A3E35] transition-all duration-300 hover:bg-white hover:shadow-md"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function BestMoments() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) => prev === null ? null : (prev - 1 + moments.length) % moments.length);
  }, []);

  const goNext = useCallback(() => {
    setSelectedIndex((prev) => prev === null ? null : (prev + 1) % moments.length);
  }, []);

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-4 px-4"
      >
        <Card
          className="relative overflow-hidden rounded-[24px] border border-[rgba(184,160,120,0.3)] shadow-[0_25px_50px_rgba(184,171,159,0.15)] backdrop-blur-sm"
          style={{ background: 'linear-gradient(150deg, #faf7f2 0%, #f5ede0 50%, #ede3d4 100%)' }}
        >
          {/* ── Watercolor wash ── */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '55%', height: '50%', background: 'radial-gradient(ellipse, rgba(192,100,80,0.07) 0%, transparent 70%)', filter: 'blur(10px)' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-8%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(160,60,70,0.06) 0%, transparent 70%)', filter: 'blur(10px)' }} />
            <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '35%', background: 'radial-gradient(ellipse, rgba(210,170,100,0.04) 0%, transparent 70%)', filter: 'blur(8px)' }} />
          </div>

          {/* ── Botanical corners ── */}
          <motion.div className="pointer-events-none absolute left-0 top-0" style={{ width: 'clamp(80px,16vw,150px)', opacity: 0.17, transform: 'scaleX(-1)', zIndex: 1 }} animate={{ y: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0 }} aria-hidden>
            <img src="/bung6.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
          </motion.div>
          <motion.div className="pointer-events-none absolute right-0 top-0" style={{ width: 'clamp(60px,11vw,100px)', opacity: 0.14, zIndex: 1 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} aria-hidden>
            <img src="/bung1.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
          </motion.div>
          <motion.div className="pointer-events-none absolute bottom-0 left-0" style={{ width: 'clamp(80px,16vw,150px)', opacity: 0.16, zIndex: 1 }} animate={{ y: [0, -7, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }} aria-hidden>
            <img src="/bung4.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
          </motion.div>
          <motion.div className="pointer-events-none absolute bottom-0 right-0" style={{ width: 'clamp(80px,16vw,150px)', opacity: 0.15, transform: 'scaleY(-1)', zIndex: 1 }} animate={{ y: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} aria-hidden>
            <img src="/bung3.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
          </motion.div>

          {/* ── Content ── */}
          <div className="relative p-5 sm:p-6" style={{ zIndex: 10 }}>

            {/* Title with decorative lines */}
            <div className="mb-6 flex items-center justify-center gap-3">
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(184,160,120,0.6))' }} />
              <h2 className="font-great-vibes text-[clamp(2.2rem,4.8vw,3.4rem)] leading-tight text-[#4A3E35] text-center">
                <TypingText text="Our Beautiful Moments" speed={38} />
              </h2>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(184,160,120,0.6))' }} />
            </div>

            {/* Video placeholder — ready for future */}
            {/* Uncomment and replace src when you have a video:
            <div className="mb-5 overflow-hidden rounded-2xl border border-[rgba(184,160,120,0.25)] shadow-[0_8px_24px_rgba(60,35,20,0.1)]">
              <video src="/highlight.mp4" autoPlay muted loop playsInline className="w-full object-cover" style={{ maxHeight: 280 }} />
            </div>
            */}

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 gap-2.5 auto-rows-[140px] md:grid-cols-3 md:auto-rows-[160px]">
              {moments.map((moment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.55,
                    delay: Math.min(index * 0.06, 0.5), // cap at 0.5s max delay
                    type: 'spring',
                    stiffness: 130,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => openLightbox(index)}
                  className={`group relative overflow-hidden rounded-xl cursor-pointer border border-[rgba(184,160,120,0.3)] shadow-[0_4px_14px_rgba(60,35,20,0.1)] transition-shadow duration-300 hover:shadow-[0_12px_28px_rgba(60,35,20,0.18)] ${
                    moment.size === 'wide' ? 'col-span-2' : ''
                  } ${
                    moment.size === 'tall' ? 'row-span-2' : ''
                  }`}
                >
                  {/* Image */}
                  <img
                    src={moment.src}
                    alt={moment.caption || `Moment ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    loading="lazy"
                  />

                  {/* Gradient overlay — only darkens on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                  {/* Caption — slides up on hover */}
                  <motion.div
                    className="absolute inset-x-0 bottom-0 px-3 py-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <p className="text-[0.68rem] font-medium tracking-wide text-white/95 text-center">
                      {moment.caption}
                    </p>
                  </motion.div>

                  {/* Subtle always-visible bottom fade for depth */}
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

                  {/* Corner index number — barely visible, shows on hover */}
                  <div className="absolute top-2 right-2 text-[0.6rem] font-semibold text-white/0 group-hover:text-white/50 transition-colors duration-300">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom decorative line */}
            <div className="mt-5 flex items-center gap-3">
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(184,160,120,0.4))' }} />
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c4a882', opacity: 0.5 }} />
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(184,160,120,0.4))' }} />
            </div>

          </div>
        </Card>
      </motion.section>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <Lightbox
          index={selectedIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  );
}
