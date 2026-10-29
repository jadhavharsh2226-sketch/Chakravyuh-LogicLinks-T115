import React, { useState } from 'react';
import { Send, Volume2, VolumeX, Zap, Wrench, Play, Plus, Power, User, StopCircle, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { ValidationReport } from '../../engine/validator';
import { StudentProfile } from '../../types/student';
import { AIMentorService, VoltResponse } from '../../services/aiMentorService';
import { VoltCharacter, VoltExpression } from '../common/VoltCharacter';
import { sounds } from '../../services/soundEffects';
import { AgenticAction } from '../../types/agentic';
import { AgentTaskPlan } from '../../engine/agent/agentTools';

interface AIMentorPanelProps {
  validationReport: ValidationReport | null;
  activeMissionTitle?: string;
  studentProfile: StudentProfile;
  componentsCount?: number;
  switchesState?: Record<string, boolean>;
  activeGates?: string[];
  onExecuteAgenticAction?: (action: AgenticAction) => void;
  onExecuteAutonomousGoal?: (goal: string) => Promise<void>;
  onCancelAutonomousTask?: () => void;
  isAgentRunning?: boolean;
  agentActiveStep?: {
    current: number;
    total: number;
    thought: string;
    tool: string;
  } | null;
  agentPlan?: AgentTaskPlan | null;
}

export const AIMentorPanel: React.FC<AIMentorPanelProps> = ({
  validationReport,
  activeMissionTitle,
  studentProfile,
  componentsCount = 0,
  switchesState = {},
  activeGates = [],
  onExecuteAgenticAction,
  onExecuteAutonomousGoal,
  onCancelAutonomousTask,
  isAgentRunning = false,
  agentActiveStep = null,
  agentPlan = null,
}) => {
  const [currentExpression, setCurrentExpression] = useState<VoltExpression>('happy');
  const [voltSpeech, setVoltSpeech] = useState<string>('Ask me anything! I know your syllabus.');
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'volt'; text: string; tip?: string; isAutonomous?: boolean }>>([
    {
      id: 'init-1',
      role: 'volt',
      text: `Hey there! ⚡ I'm Volt, your Autonomous AI logic agent. Tell me a task (e.g. "Build an XOR gate", "Fix floating pins", "Test all inputs") and I will plan, use tools, and verify the circuit on your workbench!`,
      tip: 'Tip: Type any command or click the action pills above to watch me build autonomously!',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const quickPrompts = [
    { label: 'Build XOR Gate', q: 'Build an XOR gate and connect it to switches and LED' },
    { label: 'Fix Floating Pins', q: 'Fix all floating pins and wire the circuit' },
    { label: 'Test All Vectors', q: 'Test all truth table inputs (00 to 11)' },
    { label: 'Bulb not on?', q: 'Why is my light bulb not turning on?' },
    { label: 'AND vs OR', q: 'What is the difference between AND and OR?' },
  ];

  const handleSendQuestion = async (question: string) => {
    if (!question.trim() || isLoading || isAgentRunning) return;

    sounds.playClick();
    const q = question.trim();
    const userMessageId = `usr-${Date.now()}`;
    setMessages((prev) => [...prev, { id: userMessageId, role: 'user', text: q }]);
    setInputQuestion('');

    // Check if question is an actionable autonomous task
    const isActionTask =
      q.toLowerCase().startsWith('build') ||
      q.toLowerCase().startsWith('make') ||
      q.toLowerCase().startsWith('create') ||
      q.toLowerCase().startsWith('fix') ||
      q.toLowerCase().startsWith('repair') ||
      q.toLowerCase().startsWith('solve') ||
      q.toLowerCase().startsWith('wire') ||
      q.toLowerCase().startsWith('connect') ||
      q.toLowerCase().startsWith('test') ||
      q.toLowerCase().startsWith('simulate') ||
      q.toLowerCase().startsWith('clear') ||
      q.toLowerCase().startsWith('add') ||
      q.toLowerCase().startsWith('flip') ||
      q.toLowerCase().startsWith('toggle');

    if (isActionTask && onExecuteAutonomousGoal) {
      setCurrentExpression('thinking');
      setMessages((prev) => [
        ...prev,
        {
          id: `volt-${Date.now()}`,
          role: 'volt',
          text: `⚡ Autonomous Goal Accepted: "${q}". Synthesizing task plan, executing simulator tools, and validating truth table vectors...`,
          isAutonomous: true,
        },
      ]);
      await onExecuteAutonomousGoal(q);
      setCurrentExpression('celebrating');
      return;
    }

    // Standard conversational viva / explanation mode
    setIsLoading(true);
    setCurrentExpression('thinking');
    setVoltSpeech('Let me inspect your circuit...');

    try {
      const response: VoltResponse = await AIMentorService.askVolt(
        q,
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
    } catch {
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
            expression={isAgentRunning ? 'thinking' : currentExpression}
            size="sm"
            onClick={() => sounds.playChirp()}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-[#ECEBE4]">Volt</span>
              <span className="px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-mono text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                <span>Autonomous Agent</span>
              </span>
            </div>
            <div className="text-[10px] text-[#9CA3A8] font-mono truncate max-w-[170px]">
              {isAgentRunning ? 'Executing tools on workbench...' : 'Ready for tasks & viva prep'}
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

      {/* ACTIVE AUTONOMOUS EXECUTION STATUS CARD */}
      {isAgentRunning && agentActiveStep && (
        <div className="p-3 bg-[#0A1218] border-b border-[#00E5FF]/40 text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#00E5FF]">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
              <span>STEP {agentActiveStep.current} / {agentActiveStep.total}</span>
            </div>

            <button
              onClick={onCancelAutonomousTask}
              className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/40 font-mono text-[10px] font-bold flex items-center gap-1 transition-colors"
              title="Stop agent execution"
            >
              <StopCircle className="w-3 h-3" />
              <span>Stop</span>
            </button>
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-1.5 py-0.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] font-mono text-[10px] font-bold uppercase border border-[#00E5FF]/40">
              tool: {agentActiveStep.tool}
            </span>
            <span className="text-[11px] text-[#ECEBE4] font-medium truncate">
              {agentActiveStep.thought}
            </span>
          </div>

          {/* Mini progress bar */}
          <div className="w-full bg-[#161B20] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#00E5FF] to-[#C6FF3D] h-full transition-all duration-300"
              style={{
                width: `${Math.round((agentActiveStep.current / agentActiveStep.total) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* COMPACT AGENTIC ACTION CHIPS */}
      <div className="px-3 py-2 bg-[#101316] border-b border-[#282E33] flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none">
        <span className="text-[10px] font-mono text-[#00E5FF] font-bold whitespace-nowrap flex items-center gap-1 mr-1">
          <Zap className="w-3 h-3 text-[#C6FF3D]" />
          <span>TASKS:</span>
        </span>

        <button
          disabled={isAgentRunning}
          onClick={() => handleSendQuestion('Build an XOR gate and connect it to switches and light bulb')}
          className="px-2.5 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/40 hover:bg-[#00E5FF]/20 text-[#00E5FF] text-[10px] font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1 disabled:opacity-40"
        >
          <Layers className="w-3 h-3" />
          <span>Build XOR</span>
        </button>

        <button
          disabled={isAgentRunning}
          onClick={() => handleSendQuestion('Fix all floating pins and wire the circuit')}
          className="px-2.5 py-1 rounded-full bg-[#16191C] border border-[#282E33] hover:border-[#FFB020] hover:bg-[#FFB020]/10 text-[#FFB020] text-[10px] font-mono whitespace-nowrap transition-all flex items-center gap-1 disabled:opacity-40"
        >
          <Wrench className="w-3 h-3" />
          <span>Auto-Fix</span>
        </button>

        <button
          disabled={isAgentRunning}
          onClick={() => handleSendQuestion('Test all truth table inputs (00 to 11)')}
          className="px-2.5 py-1 rounded-full bg-[#16191C] border border-[#282E33] hover:border-[#C6FF3D] hover:bg-[#C6FF3D]/10 text-[#C6FF3D] text-[10px] font-mono whitespace-nowrap transition-all flex items-center gap-1 disabled:opacity-40"
        >
          <Play className="w-3 h-3" />
          <span>Test Table</span>
        </button>

        <button
          disabled={isAgentRunning}
          onClick={() => handleSendQuestion('Flip Switch A')}
          className="px-2.5 py-1 rounded-full bg-[#16191C] border border-[#282E33] hover:border-[#ECEBE4] text-[#ECEBE4] text-[10px] font-mono whitespace-nowrap transition-all flex items-center gap-1 disabled:opacity-40"
        >
          <Power className="w-3 h-3 text-[#00E5FF]" />
          <span>Flip A</span>
        </button>

        <button
          disabled={isAgentRunning}
          onClick={() => handleSendQuestion('Flip Switch B')}
          className="px-2.5 py-1 rounded-full bg-[#16191C] border border-[#282E33] hover:border-[#ECEBE4] text-[#ECEBE4] text-[10px] font-mono whitespace-nowrap transition-all flex items-center gap-1 disabled:opacity-40"
        >
          <Power className="w-3 h-3 text-[#00E5FF]" />
          <span>Flip B</span>
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
              className={`p-3 rounded-2xl border text-xs leading-relaxed max-w-[92%] shadow-md ${
                msg.role === 'user'
                  ? 'bg-[#1D2125] border-[#2D333B] text-[#ECEBE4] rounded-tr-none'
                  : msg.isAutonomous
                  ? 'bg-[#0F1C24] border-[#00E5FF]/40 text-[#ECEBE4] rounded-tl-none shadow-[0_4px_16px_rgba(0,229,255,0.15)]'
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
            <span className="font-mono text-[11px]">Volt is analyzing circuit and planning tools...</span>
          </div>
        )}
      </div>

      {/* QUICK PROMPT TAGS */}
      <div className="px-3 py-2 border-t border-[#282E33] bg-[#14181B]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((item) => (
            <button
              key={item.label}
              disabled={isLoading || isAgentRunning}
              onClick={() => handleSendQuestion(item.q)}
              className="text-[10px] text-[#9CA3A8] hover:text-[#ECEBE4] hover:bg-[#1D2125] px-2 py-1 rounded-lg transition-colors border border-[#282E33] whitespace-nowrap disabled:opacity-40"
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
            disabled={isLoading || isAgentRunning}
            placeholder={isAgentRunning ? 'Agent executing task...' : 'Ask Volt: "Build an XOR gate", "Fix circuit"...'}
            className="flex-1 bg-[#16191C] border border-[#282E33] rounded-xl px-3 py-2 text-xs text-[#ECEBE4] placeholder:text-[#646F77] focus:outline-none focus:border-[#00E5FF] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || isAgentRunning || !inputQuestion.trim()}
            className="p-2 rounded-xl bg-[#00E5FF] text-[#0E1012] hover:bg-[#33ebff] disabled:opacity-40 transition-colors font-bold shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
