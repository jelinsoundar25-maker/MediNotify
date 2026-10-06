'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TAKEN_MOTIVATIONAL_RHYMES,
  NOT_TAKEN_GENTLE_RHYMES,
  RhymeItem
} from '@/lib/rhymes';
import { AnimatedMascot } from '@/components/mascot/AnimatedMascot';
import { useAudioRhymePlayer } from '@/lib/useAudioRhymePlayer';
import { AudioControlsBar } from '@/components/rhymes/AudioControlsBar';
import {
  Sparkles,
  Music,
  Star,
  Heart,
  ArrowLeft,
  Volume2,
  Play,
  RotateCcw
} from 'lucide-react';

export default function MotivationRhymesPage() {
  const audioPlayer = useAudioRhymePlayer();
  const [activeRhymeId, setActiveRhymeId] = useState<string | null>(null);

  const handleSelectAndPlayRhyme = (rhyme: RhymeItem, isCelebration = true) => {
    setActiveRhymeId(rhyme.id);
    const fullText = rhyme.lines.join(' ');
    audioPlayer.playRhyme(fullText, isCelebration ? 'success' : 'gentle_sad');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/60 via-amber-50/40 to-slate-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6 sm:gap-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-slate-900 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Caregiver Dashboard</span>
          </Link>

          <span className="text-xs font-black text-purple-800 bg-purple-100 px-3.5 py-1.5 rounded-2xl border border-purple-200 flex items-center gap-1.5">
            <Music className="w-4 h-4 text-purple-600" />
            <span>Rotating Motivation Library</span>
          </span>
        </div>

        {/* Hero Section with Interactive Dancing Mascot */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 rounded-[2.5rem] p-6 sm:p-9 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="text-center md:text-left z-10 flex-1">
            <span className="px-3.5 py-1 bg-white/20 text-purple-100 rounded-full text-xs font-black uppercase tracking-wider">
              MediNotify Rhyme Jukebox
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-2 tracking-tight">
              Rotating Motivational Rhymes
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-purple-100 max-w-lg leading-relaxed font-medium">
              Every scheduled medicine triggers a new, cheerful rhyme so children never hear the same repetitive alarm. Tap any rhyme below to listen and watch Pip dance along to the beat!
            </p>
          </div>

          <div className="flex flex-col items-center z-10">
            <AnimatedMascot
              emotion={audioPlayer.isDancing ? 'dancing' : 'happy'}
              size="md"
              showSpeechBubble={audioPlayer.isDancing ? "Pip is dancing to the rhyme! 🎵" : "Sing along with Pip! ✨"}
            />
          </div>
        </div>

        {/* Floating Global Audio Controller when a song is playing */}
        {audioPlayer.currentText && (
          <div className="sticky top-20 z-30 animate-in fade-in slide-in-from-top-3">
            <AudioControlsBar
              player={audioPlayer}
              label="Currently Playing Sing-Along Rhyme"
            />
          </div>
        )}

        {/* SECTION 1: TAKEN CELEBRATION RHYMES */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
                <span>Victory Rhymes (When Medicine is Taken)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Rotating rhymes played alongside Pip's celebration dance and confetti cannon.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TAKEN_MOTIVATIONAL_RHYMES.map((rhyme, index) => {
              const isThisPlaying = activeRhymeId === rhyme.id && audioPlayer.isPlaying && !audioPlayer.isPaused;

              return (
                <div
                  key={rhyme.id}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between shadow-sm hover:shadow-md ${
                    isThisPlaying
                      ? 'bg-amber-50/95 border-amber-400 ring-2 ring-amber-300'
                      : 'bg-white border-amber-200/80 hover:border-amber-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        Rhyme #{index + 1} • {rhyme.title}
                      </span>
                      {isThisPlaying && (
                        <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                          <span className="w-1.5 h-3 rounded-full bg-amber-500 animate-pulse" />
                          <span className="w-1.5 h-5 rounded-full bg-amber-500 animate-pulse delay-75" />
                          <span className="w-1.5 h-2 rounded-full bg-amber-500 animate-pulse delay-150" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-slate-800 text-sm font-black my-3">
                      {rhyme.lines.map((line, idx) => (
                        <p key={idx} className="leading-snug">
                          “{line}”
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      💡 {rhyme.highlight}
                    </span>
                    <button
                      onClick={() => handleSelectAndPlayRhyme(rhyme, true)}
                      className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm ${
                        isThisPlaying
                          ? 'bg-rose-500 hover:bg-rose-600 text-white'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{isThisPlaying ? 'Playing ♪' : 'Play & Dance'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: GENTLE NOT TAKEN RHYMES */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Heart className="w-6 h-6 text-sky-500 fill-sky-400" />
                <span>Gentle Encouragement Rhymes (If Not Taken Yet)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Compassionate, comforting, pressure-free reminders to help children feel safe, loved, and brave.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NOT_TAKEN_GENTLE_RHYMES.map((rhyme, index) => {
              const isThisPlaying = activeRhymeId === rhyme.id && audioPlayer.isPlaying && !audioPlayer.isPaused;

              return (
                <div
                  key={rhyme.id}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between shadow-sm hover:shadow-md ${
                    isThisPlaying
                      ? 'bg-sky-50/95 border-sky-400 ring-2 ring-sky-300'
                      : 'bg-white border-sky-200/80 hover:border-sky-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                        Gentle Reminder #{index + 1}
                      </span>
                      {isThisPlaying && (
                        <div className="flex items-center gap-1 text-xs text-sky-600 font-bold">
                          <span className="w-1.5 h-3 rounded-full bg-sky-500 animate-pulse" />
                          <span className="w-1.5 h-5 rounded-full bg-sky-500 animate-pulse delay-75" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-slate-800 text-sm font-black italic my-3">
                      {rhyme.lines.map((line, idx) => (
                        <p key={idx} className="leading-snug">
                          “{line}”
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      💡 {rhyme.highlight}
                    </span>
                    <button
                      onClick={() => handleSelectAndPlayRhyme(rhyme, false)}
                      className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm ${
                        isThisPlaying
                          ? 'bg-rose-500 hover:bg-rose-600 text-white'
                          : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{isThisPlaying ? 'Playing ♪' : 'Listen Warmly'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
