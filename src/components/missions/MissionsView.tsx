import React, { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { MISSIONS } from '../../engine/missions';
import { Mission } from '../../types';
import { BenchButton } from '../common/BenchButton';

interface MissionsViewProps {
  onSelectMission: (missionId: string) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({ onSelectMission }) => {
  const [selectedMission, setSelectedMission] = useState<Mission>(MISSIONS[0]);

  const friendlyTitles: Record<string, { title: string; subtitle: string; objective: string; difficulty: string }> = {
    'mission-001': {
      title: 'Two-Switch Safe Lock',
      subtitle: 'Learn the AND Gate',
      objective: 'Make the light bulb turn ON only when both switches are flipped ON.',
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

  const currentInfo = friendlyTitles[selectedMission.id] || {
    title: selectedMission.title,
    subtitle: selectedMission.subtitle,
    objective: selectedMission.objective,
    difficulty: selectedMission.difficulty,
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 select-none font-sans text-xs">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#282E33]">
        <div>
          <span className="text-xs text-[#C6FF3D] font-mono font-bold uppercase tracking-wider block mb-1">
            STEP-BY-STEP LAB PRACTICALS
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#ECEBE4]">
            Gate Lessons
          </h1>
        </div>
        <p className="text-xs text-[#9CA3A8] max-w-sm">
          Hands-on challenges designed for BCA, B.Tech, and diploma digital electronics practicals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Lessons List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-[11px] text-[#646F77] font-mono uppercase font-bold px-1">
            Available Lessons ({MISSIONS.length})
          </div>

          {MISSIONS.map((m) => {
            const isSelected = selectedMission.id === m.id;
            const info = friendlyTitles[m.id] || {
              title: m.title,
              subtitle: m.subtitle,
              difficulty: m.difficulty,
            };

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMission(m)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                  isSelected
                    ? 'border-[#C6FF3D] bg-[#16191C] shadow-lg'
                    : 'border-[#282E33] bg-[#16191C]/50 hover:border-[#525C64] hover:bg-[#16191C]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#646F77]">
                    LESSON #{m.number}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1D2125] text-xs font-mono font-bold text-[#ECEBE4]">
                    {info.difficulty}
                  </span>
                </div>

                <div className="font-bold text-base text-[#ECEBE4]">
                  {info.title}
                </div>

                <div className="text-xs text-[#3DDCFF]">
                  {info.subtitle}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Lesson Brief */}
        <div className="lg:col-span-7 rounded-2xl border border-[#282E33] bg-[#16191C] p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-start justify-between pb-4 border-b border-[#282E33]">
              <div>
                <span className="text-[#C6FF3D] font-mono text-xs font-bold">
                  LESSON #{selectedMission.number}
                </span>
                <h2 className="font-display text-2xl font-bold text-[#ECEBE4] mt-1">
                  {currentInfo.title}
                </h2>
                <div className="text-xs text-[#3DDCFF] mt-0.5 font-mono">
                  {currentInfo.subtitle}
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E1012] border border-[#282E33] text-[#C6FF3D] font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+{selectedMission.xp} XP</span>
              </div>
            </div>

            {/* Objective */}
            <div className="space-y-1.5">
              <span className="text-xs text-[#9CA3A8] uppercase font-bold tracking-wider block font-mono">
                Your Goal:
              </span>
              <p className="text-sm text-[#ECEBE4] p-3.5 rounded-xl bg-[#0E1012] border border-[#282E33] leading-relaxed">
                {currentInfo.objective}
              </p>
            </div>

            {/* Target Truth table */}
            <div className="space-y-2">
              <span className="text-xs text-[#9CA3A8] uppercase font-bold tracking-wider block font-mono">
                Truth Table You Must Achieve:
              </span>
              <div className="p-3 rounded-xl bg-[#0E1012] border border-[#282E33] max-h-36 overflow-y-auto font-mono text-xs">
                <div className="grid grid-cols-3 gap-2 text-[#646F77] font-bold border-b border-[#282E33] pb-1">
                  <span>Row</span>
                  <span>Switches ({selectedMission.targetTruthTable.inputs.join(', ')})</span>
                  <span>Light Bulb</span>
                </div>
                <div className="divide-y divide-[#1D2125]">
                  {selectedMission.targetTruthTable.rows.map((r, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 py-1.5 text-[#ECEBE4]">
                      <span className="text-[#646F77]">#{i + 1}</span>
                      <span className="text-[#3DDCFF]">({r.inputs.join(', ')})</span>
                      <span className={r.outputs[0] === 1 ? 'text-[#C6FF3D] font-bold' : 'text-[#646F77]'}>
                        {r.outputs[0] === 1 ? '1 (GLOWING)' : '0 (OFF)'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hints */}
            <div className="space-y-1.5">
              <span className="text-xs text-[#9CA3A8] uppercase font-bold tracking-wider block font-mono">
                Tips to Solve:
              </span>
              <div className="space-y-1.5">
                {selectedMission.hints.map((hint, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#0E1012] text-[#9CA3A8] text-xs">
                    💡 {hint}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#282E33] flex items-center justify-between">
            <span className="text-xs text-[#9CA3A8]">
              Estimated time: {selectedMission.estDuration}
            </span>
            <BenchButton
              variant="primary"
              size="lg"
              onClick={() => onSelectMission(selectedMission.id)}
              icon={<Play className="w-4 h-4 fill-current" />}
            >
              Open in Playground 🚀
            </BenchButton>
          </div>
        </div>
      </div>
    </div>
  );
};
