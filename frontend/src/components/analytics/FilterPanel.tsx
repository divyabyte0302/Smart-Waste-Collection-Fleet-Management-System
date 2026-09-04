import React from 'react';
import { Filter, Calendar, MapPin, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
  selectedArea: string;
  onAreaChange: (area: string) => void;
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  onReset?: () => void;
  areas?: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedRange,
  onRangeChange,
  selectedArea,
  onAreaChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
  areas = [
    'All',
    'Downtown Central',
    'Metro North Residential',
    'Green Valley Eco-District',
    'Industrial Harbor Yard',
    'Westside Commercial Corridor'
  ]
}) => {
  const rangeOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Year-to-Date', value: 'ytd' },
    { label: 'Custom', value: 'custom' }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Date Range Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
          <Calendar className="w-3.5 h-3.5 text-eco-400" />
          <span className="hidden sm:inline">Timeline:</span>
        </div>
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
          {rangeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onRangeChange(opt.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                selectedRange === opt.value
                  ? 'bg-gradient-to-r from-eco-500 to-city-500 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Pickers when 'custom' is selected */}
      {selectedRange === 'custom' && onStartDateChange && onEndDateChange && (
        <div className="flex items-center gap-2 text-xs">
          <input
            type="date"
            value={startDate || ''}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-eco-500"
          />
          <span className="text-slate-500">to</span>
          <input
            type="date"
            value={endDate || ''}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-eco-500"
          />
        </div>
      )}

      {/* Area Filter and Reset */}
      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
        <div className="relative">
          <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedArea}
            onChange={(e) => onAreaChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-eco-500"
          >
            {areas.map((a) => (
              <option key={a} value={a}>
                {a === 'All' ? 'All Municipal Sectors' : a}
              </option>
            ))}
          </select>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
