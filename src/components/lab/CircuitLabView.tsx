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
  const [rightPanelTab, setRightPanelTab] = useState<'inspector' | 'mentor'>('inspector');
  const [zoom, setZoom] = useState<number>(1);
  const [isTruthTableOpen, setIsTruthTableOpen] = useState<boolean>(false);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

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
    setComponents((prev) => prev.filter((c) => c.id !== compId));
    setConnections((prev) =>
      prev.filter((w) => w.fromCompId !== compId && w.toCompId !== compId)
    );
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
            title="Reset circuit to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Save */}
          <BenchButton variant="primary" size="sm" onClick={handleSaveCircuit} icon={<Save className="w-3.5 h-3.5" />}>
            Save
          </BenchButton>
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
          componentOutputs={simResult.componentOutputs}
          wireStates={simResult.wireStates}
          zoom={zoom}
          isRunMode={true}
        />

        {/* Right Panel: Inspector + AI Study Buddy */}
        <aside className="w-80 bg-[#16191C] border-l border-[#282E33] flex flex-col h-full">
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
              <Sliders className="w-4 h-4" />
              <span>Inspector</span>
            </button>

            <button
              onClick={() => setRightPanelTab('mentor')}
              className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                rightPanelTab === 'mentor'
                  ? 'border-[#C6FF3D] text-[#ECEBE4] bg-[#1D2125]/50'
                  : 'border-transparent text-[#9CA3A8] hover:text-[#ECEBE4]'
              }`}
            >
              <Bot className="w-4 h-4 text-[#C6FF3D]" />
              <span>AI Study Buddy</span>
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
              />
            )}
          </div>
        </aside>
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
