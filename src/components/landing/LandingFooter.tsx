import React from 'react';
import { Cpu, Terminal, Shield, ExternalLink } from 'lucide-react';

interface LandingFooterProps {
  onNavigate: (view: string) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#282E33] bg-[#0E1012] py-12 text-xs font-mono text-[#9CA3A8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-[#282E33]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#16191C] border border-[#282E33] flex items-center justify-center text-[#C6FF3D]">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="font-display text-sm font-bold text-[#ECEBE4] tracking-tight">
              CIRCUITVERSE AI
            </span>
            <span className="text-[#646F77]">|</span>
            <span className="text-[11px] text-[#646F77]">BENCH INSTRUMENT EDITION</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('lab')} className="hover:text-[#ECEBE4] transition-colors">
              Circuit Lab
            </button>
            <button onClick={() => onNavigate('fault-arena')} className="hover:text-[#ECEBE4] transition-colors">
              Fault Arena
            </button>
            <button onClick={() => onNavigate('missions')} className="hover:text-[#ECEBE4] transition-colors">
              Missions
            </button>
            <button onClick={() => onNavigate('knowledge')} className="hover:text-[#ECEBE4] transition-colors">
              Knowledge Base
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#646F77]">
          <div>
            Built with deterministic simulation architecture. No hallucinated circuits.
          </div>
          <div className="flex items-center gap-4">
            <span>DYPSEM EVENT HACKATHON 2026</span>
            <span>•</span>
            <span>WCAG AA COMPLIANT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
