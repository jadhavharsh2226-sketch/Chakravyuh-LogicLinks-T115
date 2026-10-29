import React from 'react';
import {
  Play,
  Sparkles,
  Flame,
  Heart,
  GraduationCap,
  Shield,
  Code2,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { BenchButton } from '../common/BenchButton';
import { VoltCharacter } from '../common/VoltCharacter';
import { StudentProfile } from '../../types/student';
import { UNIVERSITY_SYLLABI } from '../../services/syllabusData';
import { sounds } from '../../services/soundEffects';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectMission: (missionId: string) => void;
  studentProfile: StudentProfile;
  onOpenSyllabusModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectMission,
  studentProfile,
  onOpenSyllabusModal,
}) => {
  const syllabus = UNIVERSITY_SYLLABI[studentProfile.track] || UNIVERSITY_SYLLABI.ENTC_SEMESTER_1_2;

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 select-none font-sans text-xs">
      
      {/* 1. Top Student Welcome Bar with 3D Mascot */}
      <div className="rounded-3xl border border-[#22282F] bg-[#12161A] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6FF3D]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 w-full md:w-auto z-10">
          <VoltCharacter
            expression="happy"
            size="md"
            speechText={`Welcome back, ${studentProfile.name.split(' ')[0]}! Ready for ${syllabus.yearName}?`}
          />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-[#ECEBE4]">
                Hey, {studentProfile.name}! 👋
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30 font-mono text-[11px] font-bold">
                Level {studentProfile.level} {studentProfile.levelTitle}
              </span>
            </div>

            <div className="text-xs text-[#9CA3A8] mt-1 flex flex-wrap items-center gap-2 font-mono">
              <span className="text-[#3DDCFF] font-bold">{syllabus.courseName}</span>
              <span>•</span>
              <span>{syllabus.yearName}</span>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onOpenSyllabusModal();
              }}
              className="mt-2 text-xs text-[#C6FF3D] hover:underline flex items-center gap-1 font-semibold"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Change Syllabus ›</span>
            </button>
          </div>
        </div>

        {/* Gamification Stats: Streak, Hearts, XP */}
        <div className="flex items-center gap-3 bg-[#0A0D10] p-2.5 rounded-2xl border border-[#22282F] shrink-0 font-mono text-xs z-10">
          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161C22] text-[#FFB020] font-bold" title="Daily Learning Streak">
            <Flame className="w-4 h-4 text-[#FFB020] fill-current animate-pulse" />
            <span>{studentProfile.streakDays} Day Streak!</span>
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161C22] text-[#FF4D4D] font-bold" title="Available Lives">
            <Heart className="w-4 h-4 text-[#FF4D4D] fill-current" />
            <span>{studentProfile.hearts}/5</span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161C22] text-[#C6FF3D] font-bold" title="Total XP Points">
            <Sparkles className="w-4 h-4 text-[#C6FF3D]" />
            <span>{studentProfile.xp} XP</span>
          </div>
        </div>
      </div>

      {/* 2. The Three Core Engineering Hubs (With Authentic Hardware Imagery) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-[#C6FF3D] font-bold uppercase tracking-wider">
            WORKBENCH SELECTION
          </span>
          <span className="text-[11px] text-[#646F77] font-mono">
            3 Hardware Environments
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Hub 1: Logic Gate Playground */}
          <div
            onClick={() => {
              sounds.playClick();
              onNavigate('lab');
            }}
            className="group rounded-3xl border border-[#22282F] bg-[#12161A] overflow-hidden hover:border-[#00E5FF] transition-all cursor-pointer flex flex-col justify-between shadow-xl"
          >
            <div className="h-36 relative overflow-hidden">
              <img
                src="/images/circuit-board.jpg"
                alt="Circuit Board"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0A0D10]/80 border border-[#22282F] text-[10px] font-mono text-[#00E5FF] font-bold">
                <Cpu className="w-3 h-3" />
                <span>LOGIC BENCH</span>
              </div>
            </div>

            <div className="p-5 space-y-2">
              <h3 className="font-display text-base font-bold text-[#ECEBE4] group-hover:text-[#00E5FF] transition-colors">
                Circuit Playground
              </h3>
              <p className="text-[11px] text-[#9CA3A8] leading-relaxed">
                Connect logic gates, toggle SPDT switches, and inspect real-time signal truth tables.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-[#00E5FF] flex items-center gap-1">
                <span>Open Playground</span>
                <span>›</span>
              </div>
            </div>
          </div>

          {/* Hub 2: CHAKRAVYUH Arena */}
          <div
            onClick={() => {
              sounds.playClick();
              onNavigate('chakravyuha');
            }}
            className="group rounded-3xl border-2 border-[#C6FF3D]/40 bg-[#12161A] overflow-hidden hover:border-[#C6FF3D] transition-all cursor-pointer flex flex-col justify-between shadow-xl"
          >
            <div className="h-36 relative overflow-hidden">
              <img
                src="/images/oscilloscope.jpg"
                alt="Oscilloscope Glitch Hunting"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0A0D10]/80 border border-[#C6FF3D]/40 text-[10px] font-mono text-[#C6FF3D] font-bold">
                <Shield className="w-3 h-3" />
                <span>HACKATHON 2026</span>
              </div>
            </div>

            <div className="p-5 space-y-2">
              <h3 className="font-display text-base font-bold text-[#ECEBE4] group-hover:text-[#C6FF3D] transition-colors">
                CHAKRAVYUH Arena
              </h3>
              <p className="text-[11px] text-[#9CA3A8] leading-relaxed">
                Breach the 3-layer electronic maze against the timer: Padmavyuha, Karmavyuha, and Core!
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-[#C6FF3D] flex items-center gap-1">
                <span>Enter Arena (+500 XP)</span>
                <span>›</span>
              </div>
            </div>
          </div>

          {/* Hub 3: Arduino Embedded C Lab */}
          <div
            onClick={() => {
              sounds.playClick();
              onNavigate('code-lab');
            }}
            className="group rounded-3xl border border-[#22282F] bg-[#12161A] overflow-hidden hover:border-[#3DDCFF] transition-all cursor-pointer flex flex-col justify-between shadow-xl"
          >
            <div className="h-36 relative overflow-hidden">
              <img
                src="/images/breadboard.jpg"
                alt="Breadboard Prototyping"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12161A] via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0A0D10]/80 border border-[#22282F] text-[10px] font-mono text-[#3DDCFF] font-bold">
                <Code2 className="w-3 h-3" />
                <span>EMBEDDED C</span>
              </div>
            </div>

            <div className="p-5 space-y-2">
              <h3 className="font-display text-base font-bold text-[#ECEBE4] group-hover:text-[#3DDCFF] transition-colors">
                Arduino Microcontroller Lab
              </h3>
              <p className="text-[11px] text-[#9CA3A8] leading-relaxed">
                Write AVR C code, flash the virtual ATmega328P target, and test live GPIO Pin 13 LED output.
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-[#3DDCFF] flex items-center gap-1">
                <span>Open Code Lab</span>
                <span>›</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Today's Recommended Lesson (Focused, Single Card — No Overflow) */}
      <div className="rounded-3xl border border-[#22282F] bg-[#12161A] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#C6FF3D] font-bold uppercase tracking-wider">
              CONTINUE LEARNING
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#161C22] text-[#3DDCFF] font-mono text-[10px]">
              5 Mins Daily Goal
            </span>
          </div>

          <h3 className="font-display text-xl font-bold text-[#ECEBE4]">
            Staircase 2-Way Light Switch (XOR Gate)
          </h3>

          <p className="text-xs text-[#9CA3A8] leading-relaxed">
            Understand how electrical switches at the top and bottom of a staircase control the same light bulb using binary parity logic.
          </p>

          <div className="pt-1 flex items-center gap-4 text-[11px] font-mono text-[#646F77]">
            <span>Unit: {syllabus.units[0]?.title || 'Fundamental Logic'}</span>
            <span>•</span>
            <span className="text-[#C6FF3D] font-bold">+150 XP Reward</span>
          </div>
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          <BenchButton
            variant="primary"
            size="lg"
            onClick={() => onSelectMission('mission-002')}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            className="w-full sm:w-auto"
          >
            Continue Lesson ➔
          </BenchButton>
        </div>
      </div>

    </div>
  );
};
