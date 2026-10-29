import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Shield,
  Zap,
  Clock,
  Heart,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  Radio,
  Sliders,
  Cpu,
  Volume2,
  VolumeX,
  Smile,
  Compass,
} from 'lucide-react';
import { VoltCharacter, VoltExpression } from '../common/VoltCharacter';
import { BenchButton } from '../common/BenchButton';
import { BenchBadge } from '../common/BenchBadge';
import { sounds } from '../../services/soundEffects';

type ChakravyuhaLayer = 1 | 2 | 3 | 4; // 1: Padmavyuha, 2: Karmavyuha, 3: Core, 4: Victory

export const ChakravyuhaChallengeView: React.FC<{ onNavigate?: (view: string) => void }> = ({
  onNavigate,
}) => {
  // Game progression state
  const [currentLayer, setCurrentLayer] = useState<ChakravyuhaLayer>(1);
  const [score, setScore] = useState(650);
  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState(3);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [timerRunning, setTimerRunning] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  // Volt dynamic expressions & speech
  const [voltExpression, setVoltExpression] = useState<VoltExpression>('curious_coding');
  const [voltSpeech, setVoltSpeech] = useState<string>(
    "Welcome to CHAKRAVYUH! Let's breach Layer 1: Padmavyuha together! 🛡️"
  );

  // ----------------------------------------------------
  // LAYER 1: Padmavyuha State (Boolean Combination Lock)
  // Formula: Y = (A XOR B) AND (NOT C) == 1
  // ----------------------------------------------------
  const [switchA, setSwitchA] = useState(false);
  const [switchB, setSwitchB] = useState(false);
  const [switchC, setSwitchC] = useState(true); // default output is 0

  const xorOutput = switchA !== switchB;
  const notCOutput = !switchC;
  const padmavyuhaSolved = xorOutput && notCOutput;

  // ----------------------------------------------------
  // LAYER 2: Karmavyuha State (Faulty 4:1 MUX Hunt)
  // Target: Route Sensor Channel D2 (1) to Main Bus.
  // Address: S1=1, S0=0.
  // Glitch: S1 line has inverted logic bug unless patched.
  // ----------------------------------------------------
  const [muxS1, setMuxS1] = useState(false);
  const [muxS0, setMuxS0] = useState(false);
  const [muxPatchSelected, setMuxPatchSelected] = useState<string | null>(null);
  const [karmavyuhaFixed, setKarmavyuhaFixed] = useState(false);

  // Fixed when user selects patch 'invert_s1' AND sets S1=HIGH, S0=LOW
  const effectiveS1 = muxPatchSelected === 'invert_s1' ? muxS1 : !muxS1; // glitch inverts S1 by default
  const activeMuxChannel = (effectiveS1 ? 2 : 0) + (muxS0 ? 1 : 0);
  const muxChannels = [
    { id: 0, label: 'D0 (Noise Filter)', value: 0 },
    { id: 1, label: 'D1 (Temp Sensor)', value: 0 },
    { id: 2, label: 'D2 (Chakravyuha Key)', value: 1 },
    { id: 3, label: 'D3 (Ground Reference)', value: 0 },
  ];
  const muxOutput = muxChannels[activeMuxChannel]?.value ?? 0;

  // ----------------------------------------------------
  // LAYER 3: Chakravyuha Core State (Microcontroller PWM Handshake)
  // Target: Frequency = 500 Hz (Prescaler /8), Duty Cycle = 50%
  // ----------------------------------------------------
  const [prescaler, setPrescaler] = useState<number>(1); // 1, 8, or 64
  const [dutyCycle, setDutyCycle] = useState<number>(25); // 25, 50, or 75
  const [handshakeVerified, setHandshakeVerified] = useState(false);

  // Evaluated frequency
  const baseClock = 4000; // 4 kHz simulated internal timer
  const calculatedFrequency = Math.round(baseClock / prescaler);
  const coreSolved = calculatedFrequency === 500 && dutyCycle === 50;

  // ----------------------------------------------------
  // Timer countdown
  // ----------------------------------------------------
  useEffect(() => {
    if (!timerRunning || currentLayer === 4) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          setVoltExpression('supportive_error');
          setVoltSpeech("Time's up! But don't worry, an engineer learns most from trial! Take your time to finish. ⏳");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, currentLayer]);

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle audio
  const handleToggleAudio = () => {
    const newState = sounds.toggleSound();
    setSoundOn(newState);
  };

  // Stress-Relief Jokes / Affirmations
  const handleStressRelief = () => {
    sounds.playChirp();
    const jokes = [
      "Why did the transistor go to therapy? Because it had too much collector-emitter stress! ⚡",
      "Volt says: Remember, V = IR! High resistance just means you need more voltage (motivation)! 💪",
      "Why do engineers love dark mode? Because light attracts bugs! 🪲",
      "Take a deep breath! You're an engineer—you don't fail, you just discover test cases! 🌟",
    ];
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    setVoltExpression('stress_relief');
    setVoltSpeech(randomJoke);
  };

  // Layer 1 validation
  const handleAdvanceLayer1 = () => {
    if (padmavyuhaSolved) {
      sounds.playCorrect();
      setScore((prev) => prev + 350);
      setStreak((prev) => prev + 1);
      setCurrentLayer(2);
      setVoltExpression('celebrating');
      setVoltSpeech("BOOM! Layer 1: Padmavyuha breached! Now enter Karmavyuha—a tricky multiplexer awaits! 🎯");
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      sounds.playError();
      setHearts((prev) => Math.max(1, prev - 1));
      setVoltExpression('supportive_error');
      setVoltSpeech("Padmavyuha trap still active! Look at the formula: (A XOR B) must be 1 AND NOT C must be 1. Check Switch C! 💡");
    }
  };

  // Layer 2 validation
  const handleAdvanceLayer2 = () => {
    if (muxPatchSelected === 'invert_s1' && muxOutput === 1) {
      sounds.playCorrect();
      setScore((prev) => prev + 400);
      setStreak((prev) => prev + 1);
      setKarmavyuhaFixed(true);
      setCurrentLayer(3);
      setVoltExpression('celebrating');
      setVoltSpeech("Incredible troubleshooting! Karmavyuha bypassed! Enter the Inner Core for the final firmware handshake! 🏆");
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}
    } else {
      sounds.playError();
      setHearts((prev) => Math.max(1, prev - 1));
      setVoltExpression('encouraging');
      setVoltSpeech("Sensor D2 signal not reaching main bus. S1 has an inverted line glitch. Try applying Invert S1 Buffer and setting S1=1, S0=0! 🔍");
    }
  };

  // Layer 3 validation
  const handleAdvanceLayer3 = () => {
    if (coreSolved) {
      sounds.playLevelUp();
      setScore((prev) => prev + 500);
      setStreak((prev) => prev + 1);
      setHandshakeVerified(true);
      setCurrentLayer(4);
      setVoltExpression('celebrating');
      setVoltSpeech("CHAKRAVYUH BREACHED! You have won the E&TC Innovation Championship! 🏆👑");
      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.4 },
          colors: ['#C6FF3D', '#3DDCFF', '#FFB020', '#ECEBE4'],
        });
      } catch (e) {}
    } else {
      sounds.playError();
      setHearts((prev) => Math.max(1, prev - 1));
      setVoltExpression('thinking');
      setVoltSpeech(`Calculated ${calculatedFrequency}Hz at ${dutyCycle}%. We need exact 500Hz and 50% duty cycle! Try Prescaler /8. ⚙️`);
    }
  };

  // Reset current challenge
  const handleRestart = () => {
    setCurrentLayer(1);
    setSwitchA(false);
    setSwitchB(false);
    setSwitchC(true);
    setMuxS1(false);
    setMuxS0(false);
    setMuxPatchSelected(null);
    setPrescaler(1);
    setDutyCycle(25);
    setTimeLeft(600);
    setTimerRunning(true);
    setVoltExpression('curious_coding');
    setVoltSpeech("Chakravyuha reset! Ready to conquer all 3 layers from scratch! Let's go! 🚀");
  };

  return (
    <div className="min-h-full bg-[#0E1012] text-[#ECEBE4] p-4 sm:p-8 font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header: Championship HUD */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[#16191C] border border-[#282E33] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0E1012] border-2 border-[#C6FF3D] flex items-center justify-center text-[#C6FF3D] shadow-[0_0_15px_rgba(198,255,61,0.2)]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-wider text-[#C6FF3D] font-bold uppercase">
                  ELECTRONIC HARDWARE LAB
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#C6FF3D]/10 text-[#C6FF3D] font-mono font-bold">
                  MULTI-STAGE CHALLENGE
                </span>
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-[#ECEBE4]">
                Circuit Arena
              </h1>
            </div>
          </div>

          {/* Gamification Stats: Hearts, Streak, XP, Timer */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Hearts / Lives */}
            <div className="flex items-center gap-1 text-xs font-mono bg-[#1D2125] px-3 py-1.5 rounded-xl border border-[#282E33]" title="Remaining Lives">
              <Heart className="w-4 h-4 text-[#FF4D4D] fill-current" />
              <span className="font-bold text-[#ECEBE4]">{hearts}/5</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1 text-xs font-mono bg-[#1D2125] px-3 py-1.5 rounded-xl border border-[#282E33]" title="Day Streak">
              <Flame className="w-4 h-4 text-[#FFB020] fill-current" />
              <span className="font-bold text-[#ECEBE4]">{streak} 🔥</span>
            </div>

            {/* XP Points */}
            <div className="flex items-center gap-1.5 text-xs font-mono bg-[#1D2125] px-3 py-1.5 rounded-xl border border-[#282E33] text-[#C6FF3D]" title="Total XP Earned">
              <Zap className="w-4 h-4 fill-current" />
              <span className="font-bold">{score} XP</span>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-xl border ${
              timeLeft < 120
                ? 'bg-[#FF4D4D]/20 border-[#FF4D4D] text-[#FF4D4D] animate-pulse'
                : 'bg-[#1D2125] border-[#282E33] text-[#3DDCFF]'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-bold">{formatTime(timeLeft)}</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleAudio}
              className="p-2 rounded-xl bg-[#1D2125] border border-[#282E33] text-[#9CA3A8] hover:text-[#ECEBE4]"
              title={soundOn ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Layer Steps Indicator */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { step: 1, title: 'Layer 1: Padmavyuha', subtitle: 'Boolean Trap Disarm', icon: <Shield className="w-4 h-4" /> },
            { step: 2, title: 'Layer 2: Karmavyuha', subtitle: 'Faulty MUX Diagnosis', icon: <Radio className="w-4 h-4" /> },
            { step: 3, title: 'Layer 3: The Core', subtitle: 'ATmega PWM Handshake', icon: <Cpu className="w-4 h-4" /> },
          ].map((item) => {
            const isPassed = currentLayer > item.step;
            const isCurrent = currentLayer === item.step;
            return (
              <div
                key={item.step}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  isPassed
                    ? 'bg-[#C6FF3D]/10 border-[#C6FF3D] text-[#ECEBE4]'
                    : isCurrent
                    ? 'bg-[#16191C] border-[#3DDCFF] text-[#ECEBE4] shadow-[0_0_10px_rgba(61,220,255,0.15)]'
                    : 'bg-[#16191C]/50 border-[#282E33] text-[#646F77]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                      isPassed
                        ? 'bg-[#C6FF3D] text-[#0E1012]'
                        : isCurrent
                        ? 'bg-[#3DDCFF] text-[#0E1012]'
                        : 'bg-[#1D2125] text-[#646F77]'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                  </div>
                  <div>
                    <div className="font-bold text-xs">{item.title}</div>
                    <div className="text-[10px] text-[#9CA3A8] hidden sm:block">
                      {item.subtitle}
                    </div>
                  </div>
                </div>
                {isPassed && <span className="text-[#C6FF3D] font-mono text-xs font-bold">CLEARED ✓</span>}
              </div>
            );
          })}
        </div>

        {/* Main Content Layout: Active Layer Challenge & Volt Mentor Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Challenge Workbench Area (8 Cols) */}
          <div className="lg:col-span-8 bg-[#16191C] border border-[#282E33] rounded-2xl p-6 relative overflow-hidden">
            
            {/* ---------------------------------------------------- */}
            {/* LAYER 1: Padmavyuha (Boolean Trap)                   */}
            {/* ---------------------------------------------------- */}
            {currentLayer === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#282E33] pb-4">
                  <div>
                    <BenchBadge variant="accent">STAGE 1 / 3</BenchBadge>
                    <h2 className="font-display text-xl font-bold text-[#ECEBE4] mt-1">
                      Layer 1: Padmavyuha Perimeter Trap
                    </h2>
                    <p className="text-xs text-[#9CA3A8] mt-1">
                      The fortress gate is sealed by a boolean logic latch. The target condition to disarm is:{' '}
                      <span className="font-mono text-[#C6FF3D] font-bold">
                        Output Y = (A ⊕ B) • ¬C = 1
                      </span>
                    </p>
                  </div>
                </div>

                {/* Interactive Circuit Schematic Visualizer */}
                <div className="p-6 bg-[#0E1012] border border-[#282E33] rounded-2xl relative">
                  <div className="absolute top-3 left-4 font-mono text-[10px] text-[#646F77] tracking-wider uppercase">
                    LIVE LOGIC TELEMETRY SCHEMATIC
                  </div>

                  {/* Switch Controls */}
                  <div className="grid grid-cols-3 gap-4 pt-6 pb-4">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setSwitchA(!switchA);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        switchA
                          ? 'bg-[#3DDCFF]/15 border-[#3DDCFF] text-[#3DDCFF]'
                          : 'bg-[#1D2125] border-[#282E33] text-[#9CA3A8]'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase font-bold">Switch A</span>
                      <span className="font-mono text-xl font-bold">{switchA ? '1 (HIGH)' : '0 (LOW)'}</span>
                      <span className="text-[10px]">Click to flip</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setSwitchB(!switchB);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        switchB
                          ? 'bg-[#3DDCFF]/15 border-[#3DDCFF] text-[#3DDCFF]'
                          : 'bg-[#1D2125] border-[#282E33] text-[#9CA3A8]'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase font-bold">Switch B</span>
                      <span className="font-mono text-xl font-bold">{switchB ? '1 (HIGH)' : '0 (LOW)'}</span>
                      <span className="text-[10px]">Click to flip</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setSwitchC(!switchC);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        switchC
                          ? 'bg-[#3DDCFF]/15 border-[#3DDCFF] text-[#3DDCFF]'
                          : 'bg-[#1D2125] border-[#282E33] text-[#9CA3A8]'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase font-bold">Switch C</span>
                      <span className="font-mono text-xl font-bold">{switchC ? '1 (HIGH)' : '0 (LOW)'}</span>
                      <span className="text-[10px]">Click to flip</span>
                    </button>
                  </div>

                  {/* SVG Signal Bus Diagram */}
                  <div className="py-4 px-2 bg-[#16191C] rounded-xl border border-[#282E33] flex items-center justify-around font-mono text-xs">
                    <div className="text-center">
                      <div className="text-[#646F77] text-[10px]">XOR GATE (A ⊕ B)</div>
                      <div className={`text-base font-bold ${xorOutput ? 'text-[#3DDCFF]' : 'text-[#646F77]'}`}>
                        {xorOutput ? '1 (TRUE)' : '0 (FALSE)'}
                      </div>
                    </div>

                    <div className="text-[#646F77] font-bold text-lg">➔</div>

                    <div className="text-center">
                      <div className="text-[#646F77] text-[10px]">NOT GATE (¬C)</div>
                      <div className={`text-base font-bold ${notCOutput ? 'text-[#3DDCFF]' : 'text-[#646F77]'}`}>
                        {notCOutput ? '1 (TRUE)' : '0 (FALSE)'}
                      </div>
                    </div>

                    <div className="text-[#646F77] font-bold text-lg">➔</div>

                    <div className="text-center">
                      <div className="text-[#646F77] text-[10px]">AND GATE (Y)</div>
                      <div className={`text-lg font-bold ${padmavyuhaSolved ? 'text-[#C6FF3D]' : 'text-[#FF4D4D]'}`}>
                        {padmavyuhaSolved ? '1 (DISARMED!)' : '0 (TRAPPED)'}
                      </div>
                    </div>
                  </div>

                  {/* Real-time Status Alert */}
                  <div className={`mt-4 p-3 rounded-xl border flex items-center gap-3 text-xs ${
                    padmavyuhaSolved
                      ? 'bg-[#C6FF3D]/10 border-[#C6FF3D] text-[#C6FF3D]'
                      : 'bg-[#FF4D4D]/10 border-[#FF4D4D] text-[#FF4D4D]'
                  }`}>
                    {padmavyuhaSolved ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                    <span>
                      {padmavyuhaSolved
                        ? 'Padmavyuha disarm code verified! The perimeter shields are powered down.'
                        : 'Tamper warning: Output Y is 0. Switch configuration does not satisfy (A ⊕ B) • ¬C = 1.'}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex justify-end pt-2">
                  <BenchButton
                    variant={padmavyuhaSolved ? 'primary' : 'secondary'}
                    size="lg"
                    onClick={handleAdvanceLayer1}
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Disarm Layer 1 & Advance ➔
                  </BenchButton>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* LAYER 2: Karmavyuha (Faulty Multiplexer)             */}
            {/* ---------------------------------------------------- */}
            {currentLayer === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#282E33] pb-4">
                  <div>
                    <BenchBadge variant="warning">STAGE 2 / 3</BenchBadge>
                    <h2 className="font-display text-xl font-bold text-[#ECEBE4] mt-1">
                      Layer 2: Karmavyuha Multiplexer Hunt
                    </h2>
                    <p className="text-xs text-[#9CA3A8] mt-1">
                      Target: Route the secret <span className="text-[#C6FF3D] font-bold">Keycode on Channel D2</span> (Value = 1) to the telemetry bus.
                      However, S1 line suffers from an inverter fault in the silicon package!
                    </p>
                  </div>
                </div>

                {/* 4:1 MUX Simulation Workbench */}
                <div className="p-6 bg-[#0E1012] border border-[#282E33] rounded-2xl space-y-6">
                  {/* Select Lines S1 and S0 */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#ECEBE4]">
                      1. Set Address Select Lines (Binary 10 = D2):
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setMuxS1(!muxS1);
                        }}
                        className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all ${
                          muxS1 ? 'bg-[#3DDCFF]/20 border-[#3DDCFF] text-[#3DDCFF]' : 'bg-[#1D2125] border-[#282E33] text-[#9CA3A8]'
                        }`}
                      >
                        S1 = {muxS1 ? '1' : '0'}
                      </button>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setMuxS0(!muxS0);
                        }}
                        className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all ${
                          muxS0 ? 'bg-[#3DDCFF]/20 border-[#3DDCFF] text-[#3DDCFF]' : 'bg-[#1D2125] border-[#282E33] text-[#9CA3A8]'
                        }`}
                      >
                        S0 = {muxS0 ? '1' : '0'}
                      </button>
                    </div>
                  </div>

                  {/* Multiplexer Channels Visualizer */}
                  <div className="grid grid-cols-4 gap-3">
                    {muxChannels.map((ch) => {
                      const isSelected = activeMuxChannel === ch.id;
                      return (
                        <div
                          key={ch.id}
                          className={`p-3 rounded-xl border transition-all text-center ${
                            isSelected
                              ? ch.value === 1
                                ? 'bg-[#C6FF3D]/15 border-[#C6FF3D] text-[#ECEBE4]'
                                : 'bg-[#FF4D4D]/15 border-[#FF4D4D] text-[#ECEBE4]'
                              : 'bg-[#16191C] border-[#282E33] text-[#646F77]'
                          }`}
                        >
                          <div className="font-mono text-xs font-bold">{ch.label}</div>
                          <div className="text-xl font-bold font-mono my-1">
                            {ch.value}
                          </div>
                          <div className="text-[10px] uppercase font-mono">
                            {isSelected ? 'ACTIVE BUS' : 'INACTIVE'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Diagnostic Patch Options */}
                  <div className="pt-2">
                    <span className="font-mono text-xs font-bold text-[#ECEBE4] block mb-2">
                      2. Choose Hardware Diagnostic Patch to Bypass Karmavyuha Glitch:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: 'invert_s1',
                          label: 'Add NOT Buffer to Line S1',
                          desc: 'Inverts corrupted select line to restore true truth table.',
                        },
                        {
                          id: 'tie_ground',
                          label: 'Tie Output to VCC',
                          desc: 'Forces bus permanently HIGH without decoding.',
                        },
                        {
                          id: 'swap_inputs',
                          label: 'Reverse Channels D0 & D3',
                          desc: 'Shifts channel assignments across the bus.',
                        },
                      ].map((patch) => {
                        const isChosen = muxPatchSelected === patch.id;
                        return (
                          <div
                            key={patch.id}
                            onClick={() => {
                              sounds.playClick();
                              setMuxPatchSelected(patch.id);
                            }}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                              isChosen
                                ? 'bg-[#C6FF3D]/15 border-[#C6FF3D] text-[#ECEBE4]'
                                : 'bg-[#16191C] border-[#282E33] text-[#9CA3A8] hover:border-[#525C64]'
                            }`}
                          >
                            <div className="font-bold text-xs text-[#ECEBE4] mb-1">
                              {patch.label}
                            </div>
                            <div className="text-[10px] text-[#9CA3A8] leading-tight">
                              {patch.desc}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bus Readout */}
                  <div className="p-3 bg-[#16191C] rounded-xl border border-[#282E33] flex items-center justify-between font-mono text-xs">
                    <div>
                      <span className="text-[#9CA3A8]">Active Routed Channel: </span>
                      <span className="font-bold text-[#3DDCFF]">D{activeMuxChannel}</span>
                    </div>
                    <div>
                      <span className="text-[#9CA3A8]">Main Bus Signal: </span>
                      <span className={`font-bold ${muxOutput === 1 ? 'text-[#C6FF3D]' : 'text-[#FF4D4D]'}`}>
                        {muxOutput === 1 ? 'KEY PROTOCOL (1) ✓' : 'NOISE / CORRUPT (0)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <BenchButton
                    variant={muxOutput === 1 && muxPatchSelected === 'invert_s1' ? 'primary' : 'secondary'}
                    size="lg"
                    onClick={handleAdvanceLayer2}
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Bypass Karmavyuha & Advance ➔
                  </BenchButton>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* LAYER 3: Chakravyuha Core (ATmega PWM Handshake)    */}
            {/* ---------------------------------------------------- */}
            {currentLayer === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#282E33] pb-4">
                  <div>
                    <BenchBadge variant="danger">STAGE 3 / 3</BenchBadge>
                    <h2 className="font-display text-xl font-bold text-[#ECEBE4] mt-1">
                      Layer 3: Chakravyuha Inner Core Decoupler
                    </h2>
                    <p className="text-xs text-[#9CA3A8] mt-1">
                      The central fortress uses an ATmega328P timer lock. You must tune the PWM wave to exactly{' '}
                      <span className="font-mono text-[#C6FF3D] font-bold">500 Hz</span> with a{' '}
                      <span className="font-mono text-[#C6FF3D] font-bold">50% Duty Cycle</span> to neutralize the vortex shield.
                    </p>
                  </div>
                </div>

                {/* Oscilloscope & Firmware Controls */}
                <div className="p-6 bg-[#0E1012] border border-[#282E33] rounded-2xl space-y-6">
                  {/* Virtual Oscilloscope Screen */}
                  <div className="h-32 bg-[#12161A] rounded-xl border border-[#282E33] relative overflow-hidden flex items-center justify-center p-3">
                    {/* Oscilloscope Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#282E33_1px,transparent_1px),linear-gradient(to_bottom,#282E33_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

                    {/* Simulated Pulse Train Waveform */}
                    <svg className="w-full h-full relative z-10" viewBox="0 0 400 80" preserveAspectRatio="none">
                      <path
                        d={
                          dutyCycle === 50
                            ? 'M 0 60 L 50 60 L 50 20 L 100 20 L 100 60 L 150 60 L 150 20 L 200 20 L 200 60 L 250 60 L 250 20 L 300 20 L 300 60 L 350 60 L 350 20 L 400 20'
                            : dutyCycle === 25
                            ? 'M 0 60 L 25 60 L 25 20 L 100 20 L 100 60 L 125 60 L 125 20 L 200 20 L 200 60 L 225 60 L 225 20 L 300 20 L 300 60 L 325 60 L 325 20 L 400 20'
                            : 'M 0 60 L 75 60 L 75 20 L 100 20 L 100 60 L 175 60 L 175 20 L 200 20 L 200 60 L 275 60 L 275 20 L 300 20 L 300 60 L 375 60 L 375 20 L 400 20'
                        }
                        fill="none"
                        stroke={coreSolved ? '#C6FF3D' : '#3DDCFF'}
                        strokeWidth="3"
                        className="transition-all duration-300"
                      />
                    </svg>

                    <div className="absolute top-2 right-3 font-mono text-[10px] text-[#C6FF3D] bg-[#0E1012]/80 px-2 py-0.5 rounded border border-[#282E33]">
                      PWM CH1: {calculatedFrequency} Hz @ {dutyCycle}%
                    </div>
                  </div>

                  {/* Firmware Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Timer Clock Prescaler */}
                    <div className="p-4 bg-[#16191C] rounded-xl border border-[#282E33] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#9CA3A8]">Timer Prescaler (TCCR1B):</span>
                        <span className="font-bold text-[#C6FF3D]">/{prescaler}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 8, 64].map((div) => (
                          <button
                            key={div}
                            onClick={() => {
                              sounds.playClick();
                              setPrescaler(div);
                            }}
                            className={`py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                              prescaler === div
                                ? 'bg-[#3DDCFF]/20 border-[#3DDCFF] text-[#3DDCFF]'
                                : 'bg-[#1D2125] border-[#282E33] text-[#9CA3A8]'
                            }`}
                          >
                            /{div}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* PWM Duty Cycle */}
                    <div className="p-4 bg-[#16191C] rounded-xl border border-[#282E33] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#9CA3A8]">Duty Cycle (OCR1A):</span>
                        <span className="font-bold text-[#C6FF3D]">{dutyCycle}%</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[25, 50, 75].map((pct) => (
                          <button
                            key={pct}
                            onClick={() => {
                              sounds.playClick();
                              setDutyCycle(pct);
                            }}
                            className={`py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                              dutyCycle === pct
                                ? 'bg-[#3DDCFF]/20 border-[#3DDCFF] text-[#3DDCFF]'
                                : 'bg-[#1D2125] border-[#282E33] text-[#9CA3A8]'
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Match Status */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
                    coreSolved
                      ? 'bg-[#C6FF3D]/10 border-[#C6FF3D] text-[#C6FF3D]'
                      : 'bg-[#16191C] border-[#282E33] text-[#9CA3A8]'
                  }`}>
                    <div>
                      <span>Core Vortex Resonance: </span>
                      <span className="font-bold">{coreSolved ? '100% (STABILIZED)' : '35% (FREQUENCY MISMATCH)'}</span>
                    </div>
                    {coreSolved && <span className="font-bold text-[#C6FF3D]">READY TO UNLOCK ⚡</span>}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <BenchButton
                    variant={coreSolved ? 'primary' : 'secondary'}
                    size="lg"
                    onClick={handleAdvanceLayer3}
                    icon={<Trophy className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Breach Core & Claim Trophy 🏆
                  </BenchButton>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* LAYER 4: Grand Victory Celebration                  */}
            {/* ---------------------------------------------------- */}
            {currentLayer === 4 && (
              <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-[#C6FF3D] text-[#0E1012] flex items-center justify-center shadow-[0_0_30px_rgba(198,255,61,0.4)] animate-bounce">
                  <Trophy className="w-10 h-10" />
                </div>

                <div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#ECEBE4]">
                    CHAKRAVYUH BREACHED!
                  </h2>
                  <p className="text-base text-[#9CA3A8] max-w-md mx-auto mt-2">
                    Congratulations! You mastered Boolean De Morgan traps, debugged hardware multiplexers, and calibrated microcontroller timers!
                  </p>
                </div>

                {/* Score breakdown card */}
                <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#0E1012] border border-[#282E33] space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-[#9CA3A8]">
                    <span>Final Score</span>
                    <span className="text-[#C6FF3D] font-bold">{score} XP</span>
                  </div>
                  <div className="flex justify-between text-[#9CA3A8]">
                    <span>Time Taken</span>
                    <span className="text-[#3DDCFF] font-bold">{formatTime(600 - timeLeft)}</span>
                  </div>
                  <div className="flex justify-between text-[#9CA3A8]">
                    <span>Hearts Left</span>
                    <span className="text-[#FF4D4D] font-bold">{'❤️'.repeat(hearts)}</span>
                  </div>
                  <div className="pt-2 border-t border-[#282E33] flex justify-between font-bold text-[#ECEBE4]">
                    <span>Title Conferred</span>
                    <span className="text-[#C6FF3D]">CHAKRAVYUH GRAND MASTER</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <BenchButton
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      if (onNavigate) onNavigate('lab');
                    }}
                  >
                    Open Circuit Playground 🚀
                  </BenchButton>

                  <BenchButton
                    variant="secondary"
                    size="lg"
                    onClick={handleRestart}
                    icon={<RotateCcw className="w-4 h-4" />}
                  >
                    Play Again
                  </BenchButton>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Volt Mascot AI Mentor & Stress Relief Engine (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Mascot Card */}
            <div className="p-6 bg-[#16191C] border border-[#282E33] rounded-2xl text-center space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-[#646F77]">
                <span>DUOLINGO-STYLE AI MENTOR</span>
                <span className="text-[#C6FF3D] font-bold">ONLINE</span>
              </div>

              {/* Animated Volt Mascot */}
              <VoltCharacter
                expression={voltExpression}
                size="lg"
                speechText={voltSpeech}
              />

              <div className="text-left bg-[#0E1012] p-3.5 rounded-xl border border-[#282E33] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#3DDCFF]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-bold">Volt's Stage Wisdom:</span>
                </div>
                <p className="text-xs text-[#9CA3A8] leading-relaxed">
                  {currentLayer === 1 &&
                    "In Padmavyuha, remember that an XOR gate outputs 1 only when inputs are DIFFERENT (0,1 or 1,0). Since ¬C must also be 1, Switch C MUST be 0!"}
                  {currentLayer === 2 &&
                    "Multiplexers use binary select lines. S1 is MSB, S0 is LSB. Address 2 in binary is 10 (S1=1, S0=0). If S1 has an inversion glitch, adding a NOT gate restores normal behavior!"}
                  {currentLayer === 3 &&
                    "Timer frequency = 4000 Hz / Prescaler. If prescaler is 8, 4000 / 8 = 500 Hz! Set 50% duty cycle for a pure symmetrical square wave."}
                  {currentLayer === 4 &&
                    "You're a true electronics champion! Ready to show off this project at the DYPSEM E&TC exhibition!"}
                </p>
              </div>

              {/* Stress-Relief Button */}
              <button
                onClick={handleStressRelief}
                className="w-full py-2 px-3 rounded-xl bg-[#1D2125] border border-[#282E33] hover:border-[#C6FF3D] text-xs font-mono text-[#ECEBE4] flex items-center justify-center gap-2 transition-all"
              >
                <Smile className="w-4 h-4 text-[#FFB020]" />
                <span>Volt, I need a study break / joke! ☕</span>
              </button>
            </div>

            {/* Quick Rules & Mission Objectives */}
            <div className="p-5 bg-[#16191C] border border-[#282E33] rounded-2xl space-y-3 text-xs font-mono text-[#9CA3A8]">
              <div className="text-[#ECEBE4] font-bold flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#C6FF3D]" />
                <span>CHAKRAVYUH RULES</span>
              </div>
              <ul className="space-y-2 list-disc list-inside text-[11px] text-[#9CA3A8]">
                <li>Breach all 3 concentric defense layers.</li>
                <li>Wrong submissions consume 1 heart (❤️).</li>
                <li>Timer counts down from 10 minutes.</li>
                <li>Use Volt's telemetry hints if you get stuck.</li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
