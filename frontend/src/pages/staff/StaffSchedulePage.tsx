import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { scheduleService } from '../../services/scheduleService';
import { Schedule, CollectionStatus } from '../../types/schedule.types';
import { Badge } from '../../components/common/Badge';
import {
  Calendar,
  Clock,
  MapPin,
  Truck,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Navigation,
  Check,
  CalendarDays
} from 'lucide-react';

export const StaffSchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const data = await scheduleService.getSchedules();
      setSchedules(data);
    } catch (err) {
      console.error('Failed to load today schedule:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: CollectionStatus) => {
    try {
      await scheduleService.updateStatus(id, newStatus);
      setActionNotice(`Route status successfully updated to "${newStatus}".`);
      fetchSchedules();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update schedule status.');
    }
  };

  const getStatusBadge = (status: CollectionStatus) => {
    switch (status) {
      case 'Collected':
        return <Badge variant="green">Collected</Badge>;
      case 'In Progress':
        return <Badge variant="blue">In Progress</Badge>;
      case 'Skipped':
        return <Badge variant="rose">Skipped</Badge>;
      default:
        return <Badge variant="amber">Pending</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-eco-400 uppercase tracking-wider">
                Daily Operations Terminal
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-eco-400"></span>
              <span className="text-xs text-slate-400">Route Execution</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Today's Collection Schedule</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Follow assigned sector routes, checkpoint milestones, and stream allocations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-eco-400" />
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Action Notice */}
        {actionNotice && (
          <div className="p-3.5 bg-eco-500/10 border border-eco-500/30 rounded-xl text-xs text-eco-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-eco-400" />
              {actionNotice}
            </span>
            <button onClick={() => setActionNotice(null)} className="text-eco-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Schedule Route Stops */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-eco-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-400">Synchronizing route GPS and checkpoints...</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-xl p-8">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No routes scheduled today</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              There are no active municipal route schedules currently assigned to your team.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((sch) => (
              <div
                key={sch.id}
                className={`p-5 rounded-xl border transition-all ${
                  sch.status === 'Collected'
                    ? 'bg-emerald-950/15 border-emerald-500/30'
                    : sch.status === 'In Progress'
                    ? 'bg-cyan-950/15 border-cyan-500/30'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-white">{sch.zone}</h3>
                      {getStatusBadge(sch.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1.5 text-eco-400 font-medium">
                        <Truck className="w-3.5 h-3.5" />
                        {sch.collectionType} • {sch.vehicleNumber}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {sch.dayOfWeek}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {sch.timeSlot}
                      </span>
                    </div>

                    {/* Checkpoints */}
                    {sch.checkpoints && sch.checkpoints.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                          Sequential Checkpoints:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {sch.checkpoints.map((cp, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md flex items-center gap-1.5"
                            >
                              <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-center">
                                {idx + 1}
                              </span>
                              {cp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Route Status Controls */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    <button
                      onClick={() => handleUpdateStatus(sch.id, 'In Progress')}
                      disabled={sch.status === 'In Progress'}
                      className="px-3.5 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Start Collection
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(sch.id, 'Collected')}
                      disabled={sch.status === 'Collected'}
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-40"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Route Completed
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(sch.id, 'Skipped')}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs transition-colors"
                      title="Mark as skipped / obstructed"
                    >
                      Skip Stop
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
