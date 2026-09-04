import React, { useState } from 'react';

/**
 * 1. Bar Chart Visual Component
 */
interface BarItem {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

interface BarChartVisualProps {
  data: BarItem[];
  orientation?: 'vertical' | 'horizontal';
  height?: number;
  valueSuffix?: string;
}

export const BarChartVisual: React.FC<BarChartVisualProps> = ({
  data,
  orientation = 'horizontal',
  height = 240,
  valueSuffix = ''
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const defaultPalette = [
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#ec4899', // pink
    '#8b5cf6'  // purple
  ];

  if (orientation === 'horizontal') {
    return (
      <div className="w-full space-y-3 py-1">
        {data.map((item, idx) => {
          const pct = Math.round((item.value / maxValue) * 100);
          const color = item.color || defaultPalette[idx % defaultPalette.length];
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="group cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={`font-medium transition-colors ${isHovered ? 'text-white' : 'text-slate-300'}`}>
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  {item.percentage !== undefined && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.percentage}%
                    </span>
                  )}
                  <span className="font-mono font-bold text-white text-xs">
                    {item.value.toLocaleString()} {valueSuffix}
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: color,
                    boxShadow: isHovered ? `0 0 10px ${color}` : 'none'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical Bar Chart
  return (
    <div className="w-full flex flex-col justify-end" style={{ height: `${height}px` }}>
      <div className="flex items-end justify-around gap-2 h-full pb-6 pt-4 border-b border-slate-800">
        {data.map((item, idx) => {
          const pct = Math.max(Math.round((item.value / maxValue) * 100), 5);
          const color = item.color || defaultPalette[idx % defaultPalette.length];
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute -top-9 z-20 px-2 py-1 bg-slate-950 text-white font-mono text-[10px] rounded border border-slate-700 shadow-xl whitespace-nowrap animate-in fade-in">
                  {item.label}: <strong>{item.value}</strong>
                </div>
              )}

              {/* Bar */}
              <div
                className="w-full max-w-[36px] rounded-t-lg transition-all duration-500 hover:brightness-110"
                style={{
                  height: `${pct}%`,
                  backgroundColor: color,
                  boxShadow: isHovered ? `0 0 12px ${color}80` : 'none'
                }}
              />

              {/* Label */}
              <span className="text-[10px] text-slate-400 mt-2 truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 2. Area Trend Chart Visual (Smooth SVG Line & Gradient)
 */
interface TrendPoint {
  label: string;
  value: number;
}

interface AreaTrendVisualProps {
  data: TrendPoint[];
  height?: number;
  strokeColor?: string;
  fillColor?: string;
}

export const AreaTrendVisual: React.FC<AreaTrendVisualProps> = ({
  data,
  height = 180,
  strokeColor = '#10b981',
  fillColor = '#10b981'
}) => {
  const [activePoint, setActivePoint] = useState<TrendPoint | null>(null);

  if (!data || data.length === 0) return null;

  const width = 500;
  const paddingX = 30;
  const paddingY = 25;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const minVal = 0;

  const points = data.map((d, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * graphWidth;
    const y = paddingY + graphHeight - ((d.value - minVal) / (maxVal - minVal)) * graphHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div className="w-full relative">
      {activePoint && (
        <div className="absolute top-0 right-2 text-xs font-mono text-slate-300">
          {activePoint.label}: <strong className="text-eco-400">{activePoint.value} Pickups</strong>
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
        <line x1={paddingX} y1={paddingY + graphHeight / 2} x2={width - paddingX} y2={paddingY + graphHeight / 2} stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#334155" strokeOpacity="0.8" />

        {/* Area */}
        <path d={areaD} fill="url(#areaGradient)" />

        {/* Line */}
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />

        {/* Points */}
        {points.map((pt, idx) => (
          <g key={idx}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4"
              fill="#0f172a"
              stroke={strokeColor}
              strokeWidth="2.5"
              className="cursor-pointer hover:r-6 transition-all"
              onMouseEnter={() => setActivePoint(pt)}
              onMouseLeave={() => setActivePoint(null)}
            />
            <text
              x={pt.x}
              y={height - 8}
              textAnchor="middle"
              className="text-[9px] fill-slate-400 font-sans"
            >
              {pt.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

/**
 * 3. Donut Ring Visual Component
 */
interface DonutSegmentVisualProps {
  percentage: number;
  label: string;
  sublabel?: string;
  color?: string;
  size?: number;
}

export const DonutSegmentVisual: React.FC<DonutSegmentVisualProps> = ({
  percentage,
  label,
  sublabel,
  color = '#10b981',
  size = 140
}) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#1e293b"
            strokeWidth="10"
            fill="none"
          />
          {/* Active Arc */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Percentage */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold font-mono text-white leading-none">
            {percentage}%
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">Rate</span>
        </div>
      </div>

      <span className="text-xs font-semibold text-slate-200 mt-2 text-center">{label}</span>
      {sublabel && (
        <span className="text-[11px] text-slate-500 text-center">{sublabel}</span>
      )}
    </div>
  );
};
