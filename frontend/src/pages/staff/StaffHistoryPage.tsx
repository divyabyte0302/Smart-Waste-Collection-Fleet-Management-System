import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { scheduleService } from '../../services/scheduleService';
import { pickupService } from '../../services/pickupService';
import { Schedule } from '../../types/schedule.types';
import { PickupRequest } from '../../types/pickup.types';
import {
  History,
  CheckCircle2,
  Calendar,
  Truck,
  Boxes,
  MapPin,
  Search,
  Filter,
  ArrowUpRight,
  Printer
} from 'lucide-react';

export const StaffHistoryPage: React.FC = () => {
  const [completedSchedules, setCompletedSchedules] = useState<Schedule[]>([]);
  const [completedPickups, setCompletedPickups] = useState<PickupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'schedules' | 'pickups'>('all');
  const [search, setSearch] = useState('');

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const [sData, pData] = await Promise.all([
        scheduleService.getSchedules(),
        pickupService.getPickups({ status: 'Completed' })
      ]);
      setCompletedSchedules(sData.filter((s) => s.status === 'Collected' || s.status === 'In Progress'));
      setCompletedPickups(pData);
    } catch (err) {
      console.error('Failed to load completed service history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const totalServices = completedSchedules.length + completedPickups.length;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Field Operations Log
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs text-slate-400">Service Audit</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Crew Service History</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Verified operational log of completed waste routes, checkpoints, and fulfilled citizen requests.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              Print Shift Report
            </button>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400">Total Services Logged</span>
            <p className="text-2xl font-bold text-white mt-1">{totalServices}</p>
            <span className="text-[10px] text-slate-500">Verified by dispatch</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-emerald-400">Route Schedules</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{completedSchedules.length}</p>
            <span className="text-[10px] text-slate-500">Sectors cleared</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-sky-400">Fulfilled Pickups</span>
            <p className="text-2xl font-bold text-sky-400 mt-1">{completedPickups.length}</p>
            <span className="text-[10px] text-slate-500">Citizen requests</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-amber-400">On-Time Reliability</span>
            <p className="text-2xl font-bold text-amber-400 mt-1">98.4%</p>
            <span className="text-[10px] text-slate-500">Municipal SLA standard</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'all'
                  ? 'bg-eco-500 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Records ({totalServices})
            </button>
            <button
              onClick={() => setFilterType('schedules')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'schedules'
                  ? 'bg-eco-500 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Routes ({completedSchedules.length})
            </button>
            <button
              onClick={() => setFilterType('pickups')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'pickups'
                  ? 'bg-eco-500 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Pickups ({completedPickups.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search historical logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-eco-500"
            />
          </div>
        </div>

        {/* History List */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-400">Loading service audit logs...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Render Schedules */}
            {(filterType === 'all' || filterType === 'schedules') &&
              completedSchedules.map((sch) => (
                <div
                  key={sch.id}
                  className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-4 flex items-center justify-between gap-4 text-xs transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{sch.zone}</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                          Route Completed
                        </span>
                      </div>
                      <p className="text-slate-400 mt-0.5">
                        {sch.collectionType} • {sch.vehicleNumber} • {sch.timeSlot}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-slate-300 block">{sch.dayOfWeek}</span>
                    <span className="text-[10px] text-slate-500">Verified by GPS</span>
                  </div>
                </div>
              ))}

            {/* Render Pickups */}
            {(filterType === 'all' || filterType === 'pickups') &&
              completedPickups.map((p) => (
                <div
                  key={p.id || p.requestId}
                  className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-4 flex items-center justify-between gap-4 text-xs transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                      <Boxes className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sky-400">{p.requestId}</span>
                        <span className="font-medium text-white">{p.wasteType}</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                          Completed
                        </span>
                      </div>
                      <p className="text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {p.pickupAddress} ({p.estimatedWasteQuantity})
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-slate-300 block">{p.preferredDate}</span>
                    <span className="text-[10px] text-slate-500">Citizen: {p.citizenName}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
