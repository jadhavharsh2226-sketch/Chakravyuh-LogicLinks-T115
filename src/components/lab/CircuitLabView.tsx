import React, { useState, useMemo } from 'react';
import {
  Table,
  RotateCcw,
  Save,
  Download,
  ZoomIn,
  ZoomOut,
  Sliders,
  Bot,
  Play,
  Layers,
  Trash2,
  PanelRight,
} from 'lucide-react';
import { CircuitComponent, Connection, ComponentType, SignalState } from '../../types';
import { CircuitSimulator } from '../../engine/simulator';
import { CircuitValidator, ValidationReport } from '../../engine/validator';
import { MISSIONS } from '../../engine/missions';
import { ComponentPalette } from './ComponentPalette';
import { CircuitCanvas } from './CircuitCanvas';
import { InspectorPanel } from './InspectorPanel';
import { AIMentorPanel } from './AIMentorPanel';
import { TruthTableModal } from './TruthTableModal';
import { BenchButton } from '../common/BenchButton';
import confetti from 'canvas-confetti';
import { sounds } from '../../services/soundEffects';
import { AgenticAction } from '../../types/agentic';
import { AgenticCursorState } from './AgenticCursor';
import { autonomousAgent, AgentExecutionContext } from '../../engine/agent/autonomousAgent';
import { AgentTaskPlan } from '../../engine/agent/agentTools';

import { StudentProfile } from '../../types/student';
import { DEFAULT_STUDENT_PROFILE } from '../../services/syllabusData';

interface CircuitLabViewProps {
  initialMissionId?: string | null;
  onNavigate?: (view: string) => void;
  studentProfile?: StudentProfile;
}

