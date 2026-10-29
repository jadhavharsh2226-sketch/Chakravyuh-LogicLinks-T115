import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ArrowUpRight, Cpu, Sparkles, BookOpen, Wrench, CheckCircle2, Play, Shield, Code2 } from 'lucide-react';
import { HeroInteractiveCircuit } from './HeroInteractiveCircuit';
import { ProofOfInteraction } from './ProofOfInteraction';
import { MissionGallery } from './MissionGallery';
import { AIMentorShowcase } from './AIMentorShowcase';
import { LandingFooter } from './LandingFooter';
import { BenchButton } from '../common/BenchButton';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onSelectMission: (missionId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onSelectMission,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(eyebrowRef.current, { opacity: 0, y: -12, duration: 0.6 })
        .from(headlineRef.current, { opacity: 0, y: 24, duration: 0.8 }, '-=0.3')
        .from(copyRef.current, { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
        .from(ctaRef.current, { opacity: 0, y: 12, duration: 0.5 }, '-=0.3');
    }, heroRef);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
      ctx.revert();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0E1012] text-[#ECEBE4] selection:bg-[#C6FF3D] selection:text-[#0E1012] flex flex-col font-sans">
      {/* Friendly, Clean Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-[#0E1012]/90 backdrop-blur-md border-b border-[#282E33] py-3'
            : 'bg-transparent border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#16191C] border border-[#282E33] group-hover:border-[#C6FF3D] transition-colors flex items-center justify-center text-[#C6FF3D]">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base font-bold tracking-tight text-[#ECEBE4]">
                CircuitVerse <span className="text-[#C6FF3D]">AI</span>
              </span>
              <span className="text-[10px] text-[#9CA3A8] font-mono">
                Digital Logic Made Simple
              </span>
            </div>
          </div>

          {/* Simple Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-[#9CA3A8]">
            <button
              onClick={() => onNavigate('chakravyuha')}
              className="text-[#C6FF3D] font-bold hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>CHAKRAVYUH 2026</span>
            </button>
            <button
              onClick={() => onNavigate('code-lab')}
              className="hover:text-[#ECEBE4] transition-colors"
            >
              Arduino Lab
            </button>
            <button
              onClick={() => onNavigate('lab')}
              className="hover:text-[#ECEBE4] transition-colors"
            >
              Playground (Lab)
            </button>
            <button
              onClick={() => onNavigate('fault-arena')}
              className="hover:text-[#ECEBE4] transition-colors"
            >
              Circuit Puzzles
            </button>
            <button
              onClick={() => onNavigate('missions')}
              className="hover:text-[#ECEBE4] transition-colors"
            >
              Lessons
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="hover:text-[#ECEBE4] transition-colors"
            >
              Dashboard
            </button>
          </nav>

          {/* Primary CTA Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('login')}
              className="text-xs font-mono text-[#C6FF3D] hover:underline font-bold px-2 py-1 rounded-lg border border-[#C6FF3D]/30 bg-[#C6FF3D]/10"
            >
              Student Login ⚡
            </button>
            <BenchButton
              variant="primary"
              size="sm"
              onClick={() => onNavigate('lab')}
              icon={<ArrowUpRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Open Playground
            </BenchButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="pt-28 pb-16 sm:pt-36 sm:pb-24 relative overflow-hidden bg-bench-grid"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Clear, Friendly Student Copy */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Eyebrow */}
              <div
                ref={eyebrowRef}
                className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16191C] border border-[#282E33]"
              >
                <span className="w-2 h-2 rounded-full bg-[#C6FF3D] animate-ping" />
                <span className="font-mono text-xs font-semibold text-[#ECEBE4]">
                  SMART ENTC LEARNING PLATFORM · CHAKRAVYUH 2026
                </span>
              </div>

              {/* Headline */}
              <h1
                ref={headlineRef}
                className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#ECEBE4] leading-[1.15] mb-5"
              >
                Learn Electronics & Code by{' '}
                <span className="text-[#C6FF3D]">Actually Building</span> Them.
              </h1>

              {/* Supporting Copy */}
              <p
                ref={copyRef}
                className="text-base sm:text-lg text-[#9CA3A8] leading-relaxed max-w-xl mb-8"
              >
                Zero-stress digital electronics & embedded workbench. Meet <strong className="text-[#ECEBE4]">Volt</strong>, your cheerful AI chip mentor that teaches according to your university syllabus!
              </p>

              {/* Big, Friendly Action Buttons */}
              <div
                ref={ctaRef}
                className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
              >
                <BenchButton
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('chakravyuha')}
                  icon={<Shield className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Enter CHAKRAVYUH Arena ⚡
                </BenchButton>

                <BenchButton
                  variant="secondary"
                  size="lg"
                  onClick={() => onNavigate('lab')}
                  icon={<Play className="w-4 h-4 fill-current" />}
                >
                  Open Circuit Lab
                </BenchButton>
              </div>

              {/* 3 Quick Bullet Points for Students */}
              <div className="mt-8 pt-6 border-t border-[#282E33] w-full grid grid-cols-3 gap-3 text-xs font-mono text-[#9CA3A8]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#C6FF3D]">✓</span>
                  <span>100% Free & Visual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#3DDCFF]">✓</span>
                  <span>Instant Truth Tables</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#ECEBE4]">✓</span>
                  <span>AI Study Buddy</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive XOR Circuit Component */}
            <div className="lg:col-span-6 w-full">
              <HeroInteractiveCircuit />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Simple Steps to Learn (Proof of Interaction) */}
      <ProofOfInteraction />

      {/* Popular Beginner Lessons (Mission Gallery) */}
      <MissionGallery onSelectMission={onSelectMission} />

      {/* Friendly AI Study Buddy Showcase */}
      <AIMentorShowcase />

      {/* Final Simple CTA */}
      <section className="py-20 border-t border-[#282E33] bg-[#16191C] relative text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#ECEBE4] mb-3">
            Ready to master digital electronics?
          </h2>
          <p className="text-base text-[#9CA3A8] max-w-lg mx-auto mb-8">
            Join thousands of BCA, B.Tech, and diploma students learning logic gates the hands-on way.
          </p>
          <BenchButton
            variant="primary"
            size="lg"
            onClick={() => onNavigate('lab')}
            icon={<ArrowUpRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Open Circuit Playground 🚀
          </BenchButton>
        </div>
      </section>

      {/* Minimal Footer */}
      <LandingFooter onNavigate={onNavigate} />
    </div>
  );
};
