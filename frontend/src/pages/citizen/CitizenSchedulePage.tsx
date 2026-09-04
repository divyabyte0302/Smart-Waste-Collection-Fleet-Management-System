import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { CalendarView } from '../../components/schedules/CalendarView';
import { ScheduleCard } from '../../components/schedules/ScheduleCard';
import { Button } from '../../components/common/Button';
import { scheduleService } from '../../services/scheduleService';
import { Schedule } from '../../types/schedule.types';
import { 
  Calendar as CalendarIcon, 
  List, 
  MapPin, 
  Search, 
  RefreshCw, 
  Filter, 
  LayoutGrid,
  AlertCircle
} from 'lucide-react';

export const CitizenSchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // View mode: 'calendar' | 'list'
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Filters
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const fetchSchedules = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      const data = await scheduleService.getSchedules({
        search: search.trim() || undefined,
        area: areaFilter !== 'All' ? areaFilter : undefined,
        date: dateFilter || undefined
      });
      setSchedules(data || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load collection schedule.');
    } finally {
      setIsLoading(false);
    }
  }, [search, areaFilter, dateFilter]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Unique areas for filter
  const areas = ['All', 'Downtown Central', 'Metro North Residential', 'Green Valley Eco-District', 'Harbor Wharf District'];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-bold text-eco-400 uppercase tracking-wider">
              <CalendarIcon className="w-4 h-4" />
              Municipal Timetable
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Neighborhood Collection Schedules
            </h1>
            <p className="text-sm text-slate-400">
              Check weekly curbside collection days, recyclable routing, and vehicle compactor stops across zones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={fetchSchedules} isLoading={isLoading}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Refresh
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg">
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
                Calendar
              </button>
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
                List View
              </button>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search area, route, waste type, or vehicle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-eco-500"
              />
            </div>

            {/* Area Filter */}
            <div className="sm:col-span-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-eco-500"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a === 'All' ? 'All Municipal Areas' : a}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="sm:col-span-3">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-eco-500"
                title="Filter by Specific Date"
              />
            </div>
          </div>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* View Rendering */}
        {isLoading ? (
          <div className="h-64 bg-slate-900/40 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-2 border-eco-500 border-t-transparent rounded-full animate-spin mr-3" />
            <span className="text-sm">Fetching neighborhood routes...</span>
          </div>
        ) : viewMode === 'calendar' ? (
          <CalendarView schedules={schedules} />
        ) : schedules.length === 0 ? (
          <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-12 text-center text-slate-400">
            <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-slate-600" />
            <h3 className="text-base font-semibold text-slate-200">No Schedules Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting area or date filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map((s) => (
              <ScheduleCard key={s.id} schedule={s} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
