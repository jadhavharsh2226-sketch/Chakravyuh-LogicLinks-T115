import React from 'react';
import { ArrowUpRight, Zap, Target, Lock, Play } from 'lucide-react';
import { MISSIONS } from '../../engine/missions';
import { BenchBadge } from '../common/BenchBadge';
import { BenchButton } from '../common/BenchButton';

interface MissionGalleryProps {
  onSelectMission: (missionId: string) => void;
}

export const MissionGallery: React.FC<MissionGalleryProps> = ({ onSelectMission }) => {
  const friendlyDetails: Record<string, { title: string; subtitle: string; objective: string; difficulty: string }> = {
    'mission-001': {
      title: 'Two-Switch Safe Lock',
      subtitle: 'Learn the AND Gate',
      objective: 'Make the light turn ON only when both switches are flipped ON.',
      difficulty: 'Easy (5 mins)',
    },
    'mission-002': {
      title: 'Staircase Light Switch',
      subtitle: 'Learn the XOR Gate',
      objective: 'Flip either switch from top or bottom of the stairs to toggle the light bulb.',
      difficulty: 'Medium (10 mins)',
    },
    'mission-003': {
      title: 'Secret 3-Digit Vault Code',
      subtitle: 'Combine Multiple Gates',
      objective: 'Unlock the safe only when the secret code (Switch 1 ON, Switch 2 OFF, Switch 3 ON) is entered.',
      difficulty: 'Fun Challenge (15 mins)',
    },
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'mission-001':
        return <Zap className="w-5 h-5 text-[#C6FF3D]" />;
      case 'mission-002':
        return <Target className="w-5 h-5 text-[#3DDCFF]" />;
      case 'mission-003':
        return <Lock className="w-5 h-5 text-[#FFB020]" />;
      default:
        return <Zap className="w-5 h-5 text-[#C6FF3D]" />;
    }
  };

  return (
    <section className="py-20 border-t border-[#282E33] bg-[#0E1012]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs text-[#C6FF3D] font-bold tracking-widest uppercase block mb-2">
            STEP-BY-STEP CHALLENGES
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#ECEBE4]">
            Beginner-Friendly Practice Lessons
          </h2>
          <p className="text-sm text-[#9CA3A8] mt-3">
            Short, hands-on puzzles designed specifically for exams and lab practicals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MISSIONS.map((mission) => {
            const info = friendlyDetails[mission.id] || {
              title: mission.title,
              subtitle: mission.subtitle,
              objective: mission.objective,
              difficulty: mission.difficulty,
            };

            return (
              <div
                key={mission.id}
                className="group relative rounded-2xl border border-[#282E33] bg-[#16191C] p-6 hover:border-[#525C64] hover:bg-[#1D2125] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#646F77]">
                      LESSON #{mission.number}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1D2125] border border-[#282E33] text-xs font-mono font-semibold text-[#ECEBE4]">
                      {info.difficulty}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="p-2.5 rounded-xl bg-[#0E1012] border border-[#282E33] shrink-0">
                      {getIcon(mission.id)}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#ECEBE4] group-hover:text-white transition-colors">
                        {info.title}
                      </h3>
                      <div className="text-xs font-mono text-[#3DDCFF]">
                        {info.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Objective */}
                  <p className="text-xs text-[#9CA3A8] leading-relaxed mb-6 font-sans">
                    {info.objective}
                  </p>
                </div>

                <div>
                  <div className="pt-4 border-t border-[#282E33] flex items-center justify-between text-xs font-mono text-[#9CA3A8] mb-4">
                    <span>Reward:</span>
                    <span className="text-[#C6FF3D] font-bold">+{mission.xp} XP</span>
                  </div>

                  <BenchButton
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                    onClick={() => onSelectMission(mission.id)}
                    icon={<Play className="w-3.5 h-3.5 fill-current" />}
                    iconPosition="left"
                  >
                    Start Lesson
                  </BenchButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
