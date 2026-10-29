import { UniversitySyllabus, StudentProfile } from '../types/student';

export const UNIVERSITY_SYLLABI: Record<string, UniversitySyllabus> = {
  ENTC_SEMESTER_1_2: {
    track: 'ENTC_SEMESTER_1_2',
    courseName: 'Electronics & Telecommunication (E&TC)',
    yearName: 'First Year (BEE & Digital Electronics)',
    standardReference: 'AICTE / SPPU / Mumbai Univ ENTC Curriculum — Basic Electronics Engineering',
    units: [
      {
        id: 'entc_fe_u1',
        unitNumber: 1,
        title: 'Unit 1: The 7 Fundamental Logic Gates & Truth Tables',
        examWeight: '25% Weightage',
        description: 'Combinational building blocks: AND, OR, NOT, XOR, NAND, NOR, XNOR and their switching behavior.',
        topics: [
          { id: 'ef1_1', title: 'Binary Logic: HIGH (3.3V/5V) & LOW (0V)', ruleSummary: 'Transistor switching logic in digital circuits.', isCompleted: true, xp: 50 },
          { id: 'ef1_2', title: 'AND & OR Decision Gates', ruleSummary: 'Conjunction vs Disjunction logic.', isCompleted: true, xp: 100 },
          { id: 'ef1_3', title: 'XOR Parity & Staircase Switching', ruleSummary: 'Outputs 1 only when inputs differ.', isCompleted: false, xp: 150 },
          { id: 'ef1_4', title: 'De Morgan’s Laws & NAND Universality', ruleSummary: 'Why semiconductor fabs manufacture circuits solely out of NAND gates.', isCompleted: false, xp: 150 },
        ],
      },
      {
        id: 'entc_fe_u2',
        unitNumber: 2,
        title: 'Unit 2: Binary Adders & Arithmetic Logic',
        examWeight: '30% Weightage',
        description: 'Constructing 1-bit Half Adders and cascading into Full Adders with Carry-out.',
        topics: [
          { id: 'ef2_1', title: 'Half Adder: Sum (XOR) & Carry (AND)', ruleSummary: 'Binary addition without carry-in.', isCompleted: false, xp: 200 },
          { id: 'ef2_2', title: 'Full Adder Architecture', ruleSummary: 'Adding 3 bits (A, B, Cin) with Ripple Carry.', isCompleted: false, xp: 250 },
        ],
      },
    ],
  },

  ENTC_SEMESTER_3_4: {
    track: 'ENTC_SEMESTER_3_4',
    courseName: 'Electronics & Telecommunication (E&TC)',
    yearName: 'Second Year (DELD & Analog/Digital Systems)',
    standardReference: 'Digital Electronics & Logic Design (DELD) Core Syllabus',
    units: [
      {
        id: 'entc_se_u1',
        unitNumber: 1,
        title: 'Unit 1: Karnaugh Maps & Circuit Simplification',
        examWeight: '30% Weightage',
        description: 'SOP, POS, 3-variable and 4-variable K-maps with Don’t Care (X) conditions.',
        topics: [
          { id: 'es1_1', title: 'SOP Grouping: Pairs, Quads, and Octets', ruleSummary: 'Eliminating redundant gate inputs via Boolean adjacency.', isCompleted: true, xp: 100 },
          { id: 'es1_2', title: 'Multiplexers & Demultiplexers (74151/74138)', ruleSummary: 'Routing n data lines to single output with select pins.', isCompleted: false, xp: 200 },
        ],
      },
      {
        id: 'entc_se_u2',
        unitNumber: 2,
        title: 'Unit 2: Sequential Logic & Flip-Flops',
        examWeight: '35% Weightage',
        description: 'Clocked latches: SR, JK, D, T Flip-Flops and Race-around condition solutions.',
        topics: [
          { id: 'es2_1', title: 'Clock Edge Triggering & D Flip-Flop', ruleSummary: 'Storing 1 bit of memory synchronously on clock edge.', isCompleted: false, xp: 250 },
          { id: 'es2_2', title: 'Asynchronous Ripple Counters', ruleSummary: 'Frequency division using cascaded T Flip-Flops.', isCompleted: false, xp: 300 },
        ],
      },
    ],
  },

  ENTC_SEMESTER_5_6: {
    track: 'ENTC_SEMESTER_5_6',
    courseName: 'Electronics & Telecommunication (E&TC)',
    yearName: 'Third Year (Embedded Systems & Microcontrollers)',
    standardReference: 'Microcontrollers (Arduino / ARM Cortex / 8051) & Sensor Interfacing',
    units: [
      {
        id: 'entc_te_u1',
        unitNumber: 1,
        title: 'Unit 1: Embedded C & Microcontroller GPIO',
        examWeight: '35% Weightage',
        description: 'Port registers (DDR, PORT, PIN), digital I/O timing, and hardware interrupts.',
        topics: [
          { id: 'et1_1', title: 'Digital Pin Manipulation & Debouncing', ruleSummary: 'Filtering mechanical switch bounce in embedded firmware.', isCompleted: true, xp: 150 },
          { id: 'et1_2', title: 'PWM Signal Generation & Motor Control', ruleSummary: 'Duty cycle control for analog emulation.', isCompleted: false, xp: 250 },
        ],
      },
    ],
  },

  BCA_YEAR_1: {
    track: 'BCA_YEAR_1',
    courseName: 'Bachelor of Computer Applications (BCA)',
    yearName: '1st Year (Semester 1 & 2)',
    standardReference: 'Standard BCA Syllabus (Digital Computer Fundamentals / Principles of Electronics)',
    units: [
      {
        id: 'u1',
        unitNumber: 1,
        title: 'Unit 1: The 7 Basic Logic Gates',
        examWeight: '20% Marks in Exam',
        description: 'Understand truth tables, symbols, and switching logic for AND, OR, NOT, NAND, NOR, XOR, XNOR.',
        topics: [
          { id: 't1_1', title: 'Binary Basics: 0 (OFF) and 1 (ON)', ruleSummary: 'Switches produce voltage: 0V (LOW) or 5V (HIGH).', isCompleted: true, xp: 50 },
          { id: 't1_2', title: 'AND Gate: Both Must Agree', ruleSummary: 'Output is 1 ONLY if both A and B are 1.', isCompleted: true, xp: 100 },
          { id: 't1_3', title: 'OR Gate: Anyone Can Agree', ruleSummary: 'Output is 1 if either input is 1.', isCompleted: true, xp: 100 },
          { id: 't1_4', title: 'NOT Gate: The Inverter', ruleSummary: 'Flips 0 to 1, and 1 to 0.', isCompleted: true, xp: 100 },
          { id: 't1_5', title: 'XOR Gate: The Staircase Switch', ruleSummary: 'Output is 1 ONLY when inputs are different.', isCompleted: false, xp: 150 },
        ],
      },
    ],
  },

  BTECH_CS: {
    track: 'BTECH_CS',
    courseName: 'B.Tech / B.E. Computer Science & IT',
    yearName: '1st / 2nd Year Core',
    standardReference: 'Digital Logic & Microprocessor Architecture',
    units: [
      {
        id: 'bt_u1',
        unitNumber: 1,
        title: 'Unit 1: Combinational Logic & Glitch Analysis',
        examWeight: '30% Marks',
        description: 'Gate propagation delays, hazard detection, parity generators, and priority encoders.',
        topics: [
          { id: 'bt_t1', title: 'Propagation Delay & Static Hazards', ruleSummary: 'Understanding nanosecond signal skew in cascading gates.', isCompleted: true, xp: 150 },
        ],
      },
    ],
  },

  BEGINNER: {
    track: 'BEGINNER',
    courseName: 'Digital Logic for Absolute Beginners',
    yearName: 'Self-Paced Fun Track',
    standardReference: 'Zero Math Prerequisites — Fun Visual Analogy Track',
    units: [
      {
        id: 'beg_u1',
        unitNumber: 1,
        title: 'Unit 1: Electricity, Switches & Light Bulbs',
        examWeight: 'Fun & Casual',
        description: 'Discover how computers think using simple water and light analogies.',
        topics: [
          { id: 'beg_t1', title: 'The Light Switch: What is 0 and 1?', ruleSummary: '1 means electricity flows, 0 means switch is open.', isCompleted: true, xp: 50 },
        ],
      },
    ],
  },
};

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: 'ENTC Engineer',
  track: 'ENTC_SEMESTER_1_2',
  goal: 'LOGIC_GATE_PRACTICE',
  dailyGoalMinutes: 10,
  streakDays: 4,
  hearts: 5,
  xp: 950,
  level: 3,
  levelTitle: 'Circuit Pioneer',
  activeUnitIndex: 0,
  activeLessonId: 'mission-002',
  completedLessons: ['mission-001'],
  solvedPuzzles: ['fa-001'],
  chakravyuhaStage: 1,
  stressLevel: 'relaxed',
};
