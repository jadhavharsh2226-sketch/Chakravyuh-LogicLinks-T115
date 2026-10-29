import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Cpu, Sparkles, CheckCircle2, Code2, Terminal, AlertCircle } from 'lucide-react';
import { BenchButton } from '../common/BenchButton';
import { VoltCharacter } from '../common/VoltCharacter';
import { sounds } from '../../services/soundEffects';

interface ArduinoChallenge {
  id: string;
  title: string;
  objective: string;
  starterCode: string;
  expectedOutput: string;
  solutionHint: string;
  xp: number;
}

const ARDUINO_CHALLENGES: ArduinoChallenge[] = [
  {
    id: 'ard-01',
    title: 'Challenge 1: The Classic ENTC Blinky (Pin 13)',
    objective: 'Write an Arduino sketch to blink the built-in LED on Pin 13 with 500ms intervals.',
    starterCode: `// E&TC Microcontroller Lab - Experiment 1
const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH); // Turn LED ON
  delay(500);                  // Wait 500ms
  digitalWrite(LED_PIN, LOW);  // Turn LED OFF
  delay(500);                  // Wait 500ms
}`,
    expectedOutput: 'Pin 13 blinking periodically at 1 Hz frequency.',
    solutionHint: 'Make sure pinMode is set to OUTPUT and delay() is called between HIGH and LOW.',
    xp: 200,
  },
  {
    id: 'ard-02',
    title: 'Challenge 2: Pushbutton Digital Read (Interlock)',
    objective: 'Read input switch on Pin 2. If HIGH, turn ON Pin 13 LED, else turn OFF.',
    starterCode: `const int BUTTON_PIN = 2;
const int LED_PIN = 13;

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);
  
  if (buttonState == HIGH) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}`,
    expectedOutput: 'Pin 13 illuminates synchronously with button press.',
    solutionHint: 'Use digitalRead(BUTTON_PIN) inside an if-else block.',
    xp: 250,
  },
];

