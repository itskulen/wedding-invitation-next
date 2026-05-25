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
    if (audioRef.current) {
      console.log('[Audio] Already initialized');
      return;
    }
    
    console.log('[Audio] Initializing new audio element...');
    const audio = new Audio('/bof.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    console.log('[Audio] Audio element created, src:', audio.src);
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
    console.log('[Audio] playAudio called');
    initializeAudio();
    if (!audioRef.current) {
      console.error('[Audio] audioRef.current is null!');
      return;
    }

    console.log('[Audio] Attempting to play...', {
      src: audioRef.current.src,
      paused: audioRef.current.paused,
      muted: audioRef.current.muted,
    });

    // Strategy: Try normal playback, fallback to muted→unmuted for mobile
    audioRef.current.muted = false;
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('[Audio] ✅ Playback started successfully');
          setIsPlaying(true);
        })
        .catch((error) => {
          console.log('[Audio] ⚠️ Normal playback blocked (mobile restriction), trying muted workaround...', error.name);
          
          // MOBILE FALLBACK: Play muted first, then unmute
          if (!audioRef.current) return;
          
          audioRef.current.muted = true;
          audioRef.current.play()
            .then(() => {
              console.log('[Audio] ✅ Playing muted on mobile, unmuting in 150ms...');
              // Unmute after slight delay (helps iOS Safari)
              setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current.muted = false;
                  setIsPlaying(true);
                  console.log('[Audio] ✅ Audio unmuted - now playing on mobile');
                }
              }, 150);
            })
            .catch((fallbackError) => {
              console.error('[Audio] ❌ Both playback strategies failed:', fallbackError);
              console.error('[Audio] User must manually enable audio');
              setIsPlaying(false);
            });
        });
    }
  };

  const pauseAudio = () => {
    console.log('[Audio] pauseAudio called');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.muted = true;
      setIsPlaying(false);
      console.log('[Audio] ✅ Audio paused');
    }
  };

  const toggleAudio = () => {
    console.log('[Audio] toggleAudio called, isPlaying:', isPlaying);
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