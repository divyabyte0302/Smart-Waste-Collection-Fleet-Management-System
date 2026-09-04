import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    text?: string;
  };
  variant?: 'eco' | 'cyan' | 'amber' | 'rose' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  variant = 'eco'
}) => {
  const variantStyles = {
    eco: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      valText: 'text-emerald-400'
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      valText: 'text-cyan-400'
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      valText: 'text-amber-400'
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      valText: 'text-rose-400'
    },
    slate: {
      border: 'border-slate-800 hover:border-slate-700',
      iconBg: 'bg-slate-800/80 text-slate-300 border-slate-700',
      valText: 'text-white'
    }
  };

  const style = variantStyles[variant];

  return (
    <div className={`bg-slate-900/70 border ${style.border} rounded-xl p-4.5 transition-all shadow-md group flex flex-col justify-between`}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-medium text-slate-400 leading-none">{title}</span>
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${style.iconBg} group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
      </div>

      <div>
        <p className={`text-2xl font-bold ${style.valText} tracking-tight font-mono`}>
          {value}
        </p>

        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1 text-[11px]">
            {trend && (
              <span className={`inline-flex items-center font-semibold ${trend.isPositive !== false ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trend.isPositive !== false ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {trend.value}
              </span>
            )}
            <span className="text-slate-500 truncate">
              {trend?.text || subtitle}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
