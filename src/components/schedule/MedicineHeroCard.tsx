'use client';

import React from 'react';
import { Medication, ScheduleDose } from '@/lib/types';
import { Shield, Sparkles, Rocket, Heart, Leaf, Check, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface MedicineHeroCardProps {
  medication: Medication;
  schedule: ScheduleDose;
  onTakeDose: () => void;
  onRefuseOrDelay: () => void;
  isCompletedToday?: boolean;
  takenAtText?: string;
}

export const MedicineHeroCard: React.FC<MedicineHeroCardProps> = ({
  medication,
  schedule,
  onTakeDose,
  onRefuseOrDelay,
  isCompletedToday = false,
  takenAtText
}) => {
  const theme = medication.visual_theme_card;

  const renderThemeIllustration = () => {
    switch (theme) {
      case 'shield_potion':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-teal-100 rounded-2xl border-2 border-teal-300 shadow-inner group-hover:scale-105 transition-transform">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600 fill-teal-500/30" />
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400 absolute -top-1 -right-1 animate-bounce" />
          </div>
        );
      case 'star_elixir':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-amber-100 rounded-2xl border-2 border-amber-300 shadow-inner group-hover:scale-105 transition-transform">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="absolute bottom-1 right-1 bg-amber-400 text-white rounded-full p-0.5 text-[10px] font-bold">
              ★
            </div>
          </div>
        );
      case 'rocket_fuel':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-sky-100 rounded-2xl border-2 border-sky-300 shadow-inner group-hover:scale-105 transition-transform">
            <Rocket className="w-10 h-10 sm:w-12 sm:h-12 text-sky-600 fill-sky-400/30 -rotate-45" />
          </div>
        );
      case 'heart_crystal':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-rose-100 rounded-2xl border-2 border-rose-300 shadow-inner group-hover:scale-105 transition-transform">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500 fill-rose-400/40 animate-pulse" />
          </div>
        );
      default:
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-emerald-100 rounded-2xl border-2 border-emerald-300 shadow-inner group-hover:scale-105 transition-transform">
            <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
          </div>
        );
    }
  };

  return (
    <div
      className={`group relative rounded-3xl p-5 sm:p-6 border-2 transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl ${
        isCompletedToday
          ? 'bg-emerald-50/40 border-emerald-300/80'
          : 'bg-white border-amber-200/80 hover:border-amber-400'
      }`}
    >
      {/* Top Details */}
      <div>
        <div className="flex items-start gap-4">
          {renderThemeIllustration()}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                ⏰ {schedule.scheduled_time}
              </span>
              <span className="text-xs font-bold text-slate-500 capitalize">
                {medication.dosage} • {medication.form}
              </span>
            </div>

            {/* Medicine Alias */}
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 leading-tight group-hover:text-teal-700 transition-colors">
              {medication.alias_hero_name || medication.name}
            </h3>

            {/* Real Medicine Name */}
            <p className="text-xs text-slate-600 font-medium">
              Medicine: <span className="font-bold text-slate-800">{medication.name}</span>
            </p>

            {/* Child-friendly instruction */}
            <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
              💡 {medication.instructions}
            </p>
          </div>
        </div>

        {/* Tip for adamant kids */}
        {medication.tip_for_adamant_kids && (
          <div className="mt-3 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Tasty Trick:</strong> {medication.tip_for_adamant_kids}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100">
        {isCompletedToday ? (
          <div className="w-full py-3 px-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-black text-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Already Taken ✓</span>
            </div>
            <span className="text-xs text-emerald-700 font-semibold">
              {takenAtText ? `At ${takenAtText}` : 'Safe Double-Dose Protected'}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={onTakeDose}
              className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-md shadow-teal-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-200" />
              <span>Taken ✓</span>
            </button>

            <button
              onClick={onRefuseOrDelay}
              className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border-2 border-slate-200 hover:border-rose-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
              <span>Not Taken / Snooze</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
