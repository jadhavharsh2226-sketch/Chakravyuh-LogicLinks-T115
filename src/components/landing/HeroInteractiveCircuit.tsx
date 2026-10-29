import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, CheckCircle, AlertCircle, ArrowRight, Lightbulb, Zap } from 'lucide-react';
import { GateSymbol } from '../common/GateSymbol';
import { SignalState } from '../../types';

export const HeroInteractiveCircuit: React.FC = () => {
  const [switchA, setSwitchA] = useState<SignalState>(1);
  const [switchB, setSwitchB] = useState<SignalState>(0);
  const [isBroken, setIsBroken] = useState<boolean>(false);

  // Normal XOR: (A ^ B)
  // When broken: Behaves like OR gate
  const outputSignal: SignalState = isBroken
    ? switchA === 1 || switchB === 1 ? 1 : 0
    : switchA !== switchB ? 1 : 0;

  const isFailingCase = isBroken && switchA === 1 && switchB === 1;

  return (
    <div className="relative rounded-2xl border border-[#282E33] bg-[#16191C] shadow-2xl overflow-hidden select-none">
      {/* Friendly Top Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#1D2125] border-b border-[#282E33]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C6FF3D] animate-pulse" />
          <span className="font-sans text-sm font-semibold text-[#ECEBE4]">
            Interactive Playground: <strong className="text-[#3DDCFF]">XOR Gate Example</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#3DDCFF]/10 text-[#3DDCFF] border border-[#3DDCFF]/30 text-xs font-mono font-semibold">
            Live Circuit
          </span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="p-6 sm:p-8 bg-[#0E1012] bg-bench-grid relative">
        {/* Simple Explanation Banner */}
        <div className="mb-6 p-3.5 rounded-xl border border-[#282E33] bg-[#16191C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#3DDCFF]/10 text-[#3DDCFF]">
              <Zap className="w-4 h-4" />
            </span>
            <span className="text-[#ECEBE4]">
              <strong>Rule of XOR:</strong> The light bulb turns <span className="text-[#3DDCFF] font-bold">ON</span> only when the switches are <span className="underline decoration-[#C6FF3D] font-bold">different</span>.
            </span>
          </div>

          <button
            onClick={() => setIsBroken(!isBroken)}
            className={`px-3 py-1.5 rounded-lg font-sans font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0 ${
              isBroken
                ? 'bg-[#C6FF3D] text-[#0E1012] hover:bg-[#b5f230]'
                : 'bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30 hover:bg-[#FF4D4D]/25'
            }`}
          >
            {isBroken ? (
              <>
                <Wrench className="w-3.5 h-3.5" />
                <span>Fix the Circuit</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Simulate a Broken Gate</span>
              </>
            )}
          </button>
        </div>

        {/* The Circuit Canvas (Switches -> Gate -> Bulb) */}
        <div className="py-6 px-4 rounded-xl border border-[#282E33]/70 bg-[#14171A]/80 flex flex-col sm:flex-row items-center justify-between gap-8 relative">
          {/* 1. Left Side: Two Big Clickable Switches */}
          <div className="flex flex-col gap-6 w-full sm:w-auto">
            {/* Switch A */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-mono text-[#9CA3A8] font-semibold">INPUT SWITCH A</span>
              <button
                onClick={() => setSwitchA(switchA === 1 ? 0 : 1)}
                className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-4 cursor-pointer hover:scale-105 active:scale-95 ${
                  switchA === 1
                    ? 'border-[#3DDCFF] bg-[#3DDCFF]/15 text-[#3DDCFF] shadow-[0_0_15px_rgba(61,220,255,0.2)]'
                    : 'border-[#282E33] bg-[#16191C] text-[#9CA3A8]'
                }`}
              >
                <div className="text-left font-sans">
                  <div className="text-xs font-bold text-[#ECEBE4]">Switch A</div>
                  <div className="text-[11px] font-mono font-bold">
                    {switchA === 1 ? '● ON (1)' : '○ OFF (0)'}
                  </div>
                </div>

                {/* Big Toggle Knob */}
                <div className={`w-10 h-6 rounded-full p-0.5 border flex transition-all ${
                  switchA === 1 ? 'border-[#3DDCFF] bg-[#3DDCFF] justify-end' : 'border-[#525C64] bg-[#0E1012] justify-start'
                }`}>
                  <motion.div layout className="w-5 h-5 rounded-full bg-white shadow" />
                </div>
              </button>
            </div>

            {/* Switch B */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-mono text-[#9CA3A8] font-semibold">INPUT SWITCH B</span>
              <button
                onClick={() => setSwitchB(switchB === 1 ? 0 : 1)}
                className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-4 cursor-pointer hover:scale-105 active:scale-95 ${
                  switchB === 1
                    ? 'border-[#3DDCFF] bg-[#3DDCFF]/15 text-[#3DDCFF] shadow-[0_0_15px_rgba(61,220,255,0.2)]'
                    : 'border-[#282E33] bg-[#16191C] text-[#9CA3A8]'
                }`}
              >
                <div className="text-left font-sans">
                  <div className="text-xs font-bold text-[#ECEBE4]">Switch B</div>
                  <div className="text-[11px] font-mono font-bold">
                    {switchB === 1 ? '● ON (1)' : '○ OFF (0)'}
                  </div>
                </div>

                <div className={`w-10 h-6 rounded-full p-0.5 border flex transition-all ${
                  switchB === 1 ? 'border-[#3DDCFF] bg-[#3DDCFF] justify-end' : 'border-[#525C64] bg-[#0E1012] justify-start'
                }`}>
                  <motion.div layout className="w-5 h-5 rounded-full bg-white shadow" />
                </div>
              </button>
            </div>
          </div>

          {/* 2. Middle: Logic Gate */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-mono text-[#9CA3A8] font-semibold">
              {isBroken ? 'WRONG GATE (OR)' : 'LOGIC GATE (XOR)'}
            </span>

            <div className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
              isFailingCase
                ? 'border-[#FF4D4D] bg-[#FF4D4D]/10 shadow-[0_0_20px_rgba(255,77,77,0.3)]'
                : 'border-[#282E33] bg-[#16191C]'
            }`}>
              <GateSymbol
                type={isBroken ? 'OR' : 'XOR'}
                size={64}
                signal={outputSignal}
                isFaulty={isFailingCase}
              />

              <div className="text-center font-sans">
                <span className="font-bold text-sm text-[#ECEBE4] block">
                  {isBroken ? 'OR Gate' : 'XOR Gate'}
                </span>
                <span className="text-[10px] text-[#9CA3A8] font-mono">
                  {isBroken ? 'Needs at least one ON' : 'Needs different inputs'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Right Side: Big Light Bulb */}
          <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-mono text-[#9CA3A8] font-semibold">OUTPUT</span>

            <div className="p-4 rounded-2xl border border-[#282E33] bg-[#16191C] flex flex-col items-center gap-3 w-36">
              <GateSymbol type="LED" signal={outputSignal} size={50} />

              <div className="text-center font-sans">
                <div className="text-xs text-[#9CA3A8]">Light Bulb</div>
                <div className={`text-sm font-bold ${outputSignal === 1 ? 'text-[#3DDCFF]' : 'text-[#646F77]'}`}>
                  {outputSignal === 1 ? 'GLOWING ✨' : 'TURNED OFF'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Simple Student Explanation Card */}
        <div className="mt-5 p-4 rounded-xl border border-[#282E33] bg-[#16191C] text-xs font-sans">
          <div className="flex items-start gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${isFailingCase ? 'bg-[#FF4D4D]' : 'bg-[#C6FF3D]'}`} />
            <div className="leading-relaxed">
              {isFailingCase ? (
                <span className="text-[#FF4D4D]">
                  <strong>Bug in circuit:</strong> Both switches are ON (1, 1). An XOR gate should output <strong>0 (OFF)</strong>, but this broken OR gate outputs <strong>1 (ON)</strong>. Click "Fix the Circuit" above to replace it!
                </span>
              ) : outputSignal === 1 ? (
                <span className="text-[#ECEBE4]">
                  <strong>Why is the bulb ON?</strong> Switch A is <strong>{switchA === 1 ? '1' : '0'}</strong> and Switch B is <strong>{switchB === 1 ? '1' : '0'}</strong>. Because they are <strong>different</strong>, the XOR gate outputs <strong>1</strong> and turns the bulb on!
                </span>
              ) : (
                <span className="text-[#9CA3A8]">
                  <strong>Why is the bulb OFF?</strong> Both switches are <strong>{switchA === 1 ? 'ON (1)' : 'OFF (0)'}</strong>. Because the inputs are identical, the XOR gate outputs <strong>0</strong> and keeps the bulb off.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
