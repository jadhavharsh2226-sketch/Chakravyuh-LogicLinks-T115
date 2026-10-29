import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { AppShell } from './components/shell/AppShell';
import { DashboardView } from './components/dashboard/DashboardView';
import { CircuitLabView } from './components/lab/CircuitLabView';
import { FaultArenaView } from './components/fault-arena/FaultArenaView';
import { MissionsView } from './components/missions/MissionsView';
import { KnowledgeBaseView } from './components/knowledge/KnowledgeBaseView';
import { ProgressView } from './components/progress/ProgressView';
import { ChakravyuhaChallengeView } from './components/chakravyuha/ChakravyuhaChallengeView';
import { ArduinoCodeLabView } from './components/codelab/ArduinoCodeLabView';
import { StudentOnboardingModal } from './components/common/StudentOnboardingModal';
import { FloatingVoltCompanion } from './components/common/FloatingVoltCompanion';
import { LoginView } from './components/auth/LoginView';
import { StudentProfile } from './types/student';
import { DEFAULT_STUDENT_PROFILE, UNIVERSITY_SYLLABI } from './services/syllabusData';

export function App() {
  const [currentView, setCurrentView] = useState<string>('login');
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Student Profile persisted in localStorage
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('circuitverse_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_STUDENT_PROFILE;
  });

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setStudentProfile(newProfile);
    try {
      localStorage.setItem('circuitverse_student_profile', JSON.stringify(newProfile));
    } catch (e) {
      // safe fallback
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMission = (missionId: string) => {
    setSelectedMissionId(missionId);
    setCurrentView('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentSyllabus = UNIVERSITY_SYLLABI[studentProfile.track] || UNIVERSITY_SYLLABI.BCA_YEAR_1;

  if (currentView === 'login') {
    return (
      <LoginView
        onLogin={(newProfile) => {
          handleSaveProfile(newProfile);
          setCurrentView('dashboard');
        }}
        onExploreGuest={() => {
          handleSaveProfile(DEFAULT_STUDENT_PROFILE);
          setCurrentView('dashboard');
        }}
        onViewLanding={() => {
          setCurrentView('landing');
        }}
      />
    );
  }

  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onNavigate={handleNavigate}
          onSelectMission={handleSelectMission}
        />
        <StudentOnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          currentProfile={studentProfile}
          onSaveProfile={handleSaveProfile}
        />
        <FloatingVoltCompanion
          currentView={currentView}
          studentProfile={studentProfile}
          onNavigate={handleNavigate}
        />
      </>
    );
  }

  return (
    <>
      <AppShell
        currentView={currentView}
        onNavigate={handleNavigate}
        studentName={studentProfile.name}
        studentXP={studentProfile.xp}
        pageTitle={
          currentView === 'chakravyuha'
            ? 'CHAKRAVYUH Challenge Arena'
            : currentView === 'code-lab'
            ? 'Arduino Embedded Code Lab'
            : currentView === 'lab'
            ? 'Circuit Playground'
            : currentView === 'fault-arena'
            ? 'Circuit Puzzles'
            : currentView === 'missions'
            ? 'Gate Lessons'
            : currentView === 'knowledge'
            ? 'Gate Cheat Sheet'
            : currentView === 'progress'
            ? 'My Progress & Badges'
            : `${currentSyllabus.courseName} Dashboard`
        }
      >
        {currentView === 'dashboard' && (
          <DashboardView
            onNavigate={handleNavigate}
            onSelectMission={handleSelectMission}
            studentProfile={studentProfile}
            onOpenSyllabusModal={() => setIsOnboardingOpen(true)}
          />
        )}

        {currentView === 'chakravyuha' && (
          <ChakravyuhaChallengeView onNavigate={handleNavigate} />
        )}

        {currentView === 'code-lab' && (
          <ArduinoCodeLabView />
        )}

        {currentView === 'lab' && (
          <CircuitLabView
            initialMissionId={selectedMissionId}
            onNavigate={handleNavigate}
            studentProfile={studentProfile}
          />
        )}

        {currentView === 'fault-arena' && (
          <FaultArenaView onNavigate={handleNavigate} />
        )}

        {currentView === 'missions' && (
          <MissionsView onSelectMission={handleSelectMission} />
        )}

        {currentView === 'knowledge' && <KnowledgeBaseView />}

        {currentView === 'progress' && <ProgressView />}

        {currentView === 'saved-circuits' && (
          <div className="p-10 max-w-4xl mx-auto space-y-6 font-sans text-xs select-none">
            <div className="flex items-center justify-between pb-4 border-b border-[#282E33]">
              <h1 className="font-display text-2xl font-bold text-[#ECEBE4]">
                Saved Circuits
              </h1>
              <button
                onClick={() => handleNavigate('lab')}
                className="text-[#C6FF3D] font-bold hover:underline"
              >
                + New Circuit
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: '1',
                  title: 'Two-Switch Safe Lock (AND Gate)',
                  detail: '2 Inputs, 1 AND Gate, 1 Light Bulb',
                  date: 'Saved today',
                },
                {
                  id: '2',
                  title: 'Staircase Light Switch (XOR Gate)',
                  detail: '2 Inputs, 1 XOR Gate, 1 Light Bulb',
                  date: 'Saved yesterday',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigate('lab')}
                  className="p-4 rounded-2xl border border-[#282E33] bg-[#16191C] hover:border-[#525C64] cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <div className="font-bold text-sm text-[#ECEBE4]">
                      {item.title}
                    </div>
                    <div className="text-[#9CA3A8] text-xs mt-0.5">
                      {item.detail}
                    </div>
                  </div>
                  <div className="text-right text-[#646F77] text-xs font-mono">
                    <div>{item.date}</div>
                    <span className="text-[#C6FF3D] font-bold">Open in Playground ›</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </AppShell>

      {/* Course & Syllabus Onboarding Modal */}
      <StudentOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentProfile={studentProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Persistent 3D Floating Companion */}
      <FloatingVoltCompanion
        currentView={currentView}
        studentProfile={studentProfile}
        onNavigate={handleNavigate}
      />
    </>
  );
}

export default App;
