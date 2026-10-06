'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import {
  Heart,
  Sparkles,
  Users,
  Cpu,
  Music,
  Bell,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    activePatient,
    activePatientId,
    setActivePatientId,
    patients,
    todayCompletedCount,
    todayTotalCount,
    triggerReminderModal,
    resetToDefaults
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-teal-500 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Medi<span className="text-teal-600">Notify</span>
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-black bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                  Pediatric Care
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-bold tracking-wide">
                “Small reminders. Big courage.”
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <Link
              href="/patient/kid"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                pathname === '/patient/kid'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Kid Companion</span>
            </Link>

            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                pathname.startsWith('/dashboard')
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-teal-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Caregiver Dashboard</span>
            </Link>

            <Link
              href="/motivation"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                pathname === '/motivation'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-purple-600'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Rhymes & Motivation</span>
            </Link>

            <Link
              href="/hardware"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                pathname === '/hardware'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>IoT Smart Box</span>
            </Link>
          </nav>

          {/* Right Controls: Patient Profile, Quick Test Reminder */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Child Selector */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-2xl px-2.5 py-1.5 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-bold mr-1.5">
                Child:
              </span>
              <select
                value={activePatientId}
                onChange={e => setActivePatientId(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-black text-slate-900 focus:outline-none cursor-pointer"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Daily Adherence Pill */}
            <div
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-black shadow-sm"
              title="Today's progress"
            >
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>{todayCompletedCount}/{todayTotalCount} Taken</span>
            </div>

            {/* Instant Test Reminder Button */}
            <button
              onClick={() => triggerReminderModal()}
              className="flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all"
              title="Test the complete reminder modal flow"
            >
              <Bell className="w-4 h-4 animate-bounce" />
              <span>Test Reminder</span>
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => {
                if (confirm('Reset to standard demo data?')) {
                  resetToDefaults();
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Reset sample data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden py-2 flex items-center justify-around border-t border-slate-100 text-xs font-bold">
          <Link
            href="/patient/kid"
            className={`p-2 rounded-xl flex items-center gap-1 ${
              pathname === '/patient/kid' ? 'bg-amber-100 text-amber-900' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Kid Mode</span>
          </Link>

          <Link
            href="/dashboard"
            className={`p-2 rounded-xl flex items-center gap-1 ${
              pathname.startsWith('/dashboard') ? 'bg-teal-100 text-teal-900' : 'text-slate-600'
            }`}
          >
            <Users className="w-4 h-4 text-teal-600" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/motivation"
            className={`p-2 rounded-xl flex items-center gap-1 ${
              pathname === '/motivation' ? 'bg-purple-100 text-purple-900' : 'text-slate-600'
            }`}
          >
            <Music className="w-4 h-4 text-purple-600" />
            <span>Rhymes</span>
          </Link>

          <Link
            href="/hardware"
            className={`p-2 rounded-xl flex items-center gap-1 ${
              pathname === '/hardware' ? 'bg-slate-800 text-white' : 'text-slate-600'
            }`}
          >
            <Cpu className="w-4 h-4 text-teal-300" />
            <span>Smart Box</span>
          </Link>
        </div>

      </div>
    </header>
  );
};
