'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { AnimatedMascot } from '@/components/mascot/AnimatedMascot';
import { MascotEmotion } from '@/lib/types';
import {
  Sparkles,
  Heart,
  Users,
  ShieldCheck,
  Volume2,
  Clock,
  ArrowRight,
  Bell,
  CheckCircle2,
  Cpu,
  Music,
  Smile,
  Lock,
  Plus
} from 'lucide-react';
import { speakText, playChimeSound } from '@/lib/rhymes';

export default function HomePage() {
  const {
    activePatient,
    updateChildName,
    triggerReminderModal,
    addMedicineSchedule,
    todayCompletedCount,
    todayTotalCount,
    todayProgressText
  } = useApp();

  const [previewEmotion, setPreviewEmotion] = useState<MascotEmotion>('celebrating');

  // Quick Scheduler State on Hero
  const [demoChildName, setDemoChildName] = useState(activePatient.name);
  const [demoMedName, setDemoMedName] = useState('Ondansetron Tummy Drops');
  const [demoMedTime, setDemoMedTime] = useState('06:00 PM');

  const handleTestNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoChildName.trim()) {
      updateChildName(demoChildName.trim());
    }
    if (demoMedName.trim()) {
      addMedicineSchedule(demoChildName, demoMedName, demoMedTime);
    }
    triggerReminderModal();
  };

  const handlePlayEmotionVoice = (emotion: MascotEmotion) => {
    setPreviewEmotion(emotion);
    if (emotion === 'celebrating' || emotion === 'dancing') {
      playChimeSound('success');
      speakText("Clap your hands and tap your feet! You are strong and you are sweet! One small step, one happy day, keep smiling as you find your way!", {
        pitch: 1.3,
        rate: 0.98
      });
    } else if (emotion === 'clapping') {
      playChimeSound('success');
      speakText("Great job! Keep going, little champion!", {
        pitch: 1.3,
        rate: 1.0
      });
    } else if (emotion === 'waving') {
      playChimeSound('alert_reminder');
      speakText(`Hey! It's medicine time! Pip is waving to you!`, {
        pitch: 1.25,
        rate: 0.95
      });
    } else if (emotion === 'concerned') {
      playChimeSound('gentle_sad');
      speakText("Your medicine is waiting. You can do it! Take it when it’s time. Don't give up, you're doing great, take your medicine when it's time, don't wait!", {
        pitch: 1.15,
        rate: 0.92
      });
    } else {
      speakText(`Hello ${activePatient.name}! Pip is standing by with big courage for you!`, {
        pitch: 1.25,
        rate: 0.95
      });
    }
  };

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-teal-50/40 to-slate-50 border-b border-amber-200/60 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          
          {/* Left Hero Description */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black mb-4 border border-amber-300">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span>Designed for Children Undergoing Cancer Treatment</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Medi<span className="text-teal-600">Notify</span>
              <br />
              <span className="text-amber-500 text-2xl sm:text-4xl lg:text-5xl font-extrabold block mt-1">
                “Small reminders. Big courage.”
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              MediNotify helps children remember to take their medicines on time in a <strong>friendly and motivating way</strong> instead of using a normal boring alarm. 
              With comforting characters, rotating motivational rhymes, and <strong>accidental repeated intake prevention</strong>.
            </p>

            {/* Quick Interactive Scheduling Demo Box */}
            <div className="mt-6 p-5 bg-white rounded-3xl border-2 border-amber-200 shadow-md text-left">
              <span className="text-[11px] font-black text-teal-800 uppercase tracking-wider block mb-2">
                ⚡ Try the Complete Flow (Caregiver Entry → Reminder → Rhyme)
              </span>
              
              <form onSubmit={handleTestNow} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Child's Name
                  </label>
                  <input
                    type="text"
                    value={demoChildName}
                    onChange={e => setDemoChildName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                    placeholder="Child's Name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    value={demoMedName}
                    onChange={e => setDemoMedName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                    placeholder="Medicine Name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Medicine Time
                  </label>
                  <input
                    type="text"
                    value={demoMedTime}
                    onChange={e => setDemoMedTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div className="sm:col-span-3 mt-1">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4 animate-bounce" />
                    <span>Launch “It’s Medicine Time!” Reminder Now</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Links */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                href="/patient/kid"
                className="py-3 px-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Open Kid Companion</span>
              </Link>

              <Link
                href="/dashboard"
                className="py-3 px-5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-black text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm"
              >
                <Users className="w-4 h-4 text-teal-600" />
                <span>Caregiver Dashboard</span>
              </Link>

              <Link
                href="/hardware"
                className="py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-teal-300" />
                <span>IoT Hardware Box</span>
              </Link>
            </div>

            {/* Sub-features list */}
            <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Safe Double-Dose Lock</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-teal-600" />
                <span>Rotating Motivational Rhymes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Zero Fear or Blame</span>
              </div>
            </div>

          </div>

          {/* Right Hero: Animated Mascot Preview Card */}
          <div className="flex-1 w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl flex flex-col items-center text-center relative">
            <span className="text-[11px] font-black text-amber-800 uppercase tracking-widest mb-1">
              Friendly Mascot Companion
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Meet Pip the Courage Dino
            </h3>

            {/* Mascot Element */}
            <div className="my-2">
              <AnimatedMascot emotion={previewEmotion} size="hero" />
            </div>

            {/* Emotion Buttons */}
            <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <p className="text-xs font-bold text-slate-600 mb-2">
                Test Mascot Reactions & Rhymes:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handlePlayEmotionVoice('celebrating')}
                  className={`py-2 px-1 rounded-xl text-xs font-black transition-all ${
                    previewEmotion === 'celebrating'
                      ? 'bg-amber-500 text-white shadow scale-105'
                      : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
                  }`}
                >
                  🎉 Dances & Sings
                </button>
                <button
                  onClick={() => handlePlayEmotionVoice('sad_crying')}
                  className={`py-2 px-1 rounded-xl text-xs font-black transition-all ${
                    previewEmotion === 'sad_crying'
                      ? 'bg-blue-600 text-white shadow scale-105'
                      : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
                  }`}
                >
                  😢 Gentle Reminder
                </button>
                <button
                  onClick={() => handlePlayEmotionVoice('idle')}
                  className={`py-2 px-1 rounded-xl text-xs font-black transition-all ${
                    previewEmotion === 'idle'
                      ? 'bg-teal-600 text-white shadow scale-105'
                      : 'bg-white text-slate-700 hover:bg-teal-50 border border-slate-200'
                  }`}
                >
                  👋 Calm & Ready
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500 italic">
              {previewEmotion === 'celebrating' && "“Great job! You did it! Keep going, little fighter!”"}
              {previewEmotion === 'sad_crying' && "“Oops! Your medicine is waiting. Take it when it’s time.”"}
              {previewEmotion === 'idle' && "Watching the clock with courage for today's medicines."}
            </p>
          </div>

        </div>
      </section>

      {/* Complete Workflow Section (from prompt) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-black text-teal-700 uppercase tracking-widest bg-teal-100 px-3 py-1 rounded-full">
            Full Pediatric Adherence Pipeline
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2">
            The Complete MediNotify Experience
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            From easy caregiver entry to gentle reminders, child responses, rotating motivational rhymes, and safety locks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1: Caregiver Setup */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col justify-between hover:border-teal-400 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-black mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">1. Caregiver Enters</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                Caregiver enters child’s name, medicine name, and scheduled time. Easy quick-form and dashboard schedule overview.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="mt-4 text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              Open Caregiver Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Step 2: Gentle Reminder */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">2. Gentle Reminder</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                Displays <strong>“It’s Medicine Time!”</strong> with large friendly buttons: <strong>Taken</strong> and <strong>Not Taken</strong>.
              </p>
            </div>
            <button
              onClick={() => triggerReminderModal()}
              className="mt-4 text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 text-left"
            >
              Trigger Sample Alert <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 3: Rhyme & Celebration */}
          <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-sm flex flex-col justify-between hover:border-purple-400 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black mb-4">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">3. Motivational Rhyme</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                Dancing mascot, confetti, rotating short rhymes, and celebratory cheers: <strong>“Great job! You did it! Keep going, little fighter!”</strong>
              </p>
            </div>
            <Link
              href="/motivation"
              className="mt-4 text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              Explore Rhyme Library <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Step 4: Safety Double-Dose Protection */}
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">4. Already Taken ✓</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                Status locks immediately to <strong>“Already Taken ✓”</strong> with timestamps, preventing dangerous accidental repeated intake.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              View Medicine History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* Hardware Companion Feature Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-400/40">
              Healthcare Innovation Hardware Concept
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-3">
              Connected IoT Smart Reminder Box
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Medicine Schedule → Reminder Trigger → Buzzer / Voice Reminder → Child Takes Medicine → Taken / Not Taken → Motivational Rhyme on Speaker → Update Medicine Status.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/hardware"
                className="py-3 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                <span>Launch Interactive Hardware Simulator</span>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col items-center bg-slate-800/90 border border-slate-700 p-6 rounded-3xl text-center">
            <div className="w-16 h-16 rounded-full border-4 border-amber-400 flex items-center justify-center animate-pulse mb-3">
              <Bell className="w-8 h-8 text-amber-300" />
            </div>
            <p className="font-mono text-xs text-yellow-400 font-bold">SSD1306 OLED + ESP32</p>
            <p className="text-[11px] text-slate-300 mt-1">Plays rhymes through 3W speaker</p>
          </div>
        </div>
      </section>

    </div>
  );
}
