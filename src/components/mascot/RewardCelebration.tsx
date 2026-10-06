'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { AnimatedMascot } from './AnimatedMascot';
import { CELEBRATORY_RHYMES, speakText, playChimeSound, stopSpeech } from '@/lib/rhymes';
import { Star, Sparkles, Trophy, Award, Music, CheckCircle } from 'lucide-react';

interface RewardCelebrationProps {
  medicationName: string;
  heroAlias?: string;
  onDismiss: () => void;
}

export const RewardCelebration: React.FC<RewardCelebrationProps> = ({
  medicationName,
  heroAlias,
  onDismiss
}) => {
  const [rhymeIndex, setRhymeIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const activeRhyme = CELEBRATORY_RHYMES[rhymeIndex] || CELEBRATORY_RHYMES[0];

  useEffect(() => {
    // 1. Confetti cannon blast
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#14b8a6', '#f59e0b', '#f43f5e', '#3b82f6', '#10b981']
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 350);
    } catch (e) {
      console.warn('Confetti error', e);
    }

    // 2. Play celebratory musical chime
    playChimeSound('success');

    // 3. Sing / recite celebratory rhyme
    const fullRhyme = activeRhyme.lines.join(' ');
    speakText(fullRhyme, {
      pitch: 1.3, // Bright, happy tone
      rate: 1.0,
      onEnd: () => setIsPlayingAudio(false)
    });
    setIsPlayingAudio(true);

    return () => {
      stopSpeech();
    };
  }, [activeRhyme]);

  const handleReplayRhyme = () => {
    setIsPlayingAudio(true);
    playChimeSound('success');
    speakText(activeRhyme.lines.join(' '), {
      pitch: 1.3,
      rate: 1.0,
      onEnd: () => setIsPlayingAudio(false)
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
        
        {/* Top Banner */}
        <div className="w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 p-4 text-white flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-2 font-black tracking-wide text-sm drop-shadow">
            <Trophy className="w-5 h-5 text-yellow-200 fill-yellow-300 animate-bounce" />
            <span>MEDICINE CHAMPION!</span>
          </div>
          <button
            onClick={handleReplayRhyme}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center gap-1 text-xs px-2.5 font-bold"
            title="Sing rhyme again"
          >
            <Music className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-spin' : ''}`} />
            <span>{isPlayingAudio ? 'Singing...' : 'Sing Rhyme'}</span>
          </button>
        </div>

        {/* Mascot Dancing with Confetti */}
        <div className="pt-6 pb-2">
          <AnimatedMascot emotion="celebrating" size="hero" />
        </div>

        {/* Victory Rhyme Box */}
        <div className="px-6 py-2 w-full">
          <div className="bg-gradient-to-b from-amber-50 to-orange-50/60 border-2 border-amber-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-center gap-1.5 text-amber-800 text-xs font-black uppercase mb-1">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{activeRhyme.title}</span>
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="space-y-1 text-slate-800 text-sm font-semibold">
              {activeRhyme.lines.map((line, idx) => (
                <p key={idx} className="leading-snug">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Hero badge unlocked & stars */}
        <div className="flex items-center gap-3 my-2 px-6 py-2 bg-teal-50 border border-teal-200 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-black shadow">
            <Award className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-teal-900">+50 Courage Stars Added!</p>
            <p className="text-xs text-teal-700">
              Completed {heroAlias || medicationName}
            </p>
          </div>
        </div>

        {/* Dismiss Button */}
        <div className="w-full bg-slate-50 p-5 border-t border-slate-100">
          <button
            onClick={() => {
              stopSpeech();
              onDismiss();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-base shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-teal-200" />
            <span>Awesome! Continue My Adventure</span>
          </button>
        </div>

      </div>
    </div>
  );
};
