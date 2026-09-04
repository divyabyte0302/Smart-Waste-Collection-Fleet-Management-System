import React from 'react';
import { ComplaintStatus, ComplaintTimelineEvent } from '../../types/complaint.types';
import { 
  CheckCircle, 
  Clock, 
  Circle, 
  Search, 
  UserCheck, 
  Truck, 
  Archive 
} from 'lucide-react';

interface ComplaintTimelineProps {
  currentStatus: ComplaintStatus;
  events?: ComplaintTimelineEvent[];
}

const ORDERED_STAGES: { status: ComplaintStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'Submitted', label: 'Submitted', icon: <Clock className="w-4 h-4" /> },
  { status: 'Under Review', label: 'Review', icon: <Search className="w-4 h-4" /> },
  { status: 'Assigned', label: 'Assigned', icon: <UserCheck className="w-4 h-4" /> },
  { status: 'In Progress', label: 'In Progress', icon: <Truck className="w-4 h-4" /> },
  { status: 'Resolved', label: 'Resolved', icon: <CheckCircle className="w-4 h-4" /> },
  { status: 'Closed', label: 'Closed', icon: <Archive className="w-4 h-4" /> }
];

export const ComplaintTimeline: React.FC<ComplaintTimelineProps> = ({ currentStatus, events = [] }) => {
  const currentIndex = ORDERED_STAGES.findIndex(s => s.status === currentStatus);

  return (
    <div className="space-y-8">
      {/* 1. Visual Progress Stepper */}
      <div className="relative">
        <div className="overflow-x-auto pb-4 pt-2">
          <div className="min-w-[540px] flex items-center justify-between relative px-2">
            {/* Connecting Bar */}
            <div className="absolute top-5 left-8 right-8 h-1 bg-slate-800 -z-0">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentIndex) / (ORDERED_STAGES.length - 1)) * 100}%`
                }}
              />
            </div>

            {ORDERED_STAGES.map((stage, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              let nodeClasses = 'border-slate-700 bg-slate-900 text-slate-500';
              if (isPast) {
                nodeClasses = 'border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/30';
              } else if (isCurrent) {
                nodeClasses = 'border-sky-400 bg-sky-500/30 text-sky-300 ring-4 ring-sky-500/20 animate-pulse';
              }

              return (
                <div key={stage.status} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${nodeClasses}`}
                  >
                    {isPast ? <CheckCircle className="w-5 h-5" /> : stage.icon}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium tracking-tight text-center whitespace-nowrap ${
                      isCurrent
                        ? 'text-sky-400 font-semibold'
                        : isPast
                        ? 'text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Detailed Event Log */}
      {events && events.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Chronological Activity Log
          </h4>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {events.map((evt, i) => (
              <div key={i} className="relative group">
                {/* Node dot */}
                <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full border-2 border-slate-900 bg-emerald-400 group-hover:scale-125 transition-transform" />

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-1 hover:border-slate-700 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-200">{evt.title}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(evt.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {evt.description && (
                    <p className="text-xs text-slate-400 leading-relaxed">{evt.description}</p>
                  )}

                  <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                    <Circle className="w-1.5 h-1.5 fill-current text-eco-400" />
                    <span>Logged by: {evt.updatedBy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
