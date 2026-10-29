import React, { useState } from 'react';
import { Send, Sparkles, Volume2, VolumeX, Zap, Wrench, Play, Plus, Power } from 'lucide-react';
import { ValidationReport } from '../../engine/validator';
import { StudentProfile } from '../../types/student';
import { AIMentorService, VoltResponse } from '../../services/aiMentorService';
import { VoltCharacter, VoltExpression } from '../common/VoltCharacter';
import { sounds } from '../../services/soundEffects';
import { AgenticAction } from '../../types/agentic';

interface AIMentorPanelProps {
  validationReport: ValidationReport | null;
  activeMissionTitle?: string;
  studentProfile: StudentProfile;
  componentsCount?: number;
  switchesState?: Record<string, boolean>;
  activeGates?: string[];
  onExecuteAgenticAction?: (action: AgenticAction) => void;
}

export const AIMentorPanel: React.FC<AIMentorPanelProps> = ({
  validationReport,
  activeMissionTitle,
  studentProfile,
  componentsCount = 0,
  switchesState = {},
  activeGates = [],
  onExecuteAgenticAction,
}) => {
  const [currentExpression, setCurrentExpression] = useState<VoltExpression>('happy');
  const [voltSpeech, setVoltSpeech] = useState<string>('Ask me anything! I know your syllabus.');
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'volt'; text: string; tip?: string }>>([
    {
      id: 'init-1',
      role: 'volt',
      text: `Hey there! ⚡ I'm Volt, your Agentic AI logic tutor. I see you're in ${studentProfile.track === 'BCA_YEAR_1' ? 'BCA 1st Year' : 'college'}! I can answer viva questions OR move my cursor to wire gates, flip switches, and test circuits!`,
      tip: 'Tip: Click any Agentic Action below to watch me take action on canvas!',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const quickPrompts = [
    'Why is my light bulb not turning on?',
    'What is the difference between AND and OR?',
    'Explain XOR for my upcoming exam',
    'Are my wires connected properly?',
  ];

  const handleSendQuestion = async (question: string) => {
    if (!question.trim() || isLoading) return;

    sounds.playClick();
    setIsLoading(true);
    setCurrentExpression('thinking');
    setVoltSpeech('Let me inspect your circuit...');

    const userMessageId = `usr-${Date.now()}`;
    setMessages((prev) => [...prev, { id: userMessageId, role: 'user', text: question }]);
    setInputQuestion('');

    try {
      const response: VoltResponse = await AIMentorService.askVolt(
        question,
        studentProfile,
        validationReport,
        {
          componentsCount,
          switchesState,
          activeGates,
        }
      );

      sounds.playCorrect();
      setCurrentExpression(response.expression);
      setVoltSpeech(response.message.slice(0, 80) + '...');

      setMessages((prev) => [
        ...prev,
        {
          id: `volt-${Date.now()}`,
          role: 'volt',
          text: response.message,
          tip: response.quickTip,
        },
      ]);

      if (response.action && onExecuteAgenticAction) {
        onExecuteAgenticAction(response.action);
      }
    } catch (e) {
      setCurrentExpression('happy');
      setMessages((prev) => [
        ...prev,
        {
          id: `volt-${Date.now()}`,
          role: 'volt',
          text: '⚡ Keep building! Remember: an AND gate needs both inputs ON to light the bulb.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerAgenticAction = (action: AgenticAction) => {
    sounds.playClick();
    setCurrentExpression('excited');
    setVoltSpeech(`Moving cursor to ${action.summary.toLowerCase()}`);
    setMessages((prev) => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        role: 'user',
        text: `Volt, ${action.summary}`,
      },
      {
        id: `volt-${Date.now()}`,
        role: 'volt',
        text: `⚡ On it! Watch my cursor ${action.summary.toLowerCase()}`,
        tip: 'Volt agentic cursor is interacting with the canvas in real-time.',
      },
    ]);
    if (onExecuteAgenticAction) {
      onExecuteAgenticAction(action);
    }
  };

  const handleToggleSound = () => {
    const next = sounds.toggleSound();
    setSoundOn(next);
  };

  return (
    <div className="flex flex-col h-full bg-[#16191C] select-none font-sans text-xs">
      {/* Top Banner with Mascot */}
      <div className="p-4 bg-[#1D2125] border-b border-[#282E33] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <VoltCharacter
            expression={currentExpression}
            size="sm"
            onClick={() => sounds.playChirp()}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-[#ECEBE4]">Volt</span>
              <span className="px-2 py-0.2 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-mono text-[10px] font-bold">
                Agentic AI Tutor ⚡
              </span>
            </div>
            <div className="text-[11px] text-[#9CA3A8] font-mono">
              Moves cursor & teaches syllabus
            </div>
          </div>
        </div>

        <button
          onClick={handleToggleSound}
          className="p-1.5 rounded-lg text-[#9CA3A8] hover:text-[#ECEBE4] hover:bg-[#16191C]"
          title={soundOn ? 'Mute sound' : 'Unmute sound'}
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-[#C6FF3D]" /> : <VolumeX className="w-4 h-4 text-[#646F77]" />}
        </button>
      </div>

      {/* AGENTIC AI ACTION DECK */}
      <div className="p-3 bg-[#111518] border-b border-[#282E33]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#00E5FF]">
            <Zap className="w-3.5 h-3.5 text-[#C6FF3D]" />
            <span>AGENTIC COMMAND DECK</span>
          </div>
          <span className="text-[9px] text-[#646F77] font-mono">Click to command Volt</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() =>
              triggerAgenticAction({
                id: `act_${Date.now()}`,
                type: 'TOGGLE_SWITCH',
                targetSwitchLabel: 'Switch A',
                summary: 'Flipping Switch A',
              })
            }
            className="flex items-center gap-1.5 p-2 rounded-lg bg-[#16191C] border border-[#282E33] hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 text-[#ECEBE4] text-[11px] font-mono transition-all text-left"
          >
            <Power className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="truncate">Flip Switch A</span>
          </button>

          <button
            onClick={() =>
              triggerAgenticAction({
                id: `act_${Date.now()}`,
                type: 'TOGGLE_SWITCH',
                targetSwitchLabel: 'Switch B',
                summary: 'Flipping Switch B',
              })
            }
            className="flex items-center gap-1.5 p-2 rounded-lg bg-[#16191C] border border-[#282E33] hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 text-[#ECEBE4] text-[11px] font-mono transition-all text-left"
          >
            <Power className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="truncate">Flip Switch B</span>
          </button>

          <button
            onClick={() =>
              triggerAgenticAction({
                id: `act_${Date.now()}`,
                type: 'ADD_COMPONENT',
                componentType: 'AND',
                summary: 'Placing AND Gate',
              })
            }
            className="flex items-center gap-1.5 p-2 rounded-lg bg-[#16191C] border border-[#282E33] hover:border-[#C6FF3D] hover:bg-[#C6FF3D]/10 text-[#ECEBE4] text-[11px] font-mono transition-all text-left"
          >
            <Plus className="w-3.5 h-3.5 text-[#C6FF3D]" />
            <span className="truncate">Add AND Gate</span>
          </button>

          <button
            onClick={() =>
              triggerAgenticAction({
                id: `act_${Date.now()}`,
                type: 'FIX_CIRCUIT',
                summary: 'Auto-Fixing Circuit',
              })
            }
            className="flex items-center gap-1.5 p-2 rounded-lg bg-[#16191C] border border-[#282E33] hover:border-[#FFB020] hover:bg-[#FFB020]/10 text-[#ECEBE4] text-[11px] font-mono transition-all text-left"
          >
            <Wrench className="w-3.5 h-3.5 text-[#FFB020]" />
            <span className="truncate">Auto-Fix Circuit</span>
          </button>

          <button
            onClick={() =>
              triggerAgenticAction({
                id: `act_${Date.now()}`,
                type: 'TEST_TRUTH_TABLE',
                summary: 'Running Live Test Sequence',
              })
            }
            className="col-span-2 flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/40 hover:bg-[#00E5FF]/20 text-[#00E5FF] text-[11px] font-mono font-bold transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Volt, Run Live Truth Table Test (00→01→11→10)</span>
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0E1012] bg-bench-grid">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-2xl border text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-[#1D2125] border-[#282E33] text-[#ECEBE4] ml-6'
                : 'bg-[#16191C] border-[#282E33] text-[#ECEBE4] mr-3 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between mb-1 text-[10px] text-[#646F77] font-mono">
              <span className="font-bold text-[#9CA3A8]">
                {msg.role === 'user' ? 'You' : 'Volt ⚡'}
              </span>
            </div>

            <p className="whitespace-pre-line font-sans">{msg.text}</p>

            {msg.tip && (
              <div className="mt-2 p-2 rounded-lg bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D] text-[11px] font-sans font-semibold">
                💡 {msg.tip}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="p-3 rounded-2xl bg-[#16191C] border border-[#282E33] text-xs text-[#9CA3A8] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
            <span>Volt is analyzing circuit and calculating cursor moves...</span>
          </div>
        )}
      </div>

      {/* 1-Click Common Questions */}
      <div className="p-3 border-t border-[#282E33] bg-[#16191C] space-y-1.5">
        <div className="text-[10px] text-[#646F77] uppercase font-bold px-1 font-mono">
          Quick Questions for Volt:
        </div>
        <div className="flex flex-col gap-1">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              disabled={isLoading}
              onClick={() => handleSendQuestion(prompt)}
              className="text-left text-xs text-[#9CA3A8] hover:text-[#ECEBE4] hover:bg-[#1D2125] px-2.5 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#282E33] truncate"
            >
              💬 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-[#282E33] bg-[#0E1012]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion(inputQuestion);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            disabled={isLoading}
            placeholder='Type e.g. "Volt, flip switch A" or "Add AND gate"...'
            className="flex-1 bg-[#16191C] border border-[#282E33] rounded-xl px-3 py-2 text-xs text-[#ECEBE4] placeholder:text-[#646F77] focus:outline-none focus:border-[#00E5FF]"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuestion.trim()}
            className="p-2 rounded-xl bg-[#00E5FF] text-[#0E1012] hover:bg-[#33ebff] disabled:opacity-40 transition-colors font-bold"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
