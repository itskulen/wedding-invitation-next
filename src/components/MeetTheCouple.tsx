'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, Sparkles, X } from 'lucide-react';
import TypingText from './TypingText';

type CoupleProfile = {
  key: 'latifah' | 'valen';
  cardName: string;
  headingName: string;
  fullName: string;
  roleLine: string;
  parentLine: string;
  instagramLabel: string;
  instagramUrl: string;
  introTitle: string;
  introBody: string;
  secondaryBody: string;
  cardImage: string;
  profileSlides: string[];
  activityPhotos: string[];
};

const couples: CoupleProfile[] = [
  {
    key: 'latifah',
    cardName: 'Latifah',
    headingName: "Hi, I'm Latifah!",
    fullName: 'Latifah Qalbi Minza',
    roleLine: 'Putri Dari',
    parentLine: 'Bapak Zainer & Ibu Minta Wahyuni (Almh)',
    instagramLabel: '@latifahqalbi',
    instagramUrl: 'https://www.instagram.com/latifahqalbi',
    introTitle: 'Introduction of Latifah',
    introBody: 'Latifah adalah pribadi yang hangat, penyayang, dan selalu menghadirkan ketenangan untuk orang-orang di sekitarnya.',
    secondaryBody: 'Ia menyukai momen kecil yang bermakna, musik lembut, dan kebersamaan bersama keluarga tercinta.',
    cardImage: '/TLV.JPG',
    profileSlides: ['/L.jpg', '/p8.jpeg', '/P14.jpg', '/P13.jpg'],
    activityPhotos: ['/P1.JPG', '/p10.jpeg', '/p11.jpeg', '/p7.jpeg', '/P12.jpg', '/P15.jpg'],
  },
  {
    key: 'valen',
    cardName: 'Valen',
    headingName: "Hi, I'm Valen!",
    fullName: 'Valen Harkin Aryo Dewanto',
    roleLine: 'Putra Dari',
    parentLine: 'Bapak Suharja & Ibu Mia Suli Yunaini',
    instagramLabel: '@harkinaryod',
    instagramUrl: 'https://www.instagram.com/harkinaryod',
    introTitle: 'Introduction of Valen',
    introBody: 'Hello there! not much to say about me, I\'m just a normal guy who likes to have fun, sleep, eat and gaming.',
    secondaryBody: 'This new chapter of my life is going to be amazing, I\'m looking forward to it, and also still waiting for Manchester United to win the Champions League.',
    cardImage: '/LNV.JPG',
    profileSlides: ['/V.jpg', '/P6.jpeg', '/p9.jpeg', '/vln.JPG'],
    activityPhotos: ['/p3.JPG', '/p4.JPG', '/p5.jpeg', '/p8.jpeg', '/p10.jpeg', '/p11.jpeg'],
  },
];

/* Arch border-radius constants — same family across all layers */
const tl = 143, tr = 143, bl = 47, br = 47;
const archOuter  = { borderTopLeftRadius: tl+3,  borderTopRightRadius: tr+3,  borderBottomLeftRadius: bl+3,  borderBottomRightRadius: br+3  };
const archRing   = { borderTopLeftRadius: tl,     borderTopRightRadius: tr,     borderBottomLeftRadius: bl,     borderBottomRightRadius: br     };
const archMat    = { borderTopLeftRadius: tl-3,   borderTopRightRadius: tr-3,   borderBottomLeftRadius: bl-3,   borderBottomRightRadius: br-3   };
const archPhoto  = { borderTopLeftRadius: tl-6,   borderTopRightRadius: tr-6,   borderBottomLeftRadius: bl-6,   borderBottomRightRadius: br-6   };

