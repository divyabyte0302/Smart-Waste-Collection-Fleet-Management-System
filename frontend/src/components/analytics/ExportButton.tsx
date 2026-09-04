import React, { useState, useRef, useEffect } from 'react';
import { Download, Printer, FileSpreadsheet, ChevronDown, Check } from 'lucide-react';

interface ExportButtonProps {
  onExportCSV: () => void;
  onPrint?: () => void;
  isExporting?: boolean;
  label?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExportCSV,
  onPrint = () => window.print(),
  isExporting = false,
  label = 'Export'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-sm disabled:opacity-50"
      >
        <Download className="w-3.5 h-3.5 text-eco-400" />
        <span>{isExporting ? 'Generating...' : label}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-xl z-30 py-1.5 animate-in fade-in duration-150">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onExportCSV();
            }}
            className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Download CSV Data</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onPrint();
            }}
            className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Report View</span>
          </button>
        </div>
      )}
    </div>
  );
};
