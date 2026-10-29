export type AcademicTrack = 
  | 'ENTC_SEMESTER_1_2' // First Year ENTC (BEE & Digital Basics)
  | 'ENTC_SEMESTER_3_4' // Second Year ENTC (DELD & Analog/Digital Circuits)
  | 'ENTC_SEMESTER_5_6' // Third Year ENTC (Embedded Systems & Microcontrollers)
  | 'BCA_YEAR_1' 
  | 'BCA_YEAR_2' 
  | 'BTECH_CS' 
  | 'BEGINNER';

export type StudentGoal = 
  | 'CHAKRAVYUH_CHALLENGE'
  | 'EXAM_PREP' 
  | 'PRACTICAL_LABS' 
  | 'ARDUINO_EMBEDDED' 
  | 'UNDERSTAND_CPU';

export interface StudentProfile {
  name: string;
  track: AcademicTrack;
  goal: StudentGoal;
  dailyGoalMinutes: number;
  streakDays: number;
  hearts: number; // 0 - 5 (Duolingo style lives)
  xp: number;
  level: number;
  levelTitle: string;
  activeUnitIndex: number;
  activeLessonId: string;
  completedLessons: string[];
  solvedPuzzles: string[];
  chakravyuhaStage: number; // 1, 2, 3
  stressLevel: 'relaxed' | 'focused' | 'break_recommended';
}

export interface SyllabusUnit {
  id: string;
  unitNumber: number;
  title: string;
  examWeight: string;
  description: string;
  topics: Array<{
    id: string;
    title: string;
    ruleSummary: string;
    isCompleted: boolean;
    xp: number;
  }>;
}

export interface UniversitySyllabus {
  track: AcademicTrack;
  courseName: string;
  yearName: string;
  standardReference: string;
  units: SyllabusUnit[];
}