/* ── Profile Card — rotating gradient ring ── */
function ProfileCard({ couple, onClick }: { couple: CoupleProfile; onClick: () => void }) {
  return (
    <>
      <style>{`
        @keyframes ring-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <motion.button
        type="button"
        onClick={onClick}
        className="group relative focus-visible:outline-none"
        aria-label={`Open ${couple.cardName} profile`}
        whileHover={{ y: -10, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        style={{ width: 256, height: 320, willChange: 'transform' }}
      >
        {/* Ambient glow on hover — radial gradient, no blur-xl */}
        <div
          className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ inset: -28, background: 'radial-gradient(ellipse at center, rgba(212,168,67,0.22) 0%, transparent 68%)', ...archOuter }}
        />

        {/* Spinning conic gradient ring */}
        <div className="absolute overflow-hidden" style={{ inset: -3, ...archRing }}>
          <div style={{
            position: 'absolute', inset: '-120%',
            background: 'conic-gradient(from 0deg, #c4a882, #f0d070, #d4a843, #d08878, #e8c060, #c09050, #f0d878, #c4a882)',
            animation: 'ring-spin 5s linear infinite',
            willChange: 'transform',
          }} />
        </div>

        {/* Cream mat (gap between ring and photo) */}
        <div className="absolute" style={{ inset: 3, background: 'linear-gradient(160deg, #fdfaf5 0%, #f8f0e3 100%)', ...archMat }} />

        {/* Photo */}
        <img
          src={couple.cardImage}
          alt={couple.cardName}
          className="absolute object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          style={{ inset: 5, width: 'calc(100% - 10px)', height: 'calc(100% - 10px)', ...archPhoto }}
          loading="lazy"
        />

        {/* Vignette */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: 5,
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, transparent 32%, rgba(30,20,10,0.42) 100%)',
            ...archPhoto,
          }}
        />

        {/* Tap hint */}
        <motion.div
          className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/35 bg-black/35 px-3 py-1.5 backdrop-blur-md transition-colors group-hover:bg-black/48"
          animate={{ opacity: [0.72, 1, 0.72], y: [0, -3, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.span
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={11} className="text-amber-200" />
          </motion.span>
          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white whitespace-nowrap">
            Tap to view profile
          </span>
        </motion.div>
      </motion.button>
    </>
  );
}

/* ── Modal content — warm parchment, matching Journey / WeddingEvents ── */
function CoupleModalContent({ couple, onClose }: { couple: CoupleProfile; onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setCurrentSlide(p => (p + 1) % couple.profileSlides.length), 3000);
    return () => window.clearInterval(t);
  }, [couple.profileSlides.length]);

  const visibleSlide = useMemo(
    () => couple.profileSlides[currentSlide] ?? couple.profileSlides[0],
    [couple.profileSlides, currentSlide],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-[rgba(184,160,120,0.3)] shadow-[0_32px_80px_rgba(40,25,15,0.28)]"
      style={{ background: 'linear-gradient(160deg, #faf6f0 0%, #f5ede0 45%, #ede3d4 100%)' }}
    >
      <motion.button
        type="button"
        onClick={onClose}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        className="absolute right-3 top-3 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(184,160,120,0.35)] bg-white/90 text-[#4A3E35] shadow-[0_6px_16px_rgba(40,25,15,0.18)] transition-all hover:bg-white"
        aria-label="Close profile"
      >
        <X size={18} />
      </motion.button>

      {/* Botanical corner accents */}
      {[
        { style: { left: 0, top: 0, width: 100, opacity: 0.15, transform: 'scaleX(-1)' }, src: '/bung6.png' },
        { style: { right: 0, top: 0, width: 76, opacity: 0.12 }, src: '/bung1.png' },
        { style: { bottom: 0, right: 0, width: 110, opacity: 0.13, transform: 'scaleY(-1)' }, src: '/bung3.png' },
        { style: { bottom: 0, left: 0, width: 100, opacity: 0.12 }, src: '/bung4.png' },
      ].map((c, i) => (
        <div key={i} className="pointer-events-none absolute" style={{ ...c.style, zIndex: 0 }} aria-hidden>
          <img src={c.src} alt="" className="w-full object-contain" style={{ mixBlendMode: 'multiply' }} />
        </div>
      ))}

      {/* Watercolor blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '50%', background: 'radial-gradient(ellipse, rgba(192,100,80,0.07) 0%, transparent 70%)', filter: 'blur(8px)' }} />
        <div style={{ position: 'absolute', bottom: '-5%', right: '-5%', width: '55%', height: '45%', background: 'radial-gradient(ellipse, rgba(160,60,70,0.06) 0%, transparent 70%)', filter: 'blur(10px)' }} />
      </div>

      <div className="relative max-h-[82vh] overflow-y-auto p-5 sm:p-6" style={{ zIndex: 10 }}>
        {/* Header */}
        <div className="mb-4 flex items-center justify-center gap-3">
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(184,160,120,0.7))' }} />
          <DialogTitle style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(1.8rem,5vw,2.6rem)', color: '#4A3E35', fontWeight: 400, margin: 0 }}>
            {couple.headingName}
          </DialogTitle>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(184,160,120,0.7))' }} />
        </div>

        {/* Slideshow */}
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(184,160,120,0.2)] shadow-[0_10px_28px_rgba(60,35,20,0.14)]" style={{ ...archMat, height: 270 }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={visibleSlide}
              src={visibleSlide}
              alt={couple.cardName}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-white/18" />
        </div>

        {/* Slide dots */}
        <div className="mt-2 flex justify-center gap-1.5">
          {couple.profileSlides.map((_, i) => (
            <div key={i} style={{ width: i === currentSlide ? 20 : 6, height: 4, borderRadius: 999, background: i === currentSlide ? '#b8935a' : 'rgba(184,147,90,0.3)', transition: 'all 0.3s' }} />
          ))}
        </div>

        {/* Bio */}
        <div className="mt-5">
          <div className="mb-1 font-serif leading-none" style={{ fontSize: '2rem', color: '#c4a882', opacity: 0.42 }} aria-hidden>"</div>
          <h4 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(1.5rem,4vw,2rem)', color: '#4A3E35', marginBottom: 8 }}>{couple.introTitle}</h4>
          <p className="leading-[1.8]" style={{ fontSize: 'clamp(0.86rem,2vw,0.98rem)', color: '#5a4e45' }}>
            {couple.introBody}<br /><br />{couple.secondaryBody}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(196,168,130,0.5), transparent)' }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c4a882', opacity: 0.5 }} />
          </div>
        </div>

        {/* Info + IG */}
        <div className="mt-4 text-center">
          <p className="mb-3 leading-relaxed text-[#6B5F57]" style={{ fontSize: '0.8rem' }}>
            {couple.fullName}<br />{couple.roleLine}<br />{couple.parentLine}
          </p>
          <a href={couple.instagramUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <ExternalLink size={14} />
            {couple.instagramLabel}
          </a>
        </div>

        {/* Activities */}
        <div className="mt-5">
          <div className="mb-3 flex items-center gap-3">
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(184,160,120,0.5))' }} />
            <span className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#8a7060]">Activities</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(184,160,120,0.5))' }} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {couple.activityPhotos.slice(0, 6).map((photo, i) => (
              <motion.div key={i} whileHover={{ y: -3, scale: 1.04 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative overflow-hidden rounded-xl border border-[rgba(184,160,120,0.2)] shadow-sm" style={{ height: 84 }}>
                <img src={photo} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/22 via-transparent to-transparent" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Section ── */
export default function MeetTheCouple() {
  const [activeCouple, setActiveCouple] = useState<CoupleProfile | null>(null);

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        viewport={{ once: true, margin: '-60px' }}
        className="relative px-4 py-4"
      >
        <Card className="relative overflow-hidden rounded-[24px] border border-[rgba(184,160,120,0.3)] p-8 shadow-[0_25px_50px_rgba(184,171,159,0.15)] backdrop-blur-sm"
          style={{ background: 'linear-gradient(150deg, #faf7f2 0%, #f5ede0 50%, #ede3d4 100%)' }}>

          {/* Watercolor wash */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
            <div style={{ position:'absolute', top:'-8%', left:'-12%', width:'60%', height:'50%', background:'radial-gradient(ellipse at 40% 40%, rgba(192,100,90,0.09) 0%, transparent 70%)', transform:'rotate(-15deg)', filter:'blur(8px)' }} />
            <div style={{ position:'absolute', top:'-5%', right:'-10%', width:'55%', height:'45%', background:'radial-gradient(ellipse at 60% 35%, rgba(180,80,80,0.08) 0%, transparent 70%)', transform:'rotate(12deg)', filter:'blur(10px)' }} />
            <div style={{ position:'absolute', bottom:'-5%', left:'-8%', width:'50%', height:'45%', background:'radial-gradient(ellipse at 35% 65%, rgba(160,60,70,0.08) 0%, transparent 70%)', filter:'blur(9px)' }} />
            <div style={{ position:'absolute', bottom:'-8%', right:'-6%', width:'48%', height:'42%', background:'radial-gradient(ellipse at 65% 60%, rgba(185,120,80,0.07) 0%, transparent 70%)', filter:'blur(8px)' }} />
          </div>

          {/* Botanical side accents */}
          <motion.div className="pointer-events-none absolute left-0" style={{ zIndex:1, top:'15%', width:'clamp(130px,22vw,240px)', transform:'scaleX(-1)', opacity:0.24 }} animate={{ y:[0,-10,0] }} transition={{ duration:7, repeat:Infinity, ease:'easeInOut', delay:0.5 }} aria-hidden>
            <img src="/bung6.png" alt="" className="w-full object-contain" style={{ mixBlendMode:'multiply' }} />
          </motion.div>
          <motion.div className="pointer-events-none absolute right-0" style={{ zIndex:1, top:'10%', width:'clamp(130px,22vw,240px)', opacity:0.24 }} animate={{ y:[0,-9,0] }} transition={{ duration:9, repeat:Infinity, ease:'easeInOut', delay:2 }} aria-hidden>
            <img src="/bung3.png" alt="" className="w-full object-contain" style={{ mixBlendMode:'multiply' }} />
          </motion.div>
          {/* Bottom strip — fixed: was bungix.png → bung2.png */}
          <div className="pointer-events-none absolute bottom-0 left-0 w-full overflow-hidden" style={{ zIndex:1, height:'clamp(70px,11vh,110px)', opacity:0.09 }} aria-hidden>
            <img src="/bungix.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', mixBlendMode:'multiply', display:'block' }} />
          </div>

          <div className="relative" style={{ zIndex: 10 }}>
            {/* Title with decorative lines */}
            <motion.div className="mb-8">
              <motion.div className="mb-2 flex items-center justify-center gap-3">
                <motion.div style={{ flex:1, height:1, background:'linear-gradient(to right, transparent, rgba(184,160,120,0.6))' }} />
                <h2 style={{ fontFamily:"'Great Vibes', cursive", fontSize:'clamp(2.2rem,5vw,3.4rem)', color:'#4A3E35', lineHeight:1.2, margin:0 }}>
                  <TypingText text="Meet the couple" speed={38} />
                </h2>
                <motion.div style={{ flex:1, height:1, background:'linear-gradient(to left, transparent, rgba(184,160,120,0.6))' }} />
              </motion.div>
              <motion.p
                className="text-center text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8a7060]"
                animate={{ opacity: [0.45, 0.9, 0.45] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              >
              </motion.p>
            </motion.div>

            <div className="mx-auto max-w-4xl space-y-14">
              {couples.map((couple, index) => (
                <motion.div
                  key={couple.key}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  viewport={{ once: true, margin: '-40px' }}
                  className="flex flex-col items-center"
                  style={{ willChange: 'opacity, transform' }}
                >
                  <ProfileCard couple={couple} onClick={() => setActiveCouple(couple)} />

                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.12 + 0.1 }}
                    viewport={{ once: true }}
                    className="mt-6 text-center"
                  >
                    <h3 className="mb-1 font-serif font-bold text-[#4A3E35]" style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)' }}>
                      {couple.cardName}
                    </h3>
                    <p className="mb-4 leading-relaxed text-[#6B5F57]" style={{ fontSize: '0.88rem' }}>
                      {couple.fullName}<br />{couple.roleLine}<br />{couple.parentLine}
                    </p>
                    <a href={couple.instagramUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <ExternalLink size={15} />
                      {couple.instagramLabel}
                    </a>
                  </motion.div>

                  {/* & separator */}
                  {index === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.7, delay: 0.15, type: 'spring', stiffness: 200 }}
                      viewport={{ once: true }}
                      className="mt-10 flex items-center gap-4"
                    >
                      <div className="flex items-center gap-1.5">
                        <div style={{ width:48, height:1, background:'linear-gradient(to right, transparent, #d4a843)' }} />
                        <div style={{ width:4, height:4, borderRadius:'50%', background:'#d4a843', opacity:0.65 }} />
                        <div style={{ width:20, height:1, background:'#d4a843', opacity:0.5 }} />
                      </div>
                      <motion.span
                        className="font-serif text-amber-400 select-none"
                        style={{ fontSize: '4rem', lineHeight: 1 }}
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        &amp;
                      </motion.span>
                      <div className="flex items-center gap-1.5">
                        <div style={{ width:20, height:1, background:'#d4a843', opacity:0.5 }} />
                        <div style={{ width:4, height:4, borderRadius:'50%', background:'#d4a843', opacity:0.65 }} />
                        <div style={{ width:48, height:1, background:'linear-gradient(to left, transparent, #d4a843)' }} />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.section>

      <Dialog open={Boolean(activeCouple)} onOpenChange={(open) => !open && setActiveCouple(null)}>
        <DialogContent showCloseButton={false} className="max-h-[92vh] max-w-[540px] overflow-hidden border-none bg-transparent p-0 shadow-none">
          {activeCouple ? <CoupleModalContent couple={activeCouple} onClose={() => setActiveCouple(null)} /> : null}
        </DialogContent>
      </Dialog>
    </>
  );
}


