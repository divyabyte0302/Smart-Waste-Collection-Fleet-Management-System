import React from 'react';
import { FileText, Loader2 } from 'lucide-react';

interface HeaderDef {
  label: string;
  key: string;
  className?: string;
}

interface ReportTableProps {
  headers: HeaderDef[];
  rows: Record<string, any>[];
  summaryFooter?: React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
}

export const ReportTable: React.FC<ReportTableProps> = ({
  headers,
  rows,
  summaryFooter,
  isLoading = false,
  emptyMessage = 'No records available for the selected filter criteria.'
}) => {
  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center">
        <Loader2 className="w-7 h-7 text-eco-400 animate-spin mb-2" />
        <p className="text-xs">Generating report data table...</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-xl p-6">
        <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-semibold text-white">Empty Report</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              {headers.map((h) => (
                <th key={h.key} className={`py-3 px-4 ${h.className || ''}`}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {rows.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-slate-800/40 transition-colors">
                {headers.map((h) => {
                  const val = row[h.key];

                  // Special styling for status badges or IDs
                  if (h.key === 'status') {
                    const isSuccess = val === 'Completed' || val === 'Resolved' || val === 'Collected';
                    const isWarn = val === 'In Progress' || val === 'Scheduled' || val === 'Under Review';
                    const isDanger = val === 'Cancelled' || val === 'Skipped';

                    return (
                      <td key={h.key} className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            isSuccess
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : isWarn
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : isDanger
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          }`}
                        >
                          {val}
                        </span>
                      </td>
                    );
                  }

                  if (h.key === 'id') {
                    return (
                      <td key={h.key} className="py-3 px-4 font-mono font-bold text-white">
                        {val}
                      </td>
                    );
                  }

                  return (
                    <td key={h.key} className={`py-3 px-4 ${h.className || ''}`}>
                      {val !== null && val !== undefined ? String(val) : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {summaryFooter && (
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-300">
          {summaryFooter}
        </div>
      )}
    </div>
  );
};
