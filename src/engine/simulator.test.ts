import { describe, it, expect } from 'vitest';
import { CircuitSimulator } from './simulator';
import { CircuitValidator } from './validator';
import { MISSIONS } from './missions';
import { CircuitComponent, Connection } from '../types';

describe('Deterministic Circuit Simulator Engine', () => {
  it('correctly evaluates all basic logic gates', () => {
    // AND Gate
    expect(CircuitSimulator.evaluateGate('AND', [0, 0])).toBe(0);
    expect(CircuitSimulator.evaluateGate('AND', [0, 1])).toBe(0);
    expect(CircuitSimulator.evaluateGate('AND', [1, 0])).toBe(0);
    expect(CircuitSimulator.evaluateGate('AND', [1, 1])).toBe(1);

    // OR Gate
    expect(CircuitSimulator.evaluateGate('OR', [0, 0])).toBe(0);
    expect(CircuitSimulator.evaluateGate('OR', [0, 1])).toBe(1);
    expect(CircuitSimulator.evaluateGate('OR', [1, 0])).toBe(1);
    expect(CircuitSimulator.evaluateGate('OR', [1, 1])).toBe(1);

    // NOT Gate
    expect(CircuitSimulator.evaluateGate('NOT', [0])).toBe(1);
    expect(CircuitSimulator.evaluateGate('NOT', [1])).toBe(0);

    // XOR Gate
    expect(CircuitSimulator.evaluateGate('XOR', [0, 0])).toBe(0);
    expect(CircuitSimulator.evaluateGate('XOR', [0, 1])).toBe(1);
    expect(CircuitSimulator.evaluateGate('XOR', [1, 0])).toBe(1);
    expect(CircuitSimulator.evaluateGate('XOR', [1, 1])).toBe(0);

    // NAND Gate
    expect(CircuitSimulator.evaluateGate('NAND', [1, 1])).toBe(0);
    expect(CircuitSimulator.evaluateGate('NAND', [1, 0])).toBe(1);

    // NOR Gate
    expect(CircuitSimulator.evaluateGate('NOR', [0, 0])).toBe(1);
    expect(CircuitSimulator.evaluateGate('NOR', [0, 1])).toBe(0);
  });

  it('accurately simulates an XOR circuit with signal propagation', () => {
    const components: CircuitComponent[] = [
      {
        id: 'sw_1',
        type: 'SWITCH',
        label: 'A',
        x: 0,
        y: 0,
        inputs: [],
        outputs: [{ id: '0', name: 'OUT', type: 'output', value: 1, index: 0 }],
        state: { toggle: true },
      },
      {
        id: 'sw_2',
        type: 'SWITCH',
        label: 'B',
        x: 0,
        y: 50,
        inputs: [],
        outputs: [{ id: '0', name: 'OUT', type: 'output', value: 0, index: 0 }],
        state: { toggle: false },
      },
      {
        id: 'gate_xor',
        type: 'XOR',
        label: 'XOR',
        x: 100,
        y: 25,
        inputs: [
          { id: '0', name: 'IN_1', type: 'input', value: 1, index: 0 },
          { id: '1', name: 'IN_2', type: 'input', value: 0, index: 1 },
        ],
        outputs: [{ id: '0', name: 'OUT', type: 'output', value: 1, index: 0 }],
        state: {},
      },
    ];

    const connections: Connection[] = [
      { id: 'w1', fromCompId: 'sw_1', fromPortId: '0', toCompId: 'gate_xor', toPortId: '0', signal: 1 },
      { id: 'w2', fromCompId: 'sw_2', fromPortId: '0', toCompId: 'gate_xor', toPortId: '1', signal: 0 },
    ];

    const result = CircuitSimulator.runSimulation(components, connections);
    expect(result.componentOutputs.get('gate_xor_out_0')).toBe(1);
    expect(result.hasOscillation).toBe(false);
  });

  it('detects feedback loop / oscillation safely without freezing', () => {
    // Single NOT gate fed back to itself
    const components: CircuitComponent[] = [
      {
        id: 'not_ring',
        type: 'NOT',
        label: 'Oscillator NOT',
        x: 0,
        y: 0,
        inputs: [{ id: '0', name: 'IN', type: 'input', value: 0, index: 0 }],
        outputs: [{ id: '0', name: 'OUT', type: 'output', value: 1, index: 0 }],
        state: {},
      },
    ];

    const connections: Connection[] = [
      { id: 'loop_wire', fromCompId: 'not_ring', fromPortId: '0', toCompId: 'not_ring', toPortId: '0', signal: 0 },
    ];

    const result = CircuitSimulator.runSimulation(components, connections);
    expect(result.hasOscillation).toBe(true);
    expect(result.error).toBeDefined();
  });

  it('validates Mission 001 (AND Gate) correctly', () => {
    const mission = MISSIONS[0];
    
    // Correct solution
    const components: CircuitComponent[] = [
      ...mission.initialCircuit.components,
      {
        id: 'and_gate_1',
        type: 'AND',
        label: 'AND Gate',
        x: 300,
        y: 190,
        inputs: [
          { id: '0', name: 'IN_1', type: 'input', value: 0, index: 0 },
          { id: '1', name: 'IN_2', type: 'input', value: 0, index: 1 },
        ],
        outputs: [{ id: '0', name: 'OUT', type: 'output', value: 0, index: 0 }],
        state: {},
      },
    ];

    const connections: Connection[] = [
      { id: 'w1', fromCompId: 'sw_a', fromPortId: '0', toCompId: 'and_gate_1', toPortId: '0', signal: 0 },
      { id: 'w2', fromCompId: 'sw_b', fromPortId: '0', toCompId: 'and_gate_1', toPortId: '1', signal: 0 },
      { id: 'w3', fromCompId: 'and_gate_1', fromPortId: '0', toCompId: 'led_out', toPortId: '0', signal: 0 },
    ];

    const report = CircuitValidator.validateMission(components, connections, mission);
    expect(report.isPassing).toBe(true);
    expect(report.failingRows.length).toBe(0);
    expect(report.score).toBe(mission.xp);
  });
});
