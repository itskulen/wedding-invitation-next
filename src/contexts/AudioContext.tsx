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

    audioRef.current.muted = false;
    void audioRef.current.play().then(() => {
      console.log('[Audio] ✅ Playback started successfully');
      setIsPlaying(true);
    }).catch((error) => {
      console.error('[Audio] ❌ Playback failed:', error);
      console.error('[Audio] Error name:', error.name);
      console.error('[Audio] Error message:', error.message);
      setIsPlaying(false);
    });
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