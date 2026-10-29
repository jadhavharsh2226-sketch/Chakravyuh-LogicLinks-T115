import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Wrench,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { FAULT_ARENA_CHALLENGES } from '../../engine/missions';
import { CircuitSimulator } from '../../engine/simulator';
import { CircuitComponent, Connection } from '../../types';
import { BenchBadge } from '../common/BenchBadge';
import { BenchButton } from '../common/BenchButton';
import { GateSymbol } from '../common/GateSymbol';

interface FaultArenaViewProps {
  onNavigate?: (view: string) => void;
}

type ArenaStage = 'TEST' | 'GUESS' | 'FIX';

export const FaultArenaView: React.FC<FaultArenaViewProps> = () => {
  const [selectedChallengeIndex, setSelectedChallengeIndex] = useState(0);
  const challenge = FAULT_ARENA_CHALLENGES[selectedChallengeIndex];

  const [currentStage, setCurrentStage] = useState<ArenaStage>('TEST');
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [isRepaired, setIsRepaired] = useState<boolean>(false);
  const [userHypothesis, setUserHypothesis] = useState<string>('');

  const [components, setComponents] = useState<CircuitComponent[]>(() => {
    return JSON.parse(JSON.stringify(challenge.circuit.components));
  });
  const [connections, setConnections] = useState<Connection[]>(() => {
    return JSON.parse(JSON.stringify(challenge.circuit.connections));
  });

  const handleSelectChallenge = (index: number) => {
    setSelectedChallengeIndex(index);
    const newChallenge = FAULT_ARENA_CHALLENGES[index];
    setComponents(JSON.parse(JSON.stringify(newChallenge.circuit.components)));
    setConnections(JSON.parse(JSON.stringify(newChallenge.circuit.connections)));
    setCurrentStage('TEST');
    setHintsRevealed(0);
    setIsRepaired(false);
    setUserHypothesis('');
  };

  const simResult = useMemo(() => {
    return CircuitSimulator.runSimulation(components, connections);
  }, [components, connections]);

  const handleToggleSwitch = (compId: string) => {
    setComponents((prev) =>
      prev.map((c) =>
        c.id === compId && c.type === 'SWITCH'
          ? { ...c, state: { ...c.state, toggle: !c.state.toggle } }
          : c
      )
    );
  };

  const handlePerformRepair = () => {
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id === challenge.faultyComponentId) {
          if (challenge.id === 'fa-001') {
            return {
              ...c,
              type: 'XOR',
              label: 'Gate U1 (Corrected XOR)',
              isFaulty: false,
              faultType: undefined,
            };
          } else {
            return {
              ...c,
              isFaulty: false,
              faultType: undefined,
            };
          }
        }
        return c;
      })
    );

    setIsRepaired(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C6FF3D', '#3DDCFF', '#ECEBE4'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleRevealHint = () => {
    if (hintsRevealed < challenge.hints.length) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 select-none font-sans text-xs">
      {/* Top Banner */}
      <div className="rounded-2xl border border-[#282E33] bg-[#16191C] p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm text-[#ECEBE4]">
              Circuit Puzzle #{selectedChallengeIndex + 1}: The Broken Light Switch
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#3DDCFF]/10 text-[#3DDCFF] border border-[#3DDCFF]/30 font-mono text-[10px] font-bold">
              Easy Puzzle
            </span>
          </div>
          <p className="text-xs text-[#9CA3A8]">
            Can you test the circuit, figure out what's wrong, and fix it?
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#9CA3A8]">
            <HelpCircle className="w-4 h-4 text-[#FFB020]" />
            <span>Hints: {hintsRevealed}/{challenge.hints.length}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E1012] border border-[#C6FF3D]/30 text-[#C6FF3D] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+250 XP Reward</span>
          </div>
        </div>
      </div>

      {/* 3 Simple Steps: 1. TEST -> 2. GUESS -> 3. FIX */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'TEST', title: '1. Test the Switches', desc: 'Click switches to see when it fails' },
          { key: 'GUESS', title: '2. Guess the Mistake', desc: 'Why is the circuit behaving wrongly?' },
          { key: 'FIX', title: '3. Fix the Circuit', desc: 'Swap in the correct gate' },
        ].map((step) => {
          const isActive = currentStage === step.key;
          const isDone = (step.key === 'TEST' && currentStage !== 'TEST') || (step.key === 'GUESS' && currentStage === 'FIX') || isRepaired;

          return (
            <button
              key={step.key}
              onClick={() => setCurrentStage(step.key as ArenaStage)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isActive
                  ? 'border-[#C6FF3D] bg-[#1D2125] text-[#ECEBE4]'
                  : isDone
                  ? 'border-[#282E33] bg-[#16191C] text-[#C6FF3D]'
                  : 'border-[#282E33] bg-[#16191C]/50 text-[#646F77]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs">{step.title}</span>
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-[#C6FF3D]" /> : null}
              </div>
              <div className="text-[11px] text-[#9CA3A8]">{step.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Puzzle Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Circuit Display (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-[#282E33] bg-[#16191C] overflow-hidden flex flex-col">
          <div className="px-5 py-3 bg-[#1D2125] border-b border-[#282E33] flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-[#ECEBE4]">Current Circuit on Bench:</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isRepaired ? 'bg-[#C6FF3D]/15 text-[#C6FF3D]' : 'bg-[#FF4D4D]/15 text-[#FF4D4D]'}`}>
              {isRepaired ? '● FIXED & WORKING' : '● HAS A BUG'}
            </span>
          </div>

          <div className="p-8 bg-[#0E1012] bg-bench-grid flex items-center justify-around min-h-[280px]">
            {/* Switches */}
            <div className="flex flex-col gap-6 z-10">
              {components
                .filter((c) => c.type === 'SWITCH')
                .map((sw) => (
                  <button
                    key={sw.id}
                    onClick={() => handleToggleSwitch(sw.id)}
                    className={`p-2.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer hover:scale-105 ${
                      sw.state.toggle
                        ? 'border-[#3DDCFF] bg-[#3DDCFF]/15 text-[#3DDCFF]'
                        : 'border-[#282E33] bg-[#16191C] text-[#9CA3A8]'
                    }`}
                  >
                    <div className="text-left font-sans">
                      <div className="text-[10px] text-[#646F77]">{sw.label}</div>
                      <div className="text-xs font-bold">
                        {sw.state.toggle ? '1 (ON)' : '0 (OFF)'}
                      </div>
                    </div>
                  </button>
                ))}
            </div>

            {/* Gate */}
            <div className="flex flex-col items-center gap-2 z-10">
              {components
                .filter((c) => !['SWITCH', 'LED'].includes(c.type))
                .map((gate) => {
                  const outPortId = gate.outputs[0]?.id || '0';
                  const signal = simResult.componentOutputs.get(`${gate.id}_out_${outPortId}`);

                  return (
                    <div
                      key={gate.id}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${
                        isRepaired
                          ? 'border-[#C6FF3D] bg-[#16191C]'
                          : 'border-[#FF4D4D] bg-[#FF4D4D]/10'
                      }`}
                    >
                      <GateSymbol
                        type={gate.type}
                        size={54}
                        signal={signal}
                        isFaulty={!isRepaired && gate.isFaulty}
                      />
                      <span className="text-xs text-[#ECEBE4] font-bold">
                        {gate.label}
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* Output Light Bulb */}
            <div className="flex flex-col items-center gap-2 z-10">
              {components
                .filter((c) => c.type === 'LED')
                .map((led) => {
                  const incomingWire = connections.find((w) => w.toCompId === led.id);
                  const signal = incomingWire ? simResult.wireStates.get(incomingWire.id) : 0;

                  return (
                    <div key={led.id} className="flex flex-col items-center gap-2">
                      <GateSymbol type="LED" signal={signal} size={48} />
                      <span className="text-[11px] text-[#9CA3A8] font-bold">Light Bulb</span>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="p-4 bg-[#1D2125] border-t border-[#282E33] text-xs text-[#9CA3A8]">
            <span className="text-[#ECEBE4] font-bold">Goal: </span>
            The light bulb must turn OFF when both switches are ON. Right now, it's glowing when it shouldn't!
          </div>
        </div>

        {/* Right: Steps & Actions (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-[#282E33] bg-[#16191C] p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="font-bold text-sm text-[#ECEBE4]">
              {currentStage === 'TEST' && 'Step 1: Test the Switches'}
              {currentStage === 'GUESS' && 'Step 2: What is Causing the Bug?'}
              {currentStage === 'FIX' && 'Step 3: Fix the Circuit'}
            </div>

            {currentStage === 'TEST' && (
              <div className="space-y-3 text-xs text-[#9CA3A8]">
                <p>
                  Click the switches on the left to test different inputs. Notice what happens when both switches are ON (1, 1).
                </p>
                <div className="p-3 rounded-lg bg-[#0E1012] border border-[#282E33] space-y-1 font-mono text-[11px] text-[#ECEBE4]">
                  <div>Switch A: 1, Switch B: 0 ➔ Bulb glows</div>
                  <div>Switch A: 0, Switch B: 1 ➔ Bulb glows</div>
                  <div className="text-[#FF4D4D] font-bold">Switch A: 1, Switch B: 1 ➔ Bulb glows (Wrong!)</div>
                </div>
                <BenchButton
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setCurrentStage('GUESS')}
                >
                  I'm Ready to Guess the Bug ›
                </BenchButton>
              </div>
            )}

            {currentStage === 'GUESS' && (
              <div className="space-y-3 text-xs text-[#9CA3A8]">
                <p>Select the option that explains why this circuit is failing:</p>
                <div className="space-y-2">
                  {[
                    'Someone placed an OR gate instead of an XOR gate',
                    'The light bulb is burnt out',
                    'Both switches are broken',
                  ].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => setUserHypothesis(option)}
                      className={`w-full p-3 rounded-xl text-left border text-xs transition-all ${
                        userHypothesis === option
                          ? 'border-[#C6FF3D] bg-[#C6FF3D]/10 text-[#C6FF3D] font-bold'
                          : 'border-[#282E33] bg-[#0E1012] text-[#ECEBE4] hover:border-[#525C64]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <BenchButton
                  variant="primary"
                  size="md"
                  disabled={!userHypothesis}
                  className="w-full"
                  onClick={() => setCurrentStage('FIX')}
                >
                  Submit Guess & Fix It ›
                </BenchButton>
              </div>
            )}

            {currentStage === 'FIX' && (
              <div className="space-y-4 text-xs">
                {isRepaired ? (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D]">
                      <div className="font-bold flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Puzzle Solved! +250 XP Awarded</span>
                      </div>
                      <p className="text-xs text-[#ECEBE4] mt-2 leading-relaxed">
                        Great job! An XOR gate turns OFF when both inputs are ON (1, 1). That's why it's used in parity checkers and binary adders.
                      </p>
                    </div>

                    <BenchButton
                      variant="primary"
                      size="md"
                      className="w-full"
                      onClick={() => handleSelectChallenge((selectedChallengeIndex + 1) % FAULT_ARENA_CHALLENGES.length)}
                    >
                      Play Next Puzzle 🚀
                    </BenchButton>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[#9CA3A8]">
                      Your diagnosis was correct! Click below to replace the wrong OR gate with an <strong>XOR Gate</strong>.
                    </p>
                    <BenchButton
                      variant="primary"
                      size="md"
                      className="w-full"
                      onClick={handlePerformRepair}
                      icon={<Wrench className="w-4 h-4" />}
                    >
                      Replace With XOR Gate
                    </BenchButton>
                  </div>
                )}
              </div>
            )}

            {/* Hints */}
            <div className="pt-3 border-t border-[#282E33] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#646F77] uppercase font-bold font-mono">
                  Need a Hint?
                </span>
                <button
                  onClick={handleRevealHint}
                  disabled={hintsRevealed >= challenge.hints.length}
                  className="text-xs text-[#C6FF3D] hover:underline disabled:opacity-40"
                >
                  + Show Hint
                </button>
              </div>

              {challenge.hints.slice(0, hintsRevealed).map((h, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-[#0E1012] border border-[#282E33] text-xs text-[#9CA3A8]">
                  💡 <strong>Hint {i + 1}:</strong> {h}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#282E33] flex items-center justify-between text-xs text-[#9CA3A8]">
            <span>Puzzle {selectedChallengeIndex + 1} of {FAULT_ARENA_CHALLENGES.length}</span>
            <button
              onClick={() => handleSelectChallenge(selectedChallengeIndex)}
              className="hover:text-[#ECEBE4] flex items-center gap-1 font-mono text-[11px]"
            >
              <RotateCcw className="w-3 h-3" /> Reset Puzzle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
