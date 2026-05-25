'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import TypingText from './TypingText';

const journeyImages = [
  {
    src: '/A2.JPG',
    desc: 'Chapter I',
    subtitle: 'The Beginning',
    caption: 'Tidak ada yang kebetulan, Yang Maha Kuasa telah lebih dulu merangkai takdir terbaik untuk kami.',
  },
  {
    src: '/A1.JPG',
    desc: 'Chapter II',
    subtitle: 'Two Paths Crossed',
    caption: 'Kami dua orang asing dari arah yang berbeda, dipertemukan di sebuah kota. Membawa masa lalu yang tak sama, namun rasa yang serupa. Kami tidak saling mencari, namun takdir diam diam menemukan jalannya sendiri.',
  },
  {
    src: '/P13.JPG',
    desc: 'Chapter III',
    subtitle: 'Finding Home',
    caption: 'Dari obrolan sederhana hingga luka yang perlahan terucap, tanpa disadari kami menjadi tempat untuk pulang. Dua hati akhirnya saling menguatkan. Kami berjalan tanpa janji berlebihan, hanya saling menemani dan menyembuhkan. Bukan lagi tentang ambisi, melainkan seperti doa yang tenang dan penuh harap.',
  },
  {
    src: '/p7.JPEG',
    desc: 'Chapter IV',
    subtitle: 'Growing Together',
    caption: 'Kini kami mengerti, cinta hadir perlahan, merangkai kembali yang pernah patah. Pertemuan ini bukan tentang siapa yang datang lebih dulu, melainkan tentang siapa yang tetap menggenggam erat hingga jiwa merasa utuh.',
  },
  {
    src: '/p11.JPEG',
    desc: 'Chapter V',
    subtitle: 'Sacred Promise',
    caption: 'Dalam segala rapuh yang tersisa dan kesederhanaan yang penuh makna, kami memilih saling menggenggam, mengikat janji suci karena ingin saling menjaga, dalam doa yang tulus dan harapan akan ridha Nya.',
  },
];

