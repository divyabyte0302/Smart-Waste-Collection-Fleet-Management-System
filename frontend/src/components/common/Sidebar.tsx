import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Truck,
  AlertTriangle,
  User,
  PackagePlus,
  BarChart3,
  ShieldCheck,
  MapPin,
  ClipboardList,
  Radar,
  FileWarning,
  PackageCheck,
  Boxes,
  CalendarDays,
  FileText
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
      isActive
        ? 'bg-gradient-to-r from-eco-500/20 to-city-500/10 text-eco-400 border border-eco-500/30 font-semibold'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
    }`;

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between">
      <div className="space-y-5">
        {/* Role Portal Header */}
        <div className="px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Workspace
          </span>
          <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
            {user.role === 'Administrator' && <ShieldCheck className="w-4 h-4 text-rose-400" />}
            {user.role === 'Collection Staff' && <Truck className="w-4 h-4 text-cyan-400" />}
            {user.role === 'Citizen' && <User className="w-4 h-4 text-eco-400" />}
            {user.role} Hub
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {/* Administrator Links */}
          {user.role === 'Administrator' && (
            <>
              <div className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Core Operations
              </div>
              <NavLink to="/admin" end className={linkStyles}>
                <LayoutDashboard className="w-4 h-4" />
                Operations Overview
              </NavLink>
              <NavLink to="/admin/complaints" className={linkStyles}>
                <FileWarning className="w-4 h-4 text-amber-400" />
                Complaints Console
              </NavLink>

              <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Fleet & Logistics
              </div>
              <NavLink to="/admin/vehicles" className={linkStyles}>
                <Truck className="w-4 h-4 text-emerald-400" />
                Vehicle Fleet
              </NavLink>
              <NavLink to="/admin/staff" className={linkStyles}>
                <Users className="w-4 h-4 text-cyan-400" />
                Collection Staff
              </NavLink>
              <NavLink to="/admin/assignments" className={linkStyles}>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Fleet Assignments
              </NavLink>
              <NavLink to="/admin/pickups" className={linkStyles}>
                <PackageCheck className="w-4 h-4 text-sky-400" />
                Pickup Management
              </NavLink>
              <NavLink to="/admin/schedules" className={linkStyles}>
                <CalendarDays className="w-4 h-4 text-eco-400" />
                Schedule Management
              </NavLink>
              <NavLink to="/admin/users" className={linkStyles}>
                <Users className="w-4 h-4" />
                User Accounts
              </NavLink>

              <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Intelligence & Audits
              </div>
              <NavLink to="/admin/analytics" className={linkStyles}>
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Operations Analytics
              </NavLink>
              <NavLink to="/admin/reports" className={linkStyles}>
                <FileText className="w-4 h-4 text-cyan-400" />
                Municipal Reports
              </NavLink>
            </>
          )}

          {/* Collection Staff Links */}
          {user.role === 'Collection Staff' && (
            <>
              <div className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Field Operations
              </div>
              <NavLink to="/staff" end className={linkStyles}>
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                My Dashboard
              </NavLink>
              <NavLink to="/staff/schedule" className={linkStyles}>
                <CalendarDays className="w-4 h-4 text-eco-400" />
                Today's Schedule
              </NavLink>
              <NavLink to="/staff/pickups" className={linkStyles}>
                <Boxes className="w-4 h-4 text-sky-400" />
                Assigned Pickups
              </NavLink>
              <NavLink to="/staff/history" className={linkStyles}>
                <ClipboardList className="w-4 h-4 text-amber-400" />
                Service History
              </NavLink>
            </>
          )}

          {/* Citizen Links */}
          {user.role === 'Citizen' && (
            <>
              <NavLink to="/citizen" end className={linkStyles}>
                <LayoutDashboard className="w-4 h-4" />
                My Waste Portal
              </NavLink>

              <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Issue Reporting
              </div>
              <NavLink to="/citizen/report-issue" className={linkStyles}>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Report Waste Issue
              </NavLink>
              <NavLink to="/citizen/my-complaints" className={linkStyles}>
                <ClipboardList className="w-4 h-4 text-eco-400" />
                My Complaints
              </NavLink>
              <NavLink to="/citizen/tracking" className={linkStyles}>
                <Radar className="w-4 h-4 text-sky-400" />
                Track Complaint
              </NavLink>

              <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                On-Demand & Routes
              </div>
              <NavLink to="/citizen/request-pickup" className={linkStyles}>
                <PackagePlus className="w-4 h-4 text-cyan-400" />
                Request Waste Pickup
              </NavLink>
              <NavLink to="/citizen/my-pickups" className={linkStyles}>
                <Boxes className="w-4 h-4 text-eco-400" />
                My Pickup Requests
              </NavLink>
              <NavLink to="/citizen/pickup-tracking" className={linkStyles}>
                <Radar className="w-4 h-4 text-indigo-400" />
                Track Pickup
              </NavLink>
              <NavLink to="/citizen/schedule" className={linkStyles}>
                <CalendarDays className="w-4 h-4 text-amber-400" />
                Collection Schedules
              </NavLink>
            </>
          )}

          {/* Common Profile Link */}
          <div className="pt-3 border-t border-slate-800/80">
            <NavLink to="/profile" className={linkStyles}>
              <User className="w-4 h-4" />
              Account & Profile
            </NavLink>
          </div>
        </nav>
      </div>

      {/* Municipal Status Footer */}
      <div className="p-3 bg-slate-900/40 border border-slate-800/60 rounded-lg text-xs text-slate-400">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-eco-400 animate-pulse"></span>
          <span className="font-semibold text-slate-300">Sanitation Grid Online</span>
        </div>
        <p className="text-[11px] text-slate-500">PostgreSQL Cloud Ready • v2.0</p>
      </div>
    </aside>
  );
};
