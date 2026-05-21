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

  // Lazy-initialize audio on first user interaction (fixes mobile autoplay)
  const initializeAudio = () => {
    if (audioRef.current) return; // Already initialized
    const audio = new Audio('/bof.mp3');
    audio.loop = true;
    audio.volume = 0.3; // 30% volume (adjust as needed)
    audioRef.current = audio;
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
    initializeAudio();
    if (!audioRef.current) return;
  
    audioRef.current.muted = false;
    void audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch((error) => {
      console.error('Audio playback failed:', error); // ← ADD THIS LINE
      console.error('Audio src:', audioRef.current?.src); // ← ADD THIS LINE
      setIsPlaying(false);
    });
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.muted = true;
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio(); // This will initialize audio on first toggle
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