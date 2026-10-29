import React from 'react';
import { Bot, CheckCircle, HelpCircle, Sparkles, MessageSquare } from 'lucide-react';

export const AIMentorShowcase: React.FC = () => {
  return (
    <section className="py-20 border-t border-[#282E33] bg-[#0E1012]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs text-[#C6FF3D] font-bold tracking-widest uppercase block mb-2">
            AI STUDY BUDDY // 24/7 TUTOR
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#ECEBE4]">
            Stuck on a Circuit? Ask Your AI Tutor.
          </h2>
          <p className="text-sm text-[#9CA3A8] mt-3">
            Explains concepts in plain English, spots your wiring mistakes, and helps you pass your exams.
          </p>
        </div>

        {/* Friendly Chat Preview */}
        <div className="max-w-3xl mx-auto rounded-2xl border border-[#282E33] bg-[#16191C] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="px-5 py-3.5 bg-[#1D2125] border-b border-[#282E33] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5 text-[#C6FF3D]" />
              <div>
                <div className="font-sans text-xs font-bold text-[#ECEBE4]">
                  CircuitVerse Study Buddy
                </div>
                <div className="text-[10px] text-[#9CA3A8] font-mono">
                  Online • Ready to help with Digital Electronics
                </div>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30 text-xs font-mono font-semibold">
              Always Free
            </span>
          </div>

          {/* Conversation stream */}
          <div className="p-6 space-y-4 bg-[#0E1012] bg-bench-grid">
            {/* Student message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1D2125] border border-[#282E33] flex items-center justify-center font-mono text-xs text-[#9CA3A8] shrink-0 font-bold">
                BCA
              </div>
              <div className="p-3.5 rounded-2xl bg-[#16191C] border border-[#282E33] text-xs font-sans text-[#ECEBE4] max-w-lg leading-relaxed">
                <p>
                  "Hey! I'm trying to make a light turn ON when both switches are ON. But when I turn both ON, the light stays dark. What did I do wrong?"
                </p>
              </div>
            </div>

            {/* AI Tutor response */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C6FF3D]/10 border border-[#C6FF3D]/40 flex items-center justify-center font-mono text-xs text-[#C6FF3D] shrink-0 font-bold">
                AI
              </div>
              <div className="p-4 rounded-2xl bg-[#16191C] border border-[#282E33] space-y-3 text-xs font-sans text-[#ECEBE4] max-w-xl leading-relaxed">
                <p>
                  I looked at your circuit! You accidentally used an <strong>XOR gate</strong> instead of an <strong>AND gate</strong>. Here is why:
                </p>

                {/* Explanation Box */}
                <div className="p-3 rounded-xl border border-[#3DDCFF]/30 bg-[#3DDCFF]/5 space-y-1.5 font-sans">
                  <div className="flex items-center gap-1.5 text-[#3DDCFF] font-bold text-xs">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Simple Rule:</span>
                  </div>
                  <p className="text-[#ECEBE4] text-xs">
                    • <strong>XOR Gate:</strong> Turns ON only when switches are <em>different</em> (0 and 1). When both are ON (1, 1), it turns OFF.<br />
                    • <strong>AND Gate:</strong> Turns ON when <em>BOTH</em> switches are ON (1, 1). That's what you want!
                  </p>
                </div>

                {/* Quick Fix Button */}
                <div className="p-3 rounded-xl border border-[#C6FF3D]/30 bg-[#C6FF3D]/5 flex items-center justify-between text-xs">
                  <span className="text-[#ECEBE4]">
                    <strong>How to fix:</strong> Delete the XOR gate and drag an <strong>AND Gate</strong> from the left library.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
