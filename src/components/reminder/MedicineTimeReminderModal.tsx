'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '@/lib/store';
import { AnimatedMascot } from '@/components/mascot/AnimatedMascot';
import {
  TAKEN_MOTIVATIONAL_RHYMES,
  NOT_TAKEN_GENTLE_RHYMES,
  playChimeSound
} from '@/lib/rhymes';
import { useAudioRhymePlayer } from '@/lib/useAudioRhymePlayer';
import { AudioControlsBar } from '@/components/rhymes/AudioControlsBar';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Heart,
  ShieldCheck,
  Star,
  X,
  RefreshCw,
  Bell,
  ArrowRight,
  Smile,
  Check
} from 'lucide-react';

export const MedicineTimeReminderModal: React.FC = () => {
  const {
    activeReminder,
    setActiveReminder,
    activePatient,
    markDoseTaken,
    markDoseNotTaken,
    snoozeReminder,
    todayCompletedCount,
    todayTotalCount,
    todayProgressText
  } = useApp();

  // Modal Sub-stages: 'prompt' | 'taken_celebration' | 'not_taken_gentle'
  const [modalStage, setModalStage] = useState<'prompt' | 'taken_celebration' | 'not_taken_gentle'>('prompt');
  const [rhymeRotationIndex, setRhymeRotationIndex] = useState(0);

  // Audio Player Hook with Play, Pause, Replay, Mute controls
  const audioPlayer = useAudioRhymePlayer();

  // When active reminder opens, initialize
  useEffect(() => {
    if (activeReminder) {
      setModalStage('prompt');
      audioPlayer.stopAudio();
      playChimeSound('alert_reminder');
    } else {
      audioPlayer.stopAudio();
    }
  }, [activeReminder]);

  if (!activeReminder) return null;

  const { schedule, medication } = activeReminder;
  const currentTakenRhyme = TAKEN_MOTIVATIONAL_RHYMES[rhymeRotationIndex % TAKEN_MOTIVATIONAL_RHYMES.length];
  const currentNotTakenRhyme = NOT_TAKEN_GENTLE_RHYMES[0];

  // Handle TAKEN
  const handleTakenClick = () => {
    markDoseTaken(schedule.id);
    setModalStage('taken_celebration');

    // Confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#14b8a6', '#f59e0b', '#ec4899', '#3b82f6', '#10b981']
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.7 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.7 }
        });
      }, 250);
    } catch (e) {
      console.warn(e);
    }

    // Play motivational rhyme audio
    const fullSpeech = `${currentTakenRhyme.lines.join(' ')} Great job! Keep going, little champion!`;
    audioPlayer.playRhyme(fullSpeech, 'success');
  };

  // Handle NOT TAKEN
  const handleNotTakenClick = () => {
    markDoseNotTaken(schedule.id, 10);
    setModalStage('not_taken_gentle');

    // Play gentle encouragement audio
    const gentleSpeech = `Your medicine is waiting. You can do it! Take it when it’s time. ${currentNotTakenRhyme.lines.join(' ')}`;
    audioPlayer.playRhyme(gentleSpeech, 'gentle_sad');
  };

  // Handle rotate to next rhyme
  const handleRotateNextRhyme = () => {
    const nextIdx = (rhymeRotationIndex + 1) % TAKEN_MOTIVATIONAL_RHYMES.length;
    setRhymeRotationIndex(nextIdx);
    const nextRhyme = TAKEN_MOTIVATIONAL_RHYMES[nextIdx];
    const fullSpeech = `${nextRhyme.lines.join(' ')} Great job! Keep going, little champion!`;
    audioPlayer.playRhyme(fullSpeech, 'success');
  };

  // Handle Close
  const handleDismiss = () => {
    audioPlayer.stopAudio();
    setActiveReminder(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] max-w-lg w-full shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 p-3.5 sm:p-4 text-white flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-100 animate-bounce" />
            <span className="font-black text-sm tracking-wide uppercase drop-shadow-sm">
              MediNotify • Gentle Companion
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Close reminder window"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STAGE 1: INITIAL MEDICINE REMINDER PROMPT */}
        {modalStage === 'prompt' && (
          <div className="p-5 sm:p-7 flex flex-col items-center text-center">
            
            {/* Mascot in active waving/bouncing state with speech bubble: “Hey! It’s medicine time!” */}
            <div className="my-2 relative">
              <AnimatedMascot
                emotion="bouncing"
                size="md"
                showSpeechBubble="“Hey! It’s medicine time!”"
              />
            </div>

            {/* Child Greeting Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Reminder for {activePatient.name}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              “Hey! It’s medicine time!”
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-sm font-medium">
              Pip is here to cheer you on! Take a gentle sip and strengthen your superpower shield!
            </p>

            {/* Medicine Details Card */}
            <div className="w-full my-4 p-4 rounded-3xl bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-200 text-left flex items-start gap-3.5 shadow-inner">
              <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-black flex-shrink-0 shadow-md">
                <Star className="w-6 h-6 fill-amber-300 text-amber-200" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-black text-teal-800 bg-teal-200/70 px-2.5 py-0.5 rounded-lg">
                    ⏰ {schedule.scheduled_time}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Dosage: {medication.dosage}
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-base mt-1 truncate">
                  {medication.alias_hero_name || medication.name}
                </h4>
                <p className="text-xs text-slate-600 font-medium truncate">
                  Medicine: {medication.name}
                </p>
                {medication.tip_for_adamant_kids && (
                  <p className="text-[11px] text-amber-800 bg-amber-100/60 p-1.5 rounded-lg mt-1.5 font-semibold">
                    💡 Comfort Trick: {medication.tip_for_adamant_kids}
                  </p>
                )}
              </div>
            </div>

            {/* THREE REQUIRED BUTTONS: Taken, Not Taken, Snooze */}
            <div className="w-full space-y-2.5 mt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Taken Button */}
                <button
                  onClick={handleTakenClick}
                  className="py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-200 fill-emerald-700/20" />
                  <span>Taken ✓</span>
                </button>

                {/* 2. Not Taken Button */}
                <button
                  onClick={handleNotTakenClick}
                  className="py-4 px-5 rounded-2xl bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border-2 border-slate-200 hover:border-amber-300 font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Clock className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
                  <span>Not Taken</span>
                </button>
              </div>

              {/* 3. Snooze / Remind Me Later Button */}
              <button
                onClick={() => snoozeReminder(schedule.id, 10)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Snooze / Remind Me in 10 Mins</span>
              </button>
            </div>

          </div>
        )}

        {/* STAGE 2: WHEN MEDICINE IS TAKEN (Cartoon Celebrates & Dances, Audio Plays) */}
        {modalStage === 'taken_celebration' && (
          <div className="p-5 sm:p-7 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            
            {/* Cartoon Mascot Dances while Audio is playing, Stops when audio stops! */}
            <div className="my-1">
              <AnimatedMascot
                emotion={audioPlayer.isDancing ? 'dancing' : 'celebrating'}
                size="md"
                showSpeechBubble={audioPlayer.isDancing ? "Pip is dancing to the rhyme! 🎵" : "Yay! Little champion!"}
              />
            </div>

            {/* Exactly as requested in prompt:
                "Great job! Keep going, little champion!"
            */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Heroic Milestone</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              “Great job! Keep going, little champion!”
            </h3>

            {/* Audio Controls Bar: Play, Pause, Replay, Mute */}
            <div className="w-full my-3">
              <AudioControlsBar
                player={audioPlayer}
                label={`Playing Rhyme #${(rhymeRotationIndex % TAKEN_MOTIVATIONAL_RHYMES.length) + 1}`}
              />
            </div>

            {/* Motivational Rhyme Box (Original Cheer) */}
            <div className="w-full bg-gradient-to-b from-amber-50 to-orange-50/80 border-2 border-amber-300 rounded-3xl p-4 shadow-sm text-left mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {currentTakenRhyme.title}
                </span>
                <button
                  onClick={handleRotateNextRhyme}
                  className="p-1 px-2.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 text-[11px] font-bold flex items-center gap-1 transition-colors"
                  title="Play another motivational rhyme"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Next Rhyme</span>
                </button>
              </div>

              <div className="space-y-1 text-slate-800 text-sm font-black italic">
                {currentTakenRhyme.lines.map((line, idx) => (
                  <p key={idx} className="leading-snug">
                    “{line}”
                  </p>
                ))}
              </div>
            </div>

            {/* Status: ✓ Medicine Taken */}
            <div className="w-full py-2.5 px-4 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-900 font-black text-xs sm:text-sm flex items-center justify-center gap-2 mb-3">
              <Check className="w-5 h-5 text-emerald-700 stroke-[3]" />
              <span>✓ Medicine Taken</span>
              <span className="text-xs font-semibold text-emerald-700">
                (Already Taken ✓ Locked)
              </span>
            </div>

            {/* Daily Progress Update */}
            <div className="w-full bg-teal-50 border-2 border-teal-200 rounded-2xl p-3.5 mb-3 text-left">
              <div className="flex items-center justify-between text-xs font-black text-teal-900 mb-1.5">
                <span>{todayProgressText}</span>
                <span className="text-teal-700 font-bold">
                  {Math.round((todayCompletedCount / Math.max(todayTotalCount, 1)) * 100)}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-teal-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 transition-all duration-700 rounded-full"
                  style={{
                    width: `${Math.min(100, (todayCompletedCount / Math.max(todayTotalCount, 1)) * 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="w-full py-3.5 px-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Awesome! Keep Playing</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

        {/* STAGE 3: WHEN MEDICINE IS NOT TAKEN (Gently Concerned, Caring, NOT Scary) */}
        {modalStage === 'not_taken_gentle' && (
          <div className="p-5 sm:p-7 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            
            {/* Cartoon Mascot: Gently concerned, warm, loving, NOT sad or scary! */}
            <div className="my-1">
              <AnimatedMascot
                emotion="concerned"
                size="md"
                showSpeechBubble="“Pip is here with big hugs for you!”"
              />
            </div>

            {/* Caring Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-black uppercase tracking-wider mb-1">
              <Heart className="w-4 h-4 text-sky-600 fill-sky-500" />
              <span>Gentle Caring Moment</span>
            </div>

            {/* Exactly as requested in prompt:
                “Your medicine is waiting.
                You can do it! Take it when it’s time.”
            */}
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              “Your medicine is waiting.
              <br />
              <span className="text-teal-700">You can do it! Take it when it’s time.”</span>
            </h3>

            {/* Audio Controls Bar for gentle rhyme: Play, Pause, Replay, Mute */}
            <div className="w-full my-3">
              <AudioControlsBar
                player={audioPlayer}
                label="Gentle Encouragement Audio"
              />
            </div>

            {/* Gentle Motivational Rhyme:
                “Don’t give up, you’re doing great,
                Take your medicine when it’s time, don’t wait!
                Step by step and day by day,
                You are getting stronger every day!”
            */}
            <div className="w-full bg-gradient-to-b from-sky-50 to-blue-50/70 border-2 border-sky-200 rounded-3xl p-4 shadow-sm text-left mb-3">
              <span className="text-[11px] font-black text-sky-900 uppercase tracking-wider block mb-1">
                A Pocket of Strength
              </span>
              <div className="space-y-1 text-slate-800 text-sm font-black italic">
                {currentNotTakenRhyme.lines.map((line, idx) => (
                  <p key={idx} className="leading-snug">
                    “{line}”
                  </p>
                ))}
              </div>
            </div>

            {/* Options: Take Now OR Snooze / Remind Later */}
            <div className="w-full space-y-2.5">
              
              {/* Ready to take now button */}
              <button
                onClick={handleTakenClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Smile className="w-4 h-4 text-emerald-200" />
                <span>I Feel Ready Now! (Take Medicine)</span>
              </button>

              {/* Snooze / Remind Me Later buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => snoozeReminder(schedule.id, 5)}
                  className="py-2.5 px-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Snooze (5 Mins)</span>
                </button>

                <button
                  onClick={() => snoozeReminder(schedule.id, 10)}
                  className="py-2.5 px-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Snooze (10 Mins)</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
