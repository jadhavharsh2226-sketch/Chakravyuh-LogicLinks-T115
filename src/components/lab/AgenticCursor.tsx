import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

export interface AgenticCursorState {
  visible: boolean;
  x: number;
  y: number;
  isClicking: boolean;
  statusText: string;
}

interface AgenticCursorProps {
  cursorState: AgenticCursorState;
}

export const AgenticCursor: React.FC<AgenticCursorProps> = ({ cursorState }) => {
  if (!cursorState.visible) return null;

  return (
    <div
      className="absolute top-0 left-0 pointer-events-none z-50 select-none will-change-transform"
      style={{
        transform: `translate3d(${cursorState.x}px, ${cursorState.y}px, 0)`,
        transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
      }}
    >
      {/* Click ripple animation */}
      {cursorState.isClicking && (
        <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full border-2 border-[#00E5FF] bg-[#00E5FF]/20 animate-ping" />
      )}

      {/* Futuristic Neon Cursor Arrow */}
      <svg
        className="w-7 h-7 filter drop-shadow-[0_2px_8px_rgba(0,229,255,0.6)]"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
          fill="#00E5FF"
          stroke="#0A0D10"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Holographic Agent Tag */}
      <div className="absolute left-6 top-2 flex flex-col items-start gap-1">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0E1217]/95 border border-[#00E5FF]/60 shadow-[0_4px_16px_rgba(0,229,255,0.25)] text-white text-[11px] font-mono whitespace-nowrap backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <Zap className="w-3 h-3 text-[#C6FF3D]" />
          <span className="font-bold text-[#00E5FF]">Volt Agent</span>
        </div>

        {cursorState.statusText && (
          <div className="px-2 py-0.5 rounded bg-[#161B22]/90 border border-[#2D333B] text-[10px] text-[#C6FF3D] font-mono whitespace-nowrap shadow-md">
            {cursorState.statusText}
          </div>
        )}
      </div>
    </div>
  );
};
