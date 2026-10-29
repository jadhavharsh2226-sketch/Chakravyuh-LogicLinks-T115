import { ComponentType, CircuitComponent, Connection, SignalState } from '../../types';
import { ValidationReport } from '../validator';

export type AgentToolName =
  | 'addComponent'
  | 'connectPins'
  | 'setInputState'
  | 'runSimulation'
  | 'inspectCircuit'
  | 'verifyTruthTable'
  | 'deleteComponent'
  | 'deleteConnection'
  | 'clearCircuit';

export interface AddComponentArgs {
  type: ComponentType;
  label?: string;
  x?: number;
  y?: number;
}

export interface ConnectPinsArgs {
  fromCompId: string;
  fromPortId: string;
  toCompId: string;
  toPortId: string;
}

export interface SetInputStateArgs {
  compId: string;
  value: 0 | 1;
}

export interface DeleteComponentArgs {
  compId: string;
}

export interface DeleteConnectionArgs {
  wireId: string;
}

export interface ClearCircuitArgs {
  confirm: boolean;
}

export interface CircuitInspectionResult {
  totalComponents: number;
  components: Array<{
    id: string;
    type: ComponentType;
    label: string;
    x: number;
    y: number;
    inputCount: number;
    outputCount: number;
  }>;
  totalConnections: number;
  connections: Array<{
    id: string;
    from: string;
    to: string;
    signal?: SignalState;
  }>;
  unconnectedPorts: Array<{
    componentId: string;
    componentLabel: string;
    portName: string;
  }>;
  switches: Array<{
    id: string;
    label: string;
    state: boolean;
  }>;
}

export interface ToolExecutionResult {
  tool: AgentToolName;
  success: boolean;
  message: string;
  data?: unknown;
}

export interface AgentStep {
  id: string;
  tool: AgentToolName;
  args: Record<string, unknown>;
  thought: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: ToolExecutionResult;
}

export interface AgentTaskPlan {
  goal: string;
  explanation: string;
  steps: AgentStep[];
}
