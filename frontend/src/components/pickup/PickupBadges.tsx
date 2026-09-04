import React from 'react';
import { PickupStatus, WasteType } from '../../types/pickup.types';
import { 
  Clock, 
  CheckCircle, 
  Calendar, 
  UserCheck, 
  CheckCheck, 
  XCircle,
  Trash2,
  Recycle,
  Cpu,
  Package,
  Leaf,
  HelpCircle
} from 'lucide-react';

export const PickupStatusBadge: React.FC<{ status: PickupStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'sm'
}) => {
  const configs: Record<
    PickupStatus,
    { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    'Pending': {
      label: 'Pending Approval',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-amber-400" />,
      bg: 'bg-amber-950/60',
      text: 'text-amber-300',
      border: 'border-amber-800/50'
    },
    'Approved': {
      label: 'Approved',
      icon: <CheckCircle className="w-3.5 h-3.5 mr-1 text-sky-400" />,
      bg: 'bg-sky-950/60',
      text: 'text-sky-300',
      border: 'border-sky-800/50'
    },
    'Scheduled': {
      label: 'Scheduled',
      icon: <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-400" />,
      bg: 'bg-indigo-950/60',
      text: 'text-indigo-300',
      border: 'border-indigo-800/50'
    },
    'Assigned': {
      label: 'Crew Assigned',
      icon: <UserCheck className="w-3.5 h-3.5 mr-1 text-cyan-400" />,
      bg: 'bg-cyan-950/60',
      text: 'text-cyan-300',
      border: 'border-cyan-800/50'
    },
    'Completed': {
      label: 'Completed',
      icon: <CheckCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />,
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-300',
      border: 'border-emerald-800/50'
    },
    'Cancelled': {
      label: 'Cancelled',
      icon: <XCircle className="w-3.5 h-3.5 mr-1 text-rose-400" />,
      bg: 'bg-rose-950/60',
      text: 'text-rose-400',
      border: 'border-rose-800/50'
    }
  };

  const config = configs[status] || configs['Pending'];
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

export const WasteTypeBadge: React.FC<{ wasteType: WasteType }> = ({ wasteType }) => {
  const getIcon = () => {
    switch (wasteType) {
      case 'Household Waste':
        return <Trash2 className="w-3.5 h-3.5 mr-1.5 text-slate-400" />;
      case 'Recyclable Waste':
        return <Recycle className="w-3.5 h-3.5 mr-1.5 text-eco-400" />;
      case 'Electronic Waste':
        return <Cpu className="w-3.5 h-3.5 mr-1.5 text-sky-400" />;
      case 'Bulk Waste':
        return <Package className="w-3.5 h-3.5 mr-1.5 text-amber-400" />;
      case 'Garden Waste':
        return <Leaf className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-slate-400" />;
    }
  };

  return (
    <span className="inline-flex items-center text-xs font-semibold text-slate-200 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
      {getIcon()}
      {wasteType}
    </span>
  );
};
