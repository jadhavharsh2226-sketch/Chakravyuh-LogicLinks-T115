import React, { useState } from 'react';
import {
  ArrowUpRight,
  Cpu,
  Sparkles,
  Shield,
  Code2,
  Play,
  CheckCircle2,
  Layers,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { HeroInteractiveCircuit } from './HeroInteractiveCircuit';
import { VoltCharacter } from '../common/VoltCharacter';
import { BenchButton } from '../common/BenchButton';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onSelectMission: (missionId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onSelectMission,
}) => {
  return (
    <div className="min-h-screen bg-[#0A0D10] text-[#ECEBE4] selection:bg-[#C6FF3D] selection:text-[#0A0D10] font-sans antialiased flex flex-col">
      {/* 1. Sleek Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#0A0D10]/85 backdrop-blur-xl border-b border-[#20262D] px-4 sm:px-8 py-3.5 select-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#12161A] border border-[#232A31] group-hover:border-[#C6FF3D] transition-colors flex items-center justify-center text-[#C6FF3D]">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-tight text-[#ECEBE4]">
                Logic <span className="text-[#C6FF3D]">Links</span>
              </span>
              <span className="text-[10px] text-[#646F77] font-mono leading-none">
                Smart E&TC Platform
              </span>
            </div>
          </div>

          {/* Core Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-[#9CA3A8]">
            <button
              onClick={() => onNavigate('chakravyuha')}
              className="text-[#C6FF3D] font-bold hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Circuit Arena</span>
            </button>
            <button
              onClick={() => onNavigate('lab')}
              className="hover:text-[#ECEBE4] transition-colors"
            >
              Virtual Lab
            </button>
            <button
              onClick={() => onNavigate('code-lab')}
              className="hover:text-[#ECEBE4] transition-colors"
            >
              Arduino Lab
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="hover:text-[#ECEBE4] transition-colors"
            >
              Dashboard
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('login')}
              className="px-3.5 py-1.5 rounded-xl border border-[#C6FF3D]/40 bg-[#C6FF3D]/10 text-[#C6FF3D] font-mono text-xs font-bold hover:bg-[#C6FF3D] hover:text-[#0A0D10] transition-all"
            >
              Student Login ⚡
            </button>
            <BenchButton
              variant="primary"
              size="sm"
              onClick={() => onNavigate('lab')}
              icon={<ArrowUpRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Open Lab
            </BenchButton>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Editorial & High-Contrast with 3D Mascot */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 relative overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.12),rgba(255,255,255,0))]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Clean Editorial Copy */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12161A] border border-[#22282F]">
                <span className="w-2 h-2 rounded-full bg-[#C6FF3D] animate-ping" />
                <span className="font-mono text-[11px] font-bold text-[#C6FF3D] uppercase tracking-wider">
                  INTERACTIVE ENGINEERING / 001 · AGENTIC WORKBENCH
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#ECEBE4] leading-[1.1] mb-6">
                Stop Memorizing Circuits.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#C6FF3D]">
                  Start Making Them Work.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#9CA3A8] leading-relaxed max-w-xl mb-8">
                Build real combinational logic, solve hardware glitch puzzles in the Circuit Arena, and flash virtual ATmega microcontrollers—guided by <strong className="text-[#ECEBE4]">Volt</strong>, your 3D Agentic AI companion who moves the cursor and takes action.
              </p>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <BenchButton
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('login')}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Enter Workbench ➔
                </BenchButton>

                <BenchButton
                  variant="secondary"
                  size="lg"
                  onClick={() => onNavigate('chakravyuha')}
                  icon={<Shield className="w-4 h-4 text-[#C6FF3D]" />}
                >
                  Circuit Arena
                </BenchButton>
              </div>

              {/* 3 Trust Badges */}
              <div className="mt-8 pt-6 border-t border-[#20262D] w-full grid grid-cols-3 gap-3 font-mono text-[11px] text-[#9CA3A8]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#C6FF3D]">✓</span>
                  <span>100% Free & Visual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#3DDCFF]">✓</span>
                  <span>SPPU / AICTE Syllabi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#ECEBE4]">✓</span>
                  <span>3D AI Mentor</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive XOR Bench + 3D Volt Bot */}
            <div className="lg:col-span-6 w-full relative">
              <HeroInteractiveCircuit />
            </div>

          </div>
        </div>
      </section>

      {/* 3. The Three Workbenches: Authentic Hardware Imagery & Zero AI Clutter */}
      <section className="py-20 border-t border-[#20262D] bg-[#0E1216] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-mono text-xs text-[#C6FF3D] uppercase font-bold tracking-widest block mb-2">
                CORE ARCHITECTURE
              </span>
              <h2 className="font-display text-3xl font-bold text-[#ECEBE4]">
                Three Engineering Labs. Zero Guesswork.
              </h2>
            </div>
            <p className="text-xs text-[#9CA3A8] max-w-sm font-sans leading-relaxed">
              Every tool is grounded in deterministic electronics physics—from transistor-level logic to clock-cycle microcontroller firmware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Virtual Circuit Lab */}
            <div
              onClick={() => onNavigate('lab')}
              className="group rounded-3xl border border-[#22282F] bg-[#12161A] overflow-hidden hover:border-[#00E5FF] transition-all cursor-pointer flex flex-col justify-between shadow-xl"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src="/images/circuit-board.jpg"
                  alt="Circuit Board Logic"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#0A0D10]/80 backdrop-blur-md border border-[#22282F] text-[10px] font-mono text-[#00E5FF] font-bold">
                  01 / VIRTUAL BENCH
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-display text-lg font-bold text-[#ECEBE4] group-hover:text-[#00E5FF] transition-colors">
                  Digital Logic Playground
                </h3>
                <p className="text-xs text-[#9CA3A8] leading-relaxed">
                  Connect gates (AND, OR, XOR, NAND), flip virtual SPDT switches, and inspect real-time signal bus flow without burning a single IC.
                </p>
                <div className="pt-2 text-xs font-mono font-bold text-[#00E5FF] flex items-center gap-1">
                  <span>Open Playground</span>
                  <span>›</span>
                </div>
              </div>
            </div>

            {/* Card 2: CHAKRAVYUH Challenge */}
            <div
              onClick={() => onNavigate('chakravyuha')}
              className="group rounded-3xl border-2 border-[#C6FF3D]/40 bg-[#12161A] overflow-hidden hover:border-[#C6FF3D] transition-all cursor-pointer flex flex-col justify-between shadow-xl"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src="/images/oscilloscope.jpg"
                  alt="Oscilloscope Glitch Hunting"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#0A0D10]/80 backdrop-blur-md border border-[#C6FF3D]/40 text-[10px] font-mono text-[#C6FF3D] font-bold">
                  02 / TROUBLESHOOTING
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-display text-lg font-bold text-[#ECEBE4] group-hover:text-[#C6FF3D] transition-colors">
                  Circuit Troubleshooting Arena
                </h3>
                <p className="text-xs text-[#9CA3A8] leading-relaxed">
                  Interactive multi-stage electronic puzzles: disarm logic traps, troubleshoot faulty 4:1 multiplexers, and synchronize timer PWM signals.
                </p>
                <div className="pt-2 text-xs font-mono font-bold text-[#C6FF3D] flex items-center gap-1">
                  <span>Enter Arena (+500 XP)</span>
                  <span>›</span>
                </div>
              </div>
            </div>

            {/* Card 3: Arduino Embedded Code Lab */}
            <div
              onClick={() => onNavigate('code-lab')}
              className="group rounded-3xl border border-[#22282F] bg-[#12161A] overflow-hidden hover:border-[#3DDCFF] transition-all cursor-pointer flex flex-col justify-between shadow-xl"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src="/images/breadboard.jpg"
                  alt="Arduino Prototyping"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#0A0D10]/80 backdrop-blur-md border border-[#22282F] text-[10px] font-mono text-[#3DDCFF] font-bold">
                  03 / FIRMWARE LAB
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-display text-lg font-bold text-[#ECEBE4] group-hover:text-[#3DDCFF] transition-colors">
                  Arduino & AVR Microcontrollers
                </h3>
                <p className="text-xs text-[#9CA3A8] leading-relaxed">
                  Write embedded C code in the browser. Compile and run sketches on a virtual ATmega328P target with live Pin 13 LED output.
                </p>
                <div className="pt-2 text-xs font-mono font-bold text-[#3DDCFF] flex items-center gap-1">
                  <span>Launch Code Lab</span>
                  <span>›</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. University Curriculum Alignment & Final Call to Action */}
      <section className="py-20 border-t border-[#20262D] bg-[#0A0D10] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12161A] border border-[#22282F] text-[10px] font-mono text-[#9CA3A8]">
            <span>AICTE & SPPU PUNE UNIVERSITY COMPLIANT</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#ECEBE4]">
            Ready to master electronics the visual way?
          </h2>

          <p className="text-sm text-[#9CA3A8] max-w-lg mx-auto leading-relaxed">
            Choose your year, meet Volt, and start designing circuits that work in minutes.
          </p>

          <div className="pt-2">
            <BenchButton
              variant="primary"
              size="lg"
              onClick={() => onNavigate('login')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Start Free Student Workbench 🚀
            </BenchButton>
          </div>
        </div>
      </section>

      {/* 5. Minimal Engineering Footer */}
      <footer className="py-8 px-6 border-t border-[#20262D] bg-[#080A0D] text-xs font-mono text-[#646F77] select-none">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C6FF3D]" />
            <span>Logic Links · Precision Digital Engineering Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('login')} className="hover:text-[#ECEBE4]">
              Student Login
            </button>
            <button onClick={() => onNavigate('chakravyuha')} className="hover:text-[#ECEBE4]">
              Circuit Arena
            </button>
            <button onClick={() => onNavigate('lab')} className="hover:text-[#ECEBE4]">
              Virtual Lab
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
