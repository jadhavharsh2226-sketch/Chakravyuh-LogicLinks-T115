import React, { useState } from 'react';
import {
  Cpu,
  GraduationCap,
  ArrowRight,
  Shield,
  Wrench,
  Check,
  Zap,
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
  const [selectedGoal, setSelectedGoal] = useState<StudentGoal>('LOGIC_GATE_PRACTICE');

  // Mascot dynamic state
  const [voltExpression, setVoltExpression] = useState<VoltExpression>('happy');
  const [voltSpeech, setVoltSpeech] = useState<string>(
    "Hi there! ⚡ I'm Volt, your Agentic AI assistant. I can wire gates, flip switches, and teach your syllabus!"
  );

  const TRACKS: Array<{
    id: AcademicTrack;
    title: string;
    subtitle: string;
  }> = [
    {
      id: 'ENTC_SEMESTER_1_2',
      title: 'E&TC — First Year (FE)',
      subtitle: 'Basic Electrical & Electronics (BEE) · Gates · Adders',
    },
    {
      id: 'ENTC_SEMESTER_3_4',
      title: 'E&TC — Second Year (SE)',
      subtitle: 'Digital Electronics & Logic Design (DELD) · MUX · K-Maps',
    },
    {
      id: 'ENTC_SEMESTER_5_6',
      title: 'E&TC — Third Year (TE)',
      subtitle: 'Microcontrollers · ATmega328P · Embedded C Firmware',
    },
    {
      id: 'BCA_YEAR_1',
      title: 'BCA — 1st Year',
      subtitle: 'Computer Fundamentals · Boolean Algebra · Truth Tables',
    },
    {
      id: 'BCA_YEAR_2',
      title: 'BCA — 2nd Year',
      subtitle: 'Computer Architecture · 8085 Microprocessor · Registers',
    },
    {
      id: 'BTECH_CS',
      title: 'B.Tech — CSE / IT',
      subtitle: 'Digital Systems & Binary Arithmetic · Hardware Logic',
    },
  ];

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const track = e.target.value as AcademicTrack;
    sounds.playClick();
    setSelectedTrack(track);
    setVoltExpression('excited');
    const syllabus = UNIVERSITY_SYLLABI[track];
    setVoltSpeech(`Great choice! Loaded official ${syllabus?.yearName || 'Syllabus'}! 🎯`);
  };

  const handleGoalSelect = (goal: StudentGoal) => {
    sounds.playClick();
    setSelectedGoal(goal);
    setVoltExpression('celebrating');
    if (goal === 'LOGIC_GATE_PRACTICE') {
      setVoltSpeech("Logic Gate Practice selected! Master AND, OR, XOR, and Boolean Algebra! ⚡");
    } else if (goal === 'EXAM_PREP') {
      setVoltSpeech("Exam Viva Prep mode! High-yield questions and quick tricks ready! 📚");
    } else {
      setVoltSpeech("Virtual Lab mode! Wire components without burning any ICs! 🔬");
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
      xp: 150,
    };

    onLogin(newProfile);
  };

  return (
    <div className="min-h-screen bg-[#0A0D10] text-[#ECEBE4] flex flex-col justify-between selection:bg-[#C6FF3D] selection:text-[#0A0D10] font-sans antialiased relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E5FF]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C6FF3D]/6 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="h-14 px-6 border-b border-[#20262D] bg-[#111519]/80 backdrop-blur-md flex items-center justify-between z-20 select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0A0D10] border border-[#22282F] flex items-center justify-center text-[#C6FF3D]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-[#ECEBE4]">
              CircuitVerse <span className="text-[#C6FF3D]">AI</span>
            </span>
            <span className="hidden sm:inline text-[11px] text-[#646F77] font-mono ml-2 pl-2 border-l border-[#22282F]">
              Smart E&TC Learning Platform
            </span>
          </div>
        </div>

        <button
          onClick={onViewLanding}
          className="text-xs font-mono text-[#9CA3A8] hover:text-[#ECEBE4] hover:underline"
        >
          View Landing Page ›
        </button>
      </header>

      {/* Center Form Container (Strictly fits without vertical overflow) */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex items-center justify-center z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: 3D Mascot Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <VoltCharacter
                expression={voltExpression}
                size="xl"
                speechText={voltSpeech}
                onClick={() => sounds.playChirp()}
              />
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-[#ECEBE4]">
                Meet Volt, Your 3D Study Buddy
              </h2>
              <p className="text-xs text-[#9CA3A8] max-w-xs mx-auto mt-1 leading-relaxed">
                Personalized digital electronics guidance tailored to your university curriculum.
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-[10px]">
              <span className="px-2.5 py-1 rounded-full bg-[#161C22] border border-[#22282F] text-[#C6FF3D]">
                ✓ SPPU / AICTE Curriculum
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#161C22] border border-[#22282F] text-[#3DDCFF]">
                ✓ Autonomous Agentic AI
              </span>
            </div>
          </div>

          {/* Right Column: Sleek, Focused Sign-in Card */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleFormSubmit}
              className="bg-[#12161A]/95 border border-[#22282F] rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-5"
            >
              <div>
                <div className="font-mono text-[10px] text-[#C6FF3D] font-bold tracking-wider uppercase mb-1">
                  STUDENT ONBOARDING
                </div>
                <h1 className="font-display text-2xl font-bold text-[#ECEBE4]">
                  Enter Your Engineering Workbench
                </h1>
                <p className="text-xs text-[#9CA3A8] mt-0.5">
                  Set your degree and focus so Volt can customize your logic lessons.
                </p>
              </div>

              {/* Student Name & College */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#9CA3A8] uppercase mb-1">
                    Your Name
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D10] border border-[#22282F] focus:border-[#C6FF3D] text-[#ECEBE4] text-xs outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#9CA3A8] uppercase mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. DYPSEM Pune"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D10] border border-[#22282F] focus:border-[#C6FF3D] text-[#ECEBE4] text-xs outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Degree / Academic Year Select */}
              <div>
                <label className="block text-[11px] font-mono text-[#9CA3A8] uppercase mb-1">
                  University Degree & Academic Year
                </label>
                <div className="relative">
                  <select
                    value={selectedTrack}
                    onChange={handleTrackChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D10] border border-[#22282F] focus:border-[#C6FF3D] text-[#ECEBE4] text-xs outline-none transition-colors appearance-none cursor-pointer"
                  >
                    {TRACKS.map((t) => (
                      <option key={t.id} value={t.id} className="bg-[#12161A] text-[#ECEBE4]">
                        {t.title} — {t.subtitle}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#646F77] text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Learning Goal Pills */}
              <div>
                <label className="block text-[11px] font-mono text-[#9CA3A8] uppercase mb-1.5">
                  What's Your Main Focus?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'LOGIC_GATE_PRACTICE' as StudentGoal,
                      label: 'Logic Circuits',
                      sub: 'Gates & Truth Tables',
                      icon: <Cpu className="w-3.5 h-3.5 text-[#C6FF3D]" />,
                    },
                    {
                      id: 'EXAM_PREP' as StudentGoal,
                      label: 'Exams & Viva',
                      sub: 'High-Yield Q&A',
                      icon: <GraduationCap className="w-3.5 h-3.5 text-[#3DDCFF]" />,
                    },
                    {
                      id: 'PRACTICAL_LABS' as StudentGoal,
                      label: 'Virtual Labs',
                      sub: 'Zero-Burn Circuit',
                      icon: <Wrench className="w-3.5 h-3.5 text-[#FFB020]" />,
                    },
                  ].map((g) => {
                    const isSelected = selectedGoal === g.id;
                    return (
                      <div
                        key={g.id}
                        onClick={() => handleGoalSelect(g.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all text-center select-none ${
                          isSelected
                            ? 'bg-[#182026] border-[#C6FF3D] text-[#ECEBE4] shadow-[0_0_10px_rgba(198,255,61,0.12)]'
                            : 'bg-[#0A0D10] border-[#22282F] text-[#9CA3A8] hover:border-[#38424D]'
                        }`}
                      >
                        <div className="flex justify-center mb-1">{g.icon}</div>
                        <div className="font-bold text-xs">{g.label}</div>
                        <div className="text-[10px] text-[#646F77] truncate">{g.sub}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onExploreGuest}
                  className="text-xs font-mono text-[#9CA3A8] hover:text-[#ECEBE4] flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-[#3DDCFF]" />
                  <span>1-Click Guest Bypass</span>
                </button>

                <BenchButton
                  variant="primary"
                  size="lg"
                  type="submit"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="w-full sm:w-auto"
                >
                  Enter Workbench ➔
                </BenchButton>
              </div>
            </form>
          </div>

        </div>
      </main>

      {/* Clean Bottom Footer */}
      <footer className="h-10 px-6 border-t border-[#20262D] flex items-center justify-between text-[11px] font-mono text-[#646F77] z-20">
        <span>CircuitVerse AI</span>
        <span>Smart E&TC Platform · Powered by Volt Agentic AI</span>
      </footer>
    </div>
  );
};
