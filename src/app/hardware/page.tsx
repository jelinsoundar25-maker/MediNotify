'use client';

import React from 'react';
import Link from 'next/link';
import { HardwareSimulator } from '@/components/hardware/HardwareSimulator';
import {
  Cpu,
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  Bell,
  Volume2,
  ShieldCheck,
  Activity
} from 'lucide-react';

export default function HardwarePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-slate-900 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Caregiver Dashboard</span>
          </Link>

          <span className="text-xs font-black text-teal-800 bg-teal-100 px-3.5 py-1.5 rounded-2xl border border-teal-200 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-teal-600" />
            <span>IoT Healthcare Innovation Module</span>
          </span>
        </div>

        {/* Page Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-[2.5rem] p-6 sm:p-9 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400 text-teal-300 text-xs font-black uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              Bedside IoT Device Architecture
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              MediNotify Smart Reminder Box
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Designed for pediatric cancer patients who benefit from physical bedside cues. 
              The hardware box features soft buzzer notifications, vibrant OLED messaging, 
              large arcade push-buttons, and an integrated speaker that recites motivational rhymes!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase">Target MCU</p>
              <p className="text-base font-black text-teal-400">ESP32 Dual-Core</p>
              <p className="text-[10px] text-slate-400 mt-0.5">WiFi + BLE 4.2</p>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase">Audio Engine</p>
              <p className="text-base font-black text-amber-400">DFPlayer Mini</p>
              <p className="text-[10px] text-slate-400 mt-0.5">3W Rhyme Speaker</p>
            </div>
          </div>
        </div>

        {/* Main Hardware Simulator & Code Widget */}
        <HardwareSimulator />

        {/* Project Evaluation Notes */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Healthcare Innovation Student Project Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-900 mb-1">1. Non-Intrusive Gentle Reminders</p>
              <p>
                Hospital-grade alarms can trigger anxiety in cancer patients. MediNotify swaps loud beeps for cheerful melodic chimes and comforting rhymes.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-900 mb-1">2. Accidental Double-Dose Lock</p>
              <p>
                Strict hardware debounce and cloud state synchronization prevent curious siblings or confused patients from double-triggering high-toxicity chemo doses.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="font-bold text-slate-900 mb-1">3. Caregiver Peace of Mind</p>
              <p>
                Real-time bidirectional synchronization lets parents monitor doses from work or another room with timestamped verification.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
