import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  badge,
  actions,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
            {badge && (
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-eco-500/10 text-eco-400 border border-eco-500/20">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Chart Body */}
      <div className="flex-1 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
