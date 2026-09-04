import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { CalendarView } from '../../components/schedules/CalendarView';
import { ScheduleCard } from '../../components/schedules/ScheduleCard';
import { Button } from '../../components/common/Button';
import { scheduleService } from '../../services/scheduleService';
import { Schedule, ScheduleStatus } from '../../types/schedule.types';
import { 
  Calendar as CalendarIcon, 
  List, 
  PlusCircle, 
  Search, 
  RefreshCw, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export const ScheduleManagementPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // View Mode: 'calendar' | 'list'
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Filters
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const fetchSchedules = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      const data = await scheduleService.getSchedules({
        search: search.trim() || undefined,
        area: areaFilter !== 'All' ? areaFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        date: dateFilter || undefined
      });
      setSchedules(data || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load collection schedules.');
    } finally {
      setIsLoading(false);
    }
  }, [search, areaFilter, statusFilter, dateFilter]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel and delete this collection schedule?')) return;
    try {
      await scheduleService.deleteSchedule(id);
      setSuccessMsg('Collection schedule removed successfully.');
      fetchSchedules();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete schedule.');
    }
  };

  const areas = [
    'All',
    'Downtown Central',
    'Metro North Residential',
    'Green Valley Eco-District',
    'Harbor Wharf District'
  ];

  const statuses = ['All', 'Scheduled', 'Active', 'Completed', 'Cancelled'];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-bold text-eco-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Municipal Fleet Dispatch
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Collection Schedule Management
            </h1>
            <p className="text-sm text-slate-400">
              Plan and dispatch weekly municipal route stops, assign compactor trucks, and manage driver timetables.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={fetchSchedules} isLoading={isLoading}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Refresh
            </Button>

            <Link to="/admin/schedules/create">
              <Button variant="primary" size="sm">
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Create Schedule
              </Button>
            </Link>
          </div>
        </div>

        {/* Feedback Alerts */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-3 text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Toolbar & Filter Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search area, vehicle ID, driver, or waste type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-eco-500"
              />
            </div>

            <div className="sm:col-span-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-eco-500"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a === 'All' ? 'All Areas' : a}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-eco-500"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    Status: {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-eco-500"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-end pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  viewMode === 'list'
                    ? 'bg-eco-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Cards / List
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-eco-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                Calendar View
              </button>
            </div>
          </div>
        </div>

        {/* Schedules Grid / Calendar */}
        {isLoading ? (
          <div className="h-64 bg-slate-900/40 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-2 border-eco-500 border-t-transparent rounded-full animate-spin mr-3" />
            <span className="text-sm">Fetching route schedules...</span>
          </div>
        ) : viewMode === 'calendar' ? (
          <CalendarView schedules={schedules} />
        ) : schedules.length === 0 ? (
          <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-12 text-center text-slate-400">
            <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-slate-200">No Schedules Found</h3>
            <p className="text-xs text-slate-400 mt-1">Adjust filters or create a new collection schedule.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schedules.map((s) => (
              <ScheduleCard
                key={s.id}
                schedule={s}
                isAdmin
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
