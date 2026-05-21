'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Music2 } from 'lucide-react';
import Image from 'next/image';
import { useAudio } from '@/contexts/AudioContext';


export default function Hero() {
  const { toggleAudio, isPlaying } = useAudio();

  return (
    <header className="relative min-h-screen py-6 px-4 flex flex-col justify-between overflow-hidden">

      {/* ─────────────────────────────────────────────
          BOTANICAL DECORATIONS — Petal Drift + Layered Parallax
          Each element has unique y-range, duration & delay
          so no two ever peak at the same moment.
          Flips (scaleX/scaleY) moved into Framer Motion
          to avoid CSS transform conflicts with y animation.
      ───────────────────────────────────────────── */}

      {/* TOP — full-width dark rose arch (bung2) */}
      {/* Slow + slight x sway, like a heavy arch in a breeze */}
      <motion.div
        className="absolute top-0 left-0 w-full pointer-events-none overflow-hidden"
        style={{ zIndex: 1, height: 'clamp(180px, 35vh, 420px)' }}
        animate={{ y: [0, -5, 0], x: [0, 3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
      >
        <img
          src="/bung2.png"
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            mixBlendMode: 'multiply',
            display: 'block',
          }}
        />
      </motion.div>

      {/* BOTTOM-LEFT — dense plum blossom (bung4) */}
      {/* Slowest, heaviest feel, grounded */}
      <motion.div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{ zIndex: 1, width: 'clamp(180px, 30vw, 320px)' }}
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <img
          src="/bung4.png"
          alt=""
          className="w-full object-contain"
          style={{ mixBlendMode: 'multiply', display: 'block' }}
        />
      </motion.div>

      {/* BOTTOM-RIGHT — red cherry blossom, flipped vertically (bung3) */}
      {/* Medium speed, offset phase from bung4 */}
      <motion.div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{ zIndex: 1, width: 'clamp(180px, 30vw, 320px)' }}
        animate={{ scaleY: -1, y: [0, 7, 0] }}
        initial={{ scaleY: -1 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <img
          src="/bung3.png"
          alt=""
          className="w-full object-contain"
          style={{ mixBlendMode: 'multiply', display: 'block' }}
        />
      </motion.div>

      {/* LEFT SIDE — red cherry blossom, mirrored inward (bung6) */}
      {/* Taller range — tall vine sways more */}
      <motion.div
        className="absolute left-0 pointer-events-none"
        style={{ zIndex: 1, top: '26%', width: 'clamp(140px, 22vw, 260px)' }}
        animate={{ scaleX: -1, y: [0, -12, 0] }}
        initial={{ scaleX: -1 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        <img
          src="/bung6.png"
          alt=""
          className="w-full object-contain"
          style={{ mixBlendMode: 'multiply', display: 'block' }}
        />
      </motion.div>

      {/* RIGHT SIDE — dark botanical vine (bung1) */}
      {/* Opposite phase to bung6 — when left goes up, right goes down */}
      <motion.div
        className="absolute right-0 pointer-events-none"
        style={{ zIndex: 1, top: '39%', right: '-6%', width: 'clamp(140px, 30vw, 280px)' }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <img
          src="/bung1.png"
          alt=""
          className="w-full object-contain"
          style={{ mixBlendMode: 'multiply', display: 'block', opacity: 0.9 }}
        />
      </motion.div>

     {/* NAVIGATION */}
      <nav className="relative flex justify-between items-center" style={{ zIndex: 10 }}>
        <div className="font-serif border border-[rgba(73,62,53,0.2)] rounded-full px-3.5 py-1.5 tracking-[0.12em] bg-white/50">
          L&V
        </div>
        <button
          onClick={toggleAudio}
          className="border border-[rgba(73,62,53,0.2)] text-[#292522] bg-white/40 rounded-full px-4 py-2.5 cursor-pointer text-sm transition-all duration-300 hover:border-[#b8ab9f] flex items-center gap-2"
        >
          {isPlaying ? <Music2 size={16} /> : <Music size={16} />}
          ambience {isPlaying ? 'on' : 'off'}
        </button>
      </nav>

      {/* ─────────────────────────────────────────────
          MAIN CONTENT
      ───────────────────────────────────────────── */}
      <div className="relative my-auto max-w-[1050px] mx-auto w-full" style={{ zIndex: 10 }}>
        <div className="grid gap-4 items-center md:grid-cols-[minmax(340px,430px)_1fr] md:gap-10">

          {/* ── Invitation Frame ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-[400px] mx-auto rounded-[28px] bg-gradient-to-br from-[#fffefe] to-[#f0ece7] p-3.5 border border-[rgba(120,102,88,0.2)]"
            style={{ boxShadow: '0 20px 45px rgba(66,57,49,0.12)' }}
          >
            <div
              className="rounded-[20px] overflow-hidden relative border border-[rgba(100,84,70,0.2)]"
              style={{ minHeight: 'clamp(410px, 72vh, 530px)' }}
            >
              {/* Wedding Photo */}
              <motion.img
                src="/P6.jpeg"
                alt="Latifah & Valen"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: [1.1, 1.05, 1.1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{
                  scale: 1.15,
                  filter: 'brightness(1.1) contrast(1.05)',
                }}
              />

              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, transparent, rgba(255,255,255,0.05), rgba(255,255,255,0.10))',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Text Overlay */}
              <div
                className="relative flex flex-col justify-end text-center p-5"
                style={{
                  minHeight: 'clamp(410px, 72vh, 530px)',
                  zIndex: 2,
                  background:
                    'linear-gradient(to top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.90) 100%)',
                }}
              >
                <p className="text-[0.7rem] uppercase tracking-[0.14em] text-[#59514b] m-0">
                  The Wedding Of
                </p>
                <h2
                  className="text-[2rem] mb-0.5"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  Latifah &amp; Valen
                </h2>
                <p className="text-[0.7rem] uppercase tracking-[0.14em] text-[#59514b] m-0">
                  Saturday, 4th July 2026
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Hero Copy ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center md:text-left"
          >
           
          </motion.div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          SCROLL HINT
      ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative text-center"
        style={{ zIndex: 10 }}
      >
        <p className="text-[0.65rem] uppercase tracking-[0.16em] text-[#6f655d] mb-2">
          Scroll to explore
        </p>
      </motion.div>
    </header>
  );
}
