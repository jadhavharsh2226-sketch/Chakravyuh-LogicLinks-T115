import React, { useState } from 'react';
import { BookOpen, Cpu, Zap, CheckCircle2 } from 'lucide-react';
import { GateSymbol } from '../common/GateSymbol';

export const KnowledgeBaseView: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<string>('gate-cheat-sheet');

  const articles = [
    {
      id: 'gate-cheat-sheet',
      title: 'The 7 Logic Gates Cheat Sheet',
      category: 'EXAM ESSENTIALS',
      readTime: '3 min read',
      content: (
        <div className="space-y-6 font-sans text-xs text-[#ECEBE4] leading-relaxed">
          <p>
            In digital electronics and BCA computer fundamentals, there are 7 fundamental gates. Memorize these simple rules:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AND */}
            <div className="p-4 rounded-xl border border-[#282E33] bg-[#0E1012] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#C6FF3D]">1. AND Gate</span>
                <span className="font-mono text-xs text-[#9CA3A8]">Y = A · B</span>
              </div>
              <p className="text-xs text-[#9CA3A8]">
                <strong>Rule:</strong> Output is <strong>1</strong> ONLY when <strong>both A and B are 1</strong>. Otherwise 0.
              </p>
              <div className="font-mono text-[11px] p-2 rounded bg-[#16191C] text-[#ECEBE4]">
                0·0 = 0 &nbsp;|&nbsp; 0·1 = 0 &nbsp;|&nbsp; 1·0 = 0 &nbsp;|&nbsp; <strong>1·1 = 1</strong>
              </div>
            </div>

            {/* OR */}
            <div className="p-4 rounded-xl border border-[#282E33] bg-[#0E1012] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#3DDCFF]">2. OR Gate</span>
                <span className="font-mono text-xs text-[#9CA3A8]">Y = A + B</span>
              </div>
              <p className="text-xs text-[#9CA3A8]">
                <strong>Rule:</strong> Output is <strong>1</strong> if <strong>at least one input is 1</strong>.
              </p>
              <div className="font-mono text-[11px] p-2 rounded bg-[#16191C] text-[#ECEBE4]">
                0+0 = 0 &nbsp;|&nbsp; <strong>0+1 = 1</strong> &nbsp;|&nbsp; <strong>1+0 = 1</strong> &nbsp;|&nbsp; <strong>1+1 = 1</strong>
              </div>
            </div>

            {/* NOT */}
            <div className="p-4 rounded-xl border border-[#282E33] bg-[#0E1012] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#FFB020]">3. NOT Gate (Inverter)</span>
                <span className="font-mono text-xs text-[#9CA3A8]">Y = A'</span>
              </div>
              <p className="text-xs text-[#9CA3A8]">
                <strong>Rule:</strong> Flips the input. Turns 1 into 0, and 0 into 1.
              </p>
              <div className="font-mono text-[11px] p-2 rounded bg-[#16191C] text-[#ECEBE4]">
                Input 0 ➔ <strong>Output 1</strong> &nbsp;|&nbsp; Input 1 ➔ <strong>Output 0</strong>
              </div>
            </div>

            {/* XOR */}
            <div className="p-4 rounded-xl border border-[#282E33] bg-[#0E1012] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#ECEBE4]">4. XOR Gate (Exclusive OR)</span>
                <span className="font-mono text-xs text-[#9CA3A8]">Y = A ⊕ B</span>
              </div>
              <p className="text-xs text-[#9CA3A8]">
                <strong>Rule:</strong> Output is <strong>1</strong> when inputs are <strong>different</strong>.
              </p>
              <div className="font-mono text-[11px] p-2 rounded bg-[#16191C] text-[#ECEBE4]">
                0⊕0 = 0 &nbsp;|&nbsp; <strong>0⊕1 = 1</strong> &nbsp;|&nbsp; <strong>1⊕0 = 1</strong> &nbsp;|&nbsp; 1⊕1 = 0
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'universal-gates',
      title: 'Why are NAND and NOR called Universal Gates?',
      category: 'COMMONLY ASKED EXAM QUESTION',
      readTime: '3 min read',
      content: (
        <div className="space-y-5 font-sans text-xs text-[#ECEBE4] leading-relaxed">
          <p>
            In your exam viva or theory paper, you will often be asked: <em>"Why is NAND called a Universal Gate?"</em>
          </p>

          <div className="p-4 rounded-xl border border-[#C6FF3D]/30 bg-[#C6FF3D]/5 space-y-2">
            <span className="font-bold text-sm text-[#C6FF3D] block">The Short Answer:</span>
            <p className="text-xs text-[#ECEBE4]">
              Because <strong>every other logic gate (AND, OR, NOT, XOR) can be constructed using ONLY NAND gates</strong>. You don't need any other chips!
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#0E1012] border border-[#282E33]">
              1. <strong>NOT Gate using NAND:</strong> Tie both inputs of a NAND gate together.
            </div>
            <div className="p-3 rounded-lg bg-[#0E1012] border border-[#282E33]">
              2. <strong>AND Gate using NAND:</strong> Take a NAND gate, and connect its output to another NAND gate acting as an inverter.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'demorgan',
      title: 'De Morgan’s Laws Made Easy',
      category: 'BOOLEAN THEOREMS',
      readTime: '2 min read',
      content: (
        <div className="space-y-5 font-sans text-xs text-[#ECEBE4] leading-relaxed">
          <p>
            De Morgan's Laws look intimidating in textbooks, but there is an easy trick: <strong>"Break the line, change the sign."</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl border border-[#3DDCFF]/30 bg-[#0E1012] space-y-2">
              <span className="font-bold text-[#3DDCFF] text-sm block">Rule 1 (NAND):</span>
              <div className="text-sm font-bold text-[#ECEBE4]">(A · B)' = A' + B'</div>
              <p className="text-[11px] text-[#9CA3A8] font-sans">
                The bar over multiplication (AND) splits into addition (OR) of individual inverted inputs.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#C6FF3D]/30 bg-[#0E1012] space-y-2">
              <span className="font-bold text-[#C6FF3D] text-sm block">Rule 2 (NOR):</span>
              <div className="text-sm font-bold text-[#ECEBE4]">(A + B)' = A' · B'</div>
              <p className="text-[11px] text-[#9CA3A8] font-sans">
                The bar over addition (OR) splits into multiplication (AND) of individual inverted inputs.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentArticle = articles.find((a) => a.id === activeArticle) || articles[0];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 select-none font-sans text-xs">
      <div className="pb-6 border-b border-[#282E33]">
        <span className="text-xs font-mono text-[#C6FF3D] font-bold uppercase tracking-wider block mb-1">
          STUDENT CHEAT SHEET
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#ECEBE4]">
          Digital Electronics Quick Reference
        </h1>
        <p className="text-xs text-[#9CA3A8] mt-2">
          Simple notes, formulas, and truth tables you need for your exams and practicals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-2">
          {articles.map((art) => (
            <button
              key={art.id}
              onClick={() => setActiveArticle(art.id)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                activeArticle === art.id
                  ? 'border-[#C6FF3D] bg-[#16191C] text-[#ECEBE4] font-bold shadow-md'
                  : 'border-[#282E33] bg-[#16191C]/50 text-[#9CA3A8] hover:text-[#ECEBE4] hover:bg-[#16191C]'
              }`}
            >
              <div className="text-[10px] text-[#646F77] font-mono mb-1">{art.category}</div>
              <div className="text-xs font-sans">{art.title}</div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8 rounded-2xl border border-[#282E33] bg-[#16191C] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#282E33] pb-4">
            <span className="text-[10px] font-mono text-[#C6FF3D] font-bold uppercase tracking-wider">
              {currentArticle.category}
            </span>
            <h2 className="font-display text-2xl font-bold text-[#ECEBE4] mt-1">
              {currentArticle.title}
            </h2>
          </div>

          <div>{currentArticle.content}</div>
        </div>
      </div>
    </div>
  );
};
