import { CircuitComponent, Connection, SignalState, SimulationResult } from '../types';

export class CircuitSimulator {
  private static MAX_ITERATIONS = 50;

  /**
   * Evaluates logic gate function given input signals.
   */
  public static evaluateGate(type: string, inputs: SignalState[]): SignalState {
    const validInputs = inputs.filter((v): v is 0 | 1 => v !== undefined);
    
    // If no connected inputs for a gate that requires them
    if (validInputs.length === 0 && !['VCC', 'GND', 'SWITCH', 'CLOCK'].includes(type)) {
      return undefined;
    }

    switch (type) {
      case 'SWITCH':
        return inputs[0] ?? 0;

      case 'VCC':
        return 1;

      case 'GND':
        return 0;

      case 'BUFFER':
        return validInputs[0] ?? undefined;

      case 'NOT':
        if (validInputs.length === 0) return undefined;
        return validInputs[0] === 1 ? 0 : 1;

      case 'AND': {
        if (inputs.includes(0)) return 0;
        if (inputs.some(v => v === undefined)) return undefined;
        return 1;
      }

      case 'NAND': {
        if (inputs.includes(0)) return 1;
        if (inputs.some(v => v === undefined)) return undefined;
        return 0;
      }

      case 'OR': {
        if (inputs.includes(1)) return 1;
        if (inputs.some(v => v === undefined)) return undefined;
        return 0;
      }

      case 'NOR': {
        if (inputs.includes(1)) return 0;
        if (inputs.some(v => v === undefined)) return undefined;
        return 1;
      }

      case 'XOR': {
        if (inputs.some(v => v === undefined)) return undefined;
        const ones = validInputs.filter(v => v === 1).length;
        return (ones % 2 === 1) ? 1 : 0;
      }

      case 'XNOR': {
        if (inputs.some(v => v === undefined)) return undefined;
        const ones = validInputs.filter(v => v === 1).length;
        return (ones % 2 === 1) ? 0 : 1;
      }

      case 'LED':
      case 'PROBE':
        return validInputs[0] ?? undefined;

      default:
        return undefined;
    }
  }

  /**
   * Executes a full deterministic step of the circuit.
   */
  public static runSimulation(
    components: CircuitComponent[],
    connections: Connection[]
  ): SimulationResult {
    const componentOutputs = new Map<string, SignalState>();
    const wireStates = new Map<string, SignalState>();

    // Initial pass: Seed primary inputs (Switches, VCC, GND) and initial wire states
    for (const wire of connections) {
      if (wire.signal !== undefined) {
        wireStates.set(wire.id, wire.signal);
      }
    }

    for (const comp of components) {
      if (comp.type === 'SWITCH') {
        const val: SignalState = comp.state.toggle ? 1 : 0;
        componentOutputs.set(`${comp.id}_out_0`, val);
      } else if (comp.type === 'VCC') {
        componentOutputs.set(`${comp.id}_out_0`, 1);
      } else if (comp.type === 'GND') {
        componentOutputs.set(`${comp.id}_out_0`, 0);
      }
    }

    let iterations = 0;
    let changed = true;
    let hasOscillation = false;

    // Iterative convergence loop (handles arbitrary topologies & feedback loops)
    while (changed && iterations < this.MAX_ITERATIONS) {
      changed = false;
      iterations++;

      // 1. Propagate signals across connections (Wires)
      for (const wire of connections) {
        const sourceKey = `${wire.fromCompId}_out_${wire.fromPortId}`;
        const currentSourceVal = componentOutputs.get(sourceKey) ?? 
                                 componentOutputs.get(wire.fromPortId);

        if (currentSourceVal !== undefined) {
          const prevWireVal = wireStates.get(wire.id);
          if (prevWireVal !== currentSourceVal) {
            wireStates.set(wire.id, currentSourceVal);
            changed = true;
          }
        }
      }

      // 2. Evaluate each component's inputs and compute outputs
      for (const comp of components) {
        if (['SWITCH', 'VCC', 'GND'].includes(comp.type)) continue;

        // Gather inputs from incoming connections
        const incomingWires = connections.filter(w => w.toCompId === comp.id);
        const inputSignals: SignalState[] = comp.inputs.map((port, idx) => {
          const wire = incomingWires.find(w => w.toPortId === port.id || w.toPortId === `${idx}`);
          return wire ? wireStates.get(wire.id) : undefined;
        });

        // Compute natural gate output
        let computedOutput = this.evaluateGate(comp.type, inputSignals);

        // Apply fault injection if component is marked faulty
        if (comp.isFaulty && comp.faultType) {
          switch (comp.faultType) {
            case 'STUCK_AT_0':
              computedOutput = 0;
              break;
            case 'STUCK_AT_1':
              computedOutput = 1;
              break;
            case 'INVERTED':
              if (computedOutput !== undefined) {
                computedOutput = computedOutput === 1 ? 0 : 1;
              }
              break;
            case 'DISCONNECTED':
              computedOutput = undefined;
              break;
          }
        }

        const outPortId = comp.outputs[0]?.id || '0';
        const outputKey = `${comp.id}_out_${outPortId}`;
        const prevOutput = componentOutputs.get(outputKey);

        if (prevOutput !== computedOutput) {
          componentOutputs.set(outputKey, computedOutput);
          changed = true;
        }
      }
    }

    if (iterations >= this.MAX_ITERATIONS) {
      hasOscillation = true;
    }

    return {
      componentOutputs,
      wireStates,
      hasOscillation,
      error: hasOscillation ? 'Unstable loop / high-frequency oscillation detected' : undefined,
    };
  }

  /**
   * Generates a deterministic truth table for the circuit over all input switch permutations.
   */
  public static generateTruthTable(
    components: CircuitComponent[],
    connections: Connection[],
    inputCompIds: string[],
    outputCompIds: string[]
  ) {
    const numInputs = inputCompIds.length;
    if (numInputs === 0) return [];

    const totalCombinations = Math.pow(2, numInputs);
    const rows = [];

    // Clone components to preserve original state
    const clonedComps = JSON.parse(JSON.stringify(components)) as CircuitComponent[];

    for (let i = 0; i < totalCombinations; i++) {
      const inputVals: Record<string, number> = {};

      // Set binary combination
      for (let bit = 0; bit < numInputs; bit++) {
        const compId = inputCompIds[bit];
        // Bit extraction (MSB to LSB)
        const bitVal = (i >> (numInputs - 1 - bit)) & 1;
        inputVals[compId] = bitVal;

        const targetComp = clonedComps.find(c => c.id === compId);
        if (targetComp) {
          targetComp.state.toggle = bitVal === 1;
        }
      }

      // Run simulation on cloned circuit
      const sim = this.runSimulation(clonedComps, connections);

      const outputVals: Record<string, number | undefined> = {};
      for (const outId of outputCompIds) {
        const outComp = clonedComps.find(c => c.id === outId);
        if (outComp) {
          const outPortId = outComp.outputs[0]?.id || '0';
          const val = sim.componentOutputs.get(`${outId}_out_${outPortId}`);
          
          // For LED/PROBE, also check incoming wire signal
          if (val === undefined && ['LED', 'PROBE'].includes(outComp.type)) {
            const incoming = connections.find(w => w.toCompId === outId);
            outputVals[outId] = incoming ? sim.wireStates.get(incoming.id) : undefined;
          } else {
            outputVals[outId] = val;
          }
        }
      }

      rows.push({
        combinationIndex: i,
        inputs: inputVals,
        outputs: outputVals,
      });
    }

    return rows;
  }
}
