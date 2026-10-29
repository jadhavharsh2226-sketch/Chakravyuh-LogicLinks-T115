import React from 'react';
import { Trash2, Power, Info, CheckCircle2, HelpCircle } from 'lucide-react';
import { CircuitComponent, Connection, SignalState } from '../../types';
import { BenchButton } from '../common/BenchButton';
import { GateSymbol } from '../common/GateSymbol';

interface InspectorPanelProps {
  selectedComponent: CircuitComponent | null;
  connections: Connection[];
  componentOutputs: Map<string, SignalState>;
  wireStates: Map<string, SignalState>;
  onToggleSwitch: (componentId: string) => void;
  onDeleteComponent: (componentId: string) => void;
  totalComponents: number;
  totalConnections: number;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedComponent,
  connections,
  componentOutputs,
  wireStates,
  onToggleSwitch,
  onDeleteComponent,
  totalComponents,
  totalConnections,
}) => {
  if (!selectedComponent) {
    return (
      <div className="p-5 space-y-5 font-sans text-xs select-none">
        <div className="flex items-center justify-between border-b border-[#282E33] pb-3">
          <span className="font-bold text-[#ECEBE4] uppercase">CIRCUIT SUMMARY</span>
          <span className="px-2 py-0.5 rounded-full bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30 font-mono text-[10px] font-bold">
            Sim Active
          </span>
        </div>

        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between text-[#9CA3A8]">
            <span>Total Components:</span>
            <span className="text-[#ECEBE4] font-bold">{totalComponents}</span>
          </div>
          <div className="flex items-center justify-between text-[#9CA3A8]">
            <span>Connected Wires:</span>
            <span className="text-[#3DDCFF] font-bold">{totalConnections}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-[#282E33] bg-[#0E1012] text-[#9CA3A8] leading-relaxed">
          <p className="font-sans">
            👉 <strong>How to use:</strong> Click any switch, gate, or light bulb on the canvas to see its inputs and test its logic here!
          </p>
        </div>
      </div>
    );
  }

  const outPortId = selectedComponent.outputs[0]?.id || '0';
  const currentOutput = componentOutputs.get(`${selectedComponent.id}_out_${outPortId}`);

  return (
    <div className="p-5 space-y-5 font-sans text-xs select-none">
      {/* Component Header */}
      <div className="flex items-center justify-between border-b border-[#282E33] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0E1012] border border-[#282E33] flex items-center justify-center">
            <GateSymbol type={selectedComponent.type} size={30} signal={currentOutput} />
          </div>
          <div>
            <div className="font-bold text-sm text-[#ECEBE4]">
              {selectedComponent.label}
            </div>
            <div className="text-[11px] text-[#9CA3A8]">
              Type: {selectedComponent.type}
            </div>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
            currentOutput === 1
              ? 'bg-[#3DDCFF]/15 text-[#3DDCFF] border border-[#3DDCFF]/30'
              : 'bg-[#1D2125] text-[#9CA3A8] border border-[#282E33]'
          }`}
        >
          {currentOutput === 1 ? 'OUTPUT: ON (1)' : 'OUTPUT: OFF (0)'}
        </span>
      </div>

      {/* Switch Interactive Controls */}
      {selectedComponent.type === 'SWITCH' && (
        <div className="p-4 rounded-xl border border-[#282E33] bg-[#0E1012] space-y-3">
          <div className="flex items-center justify-between font-mono">
            <span className="text-[#9CA3A8]">Switch Status:</span>
            <span className={`font-bold ${selectedComponent.state.toggle ? 'text-[#3DDCFF]' : 'text-[#646F77]'}`}>
              {selectedComponent.state.toggle ? '● CLOSED (1 - ON)' : '○ OPEN (0 - OFF)'}
            </span>
          </div>

          <BenchButton
            variant={selectedComponent.state.toggle ? 'accent' : 'secondary'}
            size="md"
            onClick={() => onToggleSwitch(selectedComponent.id)}
            icon={<Power className="w-4 h-4" />}
            className="w-full"
          >
            Click to Flip Switch
          </BenchButton>
        </div>
      )}

      {/* Inputs Status */}
      {selectedComponent.inputs.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#9CA3A8] uppercase tracking-wider block">
            Input Wires ({selectedComponent.inputs.length}):
          </span>
          <div className="space-y-2">
            {selectedComponent.inputs.map((port, idx) => {
              const incomingWire = connections.find(
                (w) => w.toCompId === selectedComponent.id && (w.toPortId === port.id || w.toPortId === `${idx}`)
              );
              const signal = incomingWire ? wireStates.get(incomingWire.id) : undefined;

              return (
                <div
                  key={port.id}
                  className="p-2.5 rounded-lg bg-[#0E1012] border border-[#282E33] flex items-center justify-between"
                >
                  <span className="text-[#ECEBE4]">
                    Input #{idx + 1} ({port.name})
                  </span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      signal === 1
                        ? 'text-[#3DDCFF] bg-[#3DDCFF]/10'
                        : signal === 0
                        ? 'text-[#9CA3A8] bg-[#1D2125]'
                        : 'text-[#FFB020] bg-[#FFB020]/10'
                    }`}
                  >
                    {signal === 1 ? '1 (ON)' : signal === 0 ? '0 (OFF)' : 'Not Connected'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Output Status */}
      {selectedComponent.outputs.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#9CA3A8] uppercase tracking-wider block">
            Output Signal:
          </span>
          <div className="p-2.5 rounded-lg bg-[#0E1012] border border-[#282E33] flex items-center justify-between">
            <span className="text-[#ECEBE4]">Main Output Pin</span>
            <span className={`font-mono text-xs font-bold ${currentOutput === 1 ? 'text-[#3DDCFF]' : 'text-[#646F77]'}`}>
              {currentOutput === 1 ? '1 (ON - Power Sent)' : '0 (OFF)'}
            </span>
          </div>
        </div>
      )}

      {/* Delete button */}
      <div className="pt-3 border-t border-[#282E33]">
        <BenchButton
          variant="danger"
          size="sm"
          onClick={() => onDeleteComponent(selectedComponent.id)}
          icon={<Trash2 className="w-3.5 h-3.5" />}
          className="w-full"
        >
          Delete This Component
        </BenchButton>
      </div>
    </div>
  );
};
