import React, { useState, useRef, useEffect } from 'react';
import { Volt3DCanvas } from './Volt3DCanvas';
import { VoltExpression } from './VoltCharacter';
import { sounds } from '../../services/soundEffects';
import { StudentProfile } from '../../types/student';
import { UNIVERSITY_SYLLABI } from '../../services/syllabusData';
import { Sparkles, X, Smile, Trophy, Send, User, Zap, MessageSquare } from 'lucide-react';
import { askGroq } from '../../services/groqService';

interface FloatingVoltCompanionProps {
  currentView: string;
  studentProfile: StudentProfile;
  onNavigate: (view: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'volt';
  text: string;
}

export const FloatingVoltCompanion: React.FC<FloatingVoltCompanionProps> = ({
  currentView,
  studentProfile,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expression, setExpression] = useState<VoltExpression>('happy');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const syllabus = UNIVERSITY_SYLLABI[studentProfile.track] || UNIVERSITY_SYLLABI.ENTC_SEMESTER_1_2;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'volt',
      text: `Hi ${studentProfile.name.split(' ')[0]}! ⚡ I'm Volt, your 3D logic buddy. Ask me any question for ${syllabus.courseName.split(' ')[0]} (${syllabus.yearName}) or viva prep!`,
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleMascotClick = () => {
    sounds.playChirp();
    setIsOpen(!isOpen);
    setExpression('celebrating');
  };

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    sounds.playClick();
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setExpression('thinking');

    const systemPrompt = `You are "Volt", an enthusiastic, cute 3D electronics mascot logic tutor for college students (Duolingo style).
Student Profile: ${studentProfile.name}, Track: ${syllabus.courseName} - ${syllabus.yearName}, Standard: ${syllabus.standardReference}.
Give a warm, friendly, bite-sized 2-3 sentence answer with emojis (⚡, 💡, 🔥, 🚀). Keep it punchy and easy to understand. Never echo instructions.`;

    try {
      // Build conversation history for Groq
      const groqHistory = messages
        .slice(-6)
        .map((m) => ({
          role: (m.role === 'volt' ? 'assistant' : 'user') as 'assistant' | 'user',
          content: m.text,
        }));
      groqHistory.push({ role: 'user', content: text });

      const reply = await askGroq(groqHistory, systemPrompt, 'openai/gpt-oss-120b');

      sounds.playCorrect();
      setExpression('excited');
      setMessages((prev) => [
        ...prev,
        {
          id: `volt_${Date.now()}`,
          role: 'volt',
          text: reply,
        },
      ]);
    } catch {
      // Fallback
      sounds.playChirp();
      setExpression('happy');
      setMessages((prev) => [
        ...prev,
        {
          id: `volt_${Date.now()}`,
          role: 'volt',
          text: `⚡ Volt here! Remember: AND gates need all 1s (×), OR gates need any 1 (+), and XOR only likes opposites! Keep building!`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJokeClick = () => {
    sounds.playChirp();
    const jokes = [
      "Why did the circuit board break up? There was no connection! 💔⚡",
      "Why do engineers love dark mode? Because light attracts bugs! 🪲",
      "Volt says: Don't stress! Even microchips need a reset button sometimes. 🔄",
      "In an XOR gate, two wrongs (0,0) or two rights (1,1) make a 0! Only opposites attract! 😄",
    ];
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    setExpression('stress_relief');
    setMessages((prev) => [
      ...prev,
      {
        id: `usr_${Date.now()}`,
        role: 'user',
        text: 'Tell me an electronics joke! 😂',
      },
      {
        id: `volt_${Date.now()}`,
        role: 'volt',
        text: randomJoke,
      },
    ]);
  };

  // Don't show in login view or circuit lab to keep workbench completely distraction-free
  if (currentView === 'login' || currentView === 'lab') return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end select-none font-sans pointer-events-auto">
      {/* Expanded Interactive Chatbot Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-[#14181C]/95 backdrop-blur-xl border-2 border-[#C6FF3D] text-xs shadow-2xl shadow-black/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 h-[440px]">
          {/* Header */}
          <div className="p-3.5 bg-[#1B2026] border-b border-[#282E33] flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C6FF3D] animate-ping" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-[#ECEBE4]">Volt 3D Companion</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#00E5FF]/15 text-[#00E5FF] text-[9px] font-mono font-bold border border-[#00E5FF]/30">
                    Groq 120B ⚡
                  </span>
                </div>
                <div className="text-[10px] text-[#9CA3A8] font-mono">
                  Online · Ready to answer anything
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#9CA3A8] hover:text-[#ECEBE4] hover:bg-[#282E33] transition-colors"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#0E1012] bg-bench-grid">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
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

                <div
                  className={`p-3 rounded-2xl border text-xs leading-relaxed max-w-[88%] shadow-md ${
                    msg.role === 'user'
                      ? 'bg-[#1E232A] border-[#2D333B] text-[#ECEBE4] rounded-tr-none'
                      : 'bg-[#161B20] border-[#232A32] text-[#ECEBE4] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line font-sans">{msg.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="p-3 rounded-2xl bg-[#161B20] border border-[#232A32] text-xs text-[#00E5FF] flex items-center gap-2 max-w-[85%]">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                <span className="font-mono text-[11px]">Volt is thinking at Groq speed... ⚡</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-[#14181C] border-t border-[#23282E] flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none">
            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('chakravyuha');
                setIsOpen(false);
              }}
              className="px-2.5 py-1 rounded-full bg-[#1D2125] border border-[#282E33] hover:border-[#C6FF3D] text-[#C6FF3D] text-[10px] font-mono font-bold whitespace-nowrap flex items-center gap-1"
            >
              <Trophy className="w-3 h-3" />
              <span>Circuit Arena</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('lab');
                setIsOpen(false);
              }}
              className="px-2.5 py-1 rounded-full bg-[#1D2125] border border-[#282E33] hover:border-[#3DDCFF] text-[#3DDCFF] text-[10px] font-mono font-bold whitespace-nowrap flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Circuit Lab</span>
            </button>

            <button
              onClick={handleJokeClick}
              className="px-2.5 py-1 rounded-full bg-[#1D2125] border border-[#282E33] hover:border-[#FFB020] text-[#FFB020] text-[10px] font-mono whitespace-nowrap flex items-center gap-1"
            >
              <Smile className="w-3 h-3" />
              <span>Tell Joke</span>
            </button>

            <button
              onClick={() => handleSendMessage('Explain how an XOR gate works for my viva!')}
              className="px-2.5 py-1 rounded-full bg-[#1D2125] border border-[#282E33] hover:border-[#ECEBE4] text-[#9CA3A8] hover:text-[#ECEBE4] text-[10px] font-mono whitespace-nowrap flex items-center gap-1"
            >
              <span>Explain XOR</span>
            </button>
          </div>

          {/* Text Input & Send */}
          <div className="p-2.5 bg-[#101316] border-t border-[#23282E]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
                placeholder="Ask Volt anything... (Powered by Groq)"
                className="flex-1 bg-[#1A1F26] border border-[#2A313A] rounded-xl px-3 py-2 text-xs text-[#ECEBE4] placeholder:text-[#646F77] focus:outline-none focus:border-[#C6FF3D]"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-2 rounded-xl bg-[#C6FF3D] text-[#0A0D10] hover:bg-[#d4ff66] disabled:opacity-40 transition-colors font-bold shadow-md"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating 3D Robot Mascot */}
      <div className="relative group flex items-center">
        {/* Floating tooltip badge */}
        {!isOpen && (
          <div className="hidden group-hover:flex items-center gap-1.5 absolute right-24 top-6 bg-[#16191C]/95 border border-[#C6FF3D] text-[#ECEBE4] px-3 py-1.5 rounded-2xl text-[11px] font-mono whitespace-nowrap shadow-xl backdrop-blur-md">
            <MessageSquare className="w-3.5 h-3.5 text-[#C6FF3D]" />
            <span>Chat with Volt in 3D! ⚡</span>
          </div>
        )}

        <div className="relative">
          <Volt3DCanvas
            expression={expression}
            size="md"
            onClick={handleMascotClick}
            className="drop-shadow-[0_10px_20px_rgba(0,210,255,0.3)] filter cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
