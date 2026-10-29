import { ComponentType } from './index';

export type AgenticActionType =
  | 'ADD_COMPONENT'
  | 'TOGGLE_SWITCH'
  | 'FIX_CIRCUIT'
  | 'TEST_TRUTH_TABLE'
  | 'RESET_CANVAS';

export interface AgenticAction {
  id: string;
  type: AgenticActionType;
  componentType?: ComponentType;
  targetSwitchId?: string;
  targetSwitchLabel?: string;
  summary: string;
}
