export type SignalState = 0 | 1 | undefined;

export type ComponentCategory = 'inputs' | 'gates' | 'outputs';

export type ComponentType = 
  | 'SWITCH' 
  | 'CLOCK' 
  | 'VCC' 
  | 'GND' 
  | 'AND' 
  | 'OR' 
  | 'NOT' 
  | 'XOR' 
  | 'NAND' 
  | 'NOR' 
  | 'XNOR' 
  | 'BUFFER' 
  | 'LED' 
  | 'PROBE' 
  | 'DISPLAY_7SEG';

export interface Port {
  id: string;
  name: string;
  type: 'input' | 'output';
  value: SignalState;
  index: number;
}

export type FaultType = 'STUCK_AT_0' | 'STUCK_AT_1' | 'INVERTED' | 'DISCONNECTED';

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  label: string;
  x: number;
  y: number;
  inputs: Port[];
  outputs: Port[];
  state: {
    toggle?: boolean;
    frequency?: number;
    value?: SignalState;
    customLabel?: string;
  };
  isFaulty?: boolean;
  faultType?: FaultType;
}

export interface Connection {
  id: string;
  fromCompId: string;
  fromPortId: string;
  toCompId: string;
  toPortId: string;
  signal: SignalState;
}

export interface SimulationResult {
  componentOutputs: Map<string, SignalState>;
  wireStates: Map<string, SignalState>;
  hasOscillation: boolean;
  error?: string;
}

export interface TruthTableRow {
  inputs: Record<string, number>;
  expectedOutputs: Record<string, number>;
  actualOutputs: Record<string, number>;
  isPassing: boolean;
}

export interface Mission {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  objective: string;
  difficulty: 'Rookie' | 'Intermediate' | 'Advanced' | 'Master';
  estDuration: string;
  xp: number;
  initialCircuit: {
    components: CircuitComponent[];
    connections: Connection[];
  };
  targetTruthTable: {
    inputs: string[];
    outputs: string[];
    rows: Array<{
      inputs: number[];
      outputs: number[];
    }>;
  };
  hints: string[];
  theoryText: string;
  validatorKey: string;
}

export interface FaultArenaChallenge {
  id: string;
  missionId: string;
  title: string;
  difficulty: 'Rookie' | 'Intermediate' | 'Hard';
  score: number;
  hints: string[];
  circuit: {
    components: CircuitComponent[];
    connections: Connection[];
  };
  faultyComponentId: string;
  faultDescription: string;
  expectedBehavior: string;
  observedBehavior: string;
  engineeringPrinciple: string;
}

export interface AIMentorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  evidence?: {
    type: 'confirmed' | 'possible';
    label: string;
    detail: string;
  };
  suggestedAction?: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  rank: string;
  completedMissions: string[];
  completedArenaChallenges: string[];
  topicMastery: {
    combinationalLogic: number; // 0 - 100
    faultDiagnostics: number;
    timingVerification: number;
    arithmeticCircuits: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    timestamp: string;
    scoreDelta: number;
  }>;
}
