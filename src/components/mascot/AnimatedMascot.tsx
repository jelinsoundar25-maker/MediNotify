'use client';

import React from 'react';
import { MascotEmotion } from '@/lib/types';

interface AnimatedMascotProps {
  emotion: MascotEmotion;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  onTap?: () => void;
  showSpeechBubble?: string;
}

export const AnimatedMascot: React.FC<AnimatedMascotProps> = ({
  emotion,
  size = 'lg',
  className = '',
  onTap,
  showSpeechBubble
}) => {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-64 h-64',
    hero: 'w-80 h-80'
  };

  const isDancing = emotion === 'dancing' || emotion === 'celebrating';
  const isClapping = emotion === 'clapping';
  const isWaving = emotion === 'waving';
  const isBouncing = emotion === 'bouncing';
  const isConcerned = emotion === 'concerned' || emotion === 'sad_crying';

  // Animation class selector
  const getAnimationClass = () => {
    if (isDancing) return 'animate-mascot-dance cursor-pointer';
    if (isClapping) return 'animate-mascot-clap cursor-pointer';
    if (isWaving) return 'animate-mascot-wave cursor-pointer';
    if (isBouncing) return 'animate-mascot-bounce cursor-pointer';
    if (isConcerned) return 'animate-mascot-concerned';
    return 'animate-mascot-idle';
  };

  return (
    <div
      onClick={onTap}
      className={`relative select-none flex items-center justify-center transition-all duration-300 ${sizeMap[size]} ${className} ${getAnimationClass()}`}
      role="img"
      aria-label={`Pip the Mascot feeling ${emotion}`}
      title={onTap ? "Tap me to see a happy dance, wave or clap!" : undefined}
    >
      {/* Speech Bubble if passed */}
      {showSpeechBubble && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3.5 py-1.5 rounded-2xl border-2 border-amber-300 shadow-lg text-xs font-black text-amber-950 whitespace-nowrap z-20 animate-bounce">
          <span>{showSpeechBubble}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-amber-300 rotate-45" />
        </div>
      )}

      {/* 3D Radial Glow / Aura */}
      <div
        className={`absolute inset-4 rounded-full blur-2xl opacity-40 transition-all duration-500 pointer-events-none ${
          isDancing
            ? 'bg-amber-400 scale-125 opacity-70'
            : isConcerned
            ? 'bg-sky-400 scale-95 opacity-50'
            : isClapping || isWaving || isBouncing
            ? 'bg-emerald-400 scale-110 opacity-60'
            : 'bg-teal-400 scale-100 opacity-40'
        }`}
      />

      {/* Main SVG Mascot Character: Pip the Courage Star-Hero */}
      <svg
        viewBox="0 0 240 240"
        className="w-full h-full drop-shadow-xl overflow-visible transition-transform duration-300"
      >
        <defs>
          {/* Main Body Gradients */}
          <radialGradient id="mascotBodyGrad" cx="40%" cy="35%" r="65%">
            <stop
              offset="0%"
              stopColor={
                isConcerned
                  ? '#a7f3d0'
                  : isDancing
                  ? '#34d399'
                  : '#2dd4bf'
              }
            />
            <stop
              offset="70%"
              stopColor={
                isConcerned
                  ? '#10b981'
                  : isDancing
                  ? '#059669'
                  : '#0d9488'
              }
            />
            <stop
              offset="100%"
              stopColor={
                isConcerned
                  ? '#047857'
                  : isDancing
                  ? '#047857'
                  : '#115e59'
              }
            />
          </radialGradient>

          {/* Warm Belly Gradient */}
          <radialGradient id="mascotBellyGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="80%" stopColor={isConcerned ? '#e0f2fe' : '#fef08a'} />
          </radialGradient>

          {/* Rosy Cheeks */}
          <radialGradient id="mascotCheekBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </radialGradient>

          {/* Soft Glow Filter */}
          <filter id="pipSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* CUTE SOFT SPARKLE HORNS / CREST (Original Character Silhouette) */}
        <path
          d="M 94 36 Q 98 14 108 28 Q 105 38 94 36 Z"
          fill="#f59e0b"
          className="transition-colors duration-300"
        />
        <path
          d="M 116 30 Q 120 8 128 24 Q 124 34 116 30 Z"
          fill="#f59e0b"
          className="transition-colors duration-300"
        />
        <path
          d="M 136 36 Q 142 14 148 28 Q 142 38 136 36 Z"
          fill="#f59e0b"
          className="transition-colors duration-300"
        />

        {/* SUPERHERO COURAGE CAPE (Flapping on dancing / waving) */}
        <path
          d={
            isDancing
              ? "M 48 110 Q 8 130 28 185 Q 70 160 76 138 Z"
              : isWaving
              ? "M 48 112 Q 18 135 34 180 Q 70 158 76 138 Z"
              : isConcerned
              ? "M 52 118 Q 35 155 45 180 Q 72 155 75 140 Z"
              : "M 52 115 Q 22 140 38 178 Q 72 155 75 140 Z"
          }
          fill="#f43f5e"
          className="transition-all duration-300"
        />
        <path
          d={
            isDancing
              ? "M 192 110 Q 232 130 212 185 Q 170 160 164 138 Z"
              : isWaving
              ? "M 192 112 Q 225 135 208 180 Q 170 158 164 138 Z"
              : isConcerned
              ? "M 188 118 Q 205 155 195 180 Q 168 155 165 140 Z"
              : "M 188 115 Q 218 140 202 178 Q 168 155 165 140 Z"
          }
          fill="#f43f5e"
          className="transition-all duration-300"
        />

        {/* MAIN ROUNDED BODY */}
        <ellipse
          cx="120"
          cy="128"
          rx="68"
          ry="72"
          fill="url(#mascotBodyGrad)"
          className="transition-all duration-300"
        />

        {/* CUTE WARM TUMMY PATCH */}
        <ellipse
          cx="120"
          cy="144"
          rx="44"
          ry="46"
          fill="url(#mascotBellyGrad)"
          className="transition-all duration-300"
        />

        {/* TUMMY EMBLEM: GLOWING COURAGE STAR OR TENDER HEART */}
        {isConcerned ? (
          // Tender caring heart on tummy when concerned (Warm & loving, NOT sad)
          <g transform="translate(120, 142) scale(0.95)">
            <path
              d="M 0,3 C -10,-12 -22,2 -8,14 L 0,22 L 8,14 C 22,2 10,-12 0,3 Z"
              fill="#fb7185"
            />
          </g>
        ) : (
          // Sparkling golden courage star on tummy
          <g transform="translate(120, 142) scale(1.15)">
            <polygon
              points="0,-16 4.5,-5 16,-4 7,4 10,15 0,9 -10,15 -7,4 -16,-4 -4.5,-5"
              fill="#f59e0b"
            />
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
          </g>
        )}

        {/* ROSY BLUSH CHEEKS */}
        <circle cx="86" cy="126" r="13" fill="url(#mascotCheekBlush)" />
        <circle cx="154" cy="126" r="13" fill="url(#mascotCheekBlush)" />

        {/* FLOATING MUSIC NOTES OR SPARKLES WHEN DANCING */}
        {isDancing && (
          <g className="animate-bounce">
            <text x="50" y="80" fontSize="18" fill="#f59e0b" fontWeight="bold">♪</text>
            <text x="175" y="75" fontSize="20" fill="#ec4899" fontWeight="bold">♫</text>
            <polygon points="90,65 92,70 97,71 93,75 94,80 90,77 86,80 87,75 83,71 88,70" fill="#f59e0b" />
            <polygon points="150,65 152,70 157,71 153,75 154,80 150,77 146,80 147,75 143,71 148,70" fill="#f59e0b" />
          </g>
        )}

        {/* EYES SECTION */}
        {isDancing ? (
          // Joyful closed laughing arcs with star sparkles
          <g fill="#0f172a">
            <path
              d="M 82 108 Q 94 90 106 108"
              fill="none"
              stroke="#0f172a"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 134 108 Q 146 90 158 108"
              fill="none"
              stroke="#0f172a"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        ) : isConcerned ? (
          // Gently concerned, caring, warm round eyes (NO scary tears!)
          <g>
            {/* Gentle reassuring brows */}
            <path d="M 82 95 Q 94 92 104 96" fill="none" stroke="#065f46" strokeWidth="3" strokeLinecap="round" />
            <path d="M 158 95 Q 146 92 136 96" fill="none" stroke="#065f46" strokeWidth="3" strokeLinecap="round" />

            {/* Big round, gentle caring glossy eyes */}
            <ellipse cx="94" cy="107" rx="12" ry="14" fill="#0f172a" />
            <circle cx="91" cy="103" r="5" fill="#ffffff" />
            <circle cx="97" cy="112" r="2.5" fill="#ffffff" />

            <ellipse cx="146" cy="107" rx="12" ry="14" fill="#0f172a" />
            <circle cx="143" cy="103" r="5" fill="#ffffff" />
            <circle cx="149" cy="112" r="2.5" fill="#ffffff" />
          </g>
        ) : (
          // Cheerful open friendly eyes
          <g>
            <ellipse cx="94" cy="106" rx="12" ry="14" fill="#0f172a" />
            <circle cx="91" cy="101" r="5" fill="#ffffff" />
            <circle cx="97" cy="111" r="2.5" fill="#ffffff" />

            <ellipse cx="146" cy="106" rx="12" ry="14" fill="#0f172a" />
            <circle cx="143" cy="101" r="5" fill="#ffffff" />
            <circle cx="149" cy="111" r="2.5" fill="#ffffff" />
          </g>
        )}

        {/* MOUTH SECTION */}
        {isDancing ? (
          // Big joyful singing / grinning open mouth with cute tooth
          <g>
            <path
              d="M 104 122 Q 120 145 136 122 Z"
              fill="#be123c"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            <rect x="116" y="122" width="8" height="5" rx="2" fill="#ffffff" />
            <path d="M 112 133 Q 120 141 128 133 Z" fill="#fb7185" />
          </g>
        ) : isConcerned ? (
          // Sweet, reassuring gentle small smile (friendly & encouraging, NOT scary)
          <path
            d="M 110 124 Q 120 131 130 124"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ) : (
          // Warm happy grin
          <path
            d="M 106 122 Q 120 136 134 122"
            fill="none"
            stroke="#0f172a"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}

        {/* PAWS / ARMS ANIMATIONS */}
        {isDancing ? (
          // Paws raised high in celebration and dancing!
          <g>
            <path
              d="M 68 124 Q 45 90 52 80 Q 64 80 78 108"
              fill="url(#mascotBodyGrad)"
              stroke="#047857"
              strokeWidth="2"
            />
            <path
              d="M 172 124 Q 195 90 188 80 Q 176 80 162 108"
              fill="url(#mascotBodyGrad)"
              stroke="#047857"
              strokeWidth="2"
            />
          </g>
        ) : isClapping ? (
          // Paws in front of chest clapping together!
          <g>
            <path
              d="M 68 132 Q 100 138 114 135"
              fill="none"
              stroke="#0f766e"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M 172 132 Q 140 138 126 135"
              fill="none"
              stroke="#0f766e"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <circle cx="120" cy="135" r="5" fill="#f59e0b" className="animate-ping" />
          </g>
        ) : isWaving ? (
          // Right paw raised and waving happily!
          <g>
            {/* Left resting paw */}
            <path
              d="M 68 132 Q 55 125 58 140"
              fill="none"
              stroke="#0f766e"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Right waving paw */}
            <path
              d="M 172 128 Q 198 100 200 82"
              fill="none"
              stroke="#0f766e"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <circle cx="200" cy="82" r="7" fill="url(#mascotBodyGrad)" />
          </g>
        ) : isConcerned ? (
          // Paws gently folded near heart (comforting, caring hug posture)
          <g>
            <path
              d="M 68 134 Q 95 142 110 138"
              fill="none"
              stroke="#0f766e"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 172 134 Q 145 142 130 138"
              fill="none"
              stroke="#0f766e"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </g>
        ) : (
          // Gentle resting friendly paws
          <g>
            <path
              d="M 68 132 Q 55 125 58 140"
              fill="none"
              stroke="#0f766e"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d="M 172 132 Q 192 116 188 106"
              fill="none"
              stroke="#0f766e"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
