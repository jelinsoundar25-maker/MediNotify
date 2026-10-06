'use client';

import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Music } from 'lucide-react';
import { UseAudioRhymePlayerReturn } from '@/lib/useAudioRhymePlayer';

interface AudioControlsBarProps {
  player: UseAudioRhymePlayerReturn;
  className?: string;
  label?: string;
}

export const AudioControlsBar: React.FC<AudioControlsBarProps> = ({
  player,
  className = '',
  label = 'Sing-Along Audio Controls'
}) => {
  const { isPlaying, isPaused, isMuted, pauseAudio, resumeAudio, replayAudio, toggleMute } = player;

  const handlePlayPause = () => {
    if (isPlaying && !isPaused) {
      pauseAudio();
    } else {
      resumeAudio();
    }
  };

  return (
    <div className={`p-3 rounded-2xl bg-white/90 backdrop-blur-md border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
      
      {/* Label and Live Dancing Audio Wave */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-sm">
          <Music className={`w-4 h-4 ${isPlaying && !isPaused ? 'animate-bounce' : ''}`} />
        </div>
        <div>
          <span className="text-[11px] font-black uppercase text-amber-900 tracking-wider block">
            {label}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold">
            {isPlaying && !isPaused
              ? '🎵 Mascot is dancing to the rhyme!'
              : isPaused
              ? '⏸ Audio paused — Mascot is resting'
              : 'Tap play to dance and sing!'}
          </span>
        </div>
      </div>

      {/* 4 Required Controls: Play/Pause, Pause, Replay, Mute */}
      <div className="flex items-center gap-1.5 bg-amber-50 p-1.5 rounded-xl border border-amber-200">
        
        {/* ▶ Play / ⏸ Pause Toggle */}
        <button
          onClick={handlePlayPause}
          className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center gap-1 shadow-sm ${
            isPlaying && !isPaused
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
          title={isPlaying && !isPaused ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying && !isPaused ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-white" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Play</span>
            </>
          )}
        </button>

        {/* ⏸ Dedicated Pause Button */}
        {isPlaying && !isPaused && (
          <button
            onClick={pauseAudio}
            className="py-1.5 px-2.5 rounded-lg text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1"
            title="Pause playback"
          >
            <Pause className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Pause</span>
          </button>
        )}

        {/* 🔁 Replay Button */}
        <button
          onClick={replayAudio}
          className="py-1.5 px-2.5 rounded-lg text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1"
          title="Replay rhyme from start"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
          <span>Replay</span>
        </button>

        {/* 🔇 Mute / Unmute Button */}
        <button
          onClick={toggleMute}
          className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
            isMuted
              ? 'bg-rose-100 text-rose-800 border border-rose-300'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
          title={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-600" />
              <span>Unmute</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Mute</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
};
