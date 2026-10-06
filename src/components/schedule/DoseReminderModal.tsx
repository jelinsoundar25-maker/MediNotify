'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { Bell, Sparkles, Clock, X, Check, HelpCircle } from 'lucide-react';
import { playChimeSound, speakText } from '@/lib/rhymes';
import { ScheduleDose, Medication } from '@/lib/types';

interface DoseReminderModalProps {
  onTakeDose: (schedule: ScheduleDose, medication: Medication) => void;
  onHesitantOrRefuse: (schedule: ScheduleDose, medication: Medication) => void;
}

export const DoseReminderModal: React.FC<DoseReminderModalProps> = ({
  onTakeDose,
  onHesitantOrRefuse
}) => {
  const { activePatient, medications, schedules, adherenceLogs } = useApp();
  const [activeAlert, setActiveAlert] = useState<{
    schedule: ScheduleDose;
    medication: Medication;
  } | null>(null);

  // Expose a global event listener so anyone can trigger a test reminder anytime
  useEffect(() => {
    const handleTrigger = (e: any) => {
      const targetSched = schedules.find(s => {
        const med = medications.find(m => m.id === s.medication_id);
        return med?.patient_id === activePatient?.id;
      }) || schedules[0];

      if (targetSched) {
        const targetMed = medications.find(m => m.id === targetSched.medication_id);
        if (targetMed) {
          playChimeSound('alert');
          if (activePatient?.preferences?.sound_enabled) {
            speakText(`Attention ${activePatient.name}, it is time for your ${targetMed.alias_hero_name || targetMed.name}! Pip is ready!`, {
              pitch: 1.2,
              rate: 0.95
            });
          }
          setActiveAlert({ schedule: targetSched, medication: targetMed });
        }
      }
    };

    window.addEventListener('trigger-medicine-reminder', handleTrigger);
    return () => window.removeEventListener('trigger-medicine-reminder', handleTrigger);
  }, [schedules, medications, activePatient]);

  if (!activeAlert) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white rounded-3xl p-5 shadow-2xl border-4 border-amber-300 flex flex-col gap-3 relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-teal-400 to-amber-400" />

        {/* Top notification bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-wide">
            <Bell className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>Timely Medicine Reminder!</span>
          </div>
          <button
            onClick={() => setActiveAlert(null)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">
              ⏰ Scheduled for {activeAlert.schedule.scheduled_time}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {activeAlert.medication.dosage}
            </span>
          </div>

          <h4 className="text-lg font-black text-slate-900 mt-1">
            {activeAlert.medication.alias_hero_name || activeAlert.medication.name}
          </h4>
          <p className="text-xs text-slate-600 font-medium">
            Clinical name: <span className="font-semibold text-slate-800">{activeAlert.medication.name}</span>
          </p>
          <p className="text-xs text-slate-500 mt-1 italic">
            💡 {activeAlert.medication.instructions}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              const alert = activeAlert;
              setActiveAlert(null);
              onTakeDose(alert.schedule, alert.medication);
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>I Drank It! (Dance & Rhyme)</span>
          </button>

          <button
            onClick={() => {
              const alert = activeAlert;
              setActiveAlert(null);
              onHesitantOrRefuse(alert.schedule, alert.medication);
            }}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 font-bold text-xs transition-all flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Adamant / Hesitant</span>
          </button>
        </div>

      </div>
    </div>
  );
};
