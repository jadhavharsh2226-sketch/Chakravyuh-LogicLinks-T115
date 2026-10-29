import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { ComponentType, ComponentCategory } from '../../types';
import { GateSymbol } from '../common/GateSymbol';

interface ComponentPaletteProps {
  onAddComponent: (type: ComponentType) => void;
}

interface ComponentItem {
  type: ComponentType;
  category: ComponentCategory;
  label: string;
  simpleRule: string;
}

const STUDENT_COMPONENTS: ComponentItem[] = [
  // 1. Inputs
  { type: 'SWITCH', category: 'inputs', label: 'Toggle Switch', simpleRule: 'Click to flip between 0 (OFF) and 1 (ON)' },
  { type: 'VCC', category: 'inputs', label: 'Always ON (1)', simpleRule: 'Constant 1 (Power supply)' },
  { type: 'GND', category: 'inputs', label: 'Always OFF (0)', simpleRule: 'Constant 0 (Ground)' },

  // 2. Logic Gates
  { type: 'AND', category: 'gates', label: 'AND Gate', simpleRule: 'Output is 1 only if BOTH inputs are 1' },
  { type: 'OR', category: 'gates', label: 'OR Gate', simpleRule: 'Output is 1 if EITHER input is 1' },
  { type: 'NOT', category: 'gates', label: 'NOT Gate (Inverter)', simpleRule: 'Flips 0 to 1, and 1 to 0' },
  { type: 'XOR', category: 'gates', label: 'XOR Gate', simpleRule: 'Output is 1 only when inputs are DIFFERENT' },
  { type: 'NAND', category: 'gates', label: 'NAND Gate', simpleRule: 'Opposite of AND (universal gate)' },
  { type: 'NOR', category: 'gates', label: 'NOR Gate', simpleRule: 'Opposite of OR (universal gate)' },

  // 3. Outputs
  { type: 'LED', category: 'outputs', label: 'Light Bulb', simpleRule: 'Glows bright when receiving a 1' },
  { type: 'PROBE', category: 'outputs', label: 'Voltage Meter', simpleRule: 'Shows exact digital logic level' },
];

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onAddComponent }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ComponentCategory>('all');

  const filteredComponents = STUDENT_COMPONENTS.filter((comp) => {
    const matchesSearch =
      comp.label.toLowerCase().includes(search.toLowerCase()) ||
      comp.simpleRule.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || comp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <aside className="w-64 bg-[#16191C] border-r border-[#282E33] flex flex-col h-full select-none font-sans">
      {/* Header & Search */}
      <div className="p-3.5 border-b border-[#282E33] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs uppercase text-[#ECEBE4] tracking-wide">
            Add Components
          </span>
          <span className="text-[11px] text-[#9CA3A8] font-mono">
            {STUDENT_COMPONENTS.length} items
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#646F77]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gates or switches..."
            className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-[#0E1012] border border-[#282E33] text-xs text-[#ECEBE4] placeholder:text-[#646F77] focus:outline-none focus:border-[#C6FF3D]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 font-mono text-[10px]">
          {(['all', 'inputs', 'gates', 'outputs'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded capitalize transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#1D2125] text-[#C6FF3D] border border-[#282E33] font-bold'
                  : 'text-[#9CA3A8] hover:text-[#ECEBE4]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Component List with Simple 1-Line Explanations */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filteredComponents.map((comp) => (
          <div
            key={comp.type}
            onClick={() => onAddComponent(comp.type)}
            className="group p-2.5 rounded-xl border border-[#282E33] bg-[#16191C] hover:border-[#525C64] hover:bg-[#1D2125] cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#0E1012] border border-[#282E33] group-hover:border-[#C6FF3D] flex items-center justify-center shrink-0">
                <GateSymbol type={comp.type} size={28} signal={0} />
              </div>
              <div className="text-left font-sans">
                <div className="text-xs font-bold text-[#ECEBE4] group-hover:text-[#3DDCFF] transition-colors">
                  {comp.label}
                </div>
                <div className="text-[10px] text-[#9CA3A8] leading-tight line-clamp-1">
                  {comp.simpleRule}
                </div>
              </div>
            </div>

            <button
              className="p-1 rounded bg-[#0E1012] border border-[#282E33] text-[#9CA3A8] group-hover:text-[#C6FF3D] group-hover:border-[#C6FF3D] transition-colors shrink-0"
              title="Add to canvas"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Helpful Hint Footer */}
      <div className="p-3 border-t border-[#282E33] text-[11px] text-[#9CA3A8] text-center">
        💡 <strong>Tip:</strong> Click any gate above to place it on the grid!
      </div>
    </aside>
  );
};
