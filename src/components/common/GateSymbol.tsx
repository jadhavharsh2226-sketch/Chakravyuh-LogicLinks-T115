import React from 'react';
import { ComponentType, SignalState } from '../../types';

interface GateSymbolProps {
  type: ComponentType;
  signal?: SignalState;
  size?: number;
  className?: string;
  isFaulty?: boolean;
}

export const GateSymbol: React.FC<GateSymbolProps> = ({
  type,
  signal,
  size = 44,
  className = '',
  isFaulty = false,
}) => {
  const isHigh = signal === 1;
  const strokeColor = isFaulty ? '#FF4D4D' : isHigh ? '#3DDCFF' : '#ECEBE4';

  switch (type) {
    case 'AND':
      return (
        <svg width={size} height={size * 0.8} viewBox="0 0 60 48" fill="none" className={className}>
          <path
            d="M 12 6 L 30 6 C 44 6, 50 15, 50 24 C 50 33, 44 42, 30 42 L 12 42 Z"
            stroke={strokeColor}
            strokeWidth="3"
            fill="#16191C"
          />
          <line x1="2" y1="15" x2="12" y2="15" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="2" y1="33" x2="12" y2="33" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="50" y1="24" x2="58" y2="24" stroke={strokeColor} strokeWidth="2.5" />
          <text x="25" y="27" fill="#9CA3A8" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">&</text>
        </svg>
      );

    case 'OR':
      return (
        <svg width={size} height={size * 0.8} viewBox="0 0 60 48" fill="none" className={className}>
          <path
            d="M 10 6 Q 25 24 10 42 Q 35 42 50 24 Q 35 6 10 6 Z"
            stroke={strokeColor}
            strokeWidth="3"
            fill="#16191C"
          />
          <line x1="2" y1="15" x2="16" y2="15" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="2" y1="33" x2="16" y2="33" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="50" y1="24" x2="58" y2="24" stroke={strokeColor} strokeWidth="2.5" />
          <text x="27" y="27" fill="#9CA3A8" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">≥1</text>
        </svg>
      );

    case 'XOR':
      return (
        <svg width={size} height={size * 0.8} viewBox="0 0 60 48" fill="none" className={className}>
          <path d="M 6 6 Q 21 24 6 42" stroke={strokeColor} strokeWidth="3" fill="none" />
          <path
            d="M 12 6 Q 27 24 12 42 Q 37 42 50 24 Q 37 6 12 6 Z"
            stroke={strokeColor}
            strokeWidth="3"
            fill="#16191C"
          />
          <line x1="2" y1="15" x2="11" y2="15" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="2" y1="33" x2="11" y2="33" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="50" y1="24" x2="58" y2="24" stroke={strokeColor} strokeWidth="2.5" />
          <text x="27" y="27" fill="#9CA3A8" fontSize="9" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">=1</text>
        </svg>
      );

    case 'NOT':
      return (
        <svg width={size} height={size * 0.8} viewBox="0 0 60 48" fill="none" className={className}>
          <polygon points="14,10 42,24 14,38" stroke={strokeColor} strokeWidth="3" fill="#16191C" />
          <circle cx="47" cy="24" r="4.5" stroke={strokeColor} strokeWidth="2.5" fill="#0E1012" />
          <line x1="2" y1="24" x2="14" y2="24" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="52" y1="24" x2="58" y2="24" stroke={strokeColor} strokeWidth="2.5" />
          <text x="24" y="27" fill="#9CA3A8" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">1</text>
        </svg>
      );

    case 'NAND':
      return (
        <svg width={size} height={size * 0.8} viewBox="0 0 60 48" fill="none" className={className}>
          <path
            d="M 10 6 L 28 6 C 40 6, 46 15, 46 24 C 46 33, 40 42, 28 42 L 10 42 Z"
            stroke={strokeColor}
            strokeWidth="3"
            fill="#16191C"
          />
          <circle cx="51" cy="24" r="4.5" stroke={strokeColor} strokeWidth="2.5" fill="#0E1012" />
          <line x1="2" y1="15" x2="10" y2="15" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="2" y1="33" x2="10" y2="33" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="56" y1="24" x2="60" y2="24" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );

    case 'NOR':
      return (
        <svg width={size} height={size * 0.8} viewBox="0 0 60 48" fill="none" className={className}>
          <path
            d="M 10 6 Q 24 24 10 42 Q 33 42 45 24 Q 33 6 10 6 Z"
            stroke={strokeColor}
            strokeWidth="3"
            fill="#16191C"
          />
          <circle cx="50" cy="24" r="4.5" stroke={strokeColor} strokeWidth="2.5" fill="#0E1012" />
          <line x1="2" y1="15" x2="15" y2="15" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="2" y1="33" x2="15" y2="33" stroke={strokeColor} strokeWidth="2.5" />
          <line x1="55" y1="24" x2="60" y2="24" stroke={strokeColor} strokeWidth="2.5" />
        </svg>
      );

    case 'SWITCH':
      return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
          isHigh ? 'border-[#3DDCFF] bg-[#3DDCFF]/15 text-[#3DDCFF]' : 'border-[#282E33] bg-[#16191C] text-[#9CA3A8]'
        }`}>
          <div className={`w-8 h-4 rounded-full p-0.5 border flex transition-all ${
            isHigh ? 'border-[#3DDCFF] justify-end bg-[#3DDCFF]/30' : 'border-[#525C64] justify-start bg-[#0E1012]'
          }`}>
            <div className={`w-3 h-3 rounded-full ${isHigh ? 'bg-[#3DDCFF]' : 'bg-[#525C64]'}`} />
          </div>
          <span className="font-mono text-xs font-bold">{isHigh ? 'ON (1)' : 'OFF (0)'}</span>
        </div>
      );

    case 'LED':
      return (
        <div className="flex flex-col items-center gap-1.5 select-none">
          {/* Visual light bulb representation */}
          <div
            className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
              isHigh
                ? 'border-[#3DDCFF] bg-[#3DDCFF] shadow-[0_0_25px_rgba(61,220,255,0.8)]'
                : 'border-[#384047] bg-[#1A1D20]'
            }`}
          >
            {/* Filament / inner glow */}
            <div className={`w-3.5 h-3.5 rounded-full transition-all ${isHigh ? 'bg-white shadow-[0_0_10px_white]' : 'bg-[#282E33]'}`} />
          </div>
          <span className={`text-[11px] font-bold tracking-wide uppercase ${isHigh ? 'text-[#3DDCFF]' : 'text-[#646F77]'}`}>
            {isHigh ? 'GLOWING (1)' : 'DARK (0)'}
          </span>
        </div>
      );

    default:
      return (
        <div className="px-2 py-1 border border-[#282E33] bg-[#16191C] rounded font-mono text-xs text-[#ECEBE4]">
          {type}
        </div>
      );
  }
};
