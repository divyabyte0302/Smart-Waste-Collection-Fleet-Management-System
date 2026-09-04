import React from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, Mail, Truck, MapPin, ChevronRight, Award, Shield } from 'lucide-react';
import { StaffMember } from '../../types/staff.types';
import { StaffStatusBadge } from './StaffStatusBadge';
import { StaffRoleBadge } from './StaffRoleBadge';

interface StaffCardProps {
  staff: StaffMember;
  onStatusChange?: (id: string, status: any) => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({ staff, onStatusChange }) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 transition-all shadow-md group flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <StaffRoleBadge role={staff.role} />
                <StaffStatusBadge status={staff.status} />
              </div>
              <h4 className="text-base font-bold text-white tracking-wide mt-1">
                {staff.name}
              </h4>
              <span className="text-[11px] font-mono text-slate-400 block">
                {staff.employeeId} • {staff.staffId}
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Assignment Details */}
        <div className="space-y-2 py-3 border-y border-slate-800/80 my-3 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Email:
            </span>
            <span className="font-medium text-slate-200 truncate max-w-[160px]" title={staff.email}>
              {staff.email}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Phone:
            </span>
            <span className="font-medium text-slate-200">{staff.phone || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Vehicle:
            </span>
            <span className="font-medium text-eco-400">
              {staff.assignedVehicle || <span className="text-slate-500 italic">None</span>}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Zone:
            </span>
            <span className="font-medium text-slate-200">{staff.assignedArea || 'Unassigned'}</span>
          </div>
        </div>

        {staff.shiftNotes && (
          <p className="text-[11px] text-slate-400 italic line-clamp-2 mb-3 bg-slate-950/50 p-2 rounded-lg border border-slate-800/60">
            "{staff.shiftNotes}"
          </p>
        )}
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/50">
        <Link
          to={`/admin/staff/${staff.id || staff.staffId}`}
          className="flex-1 text-center py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-1.5"
        >
          Staff Profile & Duty
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        {onStatusChange && (
          <select
            value={staff.status}
            onChange={(e) => onStatusChange(staff.id || staff.staffId, e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 rounded-lg text-xs py-2 px-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            title="Quick update duty status"
          >
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="On Duty">On Duty</option>
            <option value="Inactive">Inactive</option>
          </select>
        )}
      </div>
    </div>
  );
};
