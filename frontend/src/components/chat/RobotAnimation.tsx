/**
 * RobotAnimation.tsx
 * Looping waving-robot SVG animation.
 * Only the right arm/hand moves — head, torso, legs remain static.
 * Designed to sit inside the 56 × 56 px floating chat button.
 */

import React from "react";

interface RobotAnimationProps {
  /** Pixel size of the bounding box (default 48 to fit inside the 56px button) */
  size?: number;
  className?: string;
}

const RobotAnimation: React.FC<RobotAnimationProps> = ({ size = 48, className = "" }) => {
  const id = "robot-wave"; // stable prefix for filter / gradient ids

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 220"
      width={size}
      height={size}
      className={className}
      aria-label="Waving robot chatbot icon"
      role="img"
      style={{ overflow: "visible" }}
    >
      {/* ── CSS keyframe animations ─────────────────────────────────────────── */}
      <style>{`
        @keyframes ${id}-arm-wave {
          0%   { transform: rotate(0deg);    }
          20%  { transform: rotate(-28deg);  }
          40%  { transform: rotate(8deg);    }
          60%  { transform: rotate(-24deg);  }
          80%  { transform: rotate(6deg);    }
          100% { transform: rotate(0deg);    }
        }
        @keyframes ${id}-antenna-pulse {
          0%, 100% { opacity: 1;   r: 4; }
          50%       { opacity: 0.5; r: 5; }
        }
        @keyframes ${id}-eye-blink {
          0%, 90%, 100% { transform: scaleY(1);   }
          95%           { transform: scaleY(0.08); }
        }
        @keyframes ${id}-screen-glow {
          0%, 100% { opacity: 0.75; }
          50%       { opacity: 1;   }
        }

        .${id}-arm-group {
          transform-origin: 138px 108px;   /* shoulder pivot */
          animation: ${id}-arm-wave 2.4s ease-in-out infinite;
        }
        .${id}-eye-left  { animation: ${id}-eye-blink 4s ease-in-out infinite 0.3s; transform-origin: 82px 85px; }
        .${id}-eye-right { animation: ${id}-eye-blink 4s ease-in-out infinite 0.3s; transform-origin: 110px 85px; }
        .${id}-antenna-dot { animation: ${id}-antenna-pulse 2.4s ease-in-out infinite; }
        .${id}-screen-text { animation: ${id}-screen-glow 2.4s ease-in-out infinite; }
      `}</style>

      {/* ── Defs ───────────────────────────────────────────────────────────── */}
      <defs>
        {/* Body shell gradient */}
        <linearGradient id={`${id}-body-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ddd6fe" />
        </linearGradient>
        {/* Screen gradient */}
        <linearGradient id={`${id}-screen-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
        {/* Purple glow filter */}
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Soft shadow */}
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#7c3aed" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* ══════════════════════════════════════════════════════════════════════
          STATIC BODY
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── Legs ─────────────────────────────────────────────────────────── */}
      {/* Left leg */}
      <rect x="72" y="182" width="22" height="28" rx="10" fill="url(#robot-wave-body-grad)" stroke="#7c3aed" strokeWidth="2" />
      {/* Left foot */}
      <ellipse cx="83" cy="210" rx="14" ry="7" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" />
      {/* Right leg */}
      <rect x="106" y="182" width="22" height="28" rx="10" fill="url(#robot-wave-body-grad)" stroke="#7c3aed" strokeWidth="2" />
      {/* Right foot */}
      <ellipse cx="117" cy="210" rx="14" ry="7" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" />

      {/* Purple knee accents */}
      <circle cx="83"  cy="186" r="4" fill="#7c3aed" opacity="0.7" />
      <circle cx="117" cy="186" r="4" fill="#7c3aed" opacity="0.7" />

      {/* ── Torso ────────────────────────────────────────────────────────── */}
      <rect
        x="62" y="108" width="76" height="76" rx="16"
        fill="url(#robot-wave-body-grad)"
        stroke="#7c3aed" strokeWidth="2.5"
        filter="url(#robot-wave-shadow)"
      />

      {/* Torso side accent lines */}
      <rect x="62"  y="120" width="6"  height="52" rx="3" fill="#7c3aed" opacity="0.5" />
      <rect x="132" y="120" width="6"  height="52" rx="3" fill="#7c3aed" opacity="0.5" />

      {/* Embedded screen / chest display */}
      <rect x="74" y="116" width="52" height="62" rx="8" fill="url(#robot-wave-screen-grad)" stroke="#a78bfa" strokeWidth="1.5" />
      {/* Screen glow rim */}
      <rect x="74" y="116" width="52" height="62" rx="8" fill="none" stroke="#c4b5fd" strokeWidth="2.5" opacity="0.5" />

      {/* Screen text "HI!" */}
      <text
        x="100" y="153"
        textAnchor="middle"
        fontFamily="'Arial Black', Arial, sans-serif"
        fontWeight="900"
        fontSize="22"
        fill="#d946ef"
        className={`${id}-screen-text`}
        filter="url(#robot-wave-glow)"
      >
        HI!
      </text>

      {/* ── Left arm (STATIC) ────────────────────────────────────────────── */}
      {/* Upper arm */}
      <rect x="42" y="110" width="20" height="40" rx="10" fill="url(#robot-wave-body-grad)" stroke="#7c3aed" strokeWidth="2" />
      {/* Lower arm */}
      <rect x="44" y="148" width="18" height="30" rx="9" fill="url(#robot-wave-body-grad)" stroke="#7c3aed" strokeWidth="2" />
      {/* Left hand */}
      <circle cx="53" cy="182" r="10" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2" />
      {/* Finger hints */}
      <line x1="47" y1="176" x2="44" y2="170" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      <line x1="53" y1="173" x2="53" y2="167" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      <line x1="59" y1="176" x2="62" y2="170" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />

      {/* ── Head ─────────────────────────────────────────────────────────── */}
      {/* Neck */}
      <rect x="90" y="98" width="20" height="14" rx="6" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" />

      {/* Head shell */}
      <ellipse
        cx="100" cy="72" rx="46" ry="40"
        fill="url(#robot-wave-body-grad)"
        stroke="#7c3aed" strokeWidth="2.5"
        filter="url(#robot-wave-shadow)"
      />

      {/* Visor / face plate */}
      <ellipse cx="100" cy="76" rx="34" ry="26" fill="#1e1b4b" opacity="0.85" />
      <ellipse cx="100" cy="74" rx="32" ry="24" fill="#0f0a1e" />

      {/* Eyes */}
      <circle cx="82"  cy="75" r="10" fill="#7c3aed" />
      <circle cx="118" cy="75" r="10" fill="#7c3aed" />
      <circle cx="82"  cy="75" r="6"  fill="#d946ef" className={`${id}-eye-left`} />
      <circle cx="118" cy="75" r="6"  fill="#d946ef" className={`${id}-eye-right`} />
      {/* Eye shine */}
      <circle cx="85"  cy="72" r="2"  fill="white" opacity="0.7" />
      <circle cx="121" cy="72" r="2"  fill="white" opacity="0.7" />

      {/* Ear discs */}
      <circle cx="54"  cy="72" r="8" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" />
      <circle cx="54"  cy="72" r="4" fill="#7c3aed" />
      <circle cx="146" cy="72" r="8" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" />
      <circle cx="146" cy="72" r="4" fill="#7c3aed" />

      {/* Antenna stem */}
      <line x1="100" y1="32" x2="100" y2="54" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
      {/* Antenna ball */}
      <circle cx="100" cy="28" r="7" fill="#7c3aed" />
      <circle
        cx="100" cy="28" r="4"
        fill="#d946ef"
        className={`${id}-antenna-dot`}
        filter="url(#robot-wave-glow)"
      />

      {/* ══════════════════════════════════════════════════════════════════════
          ANIMATED RIGHT ARM  (transform-origin = shoulder joint)
      ══════════════════════════════════════════════════════════════════════ */}
      <g className={`${id}-arm-group`}>
        {/* Upper arm */}
        <rect x="138" y="110" width="20" height="40" rx="10" fill="url(#robot-wave-body-grad)" stroke="#7c3aed" strokeWidth="2" />
        {/* Elbow accent */}
        <circle cx="148" cy="150" r="5" fill="#7c3aed" opacity="0.6" />
        {/* Lower arm */}
        <rect x="140" y="148" width="18" height="32" rx="9" fill="url(#robot-wave-body-grad)" stroke="#7c3aed" strokeWidth="2" />
        {/* Hand */}
        <circle cx="149" cy="184" r="11" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2" />
        {/* Finger spread — waving hand */}
        <line x1="142" y1="177" x2="138" y2="170" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
        <line x1="147" y1="174" x2="146" y2="167" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
        <line x1="153" y1="174" x2="154" y2="167" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
        <line x1="157" y1="177" x2="161" y2="171" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export default RobotAnimation;
