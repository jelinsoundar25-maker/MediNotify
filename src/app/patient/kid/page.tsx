'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { AnimatedMascot } from '@/components/mascot/AnimatedMascot';
import { MedicineHeroCard } from '@/components/schedule/MedicineHeroCard';
import { MascotEmotion, ScheduleDose, Medication } from '@/lib/types';
import {
  Sparkles,
  Trophy,
  Star,
  Award,
  ArrowLeft,
  Volume2,
  Heart,
  Bell,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { speakText, playChimeSound, stopSpeech } from '@/lib/rhymes';

export default function KidCompanionPage() {
  const {
    activePatient,
    medications,
    schedules,
    badges,
    currentStreakDays,
    todayCompletedCount,
    todayTotalCount,
    todayProgressText,
    checkDoseSafety,
    triggerReminderModal,
    setActiveReminder
  } = useApp();

  const [currentMood, setCurrentMood] = useState<MascotEmotion>('happy');

  // Filter medications & schedules for this child
  const patientMedIds = medications
    .filter(m => m.patient_id === activePatient.id)
    .map(m => m.id);

  const patientSchedules = schedules.filter(s =>
    patientMedIds.includes(s.medication_id)
  );

  const handleTakeDoseClick = (schedule: ScheduleDose, medication: Medication) => {
    // Open the primary reminder modal directly in Taken/Prompt mode
    setActiveReminder({ schedule, medication });
  };

  const handleNotTakenClick = (schedule: ScheduleDose, medication: Medication) => {
    // Open the reminder modal in prompt mode where child can choose Not Taken / Snooze
    setActiveReminder({ schedule, medication });
  };

  const handleMascotGreet = () => {
    playChimeSound('alert_reminder');
    setCurrentMood('celebrating');
    speakText(`Hello ${activePatient.name}! You are our strongest little fighter! Pip is proud of you!`, {
      pitch: 1.3,
      rate: 0.95,
      onEnd: () => setCurrentMood('happy')
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-teal-50/40 to-slate-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6 sm:gap-8">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-slate-900 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Caregiver Dashboard</span>
          </Link>

          {/* Courage Stars Counter */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black px-4 py-2 rounded-2xl shadow-sm border border-amber-300">
            <Star className="w-5 h-5 fill-amber-100 text-amber-900 animate-spin" />
            <span className="text-sm sm:text-base">
              {currentStreakDays * 50 + 250} Courage Stars
            </span>
          </div>
        </div>

        {/* Hero Cheerful Mascot Banner */}
        <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 rounded-[2.5rem] p-6 sm:p-9 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center md:text-left z-10 flex-1">
            <span className="px-3.5 py-1 bg-white/20 text-teal-100 rounded-full text-xs font-black uppercase tracking-wider">
              {activePatient.hero_title || 'Little Fighter'}
            </span>
            
            <h1 className="text-2xl sm:text-4xl font-black mt-2 tracking-tight">
              Ready for Your Power Drops, {activePatient.name}?
            </h1>
            
            <p className="mt-2 text-xs sm:text-sm text-teal-100 max-w-lg leading-relaxed font-medium">
              Every drop makes your courage shield stronger! Pip dances, sings motivational rhymes, and celebrates every small step with you.
            </p>

            {/* Streak & Voice Greet Buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>{currentStreakDays} Day Hero Streak!</span>
              </div>

              <button
                onClick={handleMascotGreet}
                className="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs shadow transition-all flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Pip Say Hi!</span>
              </button>
            </div>
          </div>

          {/* Mascot Companion Element with interactive actions */}
          <div className="flex flex-col items-center z-10">
            <AnimatedMascot
              emotion={currentMood}
              size="lg"
              onTap={handleMascotGreet}
              showSpeechBubble={
                currentMood === 'dancing' || currentMood === 'celebrating'
                  ? "Pip is dancing! 🎵"
                  : currentMood === 'clapping'
                  ? "Clap, clap, hooray! 👏"
                  : currentMood === 'waving'
                  ? "Hi brave champion! 👋"
                  : undefined
              }
            />

            {/* Interactive action buttons */}
            <div className="flex items-center gap-1.5 mt-2 bg-black/25 p-1.5 rounded-2xl backdrop-blur-sm">
              <button
                onClick={() => {
                  setCurrentMood('dancing');
                  playChimeSound('success');
                  speakText("Dance, dance, dance! You are our superhero!", { pitch: 1.3, rate: 1.0 });
                }}
                className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-[11px] shadow-sm transition-all"
                title="Make Pip dance"
              >
                💃 Dance
              </button>
              <button
                onClick={() => {
                  setCurrentMood('clapping');
                  playChimeSound('success');
                  speakText("Clap your hands and tap your feet! You are strong and you are sweet!", { pitch: 1.3, rate: 0.98 });
                }}
                className="px-2.5 py-1 rounded-xl bg-teal-400 hover:bg-teal-300 text-teal-950 font-black text-[11px] shadow-sm transition-all"
                title="Make Pip clap"
              >
                👏 Clap
              </button>
              <button
                onClick={() => {
                  setCurrentMood('waving');
                  playChimeSound('alert_reminder');
                  speakText(`Hello ${activePatient.name}! Have big courage today!`, { pitch: 1.25, rate: 0.95 });
                }}
                className="px-2.5 py-1 rounded-xl bg-sky-400 hover:bg-sky-300 text-sky-950 font-black text-[11px] shadow-sm transition-all"
                title="Make Pip wave"
              >
                👋 Wave
              </button>
              <button
                onClick={() => {
                  setCurrentMood('bouncing');
                  playChimeSound('alert_reminder');
                }}
                className="px-2.5 py-1 rounded-xl bg-pink-400 hover:bg-pink-300 text-pink-950 font-black text-[11px] shadow-sm transition-all"
                title="Make Pip bounce"
              >
                ⭐ Bounce
              </button>
            </div>
          </div>
        </div>

        {/* Daily Progress Tracker as requested in prompt */}
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                {todayProgressText}
              </h3>
            </div>
            <span className="text-xs font-black text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              {Math.round((todayCompletedCount / Math.max(todayTotalCount, 1)) * 100)}% Completed
            </span>
          </div>

          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 h-full rounded-full transition-all duration-700 shadow"
              style={{
                width: `${Math.min(100, (todayCompletedCount / Math.max(todayTotalCount, 1)) * 100)}%`
              }}
            />
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Great job! You did it! Keep going, little fighter!
          </p>
        </div>

        {/* Medicine Schedule Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Today’s Superpower Potions
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Tap Taken when you take your medicine to hear a happy rhyme and dance!
              </p>
            </div>
          </div>

          {patientSchedules.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border-2 border-slate-200">
              <p className="text-slate-500 font-bold text-sm">
                No medications scheduled yet! Add them in the Caregiver Dashboard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {patientSchedules.map(schedule => {
                const med = medications.find(m => m.id === schedule.medication_id);
                if (!med) return null;

                const safety = checkDoseSafety(schedule.id);

                return (
                  <MedicineHeroCard
                    key={schedule.id}
                    medication={med}
                    schedule={schedule}
                    isCompletedToday={safety.isTaken}
                    takenAtText={safety.takenAt}
                    onTakeDose={() => handleTakeDoseClick(schedule, med)}
                    onRefuseOrDelay={() => handleNotTakenClick(schedule, med)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Courage Sticker Album */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-teal-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-black text-slate-900">
                Hero Courage Sticker Album
              </h3>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl">
              {badges.filter(b => b.unlocked_at).length} Stickers Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {badges.map(badge => (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                  badge.unlocked_at
                    ? 'bg-amber-50/70 border-amber-300 text-slate-800 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold flex-shrink-0 ${
                    badge.unlocked_at
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 shadow-sm'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Star className="w-6 h-6 fill-amber-100" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black truncate">{badge.badge_name}</p>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