export default function Journey() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupDirection, setPopupDirection] = useState<1 | -1>(1);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % journeyImages.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + journeyImages.length) % journeyImages.length);
  const goToSlide = (index: number) => setCurrentIndex(index);

  const nextPopupChapter = () => { setPopupDirection(1); nextSlide(); };
  const prevPopupChapter = () => { setPopupDirection(-1); prevSlide(); };

  const activeSlide = journeyImages[currentIndex];

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="px-4 py-4"
      >
        <Card className="relative overflow-hidden rounded-[24px] border border-[rgba(184,160,120,0.3)] shadow-[0_20px_45px_rgba(66,57,49,0.12)] backdrop-blur-sm"
          style={{ background: 'linear-gradient(150deg, #faf7f2 0%, #f5ede0 50%, #ede3d4 100%)' }}
        >

          {/* ── Watercolor wash blobs ── */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
            <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '55%', height: '55%', background: 'radial-gradient(ellipse, rgba(192,100,80,0.07) 0%, transparent 70%)', filter: 'blur(10px)' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-8%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(160,60,70,0.06) 0%, transparent 70%)', filter: 'blur(10px)' }} />
            <div style={{ position: 'absolute', top: '40%', right: '-5%', width: '35%', height: '40%', background: 'radial-gradient(ellipse, rgba(180,140,90,0.05) 0%, transparent 70%)', filter: 'blur(8px)' }} />
          </div>

          {/* ── Botanical corner accents ── */}
          {/* Top-left: bung6 cherry blossom mirrored */}
          <motion.div
            className="pointer-events-none absolute left-0 top-0"
            style={{ width: 'clamp(90px, 18vw, 160px)', opacity: 0.2, transform: 'scaleX(-1)', zIndex: 1 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
            aria-hidden
          >
            <img src="/bung6.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
          </motion.div>

          {/* Top-right: bung1 vine */}
          <motion.div
            className="pointer-events-none absolute right-0 top-0"
            style={{ width: 'clamp(60px, 12vw, 110px)', opacity: 0.16, zIndex: 1 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            aria-hidden
          >
            <img src="/bung1.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
          </motion.div>

          {/* Bottom-left: bung4 plum */}
          <motion.div
            className="pointer-events-none absolute bottom-0 left-0"
            style={{ width: 'clamp(90px, 18vw, 160px)', opacity: 0.18, zIndex: 1 }}
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
            aria-hidden
          >
            <img src="/bung4.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
          </motion.div>

          {/* Bottom-right: bung3 cherry flipped */}
          <motion.div
            className="pointer-events-none absolute bottom-0 right-0"
            style={{ width: 'clamp(90px, 18vw, 160px)', opacity: 0.17, transform: 'scaleY(-1)', zIndex: 1 }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            aria-hidden
          >
            <img src="/bung3.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
          </motion.div>

          {/* ── Content ── */}
          <div className="relative p-5" style={{ zIndex: 10 }}>

            {/* Title with decorative lines */}
            <div className="mb-5 flex items-center justify-center gap-3">
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(184,160,120,0.6))' }} />
              <h2 className="font-great-vibes text-[clamp(2.2rem,4.8vw,3.4rem)] leading-tight text-[#4A3E35]">
                <TypingText text="Our Journey" speed={42} />
              </h2>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(184,160,120,0.6))' }} />
            </div>

            {/* Chapter progress pills */}
            <div className="mb-3 flex justify-center gap-1.5">
              {journeyImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="group flex flex-col items-center gap-1 transition-all duration-300"
                  aria-label={`Go to ${img.desc}`}
                >
                  <div
                    style={{
                      width: index === currentIndex ? 28 : 8,
                      height: 4,
                      borderRadius: 999,
                      background: index === currentIndex ? '#b8935a' : 'rgba(184,147,90,0.28)',
                      transition: 'all 0.35s ease',
                    }}
                  />
                  {index === currentIndex && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#8a7060]"
                    >
                      {img.desc}
                    </motion.span>
                  )}
                </button>
              ))}
            </div>

            {/* Slider track */}
            <div className="relative">
              {/* Left arrow */}
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[rgba(184,160,120,0.4)] bg-white/80 text-[#4A3E35] shadow-[0_4px_12px_rgba(60,35,20,0.15)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-[0_6px_18px_rgba(60,35,20,0.2)]"
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Image frame */}
              <button
                type="button"
                onClick={() => setIsPopupOpen(true)}
                className="group relative block w-full overflow-hidden rounded-2xl border border-[rgba(184,160,120,0.2)] shadow-[0_12px_32px_rgba(60,35,20,0.14)]"
                style={{ aspectRatio: '4/3' }}
                aria-label={`Open ${activeSlide.desc} details`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide.src}
                    className="absolute inset-0 h-full w-full"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.75, ease: 'easeInOut' }}
                  >
                    <img
                      src={activeSlide.src}
                      alt={activeSlide.desc}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Bottom gradient with chapter info */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-4 pt-16">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/70">
                    {activeSlide.desc}
                  </p>
                  <p className="font-great-vibes text-[1.5rem] leading-tight text-white">
                    {activeSlide.subtitle}
                  </p>
                </div>

                {/* Tap to read — redesigned */}
                <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 backdrop-blur-md transition-all duration-300 group-hover:bg-white/30">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white">
                    Tap to read
                  </span>
                </div>

                {/* Inner vignette */}
                <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 50px rgba(40,20,10,0.1)', borderRadius: 'inherit' }} />
              </button>

              {/* Right arrow */}
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[rgba(184,160,120,0.4)] bg-white/80 text-[#4A3E35] shadow-[0_4px_12px_rgba(60,35,20,0.15)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-[0_6px_18px_rgba(60,35,20,0.2)]"
                aria-label="Next slide"
              >
                <ChevronRight size={16} />
              </button>
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

      {/* ── Redesigned Modal ─────────────────────────────────────────── */}
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent className="max-w-[560px] border-none bg-transparent p-0 shadow-none data-open:zoom-in-95 data-open:fade-in-0 data-closed:zoom-out-95 data-closed:fade-out-0">
          {/* Close button */}
          <button
            onClick={() => setIsPopupOpen(false)}
            className="absolute top-3 right-3 z-[60] flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#4A3E35] transition-all duration-300 hover:bg-white hover:scale-110 shadow-[0_4px_12px_rgba(60,35,20,0.15)] hover:shadow-[0_6px_18px_rgba(60,35,20,0.2)]"
            aria-label="Close chapter"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-3xl border border-[rgba(184,160,120,0.3)] shadow-[0_32px_80px_rgba(40,25,15,0.3)]"
            style={{ background: 'linear-gradient(160deg, #faf6f0 0%, #f5ede0 45%, #ede3d4 100%)' }}
          >

            {/* ── Botanical corner decorations ── */}
            <div className="pointer-events-none absolute left-0 top-0" style={{ width: 120, opacity: 0.18, transform: 'scaleX(-1)', zIndex: 0 }} aria-hidden>
              <img src="/bung6.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
            </div>
            <div className="pointer-events-none absolute right-0 top-0" style={{ width: 85, opacity: 0.14, zIndex: 0 }} aria-hidden>
              <img src="/bung1.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
            </div>
            <div className="pointer-events-none absolute bottom-0 right-0" style={{ width: 130, opacity: 0.15, transform: 'scaleY(-1)', zIndex: 0 }} aria-hidden>
              <img src="/bung3.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0" style={{ width: 120, opacity: 0.13, zIndex: 0 }} aria-hidden>
              <img src="/bung4.png" alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
            </div>

            {/* ── Watercolor wash blobs ── */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
              <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '50%', background: 'radial-gradient(ellipse, rgba(192,100,80,0.07) 0%, transparent 70%)', filter: 'blur(8px)' }} />
              <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: '55%', height: '45%', background: 'radial-gradient(ellipse, rgba(160,60,70,0.06) 0%, transparent 70%)', filter: 'blur(10px)' }} />
            </div>

            {/* ── Content ── */}
            <div className="relative p-5 sm:p-6" style={{ zIndex: 10 }}>
              <DialogTitle className="sr-only">{activeSlide.desc}</DialogTitle>

              <AnimatePresence mode="wait" custom={popupDirection}>
                <motion.div
                  key={`${activeSlide.desc}-${currentIndex}`}
                  initial={{ opacity: 0, rotateY: popupDirection > 0 ? -18 : 18, x: popupDirection > 0 ? 24 : -24, transformPerspective: 1200 }}
                  animate={{ opacity: 1, rotateY: 0, x: 0, transformPerspective: 1200 }}
                  exit={{ opacity: 0, rotateY: popupDirection > 0 ? 18 : -18, x: popupDirection > 0 ? -24 : 24, transformPerspective: 1200 }}
                  transition={{ duration: 0.52, ease: [0.22, 0.61, 0.36, 1] }}
                  className="origin-center"
                >

                  {/* Chapter header with decorative lines */}
                  <div className="mb-4 flex items-center justify-center gap-3">
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(184,160,120,0.7))' }} />
                    <div className="text-center">
                      <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[#8a7060]">
                        {activeSlide.desc}
                      </span>
                      <span className="block font-great-vibes text-[1.5rem] leading-tight text-[#4A3E35]">
                        {activeSlide.subtitle}
                      </span>
                    </div>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(184,160,120,0.7))' }} />
                  </div>

                  {/* Image — full width, object-cover, no black box */}
                  <div
                    className="relative w-full overflow-hidden rounded-2xl border border-[rgba(184,160,120,0.25)] shadow-[0_12px_32px_rgba(60,35,20,0.18)]"
                    style={{ aspectRatio: '4/3' }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeSlide.src}
                        src={activeSlide.src}
                        alt={activeSlide.desc}
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                      />
                    </AnimatePresence>
                    {/* Inner vignette */}
                    <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 40px rgba(40,20,10,0.12)', borderRadius: 'inherit' }} />
                    {/* Bottom fade */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-[#f5ede0]/50 to-transparent" />
                  </div>

                  {/* Caption — warm parchment card */}
                  <div
                    className="mt-4 rounded-2xl border border-[rgba(184,160,120,0.2)] px-5 py-4"
                    style={{ background: 'rgba(255,251,244,0.8)', backdropFilter: 'blur(4px)' }}
                  >
                    <div className="mb-1 font-serif text-[2.2rem] leading-none text-[#c4a882] opacity-50" aria-hidden>"</div>
                    <p className="text-[clamp(0.88rem,2vw,1rem)] leading-[1.8] tracking-[0.01em] text-[#4A3E35]">
                      {activeSlide.caption}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(196,168,130,0.5), transparent)' }} />
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c4a882', opacity: 0.5 }} />
                    </div>
                  </div>

                  {/* Dot progress */}
                  <div className="mt-3 flex justify-center gap-1.5">
                    {journeyImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setPopupDirection(i > currentIndex ? 1 : -1); goToSlide(i); }}
                        style={{
                          width: i === currentIndex ? 20 : 6,
                          height: 6,
                          borderRadius: 999,
                          background: i === currentIndex ? '#b8935a' : 'rgba(184,147,90,0.3)',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'all 0.3s',
                        }}
                        aria-label={`Go to chapter ${i + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.17 }}
                className="mt-4 flex items-center justify-between"
              >
                <button
                  type="button"
                  onClick={prevPopupChapter}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(184,160,120,0.4)] bg-white/70 px-4 py-2 text-sm font-medium text-[#4A3E35] transition-all duration-300 hover:bg-white hover:shadow-md"
                >
                  <ChevronLeft size={15} />
                  Prev
                </button>
                <span className="text-[0.68rem] uppercase tracking-[0.18em] text-[#8a7060]">
                  {currentIndex + 1} / {journeyImages.length}
                </span>
                <button
                  type="button"
                  onClick={nextPopupChapter}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(184,160,120,0.4)] bg-white/70 px-4 py-2 text-sm font-medium text-[#4A3E35] transition-all duration-300 hover:bg-white hover:shadow-md"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
