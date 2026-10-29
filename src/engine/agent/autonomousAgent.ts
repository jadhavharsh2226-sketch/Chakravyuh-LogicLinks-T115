import {
  AgentStep,
  AgentTaskPlan,
  AgentToolName,
  CircuitInspectionResult,
  ToolExecutionResult,
} from './agentTools';
import { CircuitComponent, Connection, ComponentType, SignalState, Mission, SimulationResult } from '../../types';
import { CircuitSimulator } from '../simulator';
import { CircuitValidator, ValidationReport } from '../validator';
import { AgentPlanner } from './agentPlanner';
import { sounds } from '../../services/soundEffects';

export interface AgentExecutionContext {
  getComponents: () => CircuitComponent[];
  getConnections: () => Connection[];
  getActiveMission: () => Mission | undefined;
  addComponent: (type: ComponentType, label?: string, x?: number, y?: number) => string;
  connectPins: (fromCompId: string, fromPortId: string, toCompId: string, toPortId: string) => void;
  setInputState: (compId: string, value: 0 | 1) => void;
  deleteComponent: (compId: string) => void;
  deleteConnection: (wireId: string) => void;
  clearCircuit: () => void;
  runSimulation: () => SimulationResult;
  verifyTruthTable: () => ValidationReport;
  moveCursor: (x: number, y: number, statusText: string, isClicking?: boolean) => Promise<void>;
}

export interface AgentCallbacks {
  onPlanReady?: (plan: AgentTaskPlan) => void;
  onStepStart?: (stepIndex: number, totalSteps: number, step: AgentStep) => void;
  onStepComplete?: (stepIndex: number, totalSteps: number, step: AgentStep, result: ToolExecutionResult) => void;
  onVerificationResult?: (report: ValidationReport) => void;
  onFinished?: (summary: string, success: boolean, report?: ValidationReport) => void;
  onError?: (errorMessage: string) => void;
  onRequestConfirmation?: (message: string, onConfirm: () => void, onCancel: () => void) => void;
}

export class AutonomousAgent {
  private abortController: AbortController | null = null;
  private isRunning = false;
  private maxOperations = 15;

