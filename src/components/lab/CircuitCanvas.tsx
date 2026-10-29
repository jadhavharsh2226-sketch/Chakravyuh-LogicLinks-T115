import React, { useState, useRef } from 'react';
import { CircuitComponent, Connection, SignalState } from '../../types';
import { GateSymbol } from '../common/GateSymbol';
import { Power, Check, AlertCircle } from 'lucide-react';

interface CircuitCanvasProps {
  components: CircuitComponent[];
  connections: Connection[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponentPosition: (id: string, x: number, y: number) => void;
  onConnectPorts: (fromCompId: string, fromPortId: string, toCompId: string, toPortId: string) => void;
  onToggleSwitch: (componentId: string) => void;
  componentOutputs: Map<string, SignalState>;
  wireStates: Map<string, SignalState>;
  zoom: number;
  isRunMode: boolean;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  components,
  connections,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponentPosition,
  onConnectPorts,
  onToggleSwitch,
  componentOutputs,
  wireStates,
  zoom,
  isRunMode,
}) => {
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pendingWireSource, setPendingWireSource] = useState<{ compId: string; portId: string; isOutput: boolean } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Helper to compute port center coordinates in SVG space
  const getPortCoords = (compId: string, portId: string, isOutput: boolean) => {
    const comp = components.find((c) => c.id === compId);
    if (!comp) return { x: 0, y: 0 };

    const compWidth = 120;
    const compHeight = 70;

    if (isOutput) {
      return {
        x: comp.x + compWidth,
        y: comp.y + compHeight / 2,
      };
    } else {
      const portIdx = comp.inputs.findIndex((p) => p.id === portId);
      const totalInputs = Math.max(1, comp.inputs.length);
      const spacing = compHeight / (totalInputs + 1);
      return {
        x: comp.x,
        y: comp.y + spacing * (portIdx + 1),
      };
    }
  };

  // Mouse drag handlers for components
  const handleMouseDownComponent = (e: React.MouseEvent, compId: string) => {
    e.stopPropagation();
    onSelectComponent(compId);

    const comp = components.find((c) => c.id === compId);
    if (!comp) return;

    setDraggingCompId(compId);
    setDragOffset({
      x: e.clientX / zoom - comp.x,
      y: e.clientY / zoom - comp.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingCompId) {
      const newX = Math.round((e.clientX / zoom - dragOffset.x) / 10) * 10;
      const newY = Math.round((e.clientY / zoom - dragOffset.y) / 10) * 10;
      onUpdateComponentPosition(draggingCompId, Math.max(20, newX), Math.max(20, newY));
    }
  };

  const handleMouseUp = () => {
    setDraggingCompId(null);
  };

  // Port click connection logic
  const handlePortClick = (e: React.MouseEvent, compId: string, portId: string, isOutput: boolean) => {
    e.stopPropagation();

    if (!pendingWireSource) {
      // Start wire
      setPendingWireSource({ compId, portId, isOutput });
    } else {
      // Finish wire: verify one is output and one is input
      if (pendingWireSource.isOutput !== isOutput && pendingWireSource.compId !== compId) {
        if (pendingWireSource.isOutput) {
          onConnectPorts(pendingWireSource.compId, pendingWireSource.portId, compId, portId);
        } else {
          onConnectPorts(compId, portId, pendingWireSource.compId, pendingWireSource.portId);
        }
      }
      setPendingWireSource(null);
    }
  };

  return (
    <div
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => {
        onSelectComponent(null);
        setPendingWireSource(null);
      }}
      className="relative flex-1 h-full bg-[#0E1012] bg-bench-grid overflow-hidden cursor-crosshair select-none"
    >
      {/* Zoom transform container */}
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
          width: '3000px',
          height: '2000px',
        }}
        className="relative"
      >
        {/* SVG Wiring Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {connections.map((wire) => {
            const start = getPortCoords(wire.fromCompId, wire.fromPortId, true);
            const end = getPortCoords(wire.toCompId, wire.toPortId, false);

            const isHigh = wireStates.get(wire.id) === 1;
            const isUndefined = wireStates.get(wire.id) === undefined;
            const wireColor = isHigh ? '#3DDCFF' : isUndefined ? '#FFB020' : '#525C64';

            // Orthogonal routing midpoint
            const midX = (start.x + end.x) / 2;
            const pathData = `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;

            return (
              <g key={wire.id}>
                {/* Glow layer if HIGH */}
                {isHigh && (
                  <path
                    d={pathData}
                    stroke="#3DDCFF"
                    strokeWidth="5"
                    strokeOpacity="0.3"
                    fill="none"
                    filter="url(#glow-cyan)"
                  />
                )}
                {/* Primary signal wire */}
                <path
                  d={pathData}
                  stroke={wireColor}
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray={isUndefined ? '4 3' : isHigh ? '8 4' : 'none'}
                  className={isHigh ? 'animate-signal-flow' : ''}
                />
                {/* Wire signal label tag at midpoint */}
                <circle cx={midX} cy={(start.y + end.y) / 2} r="5" fill="#16191C" stroke={wireColor} strokeWidth="1.5" />
              </g>
            );
          })}
        </svg>

        {/* Schematic Components Layer */}
        {components.map((comp) => {
          const isSelected = selectedComponentId === comp.id;
          const outPortId = comp.outputs[0]?.id || '0';
          const currentOutput = componentOutputs.get(`${comp.id}_out_${outPortId}`);

          return (
            <div
              key={comp.id}
              style={{ left: `${comp.x}px`, top: `${comp.y}px`, width: '120px' }}
              onMouseDown={(e) => handleMouseDownComponent(e, comp.id)}
              className={`absolute z-20 rounded-bench border bg-[#16191C] shadow-instrument p-2.5 transition-shadow cursor-move ${
                isSelected
                  ? 'border-[#C6FF3D] ring-1 ring-[#C6FF3D] shadow-glow-accent'
                  : comp.isFaulty
                  ? 'border-[#FF4D4D]'
                  : 'border-[#282E33] hover:border-[#525C64]'
              }`}
            >
              {/* Component Header */}
              <div className="flex items-center justify-between pb-1.5 border-b border-[#282E33] mb-2 font-mono text-[10px]">
                <span className="text-[#ECEBE4] font-bold truncate">{comp.label}</span>
                <span className="text-[#646F77]">{comp.type}</span>
              </div>

              {/* Component Visual Gate Symbol */}
              <div className="flex items-center justify-center py-1">
                {comp.type === 'SWITCH' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSwitch(comp.id);
                    }}
                    className={`w-full py-1.5 px-2 rounded border font-mono text-xs font-bold transition-all flex items-center justify-between ${
                      comp.state.toggle
                        ? 'border-[#3DDCFF] bg-[#3DDCFF]/15 text-[#3DDCFF]'
                        : 'border-[#282E33] bg-[#0E1012] text-[#525C64]'
                    }`}
                  >
                    <span>{comp.state.toggle ? 'HIGH (1)' : 'LOW (0)'}</span>
                    <Power className="w-3.5 h-3.5" />
                  </button>
                ) : comp.type === 'LED' ? (
                  <div className="flex flex-col items-center gap-1 py-1">
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        currentOutput === 1
                          ? 'border-[#3DDCFF] bg-[#3DDCFF] shadow-glow-cyan'
                          : 'border-[#525C64] bg-[#0E1012]'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${currentOutput === 1 ? 'bg-white' : 'bg-transparent'}`} />
                    </div>
                    <span className={`font-mono text-[9px] font-bold ${currentOutput === 1 ? 'text-[#3DDCFF]' : 'text-[#525C64]'}`}>
                      {currentOutput === 1 ? 'HIGH (1)' : 'LOW (0)'}
                    </span>
                  </div>
                ) : (
                  <GateSymbol
                    type={comp.type}
                    size={44}
                    signal={currentOutput}
                    isFaulty={comp.isFaulty}
                  />
                )}
              </div>

              {/* Input Ports (Left Side Snap Dots) */}
              {comp.inputs.map((port, idx) => {
                const total = Math.max(1, comp.inputs.length);
                const topPercent = ((idx + 1) / (total + 1)) * 100;
                const isConnected = connections.some(
                  (w) => w.toCompId === comp.id && (w.toPortId === port.id || w.toPortId === `${idx}`)
                );

                return (
                  <div
                    key={port.id}
                    style={{ top: `${topPercent}%` }}
                    onClick={(e) => handlePortClick(e, comp.id, port.id, false)}
                    className={`absolute -left-2 -translate-y-1/2 w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer transition-transform hover:scale-125 z-30 ${
                      isConnected
                        ? 'bg-[#3DDCFF] border-[#ECEBE4]'
                        : 'bg-[#16191C] border-[#525C64] hover:border-[#C6FF3D]'
                    } ${pendingWireSource && pendingWireSource.isOutput ? 'ring-2 ring-[#C6FF3D] animate-pulse' : ''}`}
                    title={`Input Port: ${port.name}`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0E1012]" />
                  </div>
                );
              })}

              {/* Output Port (Right Side Snap Dot) */}
              {comp.outputs.map((port) => (
                <div
                  key={port.id}
                  onClick={(e) => handlePortClick(e, comp.id, port.id, true)}
                  className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer transition-transform hover:scale-125 z-30 ${
                    currentOutput === 1
                      ? 'bg-[#3DDCFF] border-[#ECEBE4] shadow-glow-cyan'
                      : 'bg-[#16191C] border-[#525C64] hover:border-[#C6FF3D]'
                  } ${pendingWireSource && !pendingWireSource.isOutput ? 'ring-2 ring-[#C6FF3D] animate-pulse' : ''}`}
                  title={`Output Port: ${port.name}`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0E1012]" />
                </div>
              ))}
            </div>
          );
        })}

        {components.length === 0 && (
          <div className="absolute left-1/4 top-1/3 p-8 border border-dashed border-[#282E33] rounded-instrument text-center space-y-2 pointer-events-none">
            <span className="font-mono text-sm text-[#9CA3A8] font-bold block">
              WORKBENCH IS EMPTY
            </span>
            <span className="text-xs text-[#646F77] font-mono">
              Click components from the left palette to begin schematic synthesis.
            </span>
          </div>
        )}
      </div>

      {/* Wire in progress notification pill */}
      {pendingWireSource && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-bench bg-[#16191C] border border-[#C6FF3D] text-[#C6FF3D] font-mono text-xs flex items-center gap-2 shadow-glow-accent z-40">
          <span className="w-2 h-2 rounded-full bg-[#C6FF3D] animate-ping" />
          <span>Select destination port to complete signal trace (or click canvas to cancel)</span>
        </div>
      )}
    </div>
  );
};
