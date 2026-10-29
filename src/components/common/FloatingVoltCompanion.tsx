import React, { useState } from 'react';
import { motion, AnimatePresence } from 'lucide-react';
import { Volt3DCanvas } from './Volt3DCanvas';
import { VoltExpression } from './VoltCharacter';
import { sounds } from '../../services/soundEffects';
import { StudentProfile } from '../../types/student';
import { UNIVERSITY_SYLLABI } from '../../services/syllabusData';
import { MessageSquare, Sparkles, X, Smile, Trophy, Minimize2, Maximize2 } from 'lucide-react';

interface FloatingVoltCompanionProps {
  currentView: string;
  studentProfile: StudentProfile;
  onNavigate: (view: string) => void;
}

export const FloatingVoltCompanion: React.FC<FloatingVoltCompanionProps> = ({
  currentView,
  studentProfile,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expression, setExpression] = useState<VoltExpression>('happy');
  const [bubbleText, setBubbleText] = useState<string>("Hey! I'm here to help ⚡");

  const syllabus = UNIVERSITY_SYLLABI[studentProfile.track] || UNIVERSITY_SYLLABI.ENTC_SEMESTER_1_2;

  const handleMascotClick = () => {
    sounds.playChirp();
    setIsOpen(!isOpen);
    setExpression('celebrating');
    setBubbleText(`Need help with ${syllabus.courseName.split(' ')[0]}? Click a button below! 💡`);
  };

  const handleJokeClick = () => {
    sounds.playChirp();
    const jokes = [
      "Why did the circuit board break up? There was no connection! 💔⚡",
      "Why do engineers love dark mode? Because light attracts bugs! 🪲",
      "Volt says: Don't stress! Even microchips need a reset button sometimes. 🔄",
      "Remember: In an XOR gate, two wrongs (0,0) or two rights (1,1) make a 0! Only opposites attract! 😄",
    ];
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    setExpression('stress_relief');
    setBubbleText(randomJoke);
  };

  // Don't show in full login view to avoid doubling the mascot on login screen
  if (currentView === 'login') return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end select-none font-sans pointer-events-auto">
      {/* Expanded Quick-Action Card */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 rounded-3xl bg-[#16191C]/95 backdrop-blur-xl border-2 border-[#C6FF3D] p-4 text-xs shadow-2xl shadow-black/80 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-[#282E33] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C6FF3D] animate-ping" />
              <span className="font-bold text-sm text-[#ECEBE4]">Volt 3D Companion</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#9CA3A8] hover:text-[#ECEBE4] hover:bg-[#1D2125]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Speech bubble */}
          <div className="p-3 rounded-2xl bg-[#0E1012] border border-[#282E33] text-xs text-[#ECEBE4] leading-relaxed">
            {bubbleText}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('chakravyuha');
                setIsOpen(false);
              }}
              className="p-2 rounded-xl bg-[#1D2125] border border-[#282E33] hover:border-[#C6FF3D] text-[#C6FF3D] font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
            >
              <Trophy className="w-3.5 h-3.5 text-[#C6FF3D]" />
              <span>CHAKRAVYUH</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('lab');
                setIsOpen(false);
              }}
              className="p-2 rounded-xl bg-[#1D2125] border border-[#282E33] hover:border-[#3DDCFF] text-[#3DDCFF] font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3DDCFF]" />
              <span>Circuit Lab</span>
            </button>
          </div>

          <button
            onClick={handleJokeClick}
            className="w-full py-1.5 px-3 rounded-xl bg-[#0E1012] border border-[#282E33] hover:border-[#FFB020] text-[#FFB020] text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Volt, tell me a quick joke! ☕</span>
          </button>
        </div>
      )}

      {/* Floating 3D Robot Mascot */}
      <div className="relative group flex items-center">
        {/* Floating tooltip badge */}
        {!isOpen && (
          <div className="hidden group-hover:block absolute right-24 top-6 bg-[#16191C] border border-[#C6FF3D] text-[#ECEBE4] px-3 py-1.5 rounded-2xl text-[11px] font-mono whitespace-nowrap shadow-xl">
            Click Volt for 3D spin & help! ⚡
          </div>
        )}

        <div className="relative">
          <Volt3DCanvas
            expression={expression}
            size="md"
            onClick={handleMascotClick}
            className="drop-shadow-[0_10px_20px_rgba(0,210,255,0.3)] filter"
          />
        </div>
      </div>
    </div>
  );
};
