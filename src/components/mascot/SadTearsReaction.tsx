'use client';

import React, { useEffect, useState } from 'react';
import { AnimatedMascot } from './AnimatedMascot';
import { SAD_EMPATHETIC_PLEAS, speakText, playChimeSound, stopSpeech } from '@/lib/rhymes';
import { Heart, Volume2, Sparkles, Clock, AlertCircle } from 'lucide-react';

interface SadTearsReactionProps {
  medicationName: string;
  heroAlias?: string;
  onTakeNow: () => void;
  onSnooze: () => void;
  tips?: string;
}

export const SadTearsReaction: React.FC<SadTearsReactionProps> = ({
  medicationName,
  heroAlias,
  onTakeNow,
  onSnooze,
  tips
}) => {
  const [currentPleaIndex, setCurrentPleaIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const activePlea = SAD_EMPATHETIC_PLEAS[currentPleaIndex] || SAD_EMPATHETIC_PLEAS[0];

  useEffect(() => {
    // Play gentle melancholy chime on open
    playChimeSound('sad');

    // Auto-read the gentle plea
    const fullText = activePlea.lines.join(' ');
    speakText(fullText, {
      pitch: 1.15,
      rate: 0.9,
      onEnd: () => setIsPlayingAudio(false)
    });
    setIsPlayingAudio(true);

    return () => {
      stopSpeech();
    };
  }, [activePlea]);

  const handleReplayVoice = () => {
    setIsPlayingAudio(true);
    playChimeSound('sad');
    speakText(activePlea.lines.join(' '), {
      pitch: 1.15,
      rate: 0.9,
      onEnd: () => setIsPlayingAudio(false)
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-blue-200 overflow-hidden flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
        
        {/* Soft Header */}
        <div className="w-full bg-gradient-to-r from-blue-100 via-sky-50 to-blue-100 p-4 border-b border-blue-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
            <Heart className="w-4 h-4 text-blue-500 fill-blue-500 animate-pulse" />
            <span>Pip Needs Your Superpower</span>
          </div>
          <button
            onClick={handleReplayVoice}
            className="p-1.5 rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300 transition-colors flex items-center gap-1 text-xs px-2.5"
            title="Listen to Pip's Voice"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce text-blue-700' : ''}`} />
            <span>{isPlayingAudio ? 'Speaking...' : 'Pip Speaks'}</span>
          </button>
        </div>

        {/* Mascot in Sad / Crying state */}
        <div className="pt-6 pb-2">
          <AnimatedMascot emotion="sad_crying" size="hero" />
        </div>

        {/* Empathetic Rhyme / Plea */}
        <div className="px-6 py-3 w-full">
          <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 shadow-inner">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">
              {activePlea.title}
            </p>
            <div className="space-y-1 text-slate-700 text-sm font-medium italic">
              {activePlea.lines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Target Medicine Reminder */}
        <div className="px-6 pb-2 text-center">
          <p className="text-xs text-slate-500">Scheduled Medicine:</p>
          <p className="text-base font-bold text-slate-800">
            {heroAlias ? `${heroAlias} (${medicationName})` : medicationName}
          </p>
        </div>

        {/* Parent Comfort Advice (Tips for Adamant Kids) */}
        {tips && (
          <div className="mx-6 mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-left flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900">Caregiver Tip for Bitter Medicines:</p>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{tips}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full bg-slate-50 p-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              stopSpeech();
              onTakeNow();
            }}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Take 1 Sip With Pip! (Cheer Pip Up)</span>
          </button>
          
          <button
            onClick={() => {
              stopSpeech();
              onSnooze();
            }}
            className="py-3 px-5 rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Try Again in 10 Mins</span>
          </button>
        </div>

      </div>
    </div>
  );
};
