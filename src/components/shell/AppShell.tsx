import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Wrench,
  BookOpen,
  Trophy,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  FolderGit2,
  Sparkles,
  User,
  LayoutDashboard,
  Check,
  Home,
  Shield,
  Code2,
} from 'lucide-react';

interface AppShellProps {
  currentView: string;
  onNavigate: (view: string) => void;
  children: React.ReactNode;
  pageTitle?: string;
  studentName?: string;
  studentXP?: number;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentView,
  onNavigate,
  children,
  pageTitle,
  studentName = 'Harsh Jadhav',
  studentXP = 850,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navGroups = [
    {
      group: 'WORKBENCHES',
      items: [
        { id: 'dashboard', label: 'My Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'lab', label: 'Circuit Playground', icon: <Cpu className="w-4 h-4 text-[#00E5FF]" /> },
        { id: 'chakravyuha', label: 'Circuit Arena', icon: <Shield className="w-4 h-4 text-[#C6FF3D]" /> },
        { id: 'code-lab', label: 'Arduino Code Lab', icon: <Code2 className="w-4 h-4 text-[#3DDCFF]" /> },
      ],
    },
    {
      group: 'PRACTICE & TOOLS',
      items: [
        { id: 'fault-arena', label: 'Circuit Puzzles', icon: <Wrench className="w-4 h-4 text-[#FFB020]" /> },
        { id: 'knowledge', label: 'Gate Cheat Sheet', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'progress', label: 'Badges & Stats', icon: <Trophy className="w-4 h-4 text-[#C6FF3D]" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0E1012] text-[#ECEBE4] flex flex-col font-sans antialiased">
      {/* Top Header */}
      <header className="h-14 bg-[#16191C] border-b border-[#282E33] px-4 sm:px-6 flex items-center justify-between z-30 select-none">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-[#9CA3A8] hover:text-white hover:bg-[#1D2125]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0E1012] border border-[#282E33] group-hover:border-[#C6FF3D] transition-colors flex items-center justify-center text-[#C6FF3D]">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-tight text-[#ECEBE4]">
                Logic <span className="text-[#C6FF3D]">Links</span>
              </span>
              <span className="text-[10px] text-[#646F77] font-mono leading-none">
                Smart E&TC Platform
              </span>
            </div>
          </div>

          {pageTitle && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-sans text-[#646F77] pl-3 border-l border-[#282E33]">
              <span className="text-[#ECEBE4] font-semibold">{pageTitle}</span>
            </div>
          )}
        </div>

        {/* Right Header: Autosave, Student XP, Profile */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-1.5 text-[#9CA3A8] text-[11px]">
            <Check className="w-3.5 h-3.5 text-[#C6FF3D]" />
            <span>Saved</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D2125] border border-[#282E33] text-[#C6FF3D] font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{studentXP} XP</span>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-[#282E33]">
            <button
              onClick={() => onNavigate('login')}
              className="flex items-center gap-2 hover:bg-[#1D2125] p-1 rounded-xl transition-all text-left"
              title="Switch Student or Change Syllabus"
            >
              <div className="w-7 h-7 rounded-full bg-[#1D2125] border border-[#282E33] flex items-center justify-center text-[#9CA3A8] font-bold text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="hidden md:block">
                <div className="text-[#ECEBE4] text-xs font-sans font-semibold leading-tight">
                  {studentName}
                </div>
                <div className="text-[10px] text-[#C6FF3D] font-mono leading-tight">
                  Switch / Login ›
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Left Sidebar */}
        <aside
          className={`hidden md:flex flex-col bg-[#16191C] border-r border-[#282E33] transition-all duration-200 select-none ${
            sidebarCollapsed ? 'w-16' : 'w-60'
          }`}
        >
          {/* Collapse Toggle */}
          <div className="p-2 flex justify-end border-b border-[#282E33]/60">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-[#9CA3A8] hover:text-[#ECEBE4] hover:bg-[#1D2125] transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Groups */}
          <div className="flex-1 overflow-y-auto py-3 space-y-6">
            {navGroups.map((grp) => (
              <div key={grp.group} className="px-3">
                {!sidebarCollapsed && (
                  <div className="px-2 mb-2 font-mono text-[10px] uppercase tracking-wider text-[#646F77] font-bold">
                    {grp.group}
                  </div>
                )}
                <div className="space-y-1">
                  {grp.items.map((item) => {
                    const isActive = currentView === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-xs transition-all relative ${
                          isActive
                            ? 'bg-[#1D2125] text-[#C6FF3D] border border-[#282E33] font-bold'
                            : 'text-[#9CA3A8] hover:text-[#ECEBE4] hover:bg-[#1D2125]/60'
                        } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Back to Landing Page Link */}
          <div className="p-3 border-t border-[#282E33]">
            <button
              onClick={() => onNavigate('landing')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-sans text-[#9CA3A8] hover:text-[#ECEBE4] hover:bg-[#1D2125] transition-colors ${
                sidebarCollapsed ? 'justify-center px-0' : ''
              }`}
            >
              <Home className="w-4 h-4 text-[#C6FF3D]" />
              {!sidebarCollapsed && <span>Home Page</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm">
            <div className="w-64 h-full bg-[#16191C] border-r border-[#282E33] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#282E33] mb-4">
                  <span className="font-display font-bold text-base text-[#ECEBE4]">
                    CircuitVerse AI
                  </span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-5 h-5 text-[#9CA3A8]" />
                  </button>
                </div>

                <div className="space-y-5">
                  {navGroups.map((grp) => (
                    <div key={grp.group}>
                      <div className="text-[10px] font-mono text-[#646F77] uppercase font-bold mb-2">
                        {grp.group}
                      </div>
                      <div className="space-y-1">
                        {grp.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              onNavigate(item.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans ${
                              currentView === item.id
                                ? 'bg-[#1D2125] text-[#C6FF3D] font-bold'
                                : 'text-[#9CA3A8]'
                            }`}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  onNavigate('landing');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 border border-[#282E33] rounded-xl font-sans text-xs text-[#ECEBE4] text-center"
              >
                Back to Home Page
              </button>
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto bg-[#0E1012]">
          {children}
        </main>
      </div>
    </div>
  );
};
