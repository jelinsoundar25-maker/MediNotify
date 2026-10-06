export type UserRole = 'parent' | 'doctor' | 'elderly' | 'admin';

export type PatientType = 'child' | 'elderly';

export type MedicationForm = 'liquid' | 'tablet' | 'chewable' | 'injection' | 'drops' | 'powder';

export type CriticalLevel = 'routine' | 'important' | 'critical_chemo';

export type DoseStatus = 'pending' | 'taken' | 'not_taken' | 'snoozed';

export type MascotEmotion = 'idle' | 'happy' | 'dancing' | 'celebrating' | 'clapping' | 'waving' | 'bouncing' | 'concerned' | 'sad_crying' | 'encouraging';

export interface Patient {
  id: string;
  caregiver_id: string;
  name: string;
  patient_type: PatientType;
  birth_date?: string;
  avatar_mascot: 'pip_dino' | 'kiki_fox' | 'leo_lion' | 'senior_sage';
  diagnosis_notes?: string;
  hero_title?: string;
  favorite_theme?: string;
  preferences?: {
    sound_enabled: boolean;
    speech_rate: number;
    rhyme_style: 'cheerful' | 'heroic' | 'calm';
    high_contrast: boolean;
  };
}

export interface Medication {
  id: string;
  patient_id: string;
  prescribed_by_doctor_id?: string;
  doctor_name?: string;
  name: string;
  alias_hero_name?: string;
  dosage: string; // e.g. "4 ml", "1 tablet"
  form: MedicationForm;
  instructions: string;
  critical_level: CriticalLevel;
  visual_theme_card: 'shield_potion' | 'star_elixir' | 'rocket_fuel' | 'heart_crystal' | 'clarity_mint';
  color_badge: string;
  side_effects_note?: string;
  tip_for_adamant_kids?: string;
}

export interface ScheduleDose {
  id: string;
  medication_id: string;
  medication?: Medication;
  scheduled_time: string; // "08:00 AM", "13:00" etc.
  days_of_week: number[];
  is_active: boolean;
}

export interface AdherenceLog {
  id: string;
  schedule_dose_id: string;
  patient_id: string;
  medication_id: string;
  medication_name: string;
  alias_hero_name?: string;
  scheduled_time: string;
  recorded_at: string; // ISO date string
  status: DoseStatus;
  safety_locked: boolean; // Safety Feature: prevents duplicate taking
  notes?: string;
  logged_by_role: UserRole;
}

export interface RewardBadge {
  id: string;
  patient_id: string;
  badge_name: string;
  badge_icon: string;
  points: number;
  description: string;
  unlocked_at?: string;
}

export interface DoctorPatientConnection {
  id: string;
  doctor_id: string;
  doctor_name: string;
  specialty: string;
  hospital_clinic: string;
  patient_id: string;
  patient_name: string;
  adherence_rate_pct: number;
  last_review_date: string;
  doctor_message?: string;
}

export interface HardwareDeviceState {
  isConnected: boolean;
  ledStatus: 'idle' | 'alert_pulsing' | 'taken_green' | 'snooze_blue';
  buzzerActive: boolean;
  screenMessage: string;
  screenSubtext: string;
  batteryLevel: number;
  lastAction?: string;
  volume: number;
}