  public cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.isRunning = false;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Plans and executes an autonomous task to completion
   */
  public async executeTask(
    goal: string,
    context: AgentExecutionContext,
    callbacks?: AgentCallbacks
  ): Promise<boolean> {
    if (this.isRunning) {
      this.cancel();
    }

    this.isRunning = true;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      const components = context.getComponents();
      const connections = context.getConnections();
      const mission = context.getActiveMission();

      // 1. Generate plan grounded in real canvas state
      const plan = AgentPlanner.planTask(goal, components, connections, mission);
      callbacks?.onPlanReady?.(plan);

      // Track newly created component IDs to resolve placeholder links
      const createdIds: Record<string, string> = {};

      let completedSteps = 0;
      let lastReport: ValidationReport | undefined = undefined;

      // 2. Sequential execution loop with feedback & error recovery
      for (let i = 0; i < plan.steps.length; i++) {
        if (signal.aborted) {
          callbacks?.onFinished?.('Task execution cancelled by user.', false);
          return false;
        }

        if (completedSteps >= this.maxOperations) {
          callbacks?.onError?.(`Operation limit reached (${this.maxOperations} steps). Halting to prevent runaway execution.`);
          return false;
        }

        const step = plan.steps[i];
        step.status = 'running';
        callbacks?.onStepStart?.(i, plan.steps.length, step);

        // Execute step
        const result = await this.executeStep(step, context, createdIds, signal);
        step.status = result.success ? 'completed' : 'failed';
        step.result = result;
        callbacks?.onStepComplete?.(i, plan.steps.length, step, result);
        completedSteps++;

        if (result.tool === 'verifyTruthTable' && result.data) {
          lastReport = result.data as ValidationReport;
          callbacks?.onVerificationResult?.(lastReport);

          // Error recovery: If verification failed due to floating ports, attempt automated correction step
          if (!lastReport.isPassing && lastReport.unconnectedPorts && lastReport.unconnectedPorts.length > 0 && completedSteps < this.maxOperations - 2) {
            const loose = lastReport.unconnectedPorts[0];
            const currentComps = context.getComponents();
            const gate = currentComps.find(c => c.id === loose.componentId);
            const led = currentComps.find(c => c.type === 'LED');

            if (gate && led) {
              const recoveryStep: AgentStep = {
                id: `step_recovery_${Date.now()}`,
                tool: 'connectPins',
                args: {
                  fromCompId: gate.id,
                  fromPortId: '0',
                  toCompId: led.id,
                  toPortId: '0',
                },
                thought: `Self-Correction: Recovering from floating pin on ${gate.label} by linking directly to ${led.label}.`,
                status: 'pending',
              };
              plan.steps.splice(i + 1, 0, recoveryStep);
            }
          }
        }

        // Brief delay between steps for visual feedback
        await new Promise((r) => setTimeout(r, 250));
      }

      // Final inspection & verification pass
      const finalReport = context.verifyTruthTable();
      const isSuccess = finalReport ? finalReport.isPassing : true;
      const summaryMsg = isSuccess
        ? `Task completed successfully! All logic checks and truth table vectors verified.`
        : `Task executed. Circuit has ${finalReport.failingRows?.length || 0} failing vector(s).`;

      if (isSuccess) {
        sounds.playCorrect();
      }

      callbacks?.onFinished?.(summaryMsg, isSuccess, finalReport);
      return isSuccess;
    } catch (err: unknown) {
      const error = err as Error;
      callbacks?.onError?.(error.message || 'An error occurred during agent execution.');
      return false;
    } finally {
      this.isRunning = false;
      this.abortController = null;
    }
  }

  /**
   * Executes a single typed tool against the real circuit engine
   */
  private async executeStep(
    step: AgentStep,
    context: AgentExecutionContext,
    createdIds: Record<string, string>,
    signal: AbortSignal
  ): Promise<ToolExecutionResult> {
    if (signal.aborted) {
      return { tool: step.tool, success: false, message: 'Execution aborted' };
    }

    switch (step.tool) {
      case 'addComponent': {
        const type = step.args.type as ComponentType;
        const label = (step.args.label as string) || `${type} Gate`;
        const x = (step.args.x as number) || 320;
        const y = (step.args.y as number) || 200;

        await context.moveCursor(60, 180, `Selecting ${type} from component palette...`, true);
        await new Promise((r) => setTimeout(r, 150));
        await context.moveCursor(x + 60, y + 35, `Placing ${label} on canvas...`, true);

        const newId = context.addComponent(type, label, x, y);
        createdIds[`__NEW_${type}__`] = newId;
        sounds.playConnect();

        return {
          tool: 'addComponent',
          success: true,
          message: `Added ${label} (ID: ${newId}) at (${x}, ${y}).`,
          data: { id: newId, type },
        };
      }

      case 'connectPins': {
        let fromCompId = step.args.fromCompId as string;
        const fromPortId = (step.args.fromPortId as string) || '0';
        let toCompId = step.args.toCompId as string;
        const toPortId = (step.args.toPortId as string) || '0';

        // Resolve placeholder IDs
        if (createdIds[fromCompId]) fromCompId = createdIds[fromCompId];
        if (createdIds[toCompId]) toCompId = createdIds[toCompId];

        const comps = context.getComponents();
        const fromComp = comps.find((c) => c.id === fromCompId);
        const toComp = comps.find((c) => c.id === toCompId);

        if (!fromComp || !toComp) {
          return {
            tool: 'connectPins',
            success: false,
            message: `Cannot connect: Component not found (${fromCompId} -> ${toCompId}).`,
          };
        }

        // Animate cursor from output to input
        await context.moveCursor(fromComp.x + 120, fromComp.y + 35, `Connecting ${fromComp.label} output...`, true);
        await new Promise((r) => setTimeout(r, 100));
        await context.moveCursor(toComp.x, toComp.y + 35, `Wiring to ${toComp.label} input #${toPortId}...`, true);

        context.connectPins(fromCompId, fromPortId, toCompId, toPortId);
        sounds.playConnect();

        return {
          tool: 'connectPins',
          success: true,
          message: `Connected ${fromComp.label} (port ${fromPortId}) to ${toComp.label} (port ${toPortId}).`,
        };
      }

      case 'setInputState': {
        const compId = step.args.compId as string;
        const value = step.args.value as 0 | 1;

        const comps = context.getComponents();
        const comp = comps.find((c) => c.id === compId);

        if (!comp) {
          return {
            tool: 'setInputState',
            success: false,
            message: `Switch component ${compId} not found.`,
          };
        }

        await context.moveCursor(comp.x + 60, comp.y + 40, `Toggling ${comp.label} to ${value}...`, true);
        context.setInputState(compId, value);
        sounds.playClick();

        return {
          tool: 'setInputState',
          success: true,
          message: `Set ${comp.label} to ${value === 1 ? 'HIGH (1)' : 'LOW (0)'}.`,
        };
      }

      case 'runSimulation': {
        const simResult = context.runSimulation();
        return {
          tool: 'runSimulation',
          success: !simResult.error,
          message: simResult.error ? `Simulation error: ${simResult.error}` : 'Simulation updated signal propagation across all wires.',
          data: simResult,
        };
      }

      case 'inspectCircuit': {
        const comps = context.getComponents();
        const conns = context.getConnections();
        const mission = context.getActiveMission();
        const report = mission ? CircuitValidator.validateMission(comps, conns, mission) : null;

        const inspection: CircuitInspectionResult = {
          totalComponents: comps.length,
          components: comps.map((c) => ({
            id: c.id,
            type: c.type,
            label: c.label,
            x: c.x,
            y: c.y,
            inputCount: c.inputs.length,
            outputCount: c.outputs.length,
          })),
          totalConnections: conns.length,
          connections: conns.map((w) => ({
            id: w.id,
            from: `${w.fromCompId}:${w.fromPortId}`,
            to: `${w.toCompId}:${w.toPortId}`,
            signal: w.signal,
          })),
          unconnectedPorts: (report?.unconnectedPorts || []).map((p) => ({
            componentId: p.componentId,
            componentLabel: p.componentLabel,
            portName: p.portId,
          })),
          switches: comps
            .filter((c) => c.type === 'SWITCH')
            .map((c) => ({ id: c.id, label: c.label, state: !!c.state.toggle })),
        };

        return {
          tool: 'inspectCircuit',
          success: true,
          message: `Inspected circuit: ${comps.length} components, ${conns.length} wires, ${inspection.unconnectedPorts.length} floating ports.`,
          data: inspection,
        };
      }

      case 'verifyTruthTable': {
        const report = context.verifyTruthTable();
        return {
          tool: 'verifyTruthTable',
          success: report.isPassing,
          message: report.isPassing
            ? 'All truth table vectors passed validation (100% score)!'
            : `Validation failed on ${report.failingRows?.length || 0} row(s).`,
          data: report,
        };
      }

      case 'deleteComponent': {
        const compId = step.args.compId as string;
        context.deleteComponent(compId);
        return {
          tool: 'deleteComponent',
          success: true,
          message: `Deleted component ${compId} from canvas.`,
        };
      }

      case 'deleteConnection': {
        const wireId = step.args.wireId as string;
        context.deleteConnection(wireId);
        return {
          tool: 'deleteConnection',
          success: true,
          message: `Removed wire ${wireId}.`,
        };
      }

      case 'clearCircuit': {
        context.clearCircuit();
        return {
          tool: 'clearCircuit',
          success: true,
          message: 'Cleared all components and wires from the canvas.',
        };
      }

      default:
        return {
          tool: step.tool,
          success: false,
          message: `Unknown tool: ${step.tool}`,
        };
    }
  }
}

export const autonomousAgent = new AutonomousAgent();
