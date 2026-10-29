import React from 'react';
import { motion } from 'framer-motion';
import { Volt3DCanvas } from './Volt3DCanvas';
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

export interface VoltCharacterProps {
  expression?: VoltExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
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
}) => {
  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Duolingo-style Speech Bubble with Stress-Relief / Friendly Feedback */}
      {speechText && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 relative px-3.5 py-2 rounded-2xl bg-[#1D2125] border-2 border-[#C6FF3D] text-[#ECEBE4] text-xs font-sans shadow-xl max-w-xs text-center z-10"
        >
          <span className="font-semibold">{speechText}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#C6FF3D]" />
        </motion.div>
      )}

      {/* 3D Moving Character matching user's photo */}
      <Volt3DCanvas
        expression={expression}
        size={size}
        onClick={onClick}
      />
    </div>
  );
};
