'use client';

export interface RhymeItem {
  id: string;
  title: string;
  lines: string[];
  tone: 'celebratory' | 'gentle_encouragement';
  highlight?: string;
}

// At least 5 short original motivational rhymes for TAKEN
export const TAKEN_MOTIVATIONAL_RHYMES: RhymeItem[] = [
  {
    id: 'rhyme-clap-tap-1',
    title: 'Clap & Tap Champion',
    lines: [
      "Clap your hands and tap your feet,",
      "You are strong and you are sweet!",
      "One small step, one happy day,",
      "Keep smiling as you find your way!"
    ],
    tone: 'celebratory',
    highlight: 'One small step, one happy day!'
  },
  {
    id: 'rhyme-medicine-time-2',
    title: 'Medicine Time Cheer',
    lines: [
      "Medicine time, medicine time,",
      "Take it well, you’ll feel just fine!",
      "One small step, one little cheer,",
      "You are strong, your courage is here!"
    ],
    tone: 'celebratory',
    highlight: 'You are strong, your courage is here!'
  },
  {
    id: 'rhyme-courage-starts-3',
    title: 'Courage Starts Here',
    lines: [
      "Take your medicine, take your cheer,",
      "A little courage starts right here!",
      "Big bright smile from ear to ear,",
      "Healthy, sunny days are near!"
    ],
    tone: 'celebratory',
    highlight: 'A little courage starts right here!'
  },
  {
    id: 'rhyme-brand-new-4',
    title: 'Brand-New Start',
    lines: [
      "Tiny steps and a brave heart,",
      "Every day is a brand-new start!",
      "Shining bright like stars above,",
      "Taking care with lots of love!"
    ],
    tone: 'celebratory',
    highlight: 'Tiny steps and a brave heart!'
  },
  {
    id: 'rhyme-stronger-5',
    title: 'Stronger Every Day',
    lines: [
      "Take your medicine, smile and say,",
      "I’m getting stronger every day!",
      "Hero cape and superhero might,",
      "You are brave in every fight!"
    ],
    tone: 'celebratory',
    highlight: 'I’m getting stronger every day!'
  },
  {
    id: 'rhyme-dawn-to-dawn-6',
    title: 'Dawn to Dawn',
    lines: [
      "Be brave, be bright, keep moving on,",
      "You’re stronger than you think from dawn to dawn!",
      "With gentle courage shining through,",
      "We are so very proud of you!"
    ],
    tone: 'celebratory',
    highlight: 'You’re stronger than you think!'
  },
  {
    id: 'rhyme-super-fighter-7',
    title: 'Super Little Fighter',
    lines: [
      "Down the hatch, brave Little Star!",
      "You are the strongest kid by far!",
      "Super power in every drop,",
      "Our little fighter will never stop!"
    ],
    tone: 'celebratory',
    highlight: 'Our little fighter will never stop!'
  }
];

// Gentle motivational rhymes for NOT TAKEN (Gently concerned, comforting, NOT scary)
export const NOT_TAKEN_GENTLE_RHYMES: RhymeItem[] = [
  {
    id: 'rhyme-not-taken-1',
    title: 'Step by Step Encouragement',
    lines: [
      "Don’t give up, you’re doing great,",
      "Take your medicine when it’s time, don’t wait!",
      "Step by step and day by day,",
      "You are getting stronger every day!"
    ],
    tone: 'gentle_encouragement',
    highlight: 'You are getting stronger every day!'
  },
  {
    id: 'rhyme-not-taken-2',
    title: 'Waiting with Love',
    lines: [
      "Your medicine is waiting near,",
      "Take a deep breath, have no fear!",
      "Whenever you're ready, take your time,",
      "We'll sing along to another happy rhyme!"
    ],
    tone: 'gentle_encouragement',
    highlight: 'Whenever you are ready, take your time!'
  }
];

// Aliases for legacy component compatibility
export const CELEBRATORY_RHYMES = TAKEN_MOTIVATIONAL_RHYMES;
export const SAD_EMPATHETIC_PLEAS = NOT_TAKEN_GENTLE_RHYMES;

// Helper to get a random celebratory rhyme
export function getRandomTakenRhyme(): RhymeItem {
  const index = Math.floor(Math.random() * TAKEN_MOTIVATIONAL_RHYMES.length);
  return TAKEN_MOTIVATIONAL_RHYMES[index];
}

// Web Audio API Synthesizer (Zero external audio files needed - 100% offline & reliable)
export function playChimeSound(type: 'success' | 'gentle_sad' | 'sad' | 'alert_reminder' | 'alert' | 'hardware_buzzer') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    if (type === 'success') {
      // Cheerful fanfare arpeggio (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.01, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.45);
      });
    } else if (type === 'gentle_sad' || type === 'sad') {
      // Soft, warm, calming descending chime (G4 -> F4 -> E4) - gentle, not scary!
      const notes = [392.00, 349.23, 329.63];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.22);

        gain.gain.setValueAtTime(0.01, ctx.currentTime + idx * 0.22);
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.22 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.22 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.22);
        osc.stop(ctx.currentTime + idx * 0.22 + 0.55);
      });
    } else if (type === 'alert_reminder' || type === 'alert') {
      // Gentle, friendly reminder chime: "Ding-Dong-Ding!"
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);

        gain.gain.setValueAtTime(0.01, ctx.currentTime + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + idx * 0.18 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.18 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.18);
        osc.stop(ctx.currentTime + idx * 0.18 + 0.5);
      });
    } else if (type === 'hardware_buzzer') {
      // Distinctive IoT hardware piezoelectric double-beep
      [880, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.18);

        gain.gain.setValueAtTime(0.01, ctx.currentTime + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + idx * 0.18 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.18 + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.18);
        osc.stop(ctx.currentTime + idx * 0.18 + 0.14);
      });
    }
  } catch (e) {
    console.warn('AudioContext playback error', e);
  }
}

// Browser Speech Synthesis for reading rhymes warmly to the child
export function speakText(
  text: string,
  options?: { pitch?: number; rate?: number; onEnd?: () => void }
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = options?.pitch ?? 1.25;
    utterance.rate = options?.rate ?? 0.95;

    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(
      v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Victoria'))
    );
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    if (options?.onEnd) {
      utterance.onend = options.onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('SpeechSynthesis error', e);
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Ignore
    }
  }
}
