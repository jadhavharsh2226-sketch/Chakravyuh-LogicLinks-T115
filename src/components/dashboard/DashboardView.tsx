import React from 'react';
import {
  ArrowUpRight,
  Plus,
  Play,
  Sparkles,
  Trophy,
  Flame,
  Heart,
  BookOpen,
  GraduationCap,
  Sliders,
  CheckCircle2,
  Shield,
  Code2,
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
  const syllabus = UNIVERSITY_SYLLABI[studentProfile.track] || UNIVERSITY_SYLLABI.BCA_YEAR_1;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 select-none font-sans">
      {/* Top Duolingo Gamification Bar: Streaks, Hearts, Course, Switch Button */}
      <div className="rounded-3xl border-2 border-[#282E33] bg-[#16191C] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* Volt Mascot */}
          <VoltCharacter
            expression="happy"
            size="lg"
            speechText={`Welcome back! Ready for ${syllabus.yearName}?`}
          />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold text-[#ECEBE4]">
                Hey, {studentProfile.name}! 👋
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30 font-mono text-xs font-bold">
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
              <span>Change Course / Year Syllabus</span>
            </button>
          </div>
        </div>

        {/* Duolingo Gamification Stats (Streaks, Hearts, XP) */}
        <div className="flex items-center gap-4 bg-[#0E1012] p-3 rounded-2xl border border-[#282E33] shrink-0 font-mono text-xs">
          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1D2125] text-[#FFB020] font-bold">
            <Flame className="w-5 h-5 text-[#FFB020] animate-bounce" />
            <span>{studentProfile.streakDays} Day Streak!</span>
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1D2125] text-[#FF4D4D] font-bold">
            <Heart className="w-5 h-5 text-[#FF4D4D] fill-current" />
            <span>{studentProfile.hearts}/5</span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1D2125] text-[#C6FF3D] font-bold">
            <Sparkles className="w-5 h-5 text-[#C6FF3D]" />
            <span>{studentProfile.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Lesson + Syllabus Path */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Lesson Card (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-[#282E33] bg-[#16191C] p-6 sm:p-8 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-[#C6FF3D]">
                TODAY'S BITE-SIZED LESSON
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1D2125] border border-[#282E33] text-xs font-mono text-[#3DDCFF] font-semibold">
                5 Mins Daily Goal
              </span>
            </div>

            <h2 className="font-display text-2xl font-bold text-[#ECEBE4] mb-2">
              Staircase 2-Way Light Switch (XOR Gate)
            </h2>

            <p className="text-sm text-[#9CA3A8] leading-relaxed mb-6">
              Learn how household switches control the same light bulb from both the bottom and top of the stairs using XOR logic!
            </p>

            {/* Progress bar */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#9CA3A8]">Lesson Progress:</span>
                <span className="text-[#C6FF3D] font-bold">50% Completed</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#0E1012] overflow-hidden border border-[#282E33]">
                <div className="h-full bg-[#C6FF3D] rounded-full w-1/2 transition-all" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[#282E33]">
            <BenchButton
              variant="primary"
              size="lg"
              onClick={() => onSelectMission('mission-002')}
              icon={<Play className="w-4 h-4 fill-current" />}
              className="w-full sm:w-auto"
            >
              Continue Lesson (+150 XP) 🚀
            </BenchButton>

            <BenchButton
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('lab')}
              icon={<Plus className="w-4 h-4" />}
            >
              Open Blank Canvas
            </BenchButton>
          </div>
        </div>

        {/* Quick Puzzle Card (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-[#282E33] bg-[#16191C] p-6 sm:p-8 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#FFB020]">
                CIRCUIT PUZZLE ARENA
              </span>
              <span className="text-xs font-mono text-[#ECEBE4] font-bold">
                Puzzle #1
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-[#ECEBE4] mb-2">
              The Stubborn Light Switch
            </h3>

            <p className="text-xs text-[#9CA3A8] leading-relaxed mb-4">
              Someone wired the wrong gate into a circuit. Can you test the switches, spot the bug, and repair it?
            </p>

            <div className="p-3 rounded-2xl bg-[#0E1012] border border-[#282E33] text-xs font-mono text-[#3DDCFF] mb-4">
              Reward: +250 XP • No hearts lost on first try!
            </div>
          </div>

          <BenchButton
            variant="accent"
            size="md"
            onClick={() => onNavigate('fault-arena')}
            className="w-full"
          >
            Play Circuit Puzzle 🧩
          </BenchButton>
        </div>

        {/* Feature Highlights: CHAKRAVYUH Challenge & Arduino Embedded Lab (12 cols) */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* CHAKRAVYUH Challenge */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#16191C] to-[#12161A] border-2 border-[#C6FF3D]/40 hover:border-[#C6FF3D] transition-all flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#0E1012] border border-[#C6FF3D] flex items-center justify-center text-[#C6FF3D]">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#C6FF3D]/10 text-[#C6FF3D] font-mono text-[11px] font-bold">
                  HACKATHON EDITION
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#ECEBE4]">
                CHAKRAVYUH Arena
              </h3>
              <p className="text-xs text-[#9CA3A8] leading-relaxed">
                Breach the 3-layer electronic maze against the timer! Disarm Padmavyuha's boolean lock, troubleshoot Karmavyuha's faulty 4:1 MUX, and synchronize the ATmega core PWM handshake.
              </p>
            </div>
            <div className="pt-5">
              <BenchButton
                variant="primary"
                size="md"
                onClick={() => onNavigate('chakravyuha')}
                icon={<Shield className="w-4 h-4 text-[#0E1012]" />}
                className="w-full"
              >
                Enter CHAKRAVYUH Arena ⚡ (+500 XP)
              </BenchButton>
            </div>
          </div>

          {/* Arduino Code Lab */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#16191C] to-[#12161A] border-2 border-[#3DDCFF]/40 hover:border-[#3DDCFF] transition-all flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#0E1012] border border-[#3DDCFF] flex items-center justify-center text-[#3DDCFF]">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#3DDCFF]/10 text-[#3DDCFF] font-mono text-[11px] font-bold">
                  EMBEDDED C LAB
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#ECEBE4]">
                Arduino Microcontroller Lab
              </h3>
              <p className="text-xs text-[#9CA3A8] leading-relaxed">
                Write AVR C code, flash the virtual ATmega328P target, and see live Pin 13 LED output and digital pushbuttons respond synchronously.
              </p>
            </div>
            <div className="pt-5">
              <BenchButton
                variant="secondary"
                size="md"
                onClick={() => onNavigate('code-lab')}
                icon={<Code2 className="w-4 h-4" />}
                className="w-full"
              >
                Open Arduino Code Lab 💻
              </BenchButton>
            </div>
          </div>
        </div>

        {/* Real Syllabus Roadmap (Duolingo Learning Path) (12 cols) */}
        <div className="lg:col-span-12 rounded-3xl border border-[#282E33] bg-[#16191C] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#282E33] gap-2">
            <div>
              <span className="text-xs font-mono text-[#C6FF3D] font-bold uppercase tracking-wider block mb-1">
                OFFICIAL COLLEGE SYLLABUS ROADMAP
              </span>
              <h3 className="font-display text-xl font-bold text-[#ECEBE4]">
                {syllabus.courseName} ({syllabus.yearName})
              </h3>
            </div>

            <button
              onClick={onOpenSyllabusModal}
              className="text-xs font-mono text-[#3DDCFF] hover:underline"
            >
              Switch Syllabus ›
            </button>
          </div>

          {/* Unit Sections */}
          <div className="space-y-6">
            {syllabus.units.map((unit) => (
              <div key={unit.id} className="p-5 rounded-2xl bg-[#0E1012] border border-[#282E33] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#282E33] pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-[#ECEBE4]">
                      {unit.title}
                    </h4>
                    <p className="text-xs text-[#9CA3A8] mt-0.5">
                      {unit.description}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#1D2125] text-xs font-mono text-[#C6FF3D] font-bold shrink-0">
                    {unit.examWeight}
                  </span>
                </div>

                {/* Topics in this unit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {unit.topics.map((topic) => (
                    <div
                      key={topic.id}
                      onClick={() => onNavigate('lab')}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        topic.isCompleted
                          ? 'border-[#C6FF3D]/40 bg-[#16191C] hover:border-[#C6FF3D]'
                          : 'border-[#282E33] bg-[#16191C]/60 hover:border-[#525C64]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-[#ECEBE4] truncate">
                            {topic.title}
                          </span>
                          {topic.isCompleted ? (
                            <span className="text-[#C6FF3D] font-bold text-xs shrink-0">✓</span>
                          ) : (
                            <span className="text-[10px] text-[#9CA3A8] font-mono shrink-0">+{topic.xp} XP</span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#9CA3A8] line-clamp-2">
                          {topic.ruleSummary}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#282E33] text-[10px] font-mono text-[#3DDCFF] font-semibold">
                        {topic.isCompleted ? 'Completed • Review Again' : 'Practice in Lab ›'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
