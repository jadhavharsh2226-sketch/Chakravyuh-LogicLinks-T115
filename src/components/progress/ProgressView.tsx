import React from 'react';
import { Trophy, Award, CheckCircle2, Zap, Shield, Sparkles } from 'lucide-react';
import { BenchBadge } from '../common/BenchBadge';

export const ProgressView: React.FC = () => {
  const achievements = [
    {
      id: 'ach-1',
      title: 'First Ignition',
      desc: 'Successfully illuminated your first status LED via combinational logic.',
      unlocked: true,
      xp: '+100 XP',
    },
    {
      id: 'ach-2',
      title: 'XOR Parity Master',
      desc: 'Validated a 2-bit parity checker with zero vector mismatches.',
      unlocked: true,
      xp: '+250 XP',
    },
    {
      id: 'ach-3',
      title: 'Silicon Surgeon',
      desc: 'Diagnosed and repaired an inverted strobe defect in Fault Arena.',
      unlocked: true,
      xp: '+300 XP',
    },
    {
      id: 'ach-4',
      title: 'De Morgan Disciple',
      desc: 'Synthesized an entire arithmetic logic unit strictly utilizing NAND gates.',
      unlocked: false,
      xp: '+500 XP',
    },
  ];

  const topics = [
    { name: 'Combinational Logic & Boolean Algebra', score: 85, color: '#C6FF3D' },
    { name: 'Fault Diagnostics & Boundary Scan', score: 62, color: '#3DDCFF' },
    { name: 'Timing Verification & Gate Delays', score: 40, color: '#FFB020' },
    { name: 'Arithmetic Circuit Synthesis (Adders/ALU)', score: 25, color: '#9CA3A8' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 select-none font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#282E33]">
        <div>
          <span className="text-[11px] text-[#C6FF3D] font-bold uppercase tracking-wider block mb-1">
            HARDWARE VERIFICATION TELEMETRY
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#ECEBE4]">
            Engineering Mastery & Telemetry
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded bg-[#16191C] border border-[#282E33] text-[#ECEBE4] font-bold">
            LEVEL 3 — TECHNICIAN
          </div>
          <div className="px-3 py-1.5 rounded bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D] font-bold">
            850 TOTAL XP
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Topic Mastery Progress Bars (6 cols) */}
        <div className="lg:col-span-6 rounded-instrument border border-[#282E33] bg-[#16191C] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#282E33] pb-3">
            <span className="font-bold text-[#ECEBE4] uppercase">
              COMPETENCY BENCHMARKS
            </span>
            <span className="text-[#C6FF3D] font-bold">AVERAGE: 53%</span>
          </div>

          <div className="space-y-4">
            {topics.map((t) => (
              <div key={t.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#ECEBE4] font-sans text-xs">{t.name}</span>
                  <span style={{ color: t.color }} className="font-bold">
                    {t.score}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0E1012] border border-[#282E33] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${t.score}%`, backgroundColor: t.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Badges & Achievements (6 cols) */}
        <div className="lg:col-span-6 rounded-instrument border border-[#282E33] bg-[#16191C] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#282E33] pb-3">
            <span className="font-bold text-[#ECEBE4] uppercase">
              VERIFIED MILESTONES
            </span>
            <span className="text-[#9CA3A8]">3 / 4 UNLOCKED</span>
          </div>

          <div className="space-y-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3 rounded-bench border flex items-center justify-between ${
                  ach.unlocked
                    ? 'border-[#282E33] bg-[#0E1012] text-[#ECEBE4]'
                    : 'border-[#282E33]/40 bg-[#0E1012]/40 text-[#525C64]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center border ${
                      ach.unlocked
                        ? 'border-[#C6FF3D] bg-[#C6FF3D]/10 text-[#C6FF3D]'
                        : 'border-[#282E33] text-[#525C64]'
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">{ach.title}</div>
                    <div className="text-[11px] text-[#9CA3A8] font-sans">
                      {ach.desc}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold ${
                    ach.unlocked ? 'text-[#C6FF3D]' : 'text-[#646F77]'
                  }`}
                >
                  {ach.xp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
