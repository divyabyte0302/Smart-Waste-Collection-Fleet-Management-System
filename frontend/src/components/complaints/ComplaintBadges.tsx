import React from 'react';
import { ComplaintStatus, ComplaintPriority, ComplaintCategory } from '../../types/complaint.types';
import { 
  Clock, 
  Search, 
  UserCheck, 
  Truck, 
  CheckCircle2, 
  Archive, 
  AlertTriangle,
  Flame,
  Trash2,
  AlertCircle,
  Wrench,
  HelpCircle
} from 'lucide-react';

export const ComplaintStatusBadge: React.FC<{ status: ComplaintStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'sm'
}) => {
  const configs: Record<
    ComplaintStatus,
    { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    'Submitted': {
      label: 'Submitted',
      icon: <Clock className="w-3.5 h-3.5 mr-1" />,
      bg: 'bg-slate-800/80',
      text: 'text-slate-300',
      border: 'border-slate-700'
    },
    'Under Review': {
      label: 'Under Review',
      icon: <Search className="w-3.5 h-3.5 mr-1" />,
      bg: 'bg-sky-950/60',
      text: 'text-sky-400',
      border: 'border-sky-800/50'
    },
    'Assigned': {
      label: 'Assigned',
      icon: <UserCheck className="w-3.5 h-3.5 mr-1" />,
      bg: 'bg-indigo-950/60',
      text: 'text-indigo-400',
      border: 'border-indigo-800/50'
    },
    'In Progress': {
      label: 'In Progress',
      icon: <Truck className="w-3.5 h-3.5 mr-1" />,
      bg: 'bg-amber-950/60',
      text: 'text-amber-400',
      border: 'border-amber-800/50'
    },
    'Resolved': {
      label: 'Resolved',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-400',
      border: 'border-emerald-800/50'
    },
    'Closed': {
      label: 'Closed',
      icon: <Archive className="w-3.5 h-3.5 mr-1" />,
      bg: 'bg-slate-900/90',
      text: 'text-slate-400',
      border: 'border-slate-800'
    }
  };

  const config = configs[status] || configs['Submitted'];
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

export const ComplaintPriorityBadge: React.FC<{ priority: ComplaintPriority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'sm'
}) => {
  const configs: Record<
    ComplaintPriority,
    { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    'Low': {
      label: 'Low',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />,
      bg: 'bg-slate-800/60',
      text: 'text-slate-300',
      border: 'border-slate-700/60'
    },
    'Medium': {
      label: 'Medium',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mr-1.5" />,
      bg: 'bg-sky-950/50',
      text: 'text-sky-300',
      border: 'border-sky-800/40'
    },
    'High': {
      label: 'High Priority',
      icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />,
      bg: 'bg-amber-950/60',
      text: 'text-amber-300',
      border: 'border-amber-700/50'
    },
    'Urgent': {
      label: 'Urgent Dispatch',
      icon: <Flame className="w-3.5 h-3.5 mr-1 text-rose-400 animate-pulse" />,
      bg: 'bg-rose-950/70',
      text: 'text-rose-300 font-semibold',
      border: 'border-rose-700/60'
    }
  };

  const config = configs[priority] || configs['Medium'];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

export const ComplaintCategoryBadge: React.FC<{ category: ComplaintCategory }> = ({ category }) => {
  const getIcon = () => {
    switch (category) {
      case 'Missed Collection':
        return <Trash2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />;
      case 'Overflowing Bin':
        return <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-amber-400" />;
      case 'Illegal Dumping':
        return <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-rose-400" />;
      case 'Damaged Bin':
        return <Wrench className="w-3.5 h-3.5 mr-1.5 text-sky-400" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-slate-400" />;
    }
  };

  return (
    <span className="inline-flex items-center text-xs font-medium text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
      {getIcon()}
      {category}
    </span>
  );
};
