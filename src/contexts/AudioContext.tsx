'use client';

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  toggleAudio: () => void;
  playAudio: () => void;
  pauseAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const initializeAudio = () => {
    if (audioRef.current) return;
    
    console.log('[Audio] Initializing audio element...');
    const audio = new Audio('/bof.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';
    audioRef.current = audio;
    console.log('[Audio] ✅ Audio created');
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAudio = () => {
    console.log('[Audio] 🎵 playAudio called');
    initializeAudio();
    
    if (!audioRef.current) {
      console.error('[Audio] ❌ No audio element!');
      return;
    }

    // AGGRESSIVE MOBILE STRATEGY: Always try muted first, then force unmute
    console.log('[Audio] Starting mobile-safe playback (muted→unmuted)...');
    
    audioRef.current.muted = true;
    audioRef.current.play()
      .then(() => {
        console.log('[Audio] ✅ Audio playing (muted)');
        
        // Force unmute after short delay
        setTimeout(() => {
          if (audioRef.current) {
            console.log('[Audio] 🔊 Force unmuting NOW...');
            audioRef.current.muted = false;
            
            // Double-check unmute worked
            setTimeout(() => {
              if (audioRef.current) {
                console.log('[Audio] Muted status:', audioRef.current.muted);
                console.log('[Audio] Playing status:', !audioRef.current.paused);
                console.log('[Audio] Volume:', audioRef.current.volume);
                
                if (!audioRef.current.muted && !audioRef.current.paused) {
                  setIsPlaying(true);
                  console.log('[Audio] ✅✅✅ AUDIO SHOULD BE AUDIBLE NOW');
                } else {
                  console.error('[Audio] ❌ Audio still muted or paused!');
                }
              }
            }, 100);
          }
        }, 200);
      })
      .catch((error) => {
        console.error('[Audio] ❌ Muted playback failed:', error.name, error.message);
        setIsPlaying(false);
      });
  };

  const pauseAudio = () => {
    console.log('[Audio] pauseAudio called');
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    console.log('[Audio] toggleAudio, current isPlaying:', isPlaying);
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio, playAudio, pauseAudio }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}