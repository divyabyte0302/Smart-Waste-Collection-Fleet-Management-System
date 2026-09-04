import React, { useState } from 'react';
import { Schedule } from '../../types/schedule.types';
import { ScheduleStatusBadge } from './ScheduleStatusBadge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Truck, UserCheck } from 'lucide-react';

interface CalendarViewProps {
  schedules: Schedule[];
  onSelectSchedule?: (schedule: Schedule) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ schedules, onSelectSchedule }) => {
  // Current calendar viewing month (default September 2026)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // Month index 8 is September
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Find schedules for a given day
  const getSchedulesForDay = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return schedules.filter((s) => s.collectionDate === formattedDate);
  };

  const selectedDaySchedules = selectedDay ? getSchedulesForDay(selectedDay) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header with Controls */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-eco-400" />
          <h2 className="text-base sm:text-lg font-bold text-slate-100">
            {monthNames[month]} {year}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-800 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/60 py-2.5">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-800/60 text-xs">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[90px] sm:min-h-[110px] bg-slate-950/30" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const daySchedules = getSchedulesForDay(day);
            const isSelected = selectedDay === day;

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`min-h-[90px] sm:min-h-[110px] p-2 flex flex-col justify-between cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-eco-500/10 ring-2 ring-inset ring-eco-500'
                    : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-eco-500 text-white'
                        : daySchedules.length > 0
                        ? 'text-eco-400 font-extrabold'
                        : 'text-slate-400'
                    }`}
                  >
                    {day}
                  </span>

                  {daySchedules.length > 0 && (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {daySchedules.length}
                    </span>
                  )}
                </div>

                {/* Day Schedules mini chips */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  {daySchedules.slice(0, 2).map((s) => (
                    <div
                      key={s.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectSchedule) onSelectSchedule(s);
                      }}
                      className="truncate text-[10px] font-medium p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60"
                      title={`${s.wasteType || s.collectionType} - ${s.area || s.zone}`}
                    >
                      <span className="text-eco-400 font-semibold mr-1">●</span>
                      {s.area || s.zone}
                    </div>
                  ))}
                  {daySchedules.length > 2 && (
                    <div className="text-[9px] text-slate-500 font-semibold pl-1">
                      +{daySchedules.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Panel */}
      {selectedDay && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-eco-400" />
              Schedules for {monthNames[month]} {selectedDay}, {year}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedDay(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
          </div>

          {selectedDaySchedules.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">
              No collection routes scheduled for this date.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDaySchedules.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-eco-400">
                      {s.scheduleId || `SCH-${s.id.substring(0, 6)}`}
                    </span>
                    <ScheduleStatusBadge status={s.status} />
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-eco-400" />
                    {s.area || s.zone}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {s.startTime} - {s.endTime}
                    </span>
                    <span className="text-slate-300 font-semibold">{s.wasteType || s.collectionType}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-sky-400" />
                      {s.vehicleId || s.vehicleNumber || 'TRK-101'}
                    </span>
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-eco-400" />
                      {s.staffName || s.assignedStaffName || 'Field Crew'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
