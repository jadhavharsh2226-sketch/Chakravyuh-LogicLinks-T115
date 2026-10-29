import { AgentStep, AgentTaskPlan, AgentToolName } from './agentTools';
import { CircuitComponent, Connection, ComponentType, Mission } from '../../types';
import { CircuitValidator } from '../validator';

export class AgentPlanner {
  /**
   * Generates an intelligent, grounded execution plan based on user goal and actual canvas state
   */
  public static planTask(
    goal: string,
    components: CircuitComponent[],
    connections: Connection[],
    activeMission?: Mission
  ): AgentTaskPlan {
    const q = goal.toLowerCase().trim();
    const steps: AgentStep[] = [];

    // 1. CLEAR CANVAS / RESET
    if (q.includes('clear') || q.includes('delete all') || q.includes('empty canvas')) {
      steps.push({
        id: `step_${Date.now()}_1`,
        tool: 'clearCircuit',
        args: { confirm: true },
        thought: 'User requested clearing the canvas. Requesting confirmation to clear components.',
        status: 'pending',
      });
      return {
        goal,
        explanation: 'I will clear all components and connections from the workbench.',
        steps,
      };
    }

    // 2. AUTO-FIX CIRCUIT / REPAIR FLOATING PINS
    if (q.includes('fix') || q.includes('repair') || q.includes('solve') || q.includes('floating')) {
      const report = activeMission
        ? CircuitValidator.validateMission(components, connections, activeMission)
        : null;

      // Find floating gate or led inputs
      const loose = report?.unconnectedPorts || [];
      const switches = components.filter((c) => c.type === 'SWITCH');
      const led = components.find((c) => c.type === 'LED');
      const gates = components.filter((c) => !['SWITCH', 'LED', 'PROBE', 'VCC', 'GND'].includes(c.type));

      steps.push({
        id: `step_${Date.now()}_inspect`,
        tool: 'inspectCircuit',
        args: {},
        thought: 'Inspecting existing circuit to locate floating pins and logic mismatches.',
        status: 'pending',
      });

      // Wire up loose gates or LED
      if (gates.length > 0 && led) {
        const primaryGate = gates[0];
        // Connect switches to gate if not connected
        switches.forEach((sw, idx) => {
          const isConnected = connections.some(
            (w) => w.fromCompId === sw.id && w.toCompId === primaryGate.id
          );
          if (!isConnected) {
            steps.push({
              id: `step_${Date.now()}_sw_${idx}`,
              tool: 'connectPins',
              args: {
                fromCompId: sw.id,
                fromPortId: '0',
                toCompId: primaryGate.id,
                toPortId: `${idx}`,
              },
              thought: `Connecting ${sw.label} output to ${primaryGate.label} input #${idx + 1}.`,
              status: 'pending',
            });
          }
        });

        // Connect gate output to LED
        const isLedConnected = connections.some(
          (w) => w.fromCompId === primaryGate.id && w.toCompId === led.id
        );
        if (!isLedConnected) {
          steps.push({
            id: `step_${Date.now()}_gate_led`,
            tool: 'connectPins',
            args: {
              fromCompId: primaryGate.id,
              fromPortId: '0',
              toCompId: led.id,
              toPortId: '0',
            },
            thought: `Connecting ${primaryGate.label} output to ${led.label} input pin.`,
            status: 'pending',
          });
        }
      }

      steps.push({
        id: `step_${Date.now()}_verify`,
        tool: 'verifyTruthTable',
        args: {},
        thought: 'Evaluating verified truth table against academic target vectors.',
        status: 'pending',
      });

      return {
        goal,
        explanation: 'I will inspect circuit wiring, connect all floating pins to appropriate switches and LEDs, and verify truth table output.',
        steps,
      };
    }

    // 3. BUILD SPECIFIC GATE CIRCUIT (e.g. "Build XOR gate", "Build AND gate", "Build OR gate")
    const gateTypes: ComponentType[] = ['XNOR', 'NAND', 'NOR', 'XOR', 'NOT', 'AND', 'OR'];
    const matchedGate = gateTypes.find((g) => new RegExp(`\\b${g.toLowerCase()}\\b`).test(q));

    if (matchedGate || q.includes('gate') || q.includes('circuit')) {
      const targetGateType = matchedGate || 'AND';
      const switches = components.filter((c) => c.type === 'SWITCH');
      const led = components.find((c) => c.type === 'LED');

      // Add gate if not present
      steps.push({
        id: `step_${Date.now()}_add_gate`,
        tool: 'addComponent',
        args: {
          type: targetGateType,
          label: `${targetGateType} Gate`,
          x: 320,
          y: 200,
        },
        thought: `Adding a digital ${targetGateType} gate to the workbench.`,
        status: 'pending',
      });

      // Wire switches
      if (switches.length >= 2) {
        steps.push({
          id: `step_${Date.now()}_wire_sw1`,
          tool: 'connectPins',
          args: {
            fromCompId: switches[0].id,
            fromPortId: '0',
            toCompId: `__NEW_${targetGateType}__`,
            toPortId: '0',
          },
          thought: `Wiring ${switches[0].label} into first input pin of ${targetGateType} gate.`,
          status: 'pending',
        });

        steps.push({
          id: `step_${Date.now()}_wire_sw2`,
          tool: 'connectPins',
          args: {
            fromCompId: switches[1].id,
            fromPortId: '0',
            toCompId: `__NEW_${targetGateType}__`,
            toPortId: '1',
          },
          thought: `Wiring ${switches[1].label} into second input pin of ${targetGateType} gate.`,
          status: 'pending',
        });
      }

      // Wire to LED
      if (led) {
        steps.push({
          id: `step_${Date.now()}_wire_led`,
          tool: 'connectPins',
          args: {
            fromCompId: `__NEW_${targetGateType}__`,
            fromPortId: '0',
            toCompId: led.id,
            toPortId: '0',
          },
          thought: `Routing ${targetGateType} output trace directly to ${led.label}.`,
          status: 'pending',
        });
      }

      steps.push({
        id: `step_${Date.now()}_verify`,
        tool: 'verifyTruthTable',
        args: {},
        thought: `Running verification pass on truth table to ensure 100% compliance.`,
        status: 'pending',
      });

      return {
        goal,
        explanation: `Synthesizing a complete ${targetGateType} logic circuit, wiring inputs, connecting to light bulb indicator, and testing outputs.`,
        steps,
      };
    }

    // 4. TEST TRUTH TABLE / SIMULATION
    if (q.includes('test') || q.includes('simulate') || q.includes('verify') || q.includes('truth table')) {
      const switches = components.filter((c) => c.type === 'SWITCH');
      if (switches.length >= 2) {
        const vectors: Array<[0 | 1, 0 | 1]> = [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
        ];

        vectors.forEach(([v1, v2], i) => {
          steps.push({
            id: `step_${Date.now()}_vec_${i}_a`,
            tool: 'setInputState',
            args: { compId: switches[0].id, value: v1 },
            thought: `Setting ${switches[0].label} to ${v1} (Vector ${i + 1}/4).`,
            status: 'pending',
          });
          steps.push({
            id: `step_${Date.now()}_vec_${i}_b`,
            tool: 'setInputState',
            args: { compId: switches[1].id, value: v2 },
            thought: `Setting ${switches[1].label} to ${v2} (Vector ${i + 1}/4).`,
            status: 'pending',
          });
          steps.push({
            id: `step_${Date.now()}_sim_${i}`,
            tool: 'runSimulation',
            args: {},
            thought: `Simulating logic gate propagation for vector (${v1}, ${v2}).`,
            status: 'pending',
          });
        });
      }

      steps.push({
        id: `step_${Date.now()}_final_verify`,
        tool: 'verifyTruthTable',
        args: {},
        thought: 'Confirming all rows pass target curriculum validation.',
        status: 'pending',
      });

      return {
        goal,
        explanation: 'Running exhaustive multi-vector live truth table simulation across all switch permutations.',
        steps,
      };
    }

    // 5. FLIP / TOGGLE SWITCH
    if (q.includes('flip') || q.includes('toggle') || q.includes('turn on') || q.includes('turn off')) {
      const isB = q.includes(' b');
      const sw = components.find((c) => c.type === 'SWITCH' && (isB ? c.label.includes('B') : c.label.includes('A'))) ||
        components.find((c) => c.type === 'SWITCH');

      if (sw) {
        const nextVal = sw.state.toggle ? 0 : 1;
        steps.push({
          id: `step_${Date.now()}_sw`,
          tool: 'setInputState',
          args: { compId: sw.id, value: nextVal },
          thought: `Flipping ${sw.label} voltage to ${nextVal === 1 ? 'HIGH (1)' : 'LOW (0)'}.`,
          status: 'pending',
        });
        steps.push({
          id: `step_${Date.now()}_sim`,
          tool: 'runSimulation',
          args: {},
          thought: 'Propagating voltage change through wires and logic gates.',
          status: 'pending',
        });
      }

      return {
        goal,
        explanation: `Toggling switch input and simulating resultant circuit voltage.`,
        steps,
      };
    }

    // Default: Inspect circuit & report state
    steps.push({
      id: `step_${Date.now()}_inspect`,
      tool: 'inspectCircuit',
      args: {},
      thought: 'Inspecting circuit architecture and pin telemetry.',
      status: 'pending',
    });
    steps.push({
      id: `step_${Date.now()}_sim`,
      tool: 'runSimulation',
      args: {},
      thought: 'Evaluating active logic signals.',
      status: 'pending',
    });

    return {
      goal,
      explanation: 'Inspecting schematic, verifying pin connectivity, and evaluating signal states.',
      steps,
    };
  }
}
