'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { SeniorMedicineCard } from '@/components/schedule/SeniorMedicineCard';
import { ScheduleDose, Medication } from '@/lib/types';
import { ArrowLeft, PhoneCall, Volume2, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';
import { speakText, playChimeSound } from '@/lib/rhymes';

export default function ElderlyModePage() {
  const {
    activePatient,
    medications,
    schedules,
    adherenceLogs,
    logDoseAction,
    adherenceRate
  } = useApp();

  const patientMedIds = medications
    .filter(m => m.patient_id === activePatient?.id)
    .map(m => m.id);

  const patientSchedules = schedules.filter(s =>
    patientMedIds.includes(s.medication_id)
  );

  const handleTakeDose = (schedule: ScheduleDose, medication: Medication) => {
    playChimeSound('success');
    logDoseAction(schedule.id, 'taken');
    speakText(`Thank you. Your dose of ${medication.name} has been recorded and confirmed with your care team.`, {
      pitch: 0.95,
      rate: 0.9
    });
  };

  const handlePostpone = (schedule: ScheduleDose, medication: Medication) => {
    playChimeSound('alert');
    logDoseAction(schedule.id, 'delayed', 'Postponed by patient');
    speakText(`Reminder paused. We will remind you again in 15 minutes for ${medication.name}.`, {
      pitch: 0.95,
      rate: 0.9
    });
  };

  const speakOverview = () => {
    playChimeSound('alert');
    const msg = `Hello ${activePatient?.name}. You have ${patientSchedules.length} scheduled medicines today. Your on-time adherence rate is ${adherenceRate} percent. Keep up the good work.`;
    speakText(msg, { pitch: 0.95, rate: 0.85 });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Navigation & Audio Help Banner */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-slate-950 bg-white px-4 py-2 rounded-xl border-2 border-slate-300 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Family Dashboard</span>
          </Link>

          <button
            onClick={speakOverview}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-teal-700 text-white font-bold text-sm shadow hover:bg-teal-800 transition-all"
          >
            <Volume2 className="w-5 h-5 text-amber-300" />
            <span>Read Daily Summary</span>
          </button>
        </div>

        {/* High Contrast Header Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border-4 border-slate-950 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black tracking-widest text-teal-400 uppercase">
                Senior Clarity Assistant
              </span>
              <h1 className="text-3xl sm:text-4xl font-black mt-1">
                {activePatient?.name}
              </h1>
              <p className="mt-2 text-base sm:text-lg text-slate-300">
                Clear daily schedule with voice support & real-time doctor connection.
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className="text-xs text-slate-400 font-bold uppercase">Adherence Rate</span>
              <div className="text-3xl font-black text-emerald-400">
                {adherenceRate}%
              </div>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Doctor Connected</span>
              </span>
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-black text-slate-950">
            Medication Schedule for Today
          </h2>

          {patientSchedules.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border-2 border-slate-300">
              <p className="text-slate-700 font-bold text-lg">
                No medications currently scheduled for this patient profile.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {patientSchedules.map(schedule => {
                const med = medications.find(m => m.id === schedule.medication_id);
                if (!med) return null;

                const isDone = adherenceLogs.some(
                  l => l.schedule_dose_id === schedule.id && l.status === 'taken'
                );

                return (
                  <SeniorMedicineCard
                    key={schedule.id}
                    medication={med}
                    schedule={schedule}
                    isCompletedToday={isDone}
                    onTakeDose={() => handleTakeDose(schedule, med)}
                    onPostpone={() => handlePostpone(schedule, med)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Emergency / Caregiver Helpline */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-amber-950">
            <PhoneCall className="w-6 h-6 text-amber-700 flex-shrink-0" />
            <div>
              <p className="font-bold text-base">Family Caregiver Connected</p>
              <p className="text-xs text-amber-800">
                Sarah Miller (Daughter / Primary Caregiver) • Notifications Active
              </p>
            </div>
          </div>
          <span className="text-xs font-black bg-amber-200 text-amber-900 px-3 py-1 rounded-full">
            Direct Alert Enabled
          </span>
        </div>

      </div>
    </div>
  );
}
