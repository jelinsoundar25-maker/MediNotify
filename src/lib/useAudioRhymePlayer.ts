'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { playChimeSound } from './rhymes';

export interface UseAudioRhymePlayerReturn {
  isPlaying: boolean;
  isPaused: boolean;
  isMuted: boolean;
  isDancing: boolean;
  currentText: string;
  playRhyme: (text: string, soundType?: 'success' | 'gentle_sad', onFinish?: () => void) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  replayAudio: () => void;
  toggleMute: () => void;
  stopAudio: () => void;
}

export function useAudioRhymePlayer(): UseAudioRhymePlayerReturn {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentText, setCurrentText] = useState<string>('');

  const textRef = useRef<string>('');
  const soundTypeRef = useRef<'success' | 'gentle_sad'>('success');
  const onFinishRef = useRef<(() => void) | undefined>(undefined);
  const isMutedRef = useRef<boolean>(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const playRhyme = useCallback(
    (text: string, soundType: 'success' | 'gentle_sad' = 'success', onFinish?: () => void) => {
      textRef.current = text;
      soundTypeRef.current = soundType;
      onFinishRef.current = onFinish;
      setCurrentText(text);

      if (typeof window === 'undefined') return;

      // 1. Play musical cue if not muted
      if (!isMutedRef.current) {
        playChimeSound(soundType);
      }

      // 2. Setup speech synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        if (isMutedRef.current) {
          // If muted, we simulate duration so child still sees celebration
          setIsPlaying(true);
          setIsPaused(false);
          const words = text.split(' ').length;
          const durationMs = Math.max(3000, words * 380);
          const timer = setTimeout(() => {
            setIsPlaying(false);
            setIsPaused(false);
            onFinish?.();
          }, durationMs);
          return () => clearTimeout(timer);
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = soundType === 'success' ? 1.3 : 1.15;
        utterance.rate = 0.94;

        const voices = window.speechSynthesis.getVoices();
        const friendlyVoice = voices.find(
          v =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Victoria'))
        );
        if (friendlyVoice) {
          utterance.voice = friendlyVoice;
        }

        utterance.onstart = () => {
          setIsPlaying(true);
          setIsPaused(false);
        };

        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
          onFinishRef.current?.();
        };

        utterance.onerror = () => {
          setIsPlaying(false);
          setIsPaused(false);
        };

        utterance.onpause = () => {
          setIsPaused(true);
        };

        utterance.onresume = () => {
          setIsPaused(false);
          setIsPlaying(true);
        };

        setIsPlaying(true);
        setIsPaused(false);
        window.speechSynthesis.speak(utterance);
      }
    },
    []
  );

  const pauseAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
      }
    }
    setIsPaused(true);
  }, []);

  const resumeAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        setIsPlaying(true);
        return;
      }
    }
    // Fallback restart if not paused
    if (textRef.current) {
      playRhyme(textRef.current, soundTypeRef.current, onFinishRef.current);
    }
  }, [playRhyme]);

  const replayAudio = useCallback(() => {
    if (textRef.current) {
      stopAudio();
      setTimeout(() => {
        playRhyme(textRef.current, soundTypeRef.current, onFinishRef.current);
      }, 150);
    }
  }, [stopAudio, playRhyme]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (next) {
        // Muting now: cancel speech
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } else {
        // Unmuting: replay if there was text
        if (textRef.current && isPlaying) {
          playRhyme(textRef.current, soundTypeRef.current, onFinishRef.current);
        }
      }
      return next;
    });
  }, [isPlaying, playRhyme]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const isDancing = isPlaying && !isPaused && !isMuted;

  return {
    isPlaying,
    isPaused,
    isMuted,
    isDancing,
    currentText,
    playRhyme,
    pauseAudio,
    resumeAudio,
    replayAudio,
    toggleMute,
    stopAudio
  };
}
