import React from 'react';
import { ScheduleStatus } from '../../types/schedule.types';
import { Clock, PlayCircle, CheckCircle2, XCircle } from 'lucide-react';

export const ScheduleStatusBadge: React.FC<{ status: ScheduleStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'sm'
}) => {
  const configs: Record<
    string,
    { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    'Scheduled': {
      label: 'Scheduled',
      icon: <Clock className="w-3.5 h-3.5 mr-1" />,
      bg: 'bg-indigo-950/60',
      text: 'text-indigo-300',
      border: 'border-indigo-800/50'
    },
    'Active': {
      label: 'Active En Route',
      icon: <PlayCircle className="w-3.5 h-3.5 mr-1 text-amber-400" />,
      bg: 'bg-amber-950/60',
      text: 'text-amber-300',
      border: 'border-amber-800/50'
    },
    'In Progress': {
      label: 'In Progress',
      icon: <PlayCircle className="w-3.5 h-3.5 mr-1 text-amber-400" />,
      bg: 'bg-amber-950/60',
      text: 'text-amber-300',
      border: 'border-amber-800/50'
    },
    'Completed': {
      label: 'Completed',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />,
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-300',
      border: 'border-emerald-800/50'
    },
    'Collected': {
      label: 'Collected',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />,
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-300',
      border: 'border-emerald-800/50'
    },
    'Cancelled': {
      label: 'Cancelled',
      icon: <XCircle className="w-3.5 h-3.5 mr-1 text-rose-400" />,
      bg: 'bg-rose-950/60',
      text: 'text-rose-300',
      border: 'border-rose-800/50'
    },
    'Pending': {
      label: 'Pending',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />,
      bg: 'bg-slate-900',
      text: 'text-slate-400',
      border: 'border-slate-700'
    }
  };

  const config = configs[status] || configs['Scheduled'];
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};
