import React from 'react';
import { Link } from 'react-router-dom';
import { Schedule } from '../../types/schedule.types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ScheduleStatusBadge } from './ScheduleStatusBadge';
import { MapPin, Calendar, Clock, Truck, UserCheck, Edit, Trash2 } from 'lucide-react';

interface ScheduleCardProps {
  schedule: Schedule;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  isAdmin = false,
  onDelete
}) => {
  const displayArea = schedule.area || schedule.zone || 'Metro Municipal District';
  const displayWaste = schedule.wasteType || schedule.collectionType || 'Household Waste';
  const displayVehicle = schedule.vehicleId || schedule.vehicleNumber || 'TRK-101';
  const displayStaff = schedule.staffName || schedule.assignedStaffName || 'Field Operative';
  const displayTime =
    schedule.startTime && schedule.endTime
      ? `${schedule.startTime} - ${schedule.endTime}`
      : schedule.timeSlot || '08:00 AM - 12:00 PM';

  return (
    <Card hoverEffect className="flex flex-col justify-between overflow-hidden">
      <div className="space-y-3">
        {/* Top bar with ID & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-eco-400 bg-eco-500/10 px-2 py-0.5 rounded border border-eco-500/20">
              {schedule.scheduleId || `SCH-${schedule.id.substring(0, 6)}`}
            </span>
            <span className="text-xs font-semibold text-slate-200 bg-slate-800 px-2.5 py-0.5 rounded">
              {displayWaste}
            </span>
          </div>
          <ScheduleStatusBadge status={schedule.status} />
        </div>

        {/* Area & Date info */}
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-eco-400 shrink-0" />
            {displayArea}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              {schedule.collectionDate || schedule.dayOfWeek || 'Scheduled'}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {displayTime}
            </span>
          </div>
        </div>

        {/* Vehicle and Crew metadata */}
        <div className="pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 truncate">
            <Truck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">{displayVehicle}</span>
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <UserCheck className="w-3.5 h-3.5 text-eco-400 shrink-0" />
            <span className="truncate">{displayStaff}</span>
          </div>
        </div>
      </div>

      {/* Admin Action Footer */}
      {isAdmin && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
          <Link to={`/admin/schedules/${schedule.id}/edit`}>
            <Button variant="secondary" size="sm" className="text-xs py-1 px-3">
              <Edit className="w-3.5 h-3.5 mr-1" />
              Edit
            </Button>
          </Link>

          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(schedule.id)}
              className="text-xs py-1 px-2.5"
              title="Delete or Cancel Schedule"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