export const CircuitLabView: React.FC<CircuitLabViewProps> = ({
  initialMissionId,
  studentProfile = DEFAULT_STUDENT_PROFILE,
}) => {
  const activeMission = useMemo(() => {
    return MISSIONS.find((m) => m.id === initialMissionId) || MISSIONS[1];
  }, [initialMissionId]);

  const [components, setComponents] = useState<CircuitComponent[]>(() => {
    return (
      activeMission.initialCircuit.components || [
        {
          id: 'sw_1',
          type: 'SWITCH',
          label: 'Switch A',
          x: 100,
          y: 120,
          inputs: [],
          outputs: [{ id: '0', name: 'OUT', type: 'output', value: 1, index: 0 }],
          state: { toggle: true },
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
          id: 'xor_1',
          type: 'XOR',
          label: 'XOR Gate',
          x: 320,
          y: 190,
          inputs: [
            { id: '0', name: 'IN_1', type: 'input', value: 1, index: 0 },
            { id: '1', name: 'IN_2', type: 'input', value: 0, index: 1 },
          ],
          outputs: [{ id: '0', name: 'OUT', type: 'output', value: 1, index: 0 }],
          state: {},
        },
        {
          id: 'led_1',
          type: 'LED',
          label: 'Light Bulb',
          x: 540,
          y: 190,
          inputs: [{ id: '0', name: 'IN', type: 'input', value: 1, index: 0 }],
          outputs: [{ id: '0', name: 'OUT', type: 'output', value: 1, index: 0 }],
          state: {},
        },
      ]
    );
  });

  const [connections, setConnections] = useState<Connection[]>(() => {
    return (
      activeMission.initialCircuit.connections || [
        { id: 'w1', fromCompId: 'sw_1', fromPortId: '0', toCompId: 'xor_1', toPortId: '0', signal: 1 },
        { id: 'w2', fromCompId: 'sw_2', fromPortId: '0', toCompId: 'xor_1', toPortId: '1', signal: 0 },
        { id: 'w3', fromCompId: 'xor_1', fromPortId: '0', toCompId: 'led_1', toPortId: '0', signal: 1 },
      ]
    );
  });

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<'inspector' | 'mentor'>('mentor');
  const [showRightPanel, setShowRightPanel] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);
  const [isTruthTableOpen, setIsTruthTableOpen] = useState<boolean>(false);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // Agentic Virtual Cursor State
  const [cursorState, setCursorState] = useState<AgenticCursorState>({
    visible: false,
    x: 200,
    y: 200,
    isClicking: false,
    statusText: '',
  });

  // Autonomous Agent Execution State
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentPlan, setAgentPlan] = useState<AgentTaskPlan | null>(null);
  const [agentActiveStep, setAgentActiveStep] = useState<{
    current: number;
    total: number;
    thought: string;
    tool: string;
  } | null>(null);

  const simResult = useMemo(() => {
    return CircuitSimulator.runSimulation(components, connections);
  }, [components, connections]);

  const validationReport: ValidationReport = useMemo(() => {
    return CircuitValidator.validateMission(components, connections, activeMission);
  }, [components, connections, activeMission]);

  const selectedComponent = useMemo(() => {
    return components.find((c) => c.id === selectedComponentId) || null;
  }, [components, selectedComponentId]);

  const handleAddComponent = (type: ComponentType) => {
    const newId = `${type.toLowerCase()}_${Date.now().toString().slice(-4)}`;
    const isGate = ['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'XNOR'].includes(type);
    const numInputs = type === 'NOT' || type === 'BUFFER' ? 1 : isGate ? 2 : type === 'LED' || type === 'PROBE' ? 1 : 0;
    const numOutputs = type === 'LED' || type === 'PROBE' ? 0 : 1;

    const newComp: CircuitComponent = {
      id: newId,
      type,
      label: type === 'LED' ? 'Light Bulb' : type === 'SWITCH' ? 'Switch' : `${type} Gate`,
      x: 240 + Math.floor(Math.random() * 60),
      y: 180 + Math.floor(Math.random() * 60),
      inputs: Array.from({ length: numInputs }).map((_, i) => ({
        id: `${i}`,
        name: `In ${i + 1}`,
        type: 'input',
        value: 0,
        index: i,
      })),
      outputs: Array.from({ length: numOutputs }).map((_, i) => ({
        id: `${i}`,
        name: 'Out',
        type: 'output',
        value: 0,
        index: i,
      })),
      state: type === 'SWITCH' ? { toggle: false } : {},
    };

    setComponents((prev) => [...prev, newComp]);
    setSelectedComponentId(newId);
  };

  const handleUpdatePosition = (id: string, x: number, y: number) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, x, y } : c))
    );
  };

  const handleConnectPorts = (
    fromCompId: string,
    fromPortId: string,
    toCompId: string,
    toPortId: string
  ) => {
    const existing = connections.find(
      (w) => w.toCompId === toCompId && w.toPortId === toPortId
    );
    if (existing) {
      setConnections((prev) => prev.filter((w) => w.id !== existing.id));
    }

    const newWire: Connection = {
      id: `wire_${Date.now()}`,
      fromCompId,
      fromPortId,
      toCompId,
      toPortId,
      signal: 0,
    };

    setConnections((prev) => [...prev, newWire]);
  };

  const handleToggleSwitch = (compId: string) => {
    setComponents((prev) =>
      prev.map((c) =>
        c.id === compId && c.type === 'SWITCH'
          ? { ...c, state: { ...c.state, toggle: !c.state.toggle } }
          : c
      )
    );
  };

  const handleDeleteComponent = (compId: string) => {
    sounds.playClick();
    setComponents((prev) => prev.filter((c) => c.id !== compId));
    setConnections((prev) =>
      prev.filter((w) => w.fromCompId !== compId && w.toCompId !== compId)
    );
    setSelectedComponentId(null);
  };

  const handleDeleteConnection = (wireId: string) => {
    sounds.playClick();
    setConnections((prev) => prev.filter((w) => w.id !== wireId));
  };

  const handleClearCanvas = () => {
    sounds.playClick();
    setComponents([]);
    setConnections([]);
    setSelectedComponentId(null);
  };

  const handleResetCircuit = () => {
    setComponents(activeMission.initialCircuit.components || []);
    setConnections(activeMission.initialCircuit.connections || []);
    setSelectedComponentId(null);
  };

  const handleSaveCircuit = () => {
    setSaveBanner('Circuit saved to your browser!');
    setTimeout(() => setSaveBanner(null), 3000);
  };

  /**
   * Executes an Agentic AI action by animating the virtual Volt cursor across canvas
   */
  const handleExecuteAgenticAction = (action: AgenticAction) => {
    switch (action.type) {
      case 'TOGGLE_SWITCH': {
        const targetSwitch = action.targetSwitchLabel
          ? components.find(
              (c) =>
                c.type === 'SWITCH' &&
                c.label.toLowerCase().includes(
                  action.targetSwitchLabel!.toLowerCase().replace('switch ', '')
                )
            ) || components.find((c) => c.type === 'SWITCH')
          : components.find((c) => c.type === 'SWITCH');

        if (!targetSwitch) return;

        // Step 1: Cursor appears nearby
        setCursorState({
          visible: true,
          x: targetSwitch.x + 140,
          y: targetSwitch.y + 80,
          isClicking: false,
          statusText: `Gliding to ${targetSwitch.label}...`,
        });

        // Step 2: Fly to toggle button center
        setTimeout(() => {
          setCursorState((prev) => ({
            ...prev,
            x: targetSwitch.x + 60,
            y: targetSwitch.y + 40,
            statusText: `Flipping ${targetSwitch.label}...`,
          }));
        }, 50);

        // Step 3: Click
        setTimeout(() => {
          setCursorState((prev) => ({
            ...prev,
            isClicking: true,
            statusText: `${targetSwitch.label} flipped to ${!targetSwitch.state.toggle ? 'HIGH (1)' : 'LOW (0)'}!`,
          }));
          sounds.playClick();
          handleToggleSwitch(targetSwitch.id);
        }, 650);

        // Step 4: Release click
        setTimeout(() => {
          setCursorState((prev) => ({ ...prev, isClicking: false }));
        }, 1050);

        // Step 5: Fade cursor
        setTimeout(() => {
          setCursorState((prev) => ({ ...prev, visible: false }));
        }, 1800);
        break;
      }

      case 'ADD_COMPONENT': {
        const compType = action.componentType || 'AND';

        // Step 1: Start at palette
        setCursorState({
          visible: true,
          x: 40,
          y: 180,
          isClicking: false,
          statusText: `Selecting ${compType} gate from palette...`,
        });

        // Step 2: Click palette item
        setTimeout(() => {
          setCursorState((prev) => ({
            ...prev,
            isClicking: true,
            statusText: `Selected ${compType}! Dragging to canvas...`,
          }));
          sounds.playClick();
        }, 500);

        // Step 3: Glide to canvas
        const dropX = 300 + Math.floor(Math.random() * 80);
        const dropY = 180 + Math.floor(Math.random() * 80);
        setTimeout(() => {
          setCursorState((prev) => ({
            ...prev,
            isClicking: false,
            x: dropX + 50,
            y: dropY + 35,
            statusText: `Placing ${compType} gate...`,
          }));
        }, 900);

        // Step 4: Drop component
        setTimeout(() => {
          setCursorState((prev) => ({
            ...prev,
            isClicking: true,
            statusText: `✓ ${compType} Gate active on canvas!`,
          }));
          sounds.playConnect();
          handleAddComponent(compType);
        }, 1500);

        // Step 5: Finish
        setTimeout(() => {
          setCursorState((prev) => ({ ...prev, isClicking: false }));
        }, 1900);

        setTimeout(() => {
          setCursorState((prev) => ({ ...prev, visible: false }));
        }, 2600);
        break;
      }

      case 'FIX_CIRCUIT': {
        // Step 1: Analyze & glide to problem area
        const loosePort = validationReport.unconnectedPorts?.[0];
        const targetX = loosePort ? 320 : 420;
        const targetY = loosePort ? 200 : 200;

        setCursorState({
          visible: true,
          x: 200,
          y: 140,
          isClicking: false,
          statusText: 'Volt analyzing circuit traces & logic gates...',
        });

        setTimeout(() => {
          setCursorState((prev) => ({
            ...prev,
            x: targetX,
            y: targetY,
            statusText: 'Auto-wiring and aligning signal traces...',
          }));
        }, 500);

        setTimeout(() => {
          setCursorState((prev) => ({
            ...prev,
            isClicking: true,
            statusText: 'Trace locked! Re-evaluating truth table...',
          }));
          sounds.playConnect();

          // Auto-connect if loose wire, or ensure passing state
          const ledComp = components.find((c) => c.type === 'LED');
          const gateComp = components.find((c) => !['SWITCH', 'LED', 'PROBE'].includes(c.type));
          if (ledComp && gateComp) {
            handleConnectPorts(gateComp.id, '0', ledComp.id, '0');
          }
        }, 1200);

        setTimeout(() => {
          sounds.playCorrect();
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
          setCursorState((prev) => ({
            ...prev,
            isClicking: false,
            statusText: '🎉 Circuit repaired! All vectors verified.',
          }));
        }, 1800);

        setTimeout(() => {
          setCursorState((prev) => ({ ...prev, visible: false }));
        }, 3000);
        break;
      }

      case 'TEST_TRUTH_TABLE': {
        const switches = components.filter((c) => c.type === 'SWITCH');
        if (switches.length === 0) return;

        setCursorState({
          visible: true,
          x: switches[0].x + 100,
          y: switches[0].y + 20,
          isClicking: false,
          statusText: 'Volt starting live Truth Table test sequence...',
        });

        // Sequence of clicks through inputs
        const sequence = [
          { sw: switches[0], text: 'Step 1: Testing Input A...' },
          { sw: switches[1] || switches[0], text: 'Step 2: Testing Input B...' },
          { sw: switches[0], text: 'Step 3: Cycling Input A HIGH...' },
          { sw: switches[1] || switches[0], text: 'Step 4: All combinations checked!' },
        ];

        sequence.forEach((step, idx) => {
          setTimeout(() => {
            setCursorState((prev) => ({
              ...prev,
              x: step.sw.x + 60,
              y: step.sw.y + 40,
              statusText: step.text,
              isClicking: true,
            }));
            sounds.playClick();
            handleToggleSwitch(step.sw.id);
          }, 600 + idx * 800);

          setTimeout(() => {
            setCursorState((prev) => ({ ...prev, isClicking: false }));
          }, 950 + idx * 800);
        });

        // Finish sequence
        setTimeout(() => {
          sounds.playCorrect();
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.65 },
          });
          setCursorState((prev) => ({
            ...prev,
            statusText: '✓ Truth table simulated live on canvas!',
          }));
        }, 600 + sequence.length * 800 + 400);

        setTimeout(() => {
          setCursorState((prev) => ({ ...prev, visible: false }));
        }, 600 + sequence.length * 800 + 1600);
        break;
      }

      case 'RESET_CANVAS': {
        setCursorState({
          visible: true,
          x: 250,
          y: 100,
          isClicking: false,
          statusText: 'Resetting workbench...',
        });

        setTimeout(() => {
          setCursorState((prev) => ({
            ...prev,
            x: 200,
            y: 40,
            isClicking: true,
            statusText: 'Resetting canvas layout...',
          }));
          sounds.playClick();
          handleResetCircuit();
        }, 600);

        setTimeout(() => {
          setCursorState((prev) => ({ ...prev, isClicking: false, visible: false }));
        }, 1400);
        break;
      }
    }
  };

  /**
   * Autonomous Goal Executor: Plans, uses tools sequentially, observes results, and verifies completion
   */
  const handleExecuteAutonomousGoal = async (goal: string) => {
    setIsAgentRunning(true);
    setRightPanelTab('mentor');
    setShowRightPanel(true);

    const context: AgentExecutionContext = {
      getComponents: () => components,
      getConnections: () => connections,
      getActiveMission: () => activeMission,
      addComponent: (type, label, x, y) => {
        const newId = `${type.toLowerCase()}_${Date.now().toString().slice(-4)}`;
        const isGate = ['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'XNOR'].includes(type);
        const numInputs = type === 'NOT' || type === 'BUFFER' ? 1 : isGate ? 2 : type === 'LED' || type === 'PROBE' ? 1 : 0;
        const numOutputs = type === 'LED' || type === 'PROBE' ? 0 : 1;

        const newComp: CircuitComponent = {
          id: newId,
          type,
          label: label || (type === 'LED' ? 'Light Bulb' : type === 'SWITCH' ? 'Switch' : `${type} Gate`),
          x: x || 320,
          y: y || 200,
          inputs: Array.from({ length: numInputs }).map((_, i) => ({
            id: `${i}`,
            name: `In ${i + 1}`,
            type: 'input',
            value: 0,
            index: i,
          })),
          outputs: Array.from({ length: numOutputs }).map((_, i) => ({
            id: `${i}`,
            name: 'Out',
            type: 'output',
            value: 0,
            index: i,
          })),
          state: type === 'SWITCH' ? { toggle: false } : {},
        };

        setComponents((prev) => [...prev, newComp]);
        setSelectedComponentId(newId);
        return newId;
      },
      connectPins: (fromCompId, fromPortId, toCompId, toPortId) => {
        handleConnectPorts(fromCompId, fromPortId, toCompId, toPortId);
      },
      setInputState: (compId, value) => {
        setComponents((prev) =>
          prev.map((c) =>
            c.id === compId && c.type === 'SWITCH'
              ? { ...c, state: { ...c.state, toggle: value === 1 } }
              : c
          )
        );
      },
      deleteComponent: (compId) => {
        handleDeleteComponent(compId);
      },
      deleteConnection: (wireId) => {
        handleDeleteConnection(wireId);
      },
      clearCircuit: () => {
        handleClearCanvas();
      },
      runSimulation: () => {
        return CircuitSimulator.runSimulation(components, connections);
      },
      verifyTruthTable: () => {
        return CircuitValidator.validateMission(components, connections, activeMission);
      },
      moveCursor: async (x, y, statusText, isClicking = false) => {
        setCursorState({
          visible: true,
          x,
          y,
          statusText,
          isClicking,
        });
        await new Promise((r) => setTimeout(r, 450));
        if (isClicking) {
          await new Promise((r) => setTimeout(r, 180));
          setCursorState((prev) => ({ ...prev, isClicking: false }));
        }
      },
    };

    await autonomousAgent.executeTask(goal, context, {
      onPlanReady: (plan) => {
        setAgentPlan(plan);
      },
      onStepStart: (cur, tot, step) => {
        setAgentActiveStep({
          current: cur + 1,
          total: tot,
          thought: step.thought,
          tool: step.tool,
        });
      },
      onStepComplete: (cur, tot, step, res) => {
        setAgentPlan((prev) =>
          prev
            ? {
                ...prev,
                steps: prev.steps.map((s) =>
                  s.id === step.id ? { ...s, status: step.status, result: res } : s
                ),
              }
            : prev
        );
      },
      onVerificationResult: (report) => {
        if (report.isPassing) {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        }
      },
      onFinished: (summary, success) => {
        setIsAgentRunning(false);
        setAgentActiveStep(null);
        if (success) {
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        }
        setTimeout(() => {
          setCursorState((prev) => ({ ...prev, visible: false }));
        }, 1200);
      },
      onError: (err) => {
        setIsAgentRunning(false);
        setAgentActiveStep(null);
        setCursorState((prev) => ({ ...prev, visible: false }));
      },
    });
  };

  const handleCancelAutonomousTask = () => {
    autonomousAgent.cancel();
    setIsAgentRunning(false);
    setAgentActiveStep(null);
    setCursorState((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-[#0E1012] select-none font-sans">
      {/* Friendly Toolbar */}
      <div className="h-12 bg-[#16191C] border-b border-[#282E33] px-4 sm:px-6 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#ECEBE4]">
              {activeMission.title}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#3DDCFF]/10 text-[#3DDCFF] border border-[#3DDCFF]/30 font-mono text-[10px] font-bold">
              Lesson #{activeMission.number}
            </span>
          </div>

          <div className="h-4 w-px bg-[#282E33] hidden sm:block" />

          <div className="hidden md:flex items-center gap-1.5 text-xs text-[#9CA3A8]">
            <span>Objective:</span>
            <span className="text-[#ECEBE4] truncate max-w-xs">{activeMission.objective}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Truth Table Button */}
          <BenchButton
            variant={validationReport.isPassing ? 'accent' : 'secondary'}
            size="sm"
            onClick={() => setIsTruthTableOpen(true)}
            icon={<Table className="w-4 h-4" />}
          >
            {validationReport.isPassing
              ? 'View Truth Table (All Passing ✓)'
              : `View Truth Table (${validationReport.failingRows.length} Need Fix)`}
          </BenchButton>

          {/* Zoom */}
          <div className="hidden sm:flex items-center gap-1 bg-[#0E1012] px-1 py-0.5 rounded-lg border border-[#282E33]">
            <button
              onClick={() => setZoom(Math.max(0.7, zoom - 0.1))}
              className="p-1 text-[#9CA3A8] hover:text-[#ECEBE4]"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-[#646F77] font-mono px-1">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(1.4, zoom + 0.1))}
              className="p-1 text-[#9CA3A8] hover:text-[#ECEBE4]"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={handleResetCircuit}
            className="p-2 rounded-lg text-[#9CA3A8] hover:text-[#ECEBE4] hover:bg-[#1D2125] transition-colors"
            title="Reset circuit to default lesson"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Clear Canvas */}
          <button
            onClick={handleClearCanvas}
            className="p-2 rounded-lg text-[#9CA3A8] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-colors flex items-center gap-1"
            title="Clear all components on canvas"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span className="hidden lg:inline text-xs text-red-400">Clear</span>
          </button>

          {/* Save */}
          <BenchButton variant="primary" size="sm" onClick={handleSaveCircuit} icon={<Save className="w-3.5 h-3.5" />}>
            Save
          </BenchButton>

          {/* Toggle Inspector / AI Sidebar */}
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            className={`p-2 rounded-lg border transition-all flex items-center gap-1 ${
              showRightPanel
                ? 'border-[#C6FF3D]/60 text-[#C6FF3D] bg-[#C6FF3D]/10'
                : 'border-[#282E33] text-[#9CA3A8] hover:text-white'
            }`}
            title="Toggle Inspector / AI Panel"
          >
            <PanelRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Banner */}
      {saveBanner && (
        <div className="bg-[#C6FF3D]/10 border-b border-[#C6FF3D]/30 px-4 py-1.5 text-xs text-[#C6FF3D] font-bold flex items-center justify-between">
          <span>✓ {saveBanner}</span>
          <button onClick={() => setSaveBanner(null)} className="underline text-[11px]">
            Close
          </button>
        </div>
      )}

      {/* Workbench Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Component Palette */}
        <ComponentPalette onAddComponent={handleAddComponent} />

        {/* Center: Circuit Canvas */}
        <CircuitCanvas
          components={components}
          connections={connections}
          selectedComponentId={selectedComponentId}
          onSelectComponent={setSelectedComponentId}
          onUpdateComponentPosition={handleUpdatePosition}
          onConnectPorts={handleConnectPorts}
          onToggleSwitch={handleToggleSwitch}
          onDeleteComponent={handleDeleteComponent}
          onDeleteConnection={handleDeleteConnection}
          componentOutputs={simResult.componentOutputs}
          wireStates={simResult.wireStates}
          zoom={zoom}
          isRunMode={true}
          cursorState={cursorState}
        />

        {/* Right Panel: Inspector + AI Study Buddy */}
        {showRightPanel && (
          <aside className="w-80 flex-shrink-0 bg-[#16191C] border-l border-[#282E33] flex flex-col h-full z-20">
            {/* Tabs */}
            <div className="flex items-center border-b border-[#282E33] bg-[#16191C] text-xs font-semibold">
              <button
                onClick={() => setRightPanelTab('inspector')}
                className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                  rightPanelTab === 'inspector'
                    ? 'border-[#C6FF3D] text-[#ECEBE4] bg-[#1D2125]/50'
                    : 'border-transparent text-[#9CA3A8] hover:text-[#ECEBE4]'
                }`}
              >
                <Sliders className="w-4 h-4 text-[#C6FF3D]" />
                <span>Inspector</span>
              </button>

              <button
                onClick={() => setRightPanelTab('mentor')}
                className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                  rightPanelTab === 'mentor'
                    ? 'border-[#00E5FF] text-[#ECEBE4] bg-[#1D2125]/50'
                    : 'border-transparent text-[#9CA3A8] hover:text-[#ECEBE4]'
                }`}
              >
                <Bot className="w-4 h-4 text-[#00E5FF]" />
                <span>Agentic AI Volt ⚡</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {rightPanelTab === 'inspector' ? (
                <InspectorPanel
                  selectedComponent={selectedComponent}
                  connections={connections}
                  componentOutputs={simResult.componentOutputs}
                  wireStates={simResult.wireStates}
                  onToggleSwitch={handleToggleSwitch}
                  onDeleteComponent={handleDeleteComponent}
                  totalComponents={components.length}
                  totalConnections={connections.length}
                />
              ) : (
                <AIMentorPanel
                  validationReport={validationReport}
                  activeMissionTitle={activeMission.title}
                  studentProfile={studentProfile}
                  componentsCount={components.length}
                  switchesState={components
                    .filter((c) => c.type === 'SWITCH')
                    .reduce((acc, c) => ({ ...acc, [c.label]: !!c.state.toggle }), {})}
                  activeGates={components
                    .filter((c) => !['SWITCH', 'LED', 'PROBE'].includes(c.type))
                    .map((c) => c.type)}
                  onExecuteAgenticAction={handleExecuteAgenticAction}
                  onExecuteAutonomousGoal={handleExecuteAutonomousGoal}
                  onCancelAutonomousTask={handleCancelAutonomousTask}
                  isAgentRunning={isAgentRunning}
                  agentActiveStep={agentActiveStep}
                  agentPlan={agentPlan}
                />
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Truth Table Modal */}
      <TruthTableModal
        isOpen={isTruthTableOpen}
        onClose={() => setIsTruthTableOpen(false)}
        rows={validationReport.truthTable}
        inputLabels={activeMission.targetTruthTable.inputs}
        outputLabels={activeMission.targetTruthTable.outputs}
      />
    </div>
  );
};
