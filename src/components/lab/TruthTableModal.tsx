import React from 'react';
import { X, CheckCircle2, AlertTriangle, Table } from 'lucide-react';
import { TruthTableRow } from '../../types';
import { BenchButton } from '../common/BenchButton';

interface TruthTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  rows: TruthTableRow[];
  inputLabels: string[];
  outputLabels: string[];
}

export const TruthTableModal: React.FC<TruthTableModalProps> = ({
  isOpen,
  onClose,
  rows,
  inputLabels,
  outputLabels,
}) => {
  if (!isOpen) return null;

  const totalFailing = rows.filter((r) => !r.isPassing).length;
  const isAllPassing = totalFailing === 0 && rows.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none font-sans">
      <div className="w-full max-w-2xl rounded-2xl border border-[#282E33] bg-[#16191C] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1D2125] border-b border-[#282E33] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Table className="w-5 h-5 text-[#C6FF3D]" />
            <div>
              <span className="font-bold text-sm text-[#ECEBE4] block">
                Circuit Truth Table
              </span>
              <span className="text-xs text-[#9CA3A8]">
                Testing all 0 and 1 switch combinations
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9CA3A8] hover:text-[#ECEBE4] hover:bg-[#16191C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Result Summary Banner */}
        <div className="px-6 py-3.5 border-b border-[#282E33] bg-[#0E1012] flex items-center justify-between text-xs">
          {isAllPassing ? (
            <div className="flex items-center gap-2 text-[#C6FF3D] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Great Job! All {rows.length} test rows are 100% correct.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#FF4D4D] font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>{totalFailing} row(s) failed. See the red rows below to fix your gates.</span>
            </div>
          )}

          <span className="text-[#9CA3A8] font-mono text-[11px]">
            {rows.length} total states
          </span>
        </div>

        {/* Table Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#282E33] text-[#9CA3A8] text-xs uppercase font-bold">
                <th className="py-2.5 px-3">#</th>
                {inputLabels.map((inLabel) => (
                  <th key={inLabel} className="py-2.5 px-3 text-[#3DDCFF]">
                    {inLabel}
                  </th>
                ))}
                {outputLabels.map((outLabel) => (
                  <React.Fragment key={outLabel}>
                    <th className="py-2.5 px-3 text-[#ECEBE4]">Target Bulb</th>
                    <th className="py-2.5 px-3 text-[#ECEBE4]">Your Bulb</th>
                  </React.Fragment>
                ))}
                <th className="py-2.5 px-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2125]">
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    !row.isPassing
                      ? 'bg-[#FF4D4D]/10 text-[#FF4D4D]'
                      : 'hover:bg-[#1D2125]/50 text-[#ECEBE4]'
                  }`}
                >
                  <td className="py-3 px-3 text-[#646F77]">
                    #{idx + 1}
                  </td>

                  {inputLabels.map((inLabel) => (
                    <td key={inLabel} className="py-3 px-3 font-bold">
                      {row.inputs[inLabel] === 1 ? '1 (ON)' : '0 (OFF)'}
                    </td>
                  ))}

                  {outputLabels.map((outLabel) => (
                    <React.Fragment key={outLabel}>
                      <td className="py-3 px-3 text-[#9CA3A8]">
                        {row.expectedOutputs[outLabel] === 1 ? '1 (ON)' : '0 (OFF)'}
                      </td>
                      <td
                        className={`py-3 px-3 font-bold ${
                          row.isPassing ? 'text-[#C6FF3D]' : 'text-[#FF4D4D]'
                        }`}
                      >
                        {row.actualOutputs[outLabel] === 1 ? '1 (ON)' : '0 (OFF)'}
                      </td>
                    </React.Fragment>
                  ))}

                  <td className="py-3 px-3 text-right">
                    {row.isPassing ? (
                      <span className="text-[#C6FF3D] font-bold">PASS ✅</span>
                    ) : (
                      <span className="text-[#FF4D4D] font-bold">WRONG ❌</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#282E33] bg-[#1D2125] flex items-center justify-between text-xs">
          <span className="text-[#9CA3A8]">
            Need help? Ask the AI Study Buddy on the right panel!
          </span>
          <BenchButton variant="secondary" size="sm" onClick={onClose}>
            Close Table
          </BenchButton>
        </div>
      </div>
    </div>
  );
};
