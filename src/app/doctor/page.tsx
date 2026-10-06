'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Stethoscope,
  Users,
  ShieldCheck,
  AlertTriangle,
  Send,
  Calendar,
  Activity,
  Award,
  CheckCircle,
  Clock,
  Pill
} from 'lucide-react';

export default function DoctorPortalPage() {
  const {
    patients,
    medications,
    schedules,
    adherenceLogs,
    doctorConnections,
    updateDoctorNote
  } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'pat-leo-001');
  const [noteInput, setNoteInput] = useState('');
  const [saveFeedback, setSaveFeedback] = useState(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const selectedConnection = doctorConnections.find(c => c.patient_id === selectedPatientId);

  const patientMeds = medications.filter(m => m.patient_id === selectedPatientId);
  const patientLogs = adherenceLogs.filter(l => l.patient_id === selectedPatientId);
  const takenLogs = patientLogs.filter(l => l.status === 'taken');
  const adherencePct = patientLogs.length > 0 ? Math.round((takenLogs.length / patientLogs.length) * 100) : 94;

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;

    updateDoctorNote(selectedPatientId, noteInput);
    setNoteInput('');
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Doctor Header */}
        <div className="bg-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-800 text-teal-200 flex items-center justify-center font-bold">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-teal-800 text-teal-300 text-xs font-bold uppercase tracking-wider">
                  Clinical Oncology & Geriatric Network
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                Dr. Sarah Chen, MD
              </h1>
              <p className="text-xs sm:text-sm text-teal-200 mt-0.5">
                Children’s Advanced Oncology Pavilion • Department of Hematology
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-teal-800/80 p-3 rounded-2xl border border-teal-700">
            <div className="text-center px-3">
              <p className="text-[10px] text-teal-300 uppercase font-bold">Assigned Patients</p>
              <p className="text-2xl font-black text-white">{patients.length}</p>
            </div>
            <div className="h-8 w-px bg-teal-700" />
            <div className="text-center px-3">
              <p className="text-[10px] text-teal-300 uppercase font-bold">Network Adherence</p>
              <p className="text-2xl font-black text-emerald-400">95%</p>
            </div>
          </div>
        </div>

        {/* Patient Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-400 px-3 uppercase">
            Active Chart:
          </span>
          {patients.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPatientId(p.id)}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                selectedPatientId === p.id
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{p.name}</span>
              <span className="text-[10px] opacity-80 uppercase">
                ({p.patient_type})
              </span>
            </button>
          ))}
        </div>

        {/* Patient Clinical Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Clinical Adherence & Prescriptions */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Adherence Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase">
                    Patient Adherence Tracking
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5">
                    {selectedPatient.name} — Clinical Profile
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Diagnosis: <strong>{selectedPatient.diagnosis_notes}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-bold block">Adherence Rate</span>
                  <span className="text-3xl font-black text-emerald-600">{adherencePct}%</span>
                </div>
              </div>

              {/* Adherence Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                  <span>30-Day On-Time Compliance</span>
                  <span>Target: 90%+</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${adherencePct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Prescribed Medications */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-teal-600" />
                  <span>Current Chemotherapy & Supportive Regimen</span>
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  {patientMeds.length} Active Rx
                </span>
              </div>

              <div className="space-y-4">
                {patientMeds.map(med => (
                  <div
                    key={med.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">
                          {med.name}
                        </span>
                        {med.critical_level === 'critical_chemo' && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Critical Chemo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        <strong>Dosage:</strong> {med.dosage} ({med.form}) • <strong>Instructions:</strong> {med.instructions}
                      </p>
                      {med.alias_hero_name && (
                        <p className="text-xs text-amber-700 font-bold mt-1">
                          Child Hero Alias: “{med.alias_hero_name}”
                        </p>
                      )}
                      {med.side_effects_note && (
                        <p className="text-xs text-slate-500 mt-1 italic">
                          Clinical note: {med.side_effects_note}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 flex-shrink-0">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Col: Send Doctor Encouragement Note to Family */}
          <div className="flex flex-col gap-6">
            
            {/* Note Broadcast Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-teal-900 font-black text-sm mb-2">
                <Send className="w-4 h-4 text-teal-600" />
                <span>Message to Family Caregiver</span>
              </div>
              <p className="text-xs text-slate-600 mb-4">
                Send clinical encouragement or protocol notes. These appear directly on the parent dashboard.
              </p>

              <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200 mb-4 text-xs text-blue-900">
                <p className="font-bold text-blue-950">Currently Displayed Note:</p>
                <p className="mt-1 italic leading-relaxed">
                  “{selectedConnection?.doctor_message || 'Keep up the courage! Regular adherence is key to your recovery.'}”
                </p>
                <p className="text-[10px] text-blue-600 mt-1">
                  Updated: {selectedConnection?.last_review_date || 'Recent'}
                </p>
              </div>

              <form onSubmit={handleSendNote} className="space-y-3">
                <textarea
                  rows={3}
                  placeholder="e.g. Great job on the 7-day streak! Please ensure 6-MP is taken with plenty of fluids."
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Update Clinical Note</span>
                </button>

                {saveFeedback && (
                  <p className="text-xs text-emerald-600 font-bold text-center animate-fade-in">
                    ✓ Note updated and synced to family portal!
                  </p>
                )}
              </form>
            </div>

            {/* Adherence Log Inspector */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-black text-slate-900 uppercase mb-3">
                Live Adherence Feed
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {patientLogs.slice(0, 6).map(log => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{log.medication_name}</p>
                      <p className="text-[10px] text-slate-500">
                        {log.notes || 'Recorded on time'}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.status === 'taken'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
