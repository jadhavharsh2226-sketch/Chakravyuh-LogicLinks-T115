import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToggleLeft, Cpu, Lightbulb, Table, ArrowRight } from 'lucide-react';
import { GateSymbol } from '../common/GateSymbol';
import { BenchButton } from '../common/BenchButton';

export const ProofOfInteraction: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: '1. Flip the Switches',
      desc: 'Switches act like light switches in your home. They send either a 1 (electricity ON) or 0 (OFF).',
      icon: <ToggleLeft className="w-5 h-5 text-[#3DDCFF]" />,
      component: (
        <div className="p-6 rounded-2xl bg-[#0E1012] border border-[#282E33] bg-bench-grid flex items-center justify-around">
          <div className="flex flex-col gap-3">
            <div className="px-4 py-2 rounded-lg border border-[#3DDCFF] bg-[#3DDCFF]/15 text-[#3DDCFF] font-mono text-xs font-bold">
              Switch A: ON (1)
            </div>
            <div className="px-4 py-2 rounded-lg border border-[#525C64] bg-[#16191C] text-[#9CA3A8] font-mono text-xs font-bold">
              Switch B: OFF (0)
            </div>
          </div>
          <span className="text-xl text-[#646F77]">➔</span>
          <div className="text-xs text-[#9CA3A8] font-mono">
            Sends 1 and 0 down the wires!
          </div>
        </div>
      ),
    },
    {
      num: '02',
      title: '2. Pick a Logic Gate',
      desc: 'Gates make decisions! An AND gate needs BOTH switches ON. An OR gate needs EITHER switch ON.',
      icon: <Cpu className="w-5 h-5 text-[#C6FF3D]" />,
      component: (
        <div className="p-6 rounded-2xl bg-[#0E1012] border border-[#282E33] bg-bench-grid flex items-center justify-around">
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[#282E33] bg-[#16191C]">
            <GateSymbol type="AND" size={48} signal={0} />
            <span className="font-mono text-xs font-bold text-[#ECEBE4]">AND Gate</span>
            <span className="text-[10px] text-[#9CA3A8]">Both must be ON</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[#C6FF3D] bg-[#C6FF3D]/10">
            <GateSymbol type="OR" size={48} signal={1} />
            <span className="font-mono text-xs font-bold text-[#C6FF3D]">OR Gate</span>
            <span className="text-[10px] text-[#9CA3A8]">Either can be ON</span>
          </div>
        </div>
      ),
    },
    {
      num: '03',
      title: '3. Watch the Bulb Glow',
      desc: 'When the gate outputs a 1, current reaches the light bulb and it illuminates bright cyan!',
      icon: <Lightbulb className="w-5 h-5 text-[#3DDCFF]" />,
      component: (
        <div className="p-6 rounded-2xl bg-[#0E1012] border border-[#282E33] bg-bench-grid flex items-center justify-around">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-[#3DDCFF] font-bold">Gate Output: 1</span>
            <span className="text-[#3DDCFF] font-bold">➔</span>
            <GateSymbol type="LED" signal={1} size={50} />
          </div>
        </div>
      ),
    },
    {
      num: '04',
      title: '4. Instant Truth Table',
      desc: 'No manual paper math needed. Click one button to see the full 0 and 1 truth table for your circuit.',
      icon: <Table className="w-5 h-5 text-[#FFB020]" />,
      component: (
        <div className="p-4 rounded-xl bg-[#0E1012] border border-[#282E33] font-mono text-xs">
          <div className="grid grid-cols-4 gap-2 text-[#9CA3A8] border-b border-[#282E33] pb-1.5 text-[11px] font-bold">
            <span>Switch A</span>
            <span>Switch B</span>
            <span>Bulb</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-[#1D2125]">
            <div className="grid grid-cols-4 gap-2 py-1.5 text-[#ECEBE4]">
              <span>0 (OFF)</span>
              <span>0 (OFF)</span>
              <span>0 (OFF)</span>
              <span className="text-[#C6FF3D]">PASS ✓</span>
            </div>
            <div className="grid grid-cols-4 gap-2 py-1.5 text-[#ECEBE4]">
              <span>0 (OFF)</span>
              <span>1 (ON)</span>
              <span>1 (ON)</span>
              <span className="text-[#C6FF3D]">PASS ✓</span>
            </div>
            <div className="grid grid-cols-4 gap-2 py-1.5 text-[#ECEBE4]">
              <span>1 (ON)</span>
              <span>1 (ON)</span>
              <span>1 (ON)</span>
              <span className="text-[#C6FF3D]">PASS ✓</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-20 border-t border-[#282E33] bg-[#0E1012]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs text-[#C6FF3D] font-bold tracking-widest uppercase block mb-2">
            HOW IT WORKS (IN 4 EASY STEPS)
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#ECEBE4]">
            Build, Test, and Understand in Minutes
          </h2>
          <p className="text-sm text-[#9CA3A8] mt-3">
            Learn digital logic the way modern students do: by seeing it work with your own eyes.
          </p>
        </div>

        {/* Step Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {steps.map((s, idx) => (
            <button
              key={s.num}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                activeStep === idx
                  ? 'border-[#C6FF3D] bg-[#16191C] shadow-lg'
                  : 'border-[#282E33] bg-[#16191C]/50 hover:border-[#525C64] hover:bg-[#16191C]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs font-bold ${activeStep === idx ? 'text-[#C6FF3D]' : 'text-[#646F77]'}`}>
                  STEP {s.num}
                </span>
                {s.icon}
              </div>
              <div className="font-sans text-sm font-semibold text-[#ECEBE4]">
                {s.title}
              </div>
            </button>
          ))}
        </div>

        {/* Active Step Display */}
        <div className="rounded-2xl border border-[#282E33] bg-[#16191C] p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 flex flex-col gap-3">
              <span className="text-xs font-mono text-[#C6FF3D] font-bold">
                STEP {steps[activeStep].num} OF 04
              </span>
              <h3 className="font-display text-2xl font-bold text-[#ECEBE4]">
                {steps[activeStep].title}
              </h3>
              <p className="text-sm text-[#9CA3A8] leading-relaxed">
                {steps[activeStep].desc}
              </p>
              <div className="pt-3">
                <BenchButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveStep((activeStep + 1) % steps.length)}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  iconPosition="right"
                >
                  Next Step
                </BenchButton>
              </div>
            </div>

            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {steps[activeStep].component}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
