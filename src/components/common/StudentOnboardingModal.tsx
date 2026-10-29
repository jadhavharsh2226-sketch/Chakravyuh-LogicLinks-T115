import React, { useState } from 'react';
import { X, Check, GraduationCap, Sparkles, BookOpen, Clock, Target, ArrowRight } from 'lucide-react';
import { StudentProfile, AcademicTrack, StudentGoal } from '../../types/student';
import { UNIVERSITY_SYLLABI } from '../../services/syllabusData';
import { VoltCharacter } from './VoltCharacter';
import { BenchButton } from './BenchButton';
import { sounds } from '../../services/soundEffects';

interface StudentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StudentProfile;
  onSaveProfile: (updatedProfile: StudentProfile) => void;
}

export const StudentOnboardingModal: React.FC<StudentOnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<AcademicTrack>(currentProfile.track);
  const [selectedGoal, setSelectedGoal] = useState<StudentGoal>(currentProfile.goal);
  const [dailyMinutes, setDailyMinutes] = useState<number>(currentProfile.dailyGoalMinutes);

  if (!isOpen) return null;

  const tracks: Array<{ id: AcademicTrack; title: string; subtitle: string; icon: string }> = [
    {
      id: 'BCA_YEAR_1',
      title: 'BCA 1st Year (Sem 1 & 2)',
      subtitle: 'Digital Computer Fundamentals • Logic Gates • Truth Tables • De Morgan’s Laws',
      icon: '🎓',
    },
    {
      id: 'BCA_YEAR_2',
      title: 'BCA 2nd Year (Sem 3 & 4)',
      subtitle: 'Computer Architecture (COA) • K-Maps • Adders • Multiplexers • Flip-Flops',
      icon: '💻',
    },
    {
      id: 'BTECH_CS',
      title: 'B.Tech / B.E. Computer Science',
      subtitle: 'Digital Logic Design • Propagation Delays • Parity Generators • Decoders',
      icon: '⚙️',
    },
    {
      id: 'DIPLOMA_CS',
      title: 'Diploma in Computer / IT',
      subtitle: 'Digital Techniques Practical • 7408, 7432, 7404 TTL Pinouts • Breadboard Testing',
      icon: '📐',
    },
    {
      id: 'BEGINNER',
      title: 'Absolute Beginner Track',
      subtitle: 'Zero math or electronics background required • Fun visual analogies',
      icon: '🌟',
    },
  ];

  const goals: Array<{ id: StudentGoal; label: string; desc: string }> = [
    { id: 'EXAM_PREP', label: 'College Exam & Viva Prep', desc: 'Focus on university questions, definitions, and truth table proofs' },
    { id: 'PRACTICAL_LABS', label: 'Lab Practicals & Experiments', desc: 'Master breadboard wiring, pinouts, and test vectors' },
    { id: 'UNDERSTAND_CPU', label: 'Understand How CPUs Work', desc: 'See how simple switches combine into full binary arithmetic calculators' },
  ];

  const handleSave = () => {
    sounds.playLevelUp();
    onSaveProfile({
      ...currentProfile,
      track: selectedTrack,
      goal: selectedGoal,
      dailyGoalMinutes: dailyMinutes,
    });
    onClose();
  };

  const currentSyllabus = UNIVERSITY_SYLLABI[selectedTrack] || UNIVERSITY_SYLLABI.BCA_YEAR_1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
      <div className="w-full max-w-2xl rounded-3xl border-2 border-[#C6FF3D]/40 bg-[#16191C] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Volt */}
        <div className="p-6 bg-[#1D2125] border-b border-[#282E33] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <VoltCharacter expression="excited" size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#C6FF3D] uppercase">
                  CUSTOMIZE YOUR SYLLABUS
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-[#ECEBE4] mt-0.5">
                Which course are you studying?
              </h2>
              <p className="text-xs text-[#9CA3A8] mt-0.5">
                Volt will customize all lessons, hints, and exam tips to your exact curriculum!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9CA3A8] hover:text-[#ECEBE4] hover:bg-[#16191C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Step 1: Select Academic Track */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-[#ECEBE4] uppercase tracking-wider block">
              1. Select Your Course & Semester
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {tracks.map((t) => {
                const isSelected = selectedTrack === t.id;

                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedTrack(t.id);
                    }}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#C6FF3D] bg-[#C6FF3D]/10 shadow-md'
                        : 'border-[#282E33] bg-[#0E1012] hover:border-[#525C64]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{t.icon}</span>
                      <div>
                        <div className="font-bold text-sm text-[#ECEBE4]">
                          {t.title}
                        </div>
                        <div className="text-xs text-[#9CA3A8] mt-0.5">
                          {t.subtitle}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-[#C6FF3D] text-[#0E1012] flex items-center justify-center font-bold text-xs shrink-0">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Syllabus Preview */}
          <div className="p-4 rounded-2xl border border-[#3DDCFF]/30 bg-[#3DDCFF]/5 space-y-1.5 font-sans">
            <div className="flex items-center gap-2 text-xs font-bold text-[#3DDCFF]">
              <BookOpen className="w-4 h-4" />
              <span>Official Syllabus Matched:</span>
            </div>
            <div className="text-xs text-[#ECEBE4]">
              <strong>{currentSyllabus.standardReference}</strong>
            </div>
            <div className="text-[11px] text-[#9CA3A8]">
              Units covered: {currentSyllabus.units.map(u => u.title).join(' • ')}
            </div>
          </div>

          {/* Step 2: Select Goal */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-[#ECEBE4] uppercase tracking-wider block">
              2. What is your primary focus?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {goals.map((g) => {
                const isSelected = selectedGoal === g.id;

                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setSelectedGoal(g.id);
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#3DDCFF] bg-[#3DDCFF]/10 text-[#ECEBE4]'
                        : 'border-[#282E33] bg-[#0E1012] text-[#9CA3A8] hover:border-[#525C64]'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#ECEBE4] mb-1">
                      {g.label}
                    </div>
                    <div className="text-[11px] text-[#9CA3A8] leading-tight">
                      {g.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Daily Pace */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-[#ECEBE4] uppercase tracking-wider block">
              3. Daily Learning Goal
            </span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { mins: 5, label: 'Casual (5 mins / day)' },
                { mins: 10, label: 'Regular (10 mins / day)' },
                { mins: 20, label: 'Intense (20 mins / day)' },
              ].map((pace) => (
                <button
                  key={pace.mins}
                  onClick={() => {
                    sounds.playClick();
                    setDailyMinutes(pace.mins);
                  }}
                  className={`p-2.5 rounded-xl border font-mono text-xs font-bold transition-all ${
                    dailyMinutes === pace.mins
                      ? 'border-[#C6FF3D] bg-[#C6FF3D] text-[#0E1012]'
                      : 'border-[#282E33] bg-[#0E1012] text-[#9CA3A8] hover:text-[#ECEBE4]'
                  }`}
                >
                  {pace.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Footer */}
        <div className="p-5 border-t border-[#282E33] bg-[#1D2125] flex items-center justify-between">
          <div className="text-xs text-[#9CA3A8]">
            ⚡ You can change this anytime from your dashboard!
          </div>

          <BenchButton
            variant="primary"
            size="lg"
            onClick={handleSave}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Save & Start Learning 🚀
          </BenchButton>
        </div>
      </div>
    </div>
  );
};
