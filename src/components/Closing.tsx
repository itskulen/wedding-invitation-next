  'use client';

  import { useEffect, useState } from 'react';
  import Image from 'next/image';
  import { motion } from 'framer-motion';

  const closingMessage =
    'Suatu kebahagiaan & kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan doa restu kepada kami';

  export default function Closing() {
    const [spotlight, setSpotlight] = useState({ x: 50, y: 40 });
    const [typedText, setTypedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
      let charIndex = 0;
      const typing = window.setInterval(() => {
        charIndex += 1;
        setTypedText(closingMessage.slice(0, charIndex));
        if (charIndex >= closingMessage.length) {
          window.clearInterval(typing);
        }
      }, 34);

      return () => window.clearInterval(typing);
    }, []);

    useEffect(() => {
      const blink = window.setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 520);
      return () => window.clearInterval(blink);
    }, []);

    const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setSpotlight({ x, y });
    };

    return (
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="px-4 py-6"
      >
        <motion.div
          onMouseMove={handlePointerMove}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.35 }}
          className="relative mx-auto w-full max-w-[620px] overflow-hidden rounded-[30px] shadow-[0_22px_55px_rgba(42,31,24,0.32)]"
        >
          <div className="relative h-[600px] sm:h-[680px] w-full">
            <Image
              src="/bgnd1.jpeg"
              alt="Closing wedding portrait"
              fill
              priority={false}
              className="object-cover"
            />
          </div>

          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{
              background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.08) 28%, rgba(0,0,0,0.35) 72%)`,
            }}
            transition={{ duration: 0.2, ease: 'linear' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true }}
            className="absolute inset-x-0 top-[28%] px-6 text-center text-white"
          >
            <motion.p
              className="mx-auto max-w-[420px] text-[clamp(1rem,2.5vw,1.55rem)] leading-relaxed font-semibold drop-shadow-[0_2px_12px_rgba(0,0,0,0.42)]"
              animate={{
                textShadow: [
                  '0 2px 12px rgba(0,0,0,0.42)',
                  '0 2px 15px rgba(255,255,255,0.34)',
                  '0 2px 12px rgba(0,0,0,0.42)',
                ],
              }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {typedText}
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
            </motion.p>
            <motion.p
              className="mt-4 text-[clamp(1.05rem,2.7vw,1.5rem)] font-semibold tracking-[0.03em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              viewport={{ once: true }}
            >
              Kami Yang Berbahagia
            </motion.p>
            <motion.p
              className="mt-1 font-great-vibes text-[clamp(2.25rem,5.2vw,3.6rem)] leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 1.9 }}
              viewport={{ once: true }}
              animate={{
                y: [0, -2, 0],
              }}
            >
              Latifah &amp; Valen
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.section>
    );
  }