export const ArduinoCodeLabView: React.FC = () => {
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const challenge = ARDUINO_CHALLENGES[selectedChallengeIdx];

  const [code, setCode] = useState(challenge.starterCode);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [ledState, setLedState] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [compilerLogs, setCompilerLogs] = useState<string[]>([
    'AVR GCC Toolchain ready.',
    'Target: ATmega328P (Arduino Uno standard)',
  ]);
  const [voltSpeech, setVoltSpeech] = useState("Let's write some embedded C code! 💻");

  useEffect(() => {
    setCode(challenge.starterCode);
    setIsRunning(false);
    setLedState(false);
  }, [selectedChallengeIdx]);

  // Virtual Arduino hardware execution loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      if (challenge.id === 'ard-01') {
        timer = setInterval(() => {
          setLedState((prev) => !prev);
          sounds.playClick();
        }, 500);
      } else if (challenge.id === 'ard-02') {
        setLedState(buttonPressed);
      }
    } else {
      setLedState(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, buttonPressed, challenge.id]);

  const handleCompileAndFlash = () => {
    sounds.playClick();
    setIsFlashing(true);
    setVoltSpeech('Compiling C code and linking firmware...');

    setTimeout(() => {
      setIsFlashing(false);
      setIsRunning(true);
      sounds.playCorrect();
      setVoltSpeech('Binary flashed to Uno board! Look at Pin 13 blinking! ⚡');
      setCompilerLogs([
        'Compiling sketch...',
        'Linking object files into binary.hex...',
        'Binary size: 924 bytes (2% of Flash memory)',
        'Flashing via virtual UART bootloader...',
        'SUCCESS: Firmware running live on ATmega328P!',
      ]);
    }, 800);
  };

  const handleStop = () => {
    setIsRunning(false);
    setLedState(false);
    setVoltSpeech('Board halted. Ready for your next code edit!');
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 select-none font-sans text-xs">
      {/* Top Banner */}
      <div className="rounded-3xl border border-[#282E33] bg-[#16191C] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <VoltCharacter
            expression={isRunning ? 'excited' : 'curious_coding'}
            size="md"
            speechText={voltSpeech}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-[#ECEBE4]">
                E&TC Arduino & Microcontroller Code Lab
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#3DDCFF]/10 text-[#3DDCFF] border border-[#3DDCFF]/30 font-mono text-[10px] font-bold">
                Virtual Hardware
              </span>
            </div>
            <p className="text-xs text-[#9CA3A8] mt-1">
              Bridge your digital logic gates with real embedded microcontroller C code without physical burning hazards!
            </p>
          </div>
        </div>

        {/* Challenge Selector */}
        <div className="flex items-center gap-2 bg-[#0E1012] p-1.5 rounded-2xl border border-[#282E33]">
          {ARDUINO_CHALLENGES.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChallengeIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedChallengeIdx === idx
                  ? 'bg-[#1D2125] text-[#C6FF3D] border border-[#282E33]'
                  : 'text-[#9CA3A8] hover:text-[#ECEBE4]'
              }`}
            >
              Lab {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor + Virtual Board Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: C Code Editor (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-[#282E33] bg-[#16191C] overflow-hidden flex flex-col shadow-lg">
          <div className="px-5 py-3 bg-[#1D2125] border-b border-[#282E33] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ECEBE4]">
              <Code2 className="w-4 h-4 text-[#3DDCFF]" />
              <span>sketch.ino (Arduino C++)</span>
            </div>

            <div className="flex items-center gap-2">
              {isRunning ? (
                <BenchButton variant="danger" size="sm" onClick={handleStop}>
                  Stop Board
                </BenchButton>
              ) : (
                <BenchButton
                  variant="primary"
                  size="sm"
                  isLoading={isFlashing}
                  onClick={handleCompileAndFlash}
                  icon={<Play className="w-3.5 h-3.5 fill-current" />}
                >
                  Verify & Flash Code 🚀
                </BenchButton>
              )}
            </div>
          </div>

          {/* Textarea code editor */}
          <div className="p-4 bg-[#0E1012] flex-1">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-80 bg-transparent font-mono text-xs text-[#ECEBE4] leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-[#C6FF3D] selection:text-[#0E1012]"
            />
          </div>

          {/* Mini Compiler Console */}
          <div className="p-3 bg-[#121518] border-t border-[#282E33] font-mono text-[11px] text-[#9CA3A8] max-h-24 overflow-y-auto space-y-1">
            <div className="text-[#646F77] text-[10px] uppercase font-bold flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-[#3DDCFF]" />
              <span>AVR Build Output Console:</span>
            </div>
            {compilerLogs.map((log, idx) => (
              <div key={idx} className={log.includes('SUCCESS') ? 'text-[#C6FF3D] font-bold' : ''}>
                &gt; {log}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Virtual Arduino Uno Visualizer (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-[#282E33] bg-[#16191C] p-6 space-y-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-[#282E33] pb-3 mb-4">
              <span className="font-bold text-sm text-[#ECEBE4]">
                Virtual Arduino Uno Board
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                  isRunning
                    ? 'bg-[#C6FF3D]/15 text-[#C6FF3D] border border-[#C6FF3D]/30'
                    : 'bg-[#1D2125] text-[#646F77]'
                }`}
              >
                {isRunning ? 'POWERED (5V)' : 'STANDBY'}
              </span>
            </div>

            {/* Virtual Board Layout */}
            <div className="p-6 rounded-2xl bg-[#0F2830] border-2 border-[#1E5060] flex flex-col items-center justify-center gap-6 shadow-2xl relative overflow-hidden">
              {/* Header Pins Row */}
              <div className="w-full flex items-center justify-between px-2 text-[9px] font-mono text-[#3DDCFF]">
                <span>AREF</span>
                <span>GND</span>
                <span>13</span>
                <span>12</span>
                <span>11</span>
                <span>10</span>
                <span>9</span>
              </div>

              {/* Pin 13 Built-in LED */}
              <div className="p-4 rounded-xl bg-[#09181D] border border-[#1E5060] flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    ledState
                      ? 'border-[#FFB020] bg-[#FFB020] shadow-[0_0_20px_#FFB020]'
                      : 'border-[#3DDCFF]/40 bg-[#0E1012]'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${ledState ? 'bg-white' : 'bg-transparent'}`} />
                </div>
                <div className="font-mono text-center">
                  <span className="text-[10px] text-[#ECEBE4] font-bold block">PIN 13 LED (L)</span>
                  <span className={`text-[10px] font-bold ${ledState ? 'text-[#FFB020]' : 'text-[#646F77]'}`}>
                    {ledState ? 'STATE: HIGH (5V)' : 'STATE: LOW (0V)'}
                  </span>
                </div>
              </div>

              {/* Pushbutton if Challenge 2 */}
              {challenge.id === 'ard-02' && (
                <div className="w-full p-3 rounded-xl bg-[#0E1012] border border-[#1E5060] flex items-center justify-between">
                  <span className="text-xs text-[#ECEBE4] font-mono">Pin 2 Pushbutton:</span>
                  <button
                    onMouseDown={() => setButtonPressed(true)}
                    onMouseUp={() => setButtonPressed(false)}
                    className={`px-4 py-1.5 rounded-lg font-mono font-bold text-xs transition-all ${
                      buttonPressed
                        ? 'bg-[#3DDCFF] text-[#0E1012] shadow-lg'
                        : 'bg-[#1D2125] text-[#ECEBE4] border border-[#282E33]'
                    }`}
                  >
                    {buttonPressed ? 'HELD DOWN' : 'PRESS ME'}
                  </button>
                </div>
              )}

              {/* Microcontroller ATmega Chip Graphic */}
              <div className="w-full py-2.5 px-4 rounded-lg bg-[#071317] border border-[#1E5060] flex items-center justify-between text-[10px] font-mono text-[#9CA3A8]">
                <span>ATmega328P</span>
                <span>16 MHz XTAL</span>
              </div>
            </div>
          </div>

          {/* Goal & Hint footer */}
          <div className="p-3.5 rounded-xl bg-[#0E1012] border border-[#282E33] space-y-1">
            <div className="text-[10px] font-mono text-[#C6FF3D] font-bold">
              LAB OBJECTIVE:
            </div>
            <p className="text-xs text-[#ECEBE4]">
              {challenge.objective}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
