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
    // Attempt to autoplay muted on page load
    // User can click toggle to unmute and hear the music
    const timer = setTimeout(() => {
      initializeAudio();
      if (audioRef.current) {
        audioRef.current.muted = true; // Start muted (browsers allow this)
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          console.log('Muted autoplay blocked by browser');
        });
      }
    }, 500); // Small delay to ensure page is ready

    return () => {
      clearTimeout(timer);
      audioRef.current?.pause();
    };
  }, []);

  const playAudio = () => {
    initializeAudio(); // Create audio if not already created
    if (audioRef.current) {
      audioRef.current.muted = false; // Unmute when user clicks play
      audioRef.current.play().catch(() => {
        console.log('Audio play failed');
      });
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.muted = true; // Mute when paused
      audioRef.current.pause();
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