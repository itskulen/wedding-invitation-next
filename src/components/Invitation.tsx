'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from './Hero';
import Details from './Details';
import Quote from './Quote';
import MeetTheCouple from './MeetTheCouple';
import WeddingEvents from './WeddingEvents';
import Journey from './Journey';
import BestMoments from './BestMoments';
import WeddingGifts from './WeddingGifts';
import RSVP from './RSVP';
import Closing from './Closing';
import Footer from './Footer';

export default function Invitation() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent / 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Animated Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-200 linear"
        style={{
          background: `
            radial-gradient(circle at 14% calc(8% + ${scrollProgress * 24}%), rgba(214, 202, 188, 0.22), transparent 45%),
            radial-gradient(circle at 86% calc(72% - ${scrollProgress * 28}%), rgba(178, 163, 148, 0.2), transparent 45%)
          `,
        }}
      />

      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <main>
        <Details />
        <Quote />
        <MeetTheCouple />
        <WeddingEvents />
        <Journey />
        <BestMoments />
        <WeddingGifts />
        <RSVP />
        <Closing />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
