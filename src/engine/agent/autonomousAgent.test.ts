import { describe, it, expect } from 'vitest';
import { AgentPlanner } from './agentPlanner';
import { AutonomousAgent, AgentExecutionContext } from './autonomousAgent';
import { CircuitComponent, Connection, Mission } from '../../types';

describe('AutonomousAgent & AgentPlanner', () => {
  it('generates a valid structured plan for building an XOR circuit', () => {
    const mockComponents: CircuitComponent[] = [
      {
        id: 'sw_1',
        type: 'SWITCH',
        label: 'Switch A',
        x: 100,
        y: 120,
        inputs: [],
        outputs: [{ id: '0', name: 'OUT', type: 'output', value: 0, index: 0 }],
        state: { toggle: false },
      },
      {
        id: 'sw_2',
        type: 'SWITCH',
        label: 'Switch B',
        x: 100,
        y: 260,
        inputs: [],
        outputs: [{ id: '0', name: 'OUT', type: 'output', value: 0, index: 0 }],
        state: { toggle: false },
      },
      {
        id: 'led_1',
        type: 'LED',
        label: 'Light Bulb',
        x: 540,
        y: 190,
        inputs: [{ id: '0', name: 'IN', type: 'input', value: 0, index: 0 }],
        outputs: [{ id: '0', name: 'OUT', type: 'output', value: 0, index: 0 }],
        state: {},
      },
    ];
    const mockConnections: Connection[] = [];

    const plan = AgentPlanner.planTask(
      'Build an XOR gate and connect it to switches and light bulb',
      mockComponents,
      mockConnections
    );

    expect(plan.steps.length).toBeGreaterThan(0);
    const addGateStep = plan.steps.find((s) => s.tool === 'addComponent');
    expect(addGateStep).toBeDefined();
    expect(addGateStep?.args.type).toBe('XOR');
  });

  it('executes tools sequentially through execution context and reports completion', async () => {
    const components: CircuitComponent[] = [];
    const connections: Connection[] = [];

    const mockContext: AgentExecutionContext = {
      getComponents: () => components,
      getConnections: () => connections,
      getActiveMission: () => undefined,
      addComponent: (type, label, x, y) => {
        const id = `${type.toLowerCase()}_1`;
        components.push({
          id,
          type,
          label: label || type,
          x: x || 100,
          y: y || 100,
          inputs: [{ id: '0', name: 'IN_1', type: 'input', value: 0, index: 0 }],
          outputs: [{ id: '0', name: 'OUT', type: 'output', value: 0, index: 0 }],
          state: {},
        });
        return id;
      },
      connectPins: (fromCompId, fromPortId, toCompId, toPortId) => {
        connections.push({
          id: `wire_${connections.length}`,
          fromCompId,
          fromPortId,
          toCompId,
          toPortId,
          signal: 1,
        });
      },
      setInputState: () => {},
      deleteComponent: () => {},
      deleteConnection: () => {},
      clearCircuit: () => {
        components.length = 0;
        connections.length = 0;
      },
      runSimulation: () => ({
        componentOutputs: new Map(),
        wireStates: new Map(),
        hasOscillation: false,
      }),
      verifyTruthTable: () => ({
        isPassing: true,
        score: 100,
        truthTable: [],
        errors: [],
        failingRows: [],
        unconnectedPorts: [],
        aiInsight: { confirmedFindings: [], possibleCauses: [] },
      }),
      moveCursor: async () => {},
    };

    const agent = new AutonomousAgent();
    let stepCount = 0;

    const success = await agent.executeTask('Clear canvas', mockContext, {
      onStepComplete: () => {
        stepCount++;
      },
    });

    expect(success).toBe(true);
    expect(stepCount).toBeGreaterThan(0);
  });
});
