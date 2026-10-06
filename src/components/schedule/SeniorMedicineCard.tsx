'use client';

import React from 'react';
import { Medication, ScheduleDose } from '@/lib/types';
import { Volume2, CheckCircle2, AlertCircle, Clock, Pill } from 'lucide-react';
import { speakText, playChimeSound } from '@/lib/rhymes';

interface SeniorMedicineCardProps {
  medication: Medication;
  schedule: ScheduleDose;
  onTakeDose: () => void;
  onPostpone: () => void;
  isCompletedToday?: boolean;
}

export const SeniorMedicineCard: React.FC<SeniorMedicineCardProps> = ({
  medication,
  schedule,
  onTakeDose,
  onPostpone,
  isCompletedToday = false
}) => {
  const handleSpeakInstructions = () => {
    playChimeSound('alert');
    const spokenMessage = `Reminder for ${medication.name}. Dosage is ${medication.dosage}, in ${medication.form} form. Scheduled for ${schedule.scheduled_time}. Instructions: ${medication.instructions}.`;
    speakText(spokenMessage, {
      pitch: 0.95,
      rate: 0.85 // Clear and unhurried for senior clarity
    });
  };

  return (
    <div
      className={`rounded-3xl p-6 border-4 transition-all duration-200 flex flex-col justify-between shadow-lg ${
        isCompletedToday
          ? 'bg-slate-100 border-slate-300 opacity-80'
          : 'bg-white border-slate-800'
      }`}
    >
      <div>
        {/* Scheduled Time Banner & Read Out Aloud */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-slate-200">
          <div className="flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-slate-900" />
            <span className="text-2xl font-black text-slate-950 tracking-tight">
              {schedule.scheduled_time}
            </span>
          </div>
          
          <button
            onClick={handleSpeakInstructions}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-bold active:scale-95 transition-all shadow"
            title="Read instructions aloud"
          >
            <Volume2 className="w-5 h-5 text-amber-300" />
            <span>Read Aloud</span>
          </button>
        </div>

        {/* Medicine Name & Dosage in High-Contrast Typography */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <Pill className="w-6 h-6 text-teal-700 flex-shrink-0" />
            <h3 className="text-2xl font-black text-slate-950 tracking-tight">
              {medication.name}
            </h3>
          </div>
          
          <div className="mt-2 inline-block px-3.5 py-1 bg-slate-200 rounded-lg text-base font-extrabold text-slate-900">
            Dosage: {medication.dosage} ({medication.form})
          </div>

          <p className="mt-3 text-lg font-semibold text-slate-800 leading-relaxed bg-amber-50/80 p-3 rounded-xl border border-amber-200">
            {medication.instructions}
          </p>

          {medication.doctor_name && (
            <p className="mt-2 text-sm text-slate-600 font-medium">
              Prescribed by: <strong className="text-slate-900">{medication.doctor_name}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Action Confirmation */}
      <div className="mt-6 pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row gap-3">
        {isCompletedToday ? (
          <div className="w-full py-4 px-6 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center gap-3 border-2 border-emerald-300">
            <CheckCircle2 className="w-7 h-7 text-emerald-700" />
            <span>Dose Confirmed for Today</span>
          </div>
        ) : (
          <>
            <button
              onClick={onTakeDose}
              className="flex-1 py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg shadow-md transition-all active:scale-98 flex items-center justify-center gap-3 border-2 border-emerald-900"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-200" />
              <span>I Have Taken This Medicine</span>
            </button>
            <button
              onClick={onPostpone}
              className="py-4 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-base border-2 border-slate-400 transition-all"
            >
              Remind in 15 Mins
            </button>
          </>
        )}
      </div>
    </div>
  );
};
