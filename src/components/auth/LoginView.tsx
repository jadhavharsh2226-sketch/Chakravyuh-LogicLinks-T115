import React, { useState } from 'react';
import {
  Cpu,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Shield,
  BookOpen,
  Wrench,
  Check,
  Flame,
  Zap,
  Code2,
} from 'lucide-react';
import { VoltCharacter, VoltExpression } from '../common/VoltCharacter';
import { BenchButton } from '../common/BenchButton';
import { sounds } from '../../services/soundEffects';
import { AcademicTrack, StudentGoal, StudentProfile } from '../../types/student';
import { UNIVERSITY_SYLLABI, DEFAULT_STUDENT_PROFILE } from '../../services/syllabusData';

interface LoginViewProps {
  onLogin: (profile: StudentProfile) => void;
  onExploreGuest: () => void;
  onViewLanding: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onExploreGuest,
  onViewLanding,
}) => {
  const [studentName, setStudentName] = useState('Harsh Jadhav');
  const [collegeName, setCollegeName] = useState('DYPSEM Pune');
  const [selectedTrack, setSelectedTrack] = useState<AcademicTrack>('ENTC_SEMESTER_1_2');
  const [selectedGoal, setSelectedGoal] = useState<StudentGoal>('CHAKRAVYUH_CHALLENGE');
  const [dailyMinutes, setDailyMinutes] = useState<number>(10);

  // Mascot dynamic state
  const [voltExpression, setVoltExpression] = useState<VoltExpression>('happy');
  const [voltSpeech, setVoltSpeech] = useState<string>(
    "Hi there! ⚡ I'm Volt, your personal AI mentor. Let's customize your electronics syllabus!"
  );

  const TRACKS: Array<{
    id: AcademicTrack;
    title: string;
    subtitle: string;
    badge: string;
    icon: string;
  }> = [
    {
      id: 'ENTC_SEMESTER_1_2',
      title: 'E&TC — First Year (FE)',
      subtitle: 'Basic Electrical & Electronics (BEE) · Logic Gates · Adders',
      badge: 'SPPU / AICTE Core',
      icon: '⚡',
    },
    {
      id: 'ENTC_SEMESTER_3_4',
      title: 'E&TC — Second Year (SE)',
      subtitle: 'Digital Electronics & Logic Design (DELD) · K-Maps · MUX',
      badge: 'DELD Syllabus',
      icon: '🛠️',
    },
    {
      id: 'ENTC_SEMESTER_5_6',
      title: 'E&TC — Third Year (TE)',
      subtitle: 'Microcontrollers · ATmega328P · Embedded Systems',
      badge: 'Hardware & IoT',
      icon: '🤖',
    },
    {
      id: 'BCA_YEAR_1',
      title: 'BCA — 1st Year',
      subtitle: 'Digital Computer Fundamentals · De Morgan · Truth Tables',
      badge: 'University BCA',
      icon: '💻',
    },
    {
      id: 'BCA_YEAR_2',
      title: 'BCA — 2nd Year',
      subtitle: 'Computer Architecture · Registers · Microprocessors',
      badge: 'BCA Semester 3-4',
      icon: '🧠',
    },
    {
      id: 'BTECH_CS',
      title: 'B.Tech — CSE / IT',
      subtitle: 'Digital Systems & Binary Arithmetic · Hardware Logic',
      badge: 'CS Engineering',
      icon: '🚀',
    },
  ];

  const GOALS: Array<{
    id: StudentGoal;
    title: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'CHAKRAVYUH_CHALLENGE',
      title: 'Win CHAKRAVYUH 2026 Hackathon',
      description: 'Timed multi-stage circuit puzzles & hardware glitch hunting.',
      icon: <Shield className="w-4 h-4 text-[#C6FF3D]" />,
    },
    {
      id: 'EXAM_PREP',
      title: 'Crack Semester Exams & Viva',
      description: 'High-yield exam questions, truth tables & cheat sheets.',
      icon: <GraduationCap className="w-4 h-4 text-[#3DDCFF]" />,
    },
    {
      id: 'PRACTICAL_LABS',
      title: 'Master Lab Practicals',
      description: 'Zero-burn virtual workbench for breadboards and wiring.',
      icon: <Wrench className="w-4 h-4 text-[#FFB020]" />,
    },
    {
      id: 'ARDUINO_EMBEDDED',
      title: 'Learn Embedded C & Arduino',
      description: 'Firmware programming with virtual Pin 13 LED & ATmega.',
      icon: <Code2 className="w-4 h-4 text-[#3DDCFF]" />,
    },
  ];

  const handleTrackChange = (track: AcademicTrack) => {
    sounds.playClick();
    setSelectedTrack(track);
    setVoltExpression('excited');
    const syllabus = UNIVERSITY_SYLLABI[track];
    setVoltSpeech(`Awesome! Loaded official ${syllabus?.yearName || 'Syllabus'}! Ready to make digital logic easy! 🎯`);
  };

  const handleGoalChange = (goal: StudentGoal) => {
    sounds.playClick();
    setSelectedGoal(goal);
    setVoltExpression('celebrating');
    if (goal === 'CHAKRAVYUH_CHALLENGE') {
      setVoltSpeech("CHAKRAVYUH! 🛡️ The 3-layer maze awaits! I'll guide you through Padmavyuha & Karmavyuha!");
    } else if (goal === 'EXAM_PREP') {
      setVoltSpeech("Exam prep mode on! 📚 I'll give you quick tips and viva-tested explanations!");
    } else {
      setVoltSpeech("Hands-on mode! Let's wire components without burning any ICs! 🔥");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playLevelUp();

    const newProfile: StudentProfile = {
      ...DEFAULT_STUDENT_PROFILE,
      name: studentName.trim() || 'Student Engineer',
      track: selectedTrack,
      goal: selectedGoal,
      dailyGoalMinutes: dailyMinutes,
      xp: 150, // Welcome bonus XP!
    };

    onLogin(newProfile);
  };

  return (
    <div className="min-h-screen bg-[#0E1012] text-[#ECEBE4] flex flex-col justify-between selection:bg-[#C6FF3D] selection:text-[#0E1012] font-sans antialiased">
      {/* Top Navbar */}
      <header className="py-4 px-6 border-b border-[#282E33] bg-[#16191C]/80 backdrop-blur-md flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0E1012] border border-[#282E33] flex items-center justify-center text-[#C6FF3D]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-bold text-sm tracking-tight text-[#ECEBE4]">
              CircuitVerse <span className="text-[#C6FF3D]">AI</span>
            </div>
            <div className="text-[10px] text-[#9CA3A8] font-mono">
              Smart ENTC Learning Platform · CHAKRAVYUH 2026
            </div>
          </div>
        </div>

        <button
          onClick={onViewLanding}
          className="text-xs font-mono text-[#9CA3A8] hover:text-[#ECEBE4] hover:underline"
        >
          View Landing Page ›
        </button>
      </header>

      {/* Main Login Experience */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        {/* Volt Mascot Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <VoltCharacter
            expression={voltExpression}
            size="lg"
            speechText={voltSpeech}
            onClick={() => sounds.playChirp()}
          />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#ECEBE4] mt-3">
            Welcome to Your Digital Workbench
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3A8] max-w-md mt-1">
            Tell us about your university track so Volt can teach you according to your exact syllabus!
          </p>
        </div>

        {/* Card Form */}
        <form
          onSubmit={handleFormSubmit}
          className="bg-[#16191C] border border-[#282E33] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
        >
          {/* Section 1: Student Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#9CA3A8] uppercase mb-1.5">
                Your Name / Nickname
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  setVoltExpression('curious_coding');
                }}
                placeholder="e.g. Harsh Jadhav"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0E1012] border border-[#282E33] focus:border-[#C6FF3D] text-[#ECEBE4] text-xs font-sans outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#9CA3A8] uppercase mb-1.5">
                College / University
              </label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. DYPSEM / SPPU"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0E1012] border border-[#282E33] focus:border-[#C6FF3D] text-[#ECEBE4] text-xs font-sans outline-none transition-all"
              />
            </div>
          </div>

          {/* Section 2: Choose Academic Track */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-[#9CA3A8] uppercase">
                Select Your Degree & Academic Year
              </label>
              <span className="text-[10px] font-mono text-[#C6FF3D] font-bold">
                Tailors Circuit Lessons & Viva Q&A
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRACKS.map((t) => {
                const isSelected = selectedTrack === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => handleTrackChange(t.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                      isSelected
                        ? 'bg-[#C6FF3D]/10 border-[#C6FF3D] text-[#ECEBE4] shadow-[0_0_15px_rgba(198,255,61,0.15)]'
                        : 'bg-[#0E1012] border-[#282E33] text-[#9CA3A8] hover:border-[#525C64]'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#ECEBE4] truncate">
                          {t.title}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#C6FF3D] shrink-0" />}
                      </div>
                      <p className="text-[11px] text-[#9CA3A8] mt-0.5 line-clamp-1">
                        {t.subtitle}
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#1D2125] text-[#3DDCFF]">
                        {t.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Primary Goal */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#9CA3A8] uppercase mb-2">
              What's Your Main Focus Right Now?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GOALS.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => handleGoalChange(g.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 select-none ${
                      isSelected
                        ? 'bg-[#1D2125] border-[#3DDCFF] text-[#ECEBE4]'
                        : 'bg-[#0E1012] border-[#282E33] text-[#9CA3A8] hover:border-[#525C64]'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-[#16191C] border border-[#282E33]">
                      {g.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xs text-[#ECEBE4]">{g.title}</div>
                      <div className="text-[10px] text-[#9CA3A8]">{g.description}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#3DDCFF]" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Daily Goal Commitment */}
          <div className="pt-2 border-t border-[#282E33] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-[#ECEBE4] font-bold block">
                Daily Learning Goal
              </span>
              <span className="text-[11px] text-[#9CA3A8]">
                Bite-sized microlearning to prevent academic burnout
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[
                { mins: 5, label: '5 min (Casual)' },
                { mins: 10, label: '10 min (Regular)' },
                { mins: 20, label: '20 min (Intense)' },
              ].map((m) => (
                <button
                  key={m.mins}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setDailyMinutes(m.mins);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                    dailyMinutes === m.mins
                      ? 'bg-[#C6FF3D]/15 border-[#C6FF3D] text-[#C6FF3D]'
                      : 'bg-[#0E1012] border-[#282E33] text-[#9CA3A8]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onExploreGuest}
              className="text-xs font-mono text-[#9CA3A8] hover:text-[#ECEBE4] flex items-center gap-1.5"
            >
              <span>⚡ Skip to 1-Click Guest Login</span>
            </button>

            <BenchButton
              variant="primary"
              size="lg"
              type="submit"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Start Workbench with Volt (+150 XP) 🚀
            </BenchButton>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-mono text-[#646F77] border-t border-[#282E33]">
        Smart E&TC Learning Platform · Built with Volt AI Mascot for DYPSEM 2026
      </footer>
    </div>
  );
};
