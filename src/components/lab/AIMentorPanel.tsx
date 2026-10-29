import React, { useState } from 'react';
import { Send, Volume2, VolumeX, Zap, Wrench, Play, Plus, Power, User } from 'lucide-react';
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
      tip: 'Tip: Tap any command button above or ask me to flip switches!',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const quickPrompts = [
    { label: 'Bulb not on?', q: 'Why is my light bulb not turning on?' },
    { label: 'AND vs OR', q: 'What is the difference between AND and OR?' },
    { label: 'XOR Exam Trick', q: 'Explain XOR for my upcoming exam' },
    { label: 'Check Wires', q: 'Are my wires connected properly?' },
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
        text: `⚡ Executing! Watch my cursor ${action.summary.toLowerCase()}`,
        tip: 'Volt agentic cursor is interacting directly with the canvas in real-time.',
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
      <div className="p-3 bg-[#1D2125] border-b border-[#282E33] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <VoltCharacter
            expression={currentExpression}
            size="sm"
            onClick={() => sounds.playChirp()}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-[#ECEBE4]">Volt</span>
              <span className="px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-mono text-[10px] font-bold">
                Agentic AI Tutor ⚡
              </span>
            </div>
            <div className="text-[10px] text-[#9CA3A8] font-mono truncate max-w-[160px]">
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

      {/* COMPACT AGENTIC COMMAND STRIP (Horizontal Scrolling Bar) */}
      <div className="px-3 py-2 bg-[#101316] border-b border-[#282E33] flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none">
        <span className="text-[10px] font-mono text-[#00E5FF] font-bold whitespace-nowrap flex items-center gap-1 mr-1">
          <Zap className="w-3 h-3 text-[#C6FF3D]" />
          <span>ACT:</span>
        </span>

        <button
          onClick={() =>
            triggerAgenticAction({
              id: `act_${Date.now()}`,
              type: 'TOGGLE_SWITCH',
              targetSwitchLabel: 'Switch A',
              summary: 'Flipping Switch A',
            })
          }
          className="px-2.5 py-1 rounded-full bg-[#16191C] border border-[#282E33] hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 text-[#ECEBE4] text-[10px] font-mono whitespace-nowrap transition-all flex items-center gap-1"
        >
          <Power className="w-3 h-3 text-[#00E5FF]" />
          <span>Flip A</span>
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
          className="px-2.5 py-1 rounded-full bg-[#16191C] border border-[#282E33] hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 text-[#ECEBE4] text-[10px] font-mono whitespace-nowrap transition-all flex items-center gap-1"
        >
          <Power className="w-3 h-3 text-[#00E5FF]" />
          <span>Flip B</span>
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
          className="px-2.5 py-1 rounded-full bg-[#16191C] border border-[#282E33] hover:border-[#C6FF3D] hover:bg-[#C6FF3D]/10 text-[#ECEBE4] text-[10px] font-mono whitespace-nowrap transition-all flex items-center gap-1"
        >
          <Plus className="w-3 h-3 text-[#C6FF3D]" />
          <span>Add AND</span>
        </button>

        <button
          onClick={() =>
            triggerAgenticAction({
              id: `act_${Date.now()}`,
              type: 'FIX_CIRCUIT',
              summary: 'Auto-Fixing Circuit',
            })
          }
          className="px-2.5 py-1 rounded-full bg-[#16191C] border border-[#282E33] hover:border-[#FFB020] hover:bg-[#FFB020]/10 text-[#ECEBE4] text-[10px] font-mono whitespace-nowrap transition-all flex items-center gap-1"
        >
          <Wrench className="w-3 h-3 text-[#FFB020]" />
          <span>Fix Circuit</span>
        </button>

        <button
          onClick={() =>
            triggerAgenticAction({
              id: `act_${Date.now()}`,
              type: 'TEST_TRUTH_TABLE',
              summary: 'Testing Truth Table live',
            })
          }
          className="px-2.5 py-1 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/50 text-[#00E5FF] font-bold text-[10px] font-mono whitespace-nowrap hover:bg-[#00E5FF]/25 transition-all flex items-center gap-1"
        >
          <Play className="w-3 h-3" />
          <span>Test Table</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0E1012] bg-bench-grid">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Sender badge */}
            <div className="flex items-center gap-1.5 px-1 text-[10px] font-mono text-[#646F77]">
              {msg.role === 'user' ? (
                <>
                  <span className="font-semibold text-[#9CA3A8]">You</span>
                  <User className="w-3 h-3 text-[#9CA3A8]" />
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                  <span className="font-semibold text-[#00E5FF]">Volt ⚡</span>
                </>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`p-3 rounded-2xl border text-xs leading-relaxed max-w-[90%] shadow-md ${
                msg.role === 'user'
                  ? 'bg-[#1D2125] border-[#2D333B] text-[#ECEBE4] rounded-tr-none'
                  : 'bg-[#161B20] border-[#232A32] text-[#ECEBE4] rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line font-sans">{msg.text}</p>

              {msg.tip && (
                <div className="mt-2 p-2 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[11px] font-sans font-medium flex items-center gap-1.5">
                  <span>💡</span>
                  <span>{msg.tip}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="p-3 rounded-2xl bg-[#161B20] border border-[#232A32] text-xs text-[#9CA3A8] flex items-center gap-2 max-w-[85%]">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
            <span className="font-mono text-[11px]">Volt is analyzing circuit logic...</span>
          </div>
        )}
      </div>

      {/* QUICK QUESTION PILLS (Horizontal Tag Cloud) */}
      <div className="px-3 py-2 border-t border-[#282E33] bg-[#14181B]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((item) => (
            <button
              key={item.label}
              disabled={isLoading}
              onClick={() => handleSendQuestion(item.q)}
              className="text-[10px] text-[#9CA3A8] hover:text-[#ECEBE4] hover:bg-[#1D2125] px-2 py-1 rounded-lg transition-colors border border-[#282E33] whitespace-nowrap"
            >
              💬 {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-2.5 border-t border-[#282E33] bg-[#0E1012]">
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
            placeholder='Ask Volt: "flip switch A" or "add AND gate"...'
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
