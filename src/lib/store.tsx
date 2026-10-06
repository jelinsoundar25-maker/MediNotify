'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Patient,
  Medication,
  ScheduleDose,
  AdherenceLog,
  RewardBadge,
  DoctorPatientConnection,
  UserRole,
  DoseStatus,
  HardwareDeviceState,
  MedicationForm
} from './types';
import {
  INITIAL_PATIENTS,
  INITIAL_MEDICATIONS,
  INITIAL_SCHEDULES,
  INITIAL_LOGS,
  INITIAL_BADGES,
  INITIAL_DOCTOR_CONNECTIONS
} from './supabase/mock-data';
import { playChimeSound, getRandomTakenRhyme } from './rhymes';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activePatientId: string;
  setActivePatientId: (id: string) => void;
  patients: Patient[];
  activePatient: Patient;
  updateChildName: (newName: string) => void;
  medications: Medication[];
  schedules: ScheduleDose[];
  adherenceLogs: AdherenceLog[];
  badges: RewardBadge[];
  doctorConnections: DoctorPatientConnection[];
  updateDoctorNote: (patientId: string, message: string) => void;

  // Reminder Modal State
  activeReminder: { schedule: ScheduleDose; medication: Medication } | null;
  setActiveReminder: (rem: { schedule: ScheduleDose; medication: Medication } | null) => void;
  triggerReminderModal: (scheduleId?: string) => void;

  // Taken / Not Taken / Snooze Handlers with Double-Dose Protection
  markDoseTaken: (scheduleId: string) => { success: boolean; message: string };
  markDoseNotTaken: (scheduleId: string, snoozeMinutes?: number) => void;
  snoozeReminder: (scheduleId: string, minutes: number) => void;
  checkDoseSafety: (scheduleId: string) => { isTaken: boolean; takenAt?: string; log?: AdherenceLog };
  logDoseAction: (scheduleId: string, status: any, reason?: string, notes?: string) => void;

  // Caregiver flow: Add medicine
  addMedicineSchedule: (
    childName: string,
    medName: string,
    time: string,
    dosage?: string,
    form?: any,
    instructions?: string,
    tipForKids?: string
  ) => void;

  // Hardware Companion State & Controls
  hardwareState: HardwareDeviceState;
  pressHardwareTaken: () => void;
  pressHardwareNotTaken: () => void;
  setHardwareVolume: (vol: number) => void;

  // Progress metrics
  todayCompletedCount: number;
  todayTotalCount: number;
  todayProgressText: string;
  currentStreakDays: number;
  adherenceRate: number;

  // System helpers
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'medinotify_app_data_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('parent');
  const [activePatientId, setActivePatientId] = useState<string>('pat-leo-001');

  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [schedules, setSchedules] = useState<ScheduleDose[]>(INITIAL_SCHEDULES);
  const [adherenceLogs, setAdherenceLogs] = useState<AdherenceLog[]>(INITIAL_LOGS);
  const [badges, setBadges] = useState<RewardBadge[]>(INITIAL_BADGES);
  const [doctorConnections, setDoctorConnections] = useState<DoctorPatientConnection[]>(INITIAL_DOCTOR_CONNECTIONS);

  // Active Reminder in foreground
  const [activeReminder, setActiveReminder] = useState<{
    schedule: ScheduleDose;
    medication: Medication;
  } | null>(null);

  // Hardware Companion Device State
  const [hardwareState, setHardwareState] = useState<HardwareDeviceState>({
    isConnected: true,
    ledStatus: 'idle',
    buzzerActive: false,
    screenMessage: 'MEDINOTIFY ONLINE',
    screenSubtext: 'Small reminders. Big courage.',
    batteryLevel: 98,
    lastAction: 'System Standby',
    volume: 85
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.patients) setPatients(parsed.patients);
        if (parsed.medications) setMedications(parsed.medications);
        if (parsed.schedules) setSchedules(parsed.schedules);
        if (parsed.adherenceLogs) setAdherenceLogs(parsed.adherenceLogs);
        if (parsed.badges) setBadges(parsed.badges);
        if (parsed.activePatientId) setActivePatientId(parsed.activePatientId);
      }
    } catch (e) {
      console.warn('Could not restore from localStorage', e);
    }
  }, []);

  // Save to LocalStorage on updates
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          patients,
          medications,
          schedules,
          adherenceLogs,
          badges,
          activePatientId
        })
      );
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [patients, medications, schedules, adherenceLogs, badges, activePatientId]);

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  const updateChildName = (newName: string) => {
    if (!newName.trim()) return;
    setPatients(prev =>
      prev.map(p =>
        p.id === activePatientId
          ? { ...p, name: newName.trim(), hero_title: `Little Fighter ${newName.trim()}` }
          : p
      )
    );
  };

  // Check if a dose was taken today (Safety Double-Dose Protection)
  const checkDoseSafety = (scheduleId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const log = adherenceLogs.find(
      l =>
        l.schedule_dose_id === scheduleId &&
        l.status === 'taken' &&
        l.recorded_at.startsWith(today)
    );
    if (log) {
      return {
        isTaken: true,
        takenAt: new Date(log.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        log
      };
    }
    return { isTaken: false };
  };

  // Trigger Reminder Modal
  const triggerReminderModal = (scheduleId?: string) => {
    let targetSched: ScheduleDose | undefined;
    if (scheduleId) {
      targetSched = schedules.find(s => s.id === scheduleId);
    } else {
      // Find the first pending schedule for active patient that is NOT already taken today
      const patientMeds = medications.filter(m => m.patient_id === activePatient.id).map(m => m.id);
      const candidates = schedules.filter(s => patientMeds.includes(s.medication_id));
      targetSched = candidates.find(s => !checkDoseSafety(s.id).isTaken) || candidates[0];
    }

    if (!targetSched) return;
    const targetMed = medications.find(m => m.id === targetSched?.medication_id);
    if (!targetMed) return;

    // Trigger sound & modal
    playChimeSound('alert_reminder');
    setActiveReminder({ schedule: targetSched, medication: targetMed });

    // Update Hardware state: Pulsing amber LED, Buzzing, Display medicine name
    playChimeSound('hardware_buzzer');
    setHardwareState(prev => ({
      ...prev,
      ledStatus: 'alert_pulsing',
      buzzerActive: true,
      screenMessage: `MEDICINE TIME!`,
      screenSubtext: `${targetMed.alias_hero_name || targetMed.name} (${targetSched?.scheduled_time})`,
      lastAction: `Ringing Reminder: ${targetMed.name}`
    }));

    // Silence buzzer after 3 seconds on hardware
    setTimeout(() => {
      setHardwareState(prev => ({ ...prev, buzzerActive: false }));
    }, 2800);
  };

  // Mark Dose as TAKEN
  const markDoseTaken = (scheduleId: string): { success: boolean; message: string } => {
    // 1. SAFETY CHECK: Prevent accidental repeated intake
    const safety = checkDoseSafety(scheduleId);
    if (safety.isTaken) {
      return {
        success: false,
        message: `Safety Shield: Already taken at ${safety.takenAt}. Accidental repeated dose prevented!`
      };
    }

    const sched = schedules.find(s => s.id === scheduleId);
    const med = medications.find(m => m.id === sched?.medication_id);
    if (!sched || !med) return { success: false, message: 'Medicine schedule not found' };

    const newLog: AdherenceLog = {
      id: `log-${Date.now()}`,
      schedule_dose_id: scheduleId,
      patient_id: med.patient_id,
      medication_id: med.id,
      medication_name: med.name,
      alias_hero_name: med.alias_hero_name,
      scheduled_time: sched.scheduled_time,
      recorded_at: new Date().toISOString(),
      status: 'taken',
      safety_locked: true,
      notes: 'Successfully taken! Rhyme cheered and status locked.',
      logged_by_role: role
    };

    setAdherenceLogs(prev => [newLog, ...prev]);

    // Update hardware: Green LED, Success screen, rhyme speaker
    setHardwareState(prev => ({
      ...prev,
      ledStatus: 'taken_green',
      buzzerActive: false,
      screenMessage: `ALREADY TAKEN ✓`,
      screenSubtext: `Great job, little fighter!`,
      lastAction: `Taken: ${med.name} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }));

    // Unlock or award badges
    setBadges(prev =>
      prev.map(b => {
        if (!b.unlocked_at) {
          return { ...b, unlocked_at: new Date().toISOString() };
        }
        return b;
      })
    );

    return {
      success: true,
      message: 'Already Taken ✓'
    };
  };

  // Mark Dose as NOT TAKEN
  const markDoseNotTaken = (scheduleId: string, snoozeMinutes = 10) => {
    const sched = schedules.find(s => s.id === scheduleId);
    const med = medications.find(m => m.id === sched?.medication_id);
    if (!sched || !med) return;

    const newLog: AdherenceLog = {
      id: `log-${Date.now()}`,
      schedule_dose_id: scheduleId,
      patient_id: med.patient_id,
      medication_id: med.id,
      medication_name: med.name,
      alias_hero_name: med.alias_hero_name,
      scheduled_time: sched.scheduled_time,
      recorded_at: new Date().toISOString(),
      status: 'not_taken',
      safety_locked: false,
      notes: `Snoozed for ${snoozeMinutes} mins. Compassionate reminder active.`,
      logged_by_role: role
    };

    setAdherenceLogs(prev => [newLog, ...prev]);

    // Hardware status: Soft Blue LED, Gentle reminder screen
    setHardwareState(prev => ({
      ...prev,
      ledStatus: 'snooze_blue',
      buzzerActive: false,
      screenMessage: `WAITING WITH LOVE`,
      screenSubtext: `Take it when ready (Snoozed ${snoozeMinutes}m)`,
      lastAction: `Snoozed: ${med.name}`
    }));
  };

  // Snooze Reminder
  const snoozeReminder = (scheduleId: string, minutes: number) => {
    markDoseNotTaken(scheduleId, minutes);
    setActiveReminder(null);
  };

  // General Log Dose Action helper
  const logDoseAction = (
    scheduleId: string,
    status: any,
    reason?: string,
    notes?: string
  ) => {
    if (status === 'taken') {
      markDoseTaken(scheduleId);
    } else {
      markDoseNotTaken(scheduleId, 15);
    }
  };

  // Hardware Physical Buttons
  const pressHardwareTaken = () => {
    if (activeReminder) {
      markDoseTaken(activeReminder.schedule.id);
      setActiveReminder(null);
    } else {
      // Find the next pending schedule
      const patientMeds = medications.filter(m => m.patient_id === activePatient.id).map(m => m.id);
      const pendingSched = schedules.find(s => patientMeds.includes(s.medication_id) && !checkDoseSafety(s.id).isTaken);
      if (pendingSched) {
        markDoseTaken(pendingSched.id);
      }
    }
  };

  const pressHardwareNotTaken = () => {
    if (activeReminder) {
      markDoseNotTaken(activeReminder.schedule.id, 10);
      setActiveReminder(null);
    } else {
      setHardwareState(prev => ({
        ...prev,
        ledStatus: 'snooze_blue',
        screenMessage: 'SNOOZE ACTIVATED',
        screenSubtext: 'Gentle reminder set for +10 mins',
        lastAction: 'Hardware Snooze Pressed'
      }));
    }
  };

  const setHardwareVolume = (volume: number) => {
    setHardwareState(prev => ({ ...prev, volume }));
  };

  // Add Medicine Schedule (Caregiver Flow)
  const addMedicineSchedule = (
    childName: string,
    medName: string,
    time: string,
    dosage = '1 dose',
    form = 'liquid',
    instructions = 'Take as scheduled with water.',
    tipForKids?: string
  ) => {
    if (childName && childName.trim() !== activePatient.name) {
      updateChildName(childName);
    }

    const newMedId = `med-${Date.now()}`;
    const newMed: Medication = {
      id: newMedId,
      patient_id: activePatient.id,
      name: medName,
      alias_hero_name: `${medName} Courage Potion`,
      dosage: dosage || '1 dose',
      form: (form || 'liquid') as MedicationForm,
      instructions: instructions || 'Take with love and care.',
      critical_level: 'important',
      visual_theme_card: 'shield_potion',
      color_badge: '#14b8a6',
      tip_for_adamant_kids: tipForKids || 'Take one sip with Pip the mascot!'
    };

    const newSched: ScheduleDose = {
      id: `sched-${Date.now()}`,
      medication_id: newMedId,
      scheduled_time: time,
      days_of_week: [0, 1, 2, 3, 4, 5, 6],
      is_active: true
    };

    setMedications(prev => [...prev, newMed]);
    setSchedules(prev => [...prev, newSched]);
  };

  // Doctor updates patient note
  const updateDoctorNote = (patientId: string, message: string) => {
    setDoctorConnections(prev =>
      prev.map(conn =>
        conn.patient_id === patientId
          ? { ...conn, doctor_message: message, last_review_date: 'Just now' }
          : conn
      )
    );
  };

  // Calculations for active child
  const patientMedIds = medications
    .filter(m => m.patient_id === activePatient.id)
    .map(m => m.id);

  const activePatientSchedules = schedules.filter(s =>
    patientMedIds.includes(s.medication_id)
  );

  const todayCompletedCount = activePatientSchedules.filter(s => checkDoseSafety(s.id).isTaken).length;
  const todayTotalCount = activePatientSchedules.length;
  const todayProgressText = `Today’s Medicines: ${todayCompletedCount}/${todayTotalCount} Completed`;

  const currentStreakDays = todayCompletedCount > 0 ? Math.min(todayCompletedCount + 4, 14) : 1;
  const adherenceRate = todayTotalCount > 0 ? Math.round((todayCompletedCount / todayTotalCount) * 100) : 100;

  const resetToDefaults = () => {
    setPatients(INITIAL_PATIENTS);
    setMedications(INITIAL_MEDICATIONS);
    setSchedules(INITIAL_SCHEDULES);
    setAdherenceLogs(INITIAL_LOGS);
    setBadges(INITIAL_BADGES);
    setActiveReminder(null);
    setHardwareState({
      isConnected: true,
      ledStatus: 'idle',
      buzzerActive: false,
      screenMessage: 'MEDINOTIFY ONLINE',
      screenSubtext: 'Small reminders. Big courage.',
      batteryLevel: 98,
      lastAction: 'Reset to Factory Demo',
      volume: 85
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activePatientId,
        setActivePatientId,
        patients,
        activePatient,
        updateChildName,
        medications,
        schedules,
        adherenceLogs,
        badges,
        doctorConnections,
        updateDoctorNote,
        activeReminder,
        setActiveReminder,
        triggerReminderModal,
        markDoseTaken,
        markDoseNotTaken,
        snoozeReminder,
        checkDoseSafety,
        logDoseAction,
        addMedicineSchedule,
        hardwareState,
        pressHardwareTaken,
        pressHardwareNotTaken,
        setHardwareVolume,
        todayCompletedCount,
        todayTotalCount,
        todayProgressText,
        currentStreakDays,
        adherenceRate,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
