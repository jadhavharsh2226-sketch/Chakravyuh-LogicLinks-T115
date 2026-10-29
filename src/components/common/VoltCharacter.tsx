import React from 'react';
import { motion } from 'framer-motion';
import { sounds } from '../../services/soundEffects';

export type VoltExpression = 
  | 'happy' 
  | 'excited' 
  | 'thinking' 
  | 'encouraging' 
  | 'celebrating'
  | 'curious_coding'
  | 'supportive_error'
  | 'stress_relief';

interface VoltCharacterProps {
  expression?: VoltExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  speechText?: string;
  onClick?: () => void;
  showSpark?: boolean;
}

export const VoltCharacter: React.FC<VoltCharacterProps> = ({
  expression = 'happy',
  size = 'md',
  className = '',
  speechText,
  onClick,
  showSpark = true,
}) => {
  const pixelSize = {
    sm: 44,
    md: 68,
    lg: 100,
    xl: 140,
  }[size];

  const handleClick = () => {
    sounds.playChirp();
    if (onClick) onClick();
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Duolingo-style Speech Bubble with Stress-Relief / Friendly Feedback */}
      {speechText && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 relative px-3.5 py-2 rounded-2xl bg-[#1D2125] border-2 border-[#C6FF3D] text-[#ECEBE4] text-xs font-sans shadow-lg max-w-xs text-center"
        >
          <span className="font-semibold">{speechText}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#C6FF3D]" />
        </motion.div>
      )}

      {/* Animated Mascot Body */}
      <motion.div
        whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="cursor-pointer relative"
        title="Volt - Your E&TC AI Mentor (Click to chirp!)"
      >
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Glow Backdrop */}
          <circle cx="50" cy="50" r="42" fill="#C6FF3D" fillOpacity={expression === 'supportive_error' ? 0.08 : 0.16} />

          {/* Copper Pins */}
          <rect x="6" y="28" width="10" height="6" rx="2" fill="#FFB020" stroke="#0E1012" strokeWidth="1.5" />
          <rect x="6" y="46" width="10" height="6" rx="2" fill="#FFB020" stroke="#0E1012" strokeWidth="1.5" />
          <rect x="6" y="64" width="10" height="6" rx="2" fill="#FFB020" stroke="#0E1012" strokeWidth="1.5" />

          <rect x="84" y="28" width="10" height="6" rx="2" fill="#FFB020" stroke="#0E1012" strokeWidth="1.5" />
          <rect x="84" y="46" width="10" height="6" rx="2" fill="#FFB020" stroke="#0E1012" strokeWidth="1.5" />
          <rect x="84" y="64" width="10" height="6" rx="2" fill="#FFB020" stroke="#0E1012" strokeWidth="1.5" />

          {/* Main Silicon Chip Body */}
          <rect
            x="16"
            y="18"
            width="68"
            height="64"
            rx="16"
            fill={expression === 'curious_coding' ? '#14181C' : '#1E2328'}
            stroke={expression === 'supportive_error' ? '#FFB020' : '#C6FF3D'}
            strokeWidth="3.5"
          />

          {/* Corner Notch */}
          <circle cx="28" cy="30" r="3.5" fill="#C6FF3D" />

          {/* Coder Glasses for 'curious_coding' */}
          {expression === 'curious_coding' && (
            <g>
              <rect x="26" y="38" width="20" height="16" rx="4" fill="#0E1012" stroke="#3DDCFF" strokeWidth="2" />
              <rect x="54" y="38" width="20" height="16" rx="4" fill="#0E1012" stroke="#3DDCFF" strokeWidth="2" />
              <line x1="46" y1="46" x2="54" y2="46" stroke="#3DDCFF" strokeWidth="2" />
              {/* Terminal Code Green Glow inside glasses */}
              <text x="30" y="49" fill="#C6FF3D" fontSize="8" fontFamily="monospace">&gt;_</text>
              <text x="58" y="49" fill="#C6FF3D" fontSize="8" fontFamily="monospace">{}</text>
            </g>
          )}

          {/* Expressive Eyes for other states */}
          {expression !== 'curious_coding' && (
            <>
              {expression === 'excited' ? (
                <>
                  <path d="M 36 44 L 38 48 L 42 49 L 38 52 L 39 56 L 36 53 L 33 56 L 34 52 L 30 49 L 34 48 Z" fill="#3DDCFF" />
                  <path d="M 64 44 L 66 48 L 70 49 L 66 52 L 67 56 L 64 53 L 61 56 L 62 52 L 58 49 L 62 48 Z" fill="#3DDCFF" />
                </>
              ) : expression === 'thinking' ? (
                <>
                  <ellipse cx="37" cy="48" rx="5" ry="6.5" fill="#ECEBE4" />
                  <circle cx="38" cy="46" r="3" fill="#0E1012" />
                  <ellipse cx="63" cy="44" rx="6" ry="7.5" fill="#ECEBE4" />
                  <circle cx="64" cy="42" r="3.5" fill="#0E1012" />
                  <path d="M 58 35 Q 64 30 70 35" stroke="#3DDCFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                </>
              ) : expression === 'supportive_error' ? (
                <>
                  {/* Reassuring Gentle Eyes */}
                  <path d="M 32 48 Q 38 44 44 48" stroke="#ECEBE4" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 56 48 Q 62 44 68 48" stroke="#ECEBE4" strokeWidth="3" strokeLinecap="round" fill="none" />
                </>
              ) : (
                <>
                  <ellipse cx="37" cy="48" rx="6.5" ry="8" fill="#ECEBE4" />
                  <ellipse cx="63" cy="48" rx="6.5" ry="8" fill="#ECEBE4" />
                  <circle cx="38.5" cy="48" r="4.5" fill="#0E1012" />
                  <circle cx="64.5" cy="48" r="4.5" fill="#0E1012" />
                  <circle cx="36" cy="45" r="2" fill="#FFFFFF" />
                  <circle cx="62" cy="45" r="2" fill="#FFFFFF" />
                </>
              )}
            </>
          )}

          {/* Cheerful Mouth */}
          {expression === 'celebrating' || expression === 'excited' ? (
            <path d="M 40 60 Q 50 72 60 60 Z" fill="#FF4D4D" stroke="#ECEBE4" strokeWidth="2" />
          ) : expression === 'supportive_error' ? (
            <path d="M 43 62 Q 50 67 57 62" stroke="#ECEBE4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : expression === 'thinking' ? (
            <path d="M 44 63 Q 50 60 56 62" stroke="#ECEBE4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M 42 61 Q 50 68 58 61" stroke="#ECEBE4" strokeWidth="3" strokeLinecap="round" fill="none" />
          )}

          {/* Rosy Cheeks */}
          <ellipse cx="27" cy="56" rx="4" ry="2.5" fill="#FF4D4D" fillOpacity="0.4" />
          <ellipse cx="73" cy="56" rx="4" ry="2.5" fill="#FF4D4D" fillOpacity="0.4" />

          {/* Heart Badge if supportive */}
          {expression === 'supportive_error' && (
            <path
              d="M 50 72 C 50 72 45 68 43 65 C 41 62 43 59 46 59 C 48 59 50 61 50 61 C 50 61 52 59 54 59 C 57 59 59 62 57 65 C 55 68 50 72 50 72 Z"
              fill="#FF4D4D"
            />
          )}

          {/* Graduation Cap if Celebrating */}
          {expression === 'celebrating' && (
            <g transform="translate(14, -2)">
              <polygon points="36,4 72,12 36,20 0,12" fill="#C6FF3D" stroke="#0E1012" strokeWidth="2" />
              <rect x="24" y="16" width="24" height="7" rx="3" fill="#1D2125" />
              <path d="M 68 14 L 72 26" stroke="#FFB020" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* Lightning Antenna Spark */}
          {expression !== 'celebrating' && showSpark && (
            <motion.path
              animate={{ y: [0, -3, 0], scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              d="M 52 2 L 46 10 L 52 10 L 48 18 L 56 9 L 50 9 Z"
              fill={expression === 'supportive_error' ? '#FFB020' : '#C6FF3D'}
              stroke="#0E1012"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </motion.div>
    </div>
  );
};
