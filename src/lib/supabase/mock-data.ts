import { Patient, Medication, ScheduleDose, AdherenceLog, RewardBadge, DoctorPatientConnection } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-leo-001',
    caregiver_id: 'user-parent-sarah',
    name: 'Leo',
    patient_type: 'child',
    birth_date: '2019-04-12',
    avatar_mascot: 'pip_dino',
    hero_title: 'Little Fighter Leo',
    diagnosis_notes: 'Pediatric Oncology Maintenance Protocol. Sensitive to strong tastes; thrives with gentle reminders and rhymes.',
    favorite_theme: 'shield_potion',
    preferences: {
      sound_enabled: true,
      speech_rate: 0.95,
      rhyme_style: 'heroic',
      high_contrast: false
    }
  },
  {
    id: 'pat-maya-002',
    caregiver_id: 'user-parent-sarah',
    name: 'Maya',
    patient_type: 'child',
    birth_date: '2020-08-15',
    avatar_mascot: 'kiki_fox',
    hero_title: 'Brave Spark Maya',
    diagnosis_notes: 'Pediatric Care Plan. Enjoys star stickers and mascot animations.',
    favorite_theme: 'star_elixir',
    preferences: {
      sound_enabled: true,
      speech_rate: 0.95,
      rhyme_style: 'cheerful',
      high_contrast: false
    }
  }
];

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med-a',
    patient_id: 'pat-leo-001',
    name: 'Medicine A (Ondansetron)',
    alias_hero_name: 'Tummy Shield Syrup',
    dosage: '4 ml',
    form: 'liquid',
    instructions: 'Take in the morning with a small sip of water or juice.',
    critical_level: 'important',
    visual_theme_card: 'shield_potion',
    color_badge: '#14b8a6',
    tip_for_adamant_kids: 'Chilled syrup tastes milder and goes down easy!'
  },
  {
    id: 'med-b',
    patient_id: 'pat-leo-001',
    name: 'Medicine B (Multivitamin Booster)',
    alias_hero_name: 'Superpower Bear Chewable',
    dosage: '1 gummy bear',
    form: 'chewable',
    instructions: 'Chew well after lunch with a warm smile.',
    critical_level: 'routine',
    visual_theme_card: 'star_elixir',
    color_badge: '#f59e0b',
    tip_for_adamant_kids: 'Tasty fruit flavor that gives superhero energy!'
  },
  {
    id: 'med-c',
    patient_id: 'pat-leo-001',
    name: 'Medicine C (Antibiotic Drops)',
    alias_hero_name: 'Golden Defense Drops',
    dosage: '5 drops',
    form: 'drops',
    instructions: 'Mix with one spoon of applesauce or fruit puree.',
    critical_level: 'important',
    visual_theme_card: 'rocket_fuel',
    color_badge: '#0284c7',
    tip_for_adamant_kids: 'Use a colorful bendy straw for fun sips!'
  },
  {
    id: 'med-d',
    patient_id: 'pat-leo-001',
    name: 'Medicine D (Chemo Maintenance 6-MP)',
    alias_hero_name: 'Courage Night Spark',
    dosage: '1 tiny tablet',
    form: 'tablet',
    instructions: 'Take at bedtime on an empty stomach (no dairy).',
    critical_level: 'critical_chemo',
    visual_theme_card: 'heart_crystal',
    color_badge: '#e11d48',
    tip_for_adamant_kids: 'Swallow with cold berry smoothie and high-five Pip!'
  }
];

export const INITIAL_SCHEDULES: ScheduleDose[] = [
  {
    id: 'sched-1',
    medication_id: 'med-a',
    scheduled_time: '08:00 AM',
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    is_active: true
  },
  {
    id: 'sched-2',
    medication_id: 'med-b',
    scheduled_time: '01:00 PM',
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    is_active: true
  },
  {
    id: 'sched-3',
    medication_id: 'med-c',
    scheduled_time: '06:00 PM',
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    is_active: true
  },
  {
    id: 'sched-4',
    medication_id: 'med-d',
    scheduled_time: '09:00 PM',
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    is_active: true
  }
];

// Initial logs representing today's state matching prompt:
// ✓ 8:00 AM - Medicine A - Taken
// ✓ 1:00 PM - Medicine B - Taken
// ⏰ 6:00 PM - Medicine C - Upcoming (pending)
// ⚠ 9:00 PM - Medicine D - Not Taken (or pending)
const todayStr = new Date().toISOString().split('T')[0];

export const INITIAL_LOGS: AdherenceLog[] = [
  {
    id: 'log-1',
    schedule_dose_id: 'sched-1',
    patient_id: 'pat-leo-001',
    medication_id: 'med-a',
    medication_name: 'Medicine A (Ondansetron)',
    alias_hero_name: 'Tummy Shield Syrup',
    scheduled_time: '08:00 AM',
    recorded_at: `${todayStr}T08:02:15.000Z`,
    status: 'taken',
    safety_locked: true,
    notes: 'Taken happily with morning rhyme! Courage stars awarded.',
    logged_by_role: 'parent'
  },
  {
    id: 'log-2',
    schedule_dose_id: 'sched-2',
    patient_id: 'pat-leo-001',
    medication_id: 'med-b',
    medication_name: 'Medicine B (Multivitamin Booster)',
    alias_hero_name: 'Superpower Bear Chewable',
    scheduled_time: '01:00 PM',
    recorded_at: `${todayStr}T13:05:40.000Z`,
    status: 'taken',
    safety_locked: true,
    notes: 'Chewed well with lunch. Already Taken verified.',
    logged_by_role: 'parent'
  }
];

export const INITIAL_BADGES: RewardBadge[] = [
  {
    id: 'badge-1',
    patient_id: 'pat-leo-001',
    badge_name: 'Little Fighter Shield',
    badge_icon: 'shield',
    points: 150,
    description: 'Took scheduled medicines bravely!',
    unlocked_at: `${todayStr}T08:03:00.000Z`
  },
  {
    id: 'badge-2',
    patient_id: 'pat-leo-001',
    badge_name: 'Rhyme Master Cheer',
    badge_icon: 'music',
    points: 200,
    description: 'Sang the motivational rhyme together with Pip!',
    unlocked_at: `${todayStr}T13:06:00.000Z`
  },
  {
    id: 'badge-3',
    patient_id: 'pat-leo-001',
    badge_name: 'Courage Star Champion',
    badge_icon: 'star',
    points: 500,
    description: 'Completed daily medicines on time with a brave smile!',
    unlocked_at: undefined
  }
];

export const INITIAL_DOCTOR_CONNECTIONS: DoctorPatientConnection[] = [
  {
    id: 'conn-01',
    doctor_id: 'doc-chen-01',
    doctor_name: 'Dr. Sarah Chen, MD',
    specialty: 'Pediatric Oncology',
    hospital_clinic: 'Children’s Hope Oncology Center',
    patient_id: 'pat-leo-001',
    patient_name: 'Leo',
    adherence_rate_pct: 95,
    last_review_date: 'Today, 10:30 AM',
    doctor_message: 'Leo is demonstrating amazing resilience! Consistent timing with Medicine D ensures optimal maintenance recovery. Proud of our little fighter!'
  }
];
