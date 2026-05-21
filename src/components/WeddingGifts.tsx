'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import TypingText from './TypingText';

const giftAddress =
  'Jalan Pertanian Gang Salak No 20, Tegalmulyo, Banguntapan, Bantul, Yogyakarta';

export default function WeddingGifts() {
  const [isCopied, setIsCopied] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(giftAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1600);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-4 px-4"
    >
      <Card className="border border-[rgba(210,168,154,0.28)] rounded-[24px] p-5 shadow-[0_18px_45px_rgba(66,10,10,0.35)] bg-[#420a0a] text-[#d4a574]">
        <h2 className="font-great-vibes text-[clamp(2.2rem,4.7vw,3.4rem)] leading-tight text-center mt-1 text-[#c89968]">
          <TypingText text="Wedding gifts" speed={40} />
        </h2>
        <p className="text-center mt-1 mb-5 text-[#d4a574] font-medium text-base">
          Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan
          tanda kasih dapat melalui:
        </p>

        <div className="rounded-[22px] border border-[rgba(212,165,116,0.3)] bg-[#5a1515] shadow-[0_10px_28px_rgba(66,10,10,0.25)] p-5">
          <div className="h-px w-[88%] mx-auto bg-[rgba(212,165,116,0.4)] mb-5" />

          <div className="flex flex-col items-center gap-2">
            <motion.button
              type="button"
              onClick={() => setIsGiftOpen((prev) => !prev)}
              className="relative h-[72px] w-[72px] rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b99f70]/70"
              aria-label="Toggle gift details"
              aria-expanded={isGiftOpen}
              animate={{
                y: [0, -5, 0],
                rotate: [0, -2, 2, 0],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.08, rotate: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#e7c06e] via-[#d7a95d] to-[#c79548] shadow-[0_8px_18px_rgba(102,75,35,0.24)]" />
              <div className="absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 bg-[rgba(255,243,214,0.9)]" />
              <div className="absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 bg-[rgba(255,243,214,0.9)]" />
              <motion.div
                className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[rgba(255,243,214,0.95)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              />
            </motion.button>
            <h3 className="font-cinzel text-[1.9rem] leading-none tracking-[0.05em] text-[#c89968] text-center">
              Wedding Gifts
            </h3>
            
          </div>

          <motion.div
            initial={false}
            animate={{
              height: isGiftOpen ? 'auto' : 0,
              opacity: isGiftOpen ? 1 : 0,
              marginTop: isGiftOpen ? 20 : 0,
              marginBottom: isGiftOpen ? 16 : 0,
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="bg-gradient-to-r from-[#8b5a2b] to-[#a0692f] text-[#f5e6d3] font-semibold rounded-[18px] px-4 py-3 text-center leading-relaxed">
              {giftAddress}
            </p>
          </motion.div>

          <button
            type="button"
            onClick={handleCopyAddress}
            disabled={!isGiftOpen}
            className="w-full rounded-full px-4 py-3 bg-gradient-to-r from-[#c89968] to-[#d4a574] text-[#1a0505] font-semibold text-sm uppercase tracking-[0.04em] hover:-translate-y-0.5 transition-transform disabled:opacity-80"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {!isGiftOpen ? 'Open Gift Icon!' : isCopied ? 'Address Copied' : 'Copy Address'}
            </span>
          </button>
        </div>
      </Card>
    </motion.section>
  );
}
