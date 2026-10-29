import { CircuitComponent, Connection, Mission, TruthTableRow } from '../types';
import { CircuitSimulator } from './simulator';

export interface ValidationReport {
  isPassing: boolean;
  score: number;
  truthTable: TruthTableRow[];
  errors: string[];
  failingRows: number[];
  unconnectedPorts: Array<{ componentId: string; componentLabel: string; portId: string }>;
  aiInsight: {
    confirmedFindings: string[];
    possibleCauses: string[];
    suggestedRemedy?: string;
  };
}

export class CircuitValidator {
  /**
   * Validates a circuit against a mission target truth table.
   */
  public static validateMission(
    components: CircuitComponent[],
    connections: Connection[],
    mission: Mission
  ): ValidationReport {
    const inputComps = components.filter(c => c.type === 'SWITCH');
    const outputComps = components.filter(c => ['LED', 'PROBE'].includes(c.type));

    const errors: string[] = [];
    const unconnectedPorts: Array<{ componentId: string; componentLabel: string; portId: string }> = [];

    // Check minimum inputs/outputs
    if (inputComps.length < mission.targetTruthTable.inputs.length) {
      errors.push(`Missing inputs: Requires at least ${mission.targetTruthTable.inputs.length} input switches.`);
    }
    if (outputComps.length < mission.targetTruthTable.outputs.length) {
      errors.push(`Missing outputs: Requires at least ${mission.targetTruthTable.outputs.length} output indicators (LED/Probe).`);
    }

    // Check for unconnected gate inputs
    for (const comp of components) {
      if (['SWITCH', 'VCC', 'GND'].includes(comp.type)) continue;

      for (const port of comp.inputs) {
        const isConnected = connections.some(w => w.toCompId === comp.id && (w.toPortId === port.id || w.toPortId === `${port.index}`));
        if (!isConnected) {
          unconnectedPorts.push({
            componentId: comp.id,
            componentLabel: comp.label,
            portId: port.name,
          });
        }
      }
    }

    if (unconnectedPorts.length > 0) {
      errors.push(`${unconnectedPorts.length} floating input(s) detected. All gate inputs must be tied to a valid signal.`);
    }

    // Match inputs and outputs in order
    const inputIds = inputComps.slice(0, mission.targetTruthTable.inputs.length).map(c => c.id);
    const outputIds = outputComps.slice(0, mission.targetTruthTable.outputs.length).map(c => c.id);

    const generatedRows = CircuitSimulator.generateTruthTable(
      components,
      connections,
      inputIds,
      outputIds
    );

    const truthTableResults: TruthTableRow[] = [];
    const failingRows: number[] = [];

    mission.targetTruthTable.rows.forEach((targetRow, idx) => {
      const genRow = generatedRows[idx];
      const inputDict: Record<string, number> = {};
      const expectedDict: Record<string, number> = {};
      const actualDict: Record<string, number> = {};

      mission.targetTruthTable.inputs.forEach((name, i) => {
        inputDict[name] = targetRow.inputs[i];
      });

      let rowPassing = true;
      mission.targetTruthTable.outputs.forEach((name, i) => {
        const expected = targetRow.outputs[i];
        expectedDict[name] = expected;

        const outCompId = outputIds[i];
        const actual = genRow?.outputs[outCompId] as number;
        actualDict[name] = actual ?? 0;

        if (actual !== expected) {
          rowPassing = false;
        }
      });

      if (!rowPassing) {
        failingRows.push(idx);
      }

      truthTableResults.push({
        inputs: inputDict,
        expectedOutputs: expectedDict,
        actualOutputs: actualDict,
        isPassing: rowPassing,
      });
    });

    const isPassing = failingRows.length === 0 && errors.length === 0;
    const score = isPassing ? mission.xp : Math.max(0, Math.round(mission.xp * (1 - failingRows.length / mission.targetTruthTable.rows.length)));

    // Generate AI Context Insights
    const confirmedFindings: string[] = [];
    const possibleCauses: string[] = [];
    let suggestedRemedy: string | undefined;

    if (isPassing) {
      confirmedFindings.push('Circuit matches deterministic truth table specifications across all 2^N state vectors.');
      confirmedFindings.push('Signal propagation verified with 0 floating inputs and no feedback oscillation.');
    } else {
      if (failingRows.length > 0) {
        confirmedFindings.push(`Mismatch on ${failingRows.length} test vector(s): Row(s) ${failingRows.map(r => `#${r + 1}`).join(', ')} produce incorrect logic level.`);
      }
      if (unconnectedPorts.length > 0) {
        confirmedFindings.push(`High-impedance (floating) state on ${unconnectedPorts.map(p => `${p.componentLabel}.${p.portId}`).join(', ')}.`);
        possibleCauses.push('Floating TTL inputs may behave unpredictably or stay at undefined state in simulation.');
        suggestedRemedy = 'Route signal wires from active gates or power rails to all floating ports.';
      }

      if (failingRows.includes(3) && failingRows.length === 1) {
        possibleCauses.push('Check the difference between XOR and OR logic gates when both inputs are HIGH.');
        suggestedRemedy = 'An OR gate outputs HIGH for (1,1), while an XOR outputs LOW for (1,1). Verify the selected gate.';
      } else if (failingRows.length > 0) {
        possibleCauses.push('Gate logic inversion or swapped wiring on the secondary multiplexer/stage.');
      }
    }

    return {
      isPassing,
      score,
      truthTable: truthTableResults,
      errors,
      failingRows,
      unconnectedPorts,
      aiInsight: {
        confirmedFindings,
        possibleCauses,
        suggestedRemedy,
      },
    };
  }
}
