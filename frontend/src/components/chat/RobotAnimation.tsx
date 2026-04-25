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
        @keyframes ${id}-upper-wave {
          0%, 100% { transform: rotate(-85deg); }
          50%       { transform: rotate(-95deg); }
        }
        @keyframes ${id}-forearm-wave {
          0%, 100% { transform: rotate(0deg); }
          50%       { transform: rotate(-85deg); }
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

        .${id}-upper-arm-group {
          transform-origin: 138px 110px; /* Right shoulder (Viewer's Right) */
          animation: ${id}-upper-wave 2.8s ease-in-out infinite;
        }
        .${id}-forearm-group {
          transform-origin: 148px 150px; /* Right elbow */
          animation: ${id}-forearm-wave 2.8s ease-in-out infinite;
        }
        .${id}-eye-left  { animation: ${id}-eye-blink 4s ease-in-out infinite 0.3s; transform-origin: 82px 85px; }
        .${id}-eye-right { animation: ${id}-eye-blink 4s ease-in-out infinite 0.3s; transform-origin: 110px 85px; }
        .${id}-antenna-dot { animation: ${id}-antenna-pulse 2.8s ease-in-out infinite; }
        .${id}-screen-text { animation: ${id}-screen-glow 2.8s ease-in-out infinite; }
      `}</style>

      {/* ── Defs ───────────────────────────────────────────────────────────── */}
      <defs>
        {/* Body shell gradient */}
        <linearGradient id={`${id}-body-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
        {/* Screen gradient */}
        <linearGradient id={`${id}-screen-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#172554" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        {/* Blue glow filter */}
        <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Soft shadow */}
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3b82f6" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* ══════════════════════════════════════════════════════════════════════
          STATIC BODY
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── Legs ─────────────────────────────────────────────────────────── */}
      {/* Left leg */}
      <rect x="72" y="182" width="22" height="28" rx="10" fill="url(#robot-wave-body-grad)" stroke="#3b82f6" strokeWidth="2" />
      {/* Left foot */}
      <ellipse cx="83" cy="210" rx="14" ry="7" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
      {/* Right leg */}
      <rect x="106" y="182" width="22" height="28" rx="10" fill="url(#robot-wave-body-grad)" stroke="#3b82f6" strokeWidth="2" />
      {/* Right foot */}
      <ellipse cx="117" cy="210" rx="14" ry="7" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />

      {/* Blue knee accents */}
      <circle cx="83"  cy="186" r="4" fill="#3b82f6" opacity="0.7" />
      <circle cx="117" cy="186" r="4" fill="#3b82f6" opacity="0.7" />

      {/* ── Torso ────────────────────────────────────────────────────────── */}
      <rect
        x="62" y="108" width="76" height="76" rx="16"
        fill="url(#robot-wave-body-grad)"
        stroke="#3b82f6" strokeWidth="2.5"
        filter="url(#robot-wave-shadow)"
      />

      {/* Torso side accent lines */}
      <rect x="62"  y="120" width="6"  height="52" rx="3" fill="#3b82f6" opacity="0.5" />
      <rect x="132" y="120" width="6"  height="52" rx="3" fill="#3b82f6" opacity="0.5" />

      {/* Embedded screen / chest display */}
      <rect x="74" y="116" width="52" height="62" rx="8" fill="url(#robot-wave-screen-grad)" stroke="#60a5fa" strokeWidth="1.5" />
      {/* Screen glow rim */}
      <rect x="74" y="116" width="52" height="62" rx="8" fill="none" stroke="#93c5fd" strokeWidth="2.5" opacity="0.5" />

      {/* Screen text "HI!" */}
      <text
        x="100" y="153"
        textAnchor="middle"
        fontFamily="'Arial Black', Arial, sans-serif"
        fontWeight="900"
        fontSize="22"
        fill="#06b6d4"
        className={`${id}-screen-text`}
        filter="url(#robot-wave-glow)"
      >
        HI!
      </text>

      {/* ── Left arm (STATIC) ────────────────────────────────────────────── */}
      <rect x="42" y="110" width="20" height="40" rx="10" fill="url(#robot-wave-body-grad)" stroke="#3b82f6" strokeWidth="2" />
      {/* Lower arm */}
      <rect x="44" y="148" width="18" height="30" rx="9" fill="url(#robot-wave-body-grad)" stroke="#3b82f6" strokeWidth="2" />
      {/* Hand */}
      <circle cx="53" cy="182" r="10" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
      {/* Finger hints */}
      <line x1="47" y1="176" x2="44" y2="170" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      <line x1="53" y1="173" x2="53" y2="167" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      <line x1="59" y1="176" x2="62" y2="170" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />

      {/* ── Head ─────────────────────────────────────────────────────────── */}
      <rect x="90" y="98" width="20" height="14" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />

      {/* Head shell */}
      <ellipse
        cx="100" cy="72" rx="46" ry="40"
        fill="url(#robot-wave-body-grad)"
        stroke="#3b82f6" strokeWidth="2.5"
        filter="url(#robot-wave-shadow)"
      />

      {/* Visor / face plate */}
      <ellipse cx="100" cy="76" rx="34" ry="26" fill="#172554" opacity="0.85" />
      <ellipse cx="100" cy="74" rx="32" ry="24" fill="#0f172a" />

      {/* Eyes */}
      <circle cx="82"  cy="75" r="10" fill="#2563eb" />
      <circle cx="118" cy="75" r="10" fill="#2563eb" />
      <circle cx="82"  cy="75" r="6"  fill="#06b6d4" className={`${id}-eye-left`} />
      <circle cx="118" cy="75" r="6"  fill="#06b6d4" className={`${id}-eye-right`} />
      {/* Eye shine */}
      <circle cx="85"  cy="72" r="2"  fill="white" opacity="0.7" />
      <circle cx="121" cy="72" r="2"  fill="white" opacity="0.7" />

      {/* Ear discs */}
      <circle cx="54"  cy="72" r="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
      <circle cx="54"  cy="72" r="4" fill="#3b82f6" />
      <circle cx="146" cy="72" r="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
      <circle cx="146" cy="72" r="4" fill="#3b82f6" />

      {/* Antenna stem */}
      <line x1="100" y1="32" x2="100" y2="54" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
      {/* Antenna ball */}
      <circle cx="100" cy="28" r="7" fill="#3b82f6" />
      <circle
        cx="100" cy="28" r="4"
        fill="#06b6d4"
        className={`${id}-antenna-dot`}
        filter="url(#robot-wave-glow)"
      />

      {/* ── Right arm (JOINTED ANIMATION: East to North) ─────────────────── */}
      <g className={`${id}-upper-arm-group`}>
        {/* Upper arm */}
        <rect x="138" y="110" width="20" height="40" rx="10" fill="url(#robot-wave-body-grad)" stroke="#3b82f6" strokeWidth="2" />
        
        {/* Forearm + Hand - pivots at elbow */}
        <g className={`${id}-forearm-group`}>
          {/* Elbow joint accent */}
          <circle cx="148" cy="150" r="5" fill="#3b82f6" opacity="0.8" />
          
          {/* Lower arm */}
          <rect x="140" y="148" width="18" height="36" rx="9" fill="url(#robot-wave-body-grad)" stroke="#3b82f6" strokeWidth="2" />
          
          {/* Hand */}
          <circle cx="149" cy="188" r="11" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
          
          {/* Waving fingers */}
          <line x1="143" y1="181" x2="139" y2="174" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          <line x1="148" y1="178" x2="147" y2="171" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          <line x1="154" y1="178" x2="155" y2="171" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          <line x1="158" y1="181" x2="162" y2="175" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};

export default RobotAnimation;
