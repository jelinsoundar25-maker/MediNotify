'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import {
  Heart,
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Pill,
  User,
  ArrowRight,
  Bell,
  Sliders,
  Check,
  Lock,
  Edit2,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { MedicationForm } from '@/lib/types';

export default function CaregiverDashboardPage() {
  const {
    activePatient,
    updateChildName,
    medications,
    schedules,
    adherenceLogs,
    checkDoseSafety,
    markDoseTaken,
    triggerReminderModal,
    addMedicineSchedule,
    todayCompletedCount,
    todayTotalCount,
    todayProgressText,
    currentStreakDays,
    adherenceRate
  } = useApp();

  // Quick Schedule Form State
  const [childInputName, setChildInputName] = useState(activePatient.name);
  const [medNameInput, setMedNameInput] = useState('');
  const [medTimeInput, setMedTimeInput] = useState('06:00 PM');
  const [medDosageInput, setMedDosageInput] = useState('1 dose');
  const [medFormInput, setMedFormInput] = useState<MedicationForm>('liquid');
  const [medInstructionsInput, setInstructionsInput] = useState('Take with love and water.');
  const [medTipInput, setMedTipInput] = useState('');

  // Child name edit mode
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(activePatient.name);

  // Safety notification toast
  const [safetyNotice, setSafetyNotice] = useState<string | null>(null);

  // Filter medications and schedules for active child
  const patientMeds = medications.filter(m => m.patient_id === activePatient.id);
  const patientSchedules = schedules.filter(s =>
    patientMeds.some(m => m.id === s.medication_id)
  );

  // Find upcoming dose
  const upcomingSchedule = patientSchedules.find(s => !checkDoseSafety(s.id).isTaken);
  const upcomingMed = upcomingSchedule
    ? patientMeds.find(m => m.id === upcomingSchedule.medication_id)
    : null;

  // Handle Caregiver Quick Add Schedule
  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medNameInput.trim()) return;

    addMedicineSchedule(
      childInputName || activePatient.name,
      medNameInput.trim(),
      medTimeInput,
      medDosageInput,
      medFormInput,
      medInstructionsInput,
      medTipInput
    );

    // Reset inputs
    setMedNameInput('');
    setMedTipInput('');
    setSafetyNotice(`New schedule added for ${childInputName || activePatient.name} at ${medTimeInput}!`);
    setTimeout(() => setSafetyNotice(null), 4000);
  };

  const handleSaveChildName = () => {
    if (tempName.trim()) {
      updateChildName(tempName.trim());
      setChildInputName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleAttemptDuplicateTake = (scheduleId: string) => {
    const safety = checkDoseSafety(scheduleId);
    if (safety.isTaken) {
      setSafetyNotice(`Safety Shield Active: This medicine was already taken at ${safety.takenAt}. Repeated intake is safely prevented to protect ${activePatient.name}!`);
      setTimeout(() => setSafetyNotice(null), 5000);
    } else {
      markDoseTaken(scheduleId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8">
        
        {/* Safety Alert Notification Toast */}
        {safetyNotice && (
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
              <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>{safetyNotice}</span>
            </div>
            <button
              onClick={() => setSafetyNotice(null)}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 px-2 py-1 rounded-lg bg-amber-200/60"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Header Block matching prompt format:
            MediNotify
            “Small reminders. Big courage.”
            Child: [Name]
        */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase tracking-wider border border-amber-300">
                Caregiver Monitoring Dashboard
              </span>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Pediatric Oncology Shield
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
              Medi<span className="text-teal-600">Notify</span>
            </h1>
            <p className="text-sm sm:text-base font-bold text-slate-500 italic mt-0.5">
              “Small reminders. Big courage.”
            </p>

            {/* Child Name Row */}
            <div className="mt-3 flex items-center gap-2 text-base sm:text-lg font-black text-slate-800">
              <User className="w-5 h-5 text-teal-600" />
              <span>Child:</span>
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    className="px-2.5 py-1 text-sm font-bold rounded-lg border-2 border-teal-500 focus:outline-none"
                    placeholder="Child's Name"
                  />
                  <button
                    onClick={handleSaveChildName}
                    className="p-1 px-2.5 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-teal-700 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
                    {activePatient.name}
                  </span>
                  <button
                    onClick={() => {
                      setTempName(activePatient.name);
                      setIsEditingName(true);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    title="Edit child name"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => triggerReminderModal()}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Bell className="w-4 h-4 animate-bounce" />
              <span>Trigger Test Reminder</span>
            </button>

            <Link
              href="/patient/kid"
              className="py-3 px-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Launch Kid View</span>
            </Link>

            <Link
              href="/hardware"
              className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Sliders className="w-4 h-4 text-teal-300" />
              <span>IoT Box</span>
            </Link>
          </div>
        </div>

        {/* 5 Summary Metric Cards matching prompt requirements */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* Card 1: Today's Medicines Total */}
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Today's Medicines</span>
              <Pill className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{todayTotalCount}</p>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Scheduled for {activePatient.name}</p>
          </div>

          {/* Card 2: Taken Medicines */}
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Taken Medicines</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600">{todayCompletedCount}</p>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">Already Taken ✓</p>
          </div>

          {/* Card 3: Pending Medicines */}
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending Medicines</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600">
              {Math.max(0, todayTotalCount - todayCompletedCount)}
            </p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">Awaiting dose</p>
          </div>

          {/* Card 4: Upcoming Medicine */}
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Upcoming Medicine</span>
              <Bell className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-sm sm:text-base font-black text-slate-900 truncate">
              {upcomingMed ? (upcomingMed.alias_hero_name || upcomingMed.name) : 'All Done!'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-bold">
              {upcomingSchedule ? `⏰ ${upcomingSchedule.scheduled_time}` : 'No more today'}
            </p>
          </div>

          {/* Card 5: Daily Progress */}
          <div className="bg-white p-4.5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Daily Progress</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {todayCompletedCount}/{todayTotalCount}
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (todayCompletedCount / Math.max(todayTotalCount, 1)) * 100)}%` }}
              />
            </div>
          </div>

        </div>

        {/* Main Grid: Medicine Schedule (Prompt Example) + Quick Entry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Medicine Schedule List exactly matching prompt format */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Medicine Schedule
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Clear timeline with accidental repeated dose prevention locks.
                  </p>
                </div>
                <span className="text-xs font-black text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  {todayProgressText}
                </span>
              </div>

              {/* Schedule list rows */}
              <div className="space-y-3.5">
                {patientSchedules.map(schedule => {
                  const med = medications.find(m => m.id === schedule.medication_id);
                  if (!med) return null;

                  const safety = checkDoseSafety(schedule.id);
                  const isTaken = safety.isTaken;

                  // Find if marked not_taken recently
                  const today = new Date().toISOString().split('T')[0];
                  const missedLog = adherenceLogs.find(
                    l =>
                      l.schedule_dose_id === schedule.id &&
                      l.status === 'not_taken' &&
                      l.recorded_at.startsWith(today)
                  );

                  return (
                    <div
                      key={schedule.id}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isTaken
                          ? 'bg-emerald-50/60 border-emerald-300'
                          : missedLog
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-white border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      {/* Left info */}
                      <div className="flex items-start gap-3.5">
                        {/* Status Icon */}
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold flex-shrink-0 mt-0.5 ${
                            isTaken
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : missedLog
                              ? 'bg-amber-500 text-white'
                              : 'bg-sky-100 text-sky-700'
                          }`}
                        >
                          {isTaken ? (
                            <Check className="w-5 h-5" />
                          ) : missedLog ? (
                            <AlertTriangle className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          {/* Schedule Line matching prompt:
                              8:00 AM ✓ Taken
                              1:00 PM ✓ Taken
                              6:00 PM ⏰ Upcoming
                              9:00 PM ○ Pending
                          */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-black text-slate-800 bg-white px-2.5 py-0.5 rounded-md border border-slate-300">
                              {schedule.scheduled_time}
                            </span>

                            <span
                              className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase flex items-center gap-1 ${
                                isTaken
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : upcomingSchedule?.id === schedule.id
                                  ? 'bg-sky-100 text-sky-900 border border-sky-300'
                                  : missedLog
                                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {isTaken && '✓ Taken'}
                              {!isTaken && upcomingSchedule?.id === schedule.id && '⏰ Upcoming'}
                              {!isTaken && missedLog && '⚠ Not Taken'}
                              {!isTaken && upcomingSchedule?.id !== schedule.id && !missedLog && '○ Pending'}
                            </span>

                            <span className="font-black text-slate-900 text-base">
                              {med.name}
                            </span>
                          </div>

                          {med.alias_hero_name && (
                            <p className="text-xs text-amber-700 font-bold mt-0.5">
                              Hero Alias: “{med.alias_hero_name}”
                            </p>
                          )}

                          <p className="text-xs text-slate-500 mt-0.5">
                            {med.dosage} ({med.form}) • {med.instructions}
                          </p>

                          {med.tip_for_adamant_kids && (
                            <p className="text-[11px] text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded mt-1 inline-block">
                              💡 Taste trick: {med.tip_for_adamant_kids}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Status & Controls */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {isTaken ? (
                          <div className="text-right">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-sm">
                              <ShieldCheck className="w-4 h-4" />
                              <span>Already Taken ✓</span>
                            </div>
                            <p className="text-[10px] text-emerald-800 font-semibold mt-1">
                              Locked at {safety.takenAt} (Double-Dose Safe)
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => triggerReminderModal(schedule.id)}
                              className="py-2 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs transition-all flex items-center gap-1"
                              title="Ring reminder modal for this medicine"
                            >
                              <Bell className="w-3.5 h-3.5 text-amber-600" />
                              <span>Ring Reminder</span>
                            </button>

                            <button
                              onClick={() => handleAttemptDuplicateTake(schedule.id)}
                              className="py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Mark Taken</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Important Safety Feature Banner */}
            <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 text-white p-6 rounded-3xl shadow-md flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-black text-lg">
                  Safety Feature: Accidental Repeated Intake Prevention
                </h4>
                <p className="text-xs sm:text-sm text-teal-100 mt-1 leading-relaxed">
                  For pediatric chemotherapy (such as 6-MP) and antiemetics, accidental double-dosing can be toxic. 
                  Once marked as <strong>“Already Taken ✓”</strong>, MediNotify locks the schedule for the rest of the window. 
                  The same scheduled medicine will <strong>never repeatedly ask the child to take it again</strong>.
                </p>
              </div>
            </div>

            {/* Medicine History Table (as requested in prompt) */}
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <h3 className="font-black text-slate-900 text-base">
                    Medicine History Log
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  {adherenceLogs.length} Verified Records
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-black uppercase text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3 rounded-l-xl">Medicine Name</th>
                      <th className="py-2.5 px-3">Scheduled Time</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Date & Timestamp</th>
                      <th className="py-2.5 px-3 rounded-r-xl">Safety Lock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adherenceLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {log.medication_name}
                        </td>
                        <td className="py-3 px-3 font-mono font-medium">
                          {log.scheduled_time || '8:00 AM'}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase inline-block ${
                              log.status === 'taken'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {log.status === 'taken' ? 'Taken ✓' : 'Not Taken / Snoozed'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">
                          {new Date(log.recorded_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(log.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-3">
                          {log.safety_locked ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Locked
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Standard</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Col: Caregiver Scheduling Form (Step 1 in Prompt User Flow) */}
          <div className="flex flex-col gap-6">
            
            <div className="bg-white p-6 rounded-3xl border-2 border-teal-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    Caregiver Entry Form
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Step 1: Child’s name, medicine name & time
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddSchedule} className="space-y-3.5 text-xs">
                
                {/* 1. Child's Name */}
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] mb-1">
                    1. Child’s Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={childInputName}
                    onChange={e => setChildInputName(e.target.value)}
                    placeholder="e.g. Leo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                  />
                </div>

                {/* 2. Medicine Name */}
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] mb-1">
                    2. Medicine Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={medNameInput}
                    onChange={e => setMedNameInput(e.target.value)}
                    placeholder="e.g. Ondansetron Syrup or 6-MP Tablet"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                  />
                </div>

                {/* 3. Medicine Time */}
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] mb-1">
                    3. Medicine Time *
                  </label>
                  <select
                    value={medTimeInput}
                    onChange={e => setMedTimeInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold bg-white"
                  >
                    <option value="08:00 AM">08:00 AM (Morning Boost)</option>
                    <option value="12:30 PM">12:30 PM (Lunchtime Shield)</option>
                    <option value="01:00 PM">01:00 PM (Afternoon Drop)</option>
                    <option value="06:00 PM">06:00 PM (Evening Care)</option>
                    <option value="08:00 PM">08:00 PM (Bedtime Remission)</option>
                    <option value="09:00 PM">09:00 PM (Nighttime Calm)</option>
                  </select>
                </div>

                {/* Dosage & Form */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      value={medDosageInput}
                      onChange={e => setMedDosageInput(e.target.value)}
                      placeholder="e.g. 4 ml"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                      Form
                    </label>
                    <select
                      value={medFormInput}
                      onChange={e => setMedFormInput(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none font-medium bg-white"
                    >
                      <option value="liquid">Liquid / Syrup</option>
                      <option value="tablet">Tablet / Pill</option>
                      <option value="chewable">Chewable</option>
                      <option value="drops">Drops</option>
                    </select>
                  </div>
                </div>

                {/* Tip for Adamant Kids */}
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-[10px] mb-1">
                    Comfort Trick for Adamant Kids
                  </label>
                  <input
                    type="text"
                    value={medTipInput}
                    onChange={e => setMedTipInput(e.target.value)}
                    placeholder="e.g. Serve cold with a strawberry slice"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Scheduled Medicine</span>
                </button>
              </form>
            </div>

            {/* Oncologist Comfort Guide */}
            <div className="bg-gradient-to-b from-amber-50 to-orange-50/50 p-6 rounded-3xl border border-amber-200 text-xs">
              <div className="flex items-center gap-2 font-black text-amber-900 text-sm mb-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Pediatric Oncology Reminders</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Chemotherapy and supportive medications can cause taste alterations and nausea. MediNotify uses positive gamified affirmations and playful rhymes so children never associate medication with fear or punishment.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
