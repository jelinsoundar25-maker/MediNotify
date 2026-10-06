-- ==========================================================
-- MEDIHERO DATABASE SCHEMA & ROW LEVEL SECURITY POLICIES
-- PostgreSQL / Supabase
-- ==========================================================

-- 1. PROFILES TABLE (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('parent', 'doctor', 'elderly', 'admin')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  patient_type TEXT NOT NULL CHECK (patient_type IN ('child', 'elderly')),
  birth_date DATE,
  avatar_mascot TEXT DEFAULT 'pip_dino',
  hero_title TEXT DEFAULT 'Brave Champion',
  diagnosis_notes TEXT,
  preferences JSONB DEFAULT '{"sound_enabled": true, "speech_rate": 0.95, "rhyme_style": "cheerful", "high_contrast": false}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MEDICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  prescribed_by_doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  doctor_name TEXT,
  name TEXT NOT NULL,
  alias_hero_name TEXT, -- e.g. "Star Shield Power Drop"
  dosage TEXT NOT NULL, -- e.g. "4 ml" or "1 tablet"
  form TEXT NOT NULL CHECK (form IN ('liquid', 'tablet', 'chewable', 'injection', 'drops', 'powder')),
  instructions TEXT NOT NULL,
  critical_level TEXT NOT NULL DEFAULT 'routine' CHECK (critical_level IN ('routine', 'important', 'critical_chemo')),
  visual_theme_card TEXT NOT NULL DEFAULT 'shield_potion',
  color_badge TEXT DEFAULT '#0d9488',
  tip_for_adamant_kids TEXT,
  side_effects_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SCHEDULE_DOSES TABLE
CREATE TABLE IF NOT EXISTS public.schedule_doses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
  scheduled_time TIME NOT NULL, -- e.g. '08:30:00'
  days_of_week INTEGER[] DEFAULT ARRAY[0,1,2,3,4,5,6],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ADHERENCE_LOGS TABLE
CREATE TABLE IF NOT EXISTS public.adherence_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_dose_id UUID REFERENCES public.schedule_doses(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
  medication_name TEXT NOT NULL,
  alias_hero_name TEXT,
  scheduled_for TIMESTAMPTZ NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('taken', 'missed', 'delayed', 'skipped')),
  reason TEXT,
  logged_by_role TEXT NOT NULL CHECK (logged_by_role IN ('parent', 'doctor', 'elderly', 'admin')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REWARD_BADGES TABLE
CREATE TABLE IF NOT EXISTS public.reward_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  badge_name TEXT NOT NULL,
  badge_icon TEXT NOT NULL,
  points INTEGER DEFAULT 50,
  description TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DOCTOR_PATIENT_CONNECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.doctor_patient_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  doctor_name TEXT NOT NULL,
  specialty TEXT,
  hospital_clinic TEXT,
  doctor_message TEXT,
  last_review_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (doctor_id, patient_id)
);

-- ==========================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_patients_caregiver ON public.patients(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_medications_patient ON public.medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_schedules_medication ON public.schedule_doses(medication_id);
CREATE INDEX IF NOT EXISTS idx_adherence_patient ON public.adherence_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_adherence_scheduled_for ON public.adherence_logs(scheduled_for);

-- ==========================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_doses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adherence_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_patient_connections ENABLE ROW LEVEL SECURITY;

-- ==========================================================
-- RLS POLICIES
-- ==========================================================

-- PROFILES: Users can view and update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- PATIENTS: Caregivers can CRUD their own patients; Connected doctors can view
CREATE POLICY "Caregiver can manage patients"
  ON public.patients FOR ALL
  USING (auth.uid() = caregiver_id);

CREATE POLICY "Connected doctor can view patients"
  ON public.patients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.doctor_patient_connections
      WHERE doctor_patient_connections.patient_id = patients.id
      AND doctor_patient_connections.doctor_id = auth.uid()
    )
  );

-- MEDICATIONS: Caregivers manage; Doctors can insert/update prescriptions
CREATE POLICY "Caregiver manages medications"
  ON public.medications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = medications.patient_id
      AND patients.caregiver_id = auth.uid()
    )
  );

CREATE POLICY "Doctor manages connected medications"
  ON public.medications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.doctor_patient_connections
      WHERE doctor_patient_connections.patient_id = medications.patient_id
      AND doctor_patient_connections.doctor_id = auth.uid()
    )
  );

-- ADHERENCE LOGS: Caregivers and Doctors can view and record logs
CREATE POLICY "Caregivers manage adherence logs"
  ON public.adherence_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.patients
      WHERE patients.id = adherence_logs.patient_id
      AND patients.caregiver_id = auth.uid()
    )
  );

CREATE POLICY "Doctors view patient adherence logs"
  ON public.adherence_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.doctor_patient_connections
      WHERE doctor_patient_connections.patient_id = adherence_logs.patient_id
      AND doctor_patient_connections.doctor_id = auth.uid()
    )
  );
