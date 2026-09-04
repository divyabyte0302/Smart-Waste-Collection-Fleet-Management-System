import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { staffService } from '../../services/staffService';
import { StaffMember, StaffStats, StaffRole, StaffStatus } from '../../types/staff.types';
import { StaffCard } from '../../components/staff/StaffCard';
import { StaffStatusBadge } from '../../components/staff/StaffStatusBadge';
import { StaffRoleBadge } from '../../components/staff/StaffRoleBadge';
import {
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  LayoutGrid,
  ListFilter,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Truck
} from 'lucide-react';

export const StaffManagementPage: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [stats, setStats] = useState<StaffStats>({
    total: 0,
    drivers: 0,
    collectors: 0,
    supervisors: 0,
    available: 0,
    assigned: 0,
    onDuty: 0,
    inactive: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const res = await staffService.getStaff({
        search: search || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined
      });
      setStaffList(res.staff);
      setStats(res.stats);
    } catch (err) {
      console.error('Failed to load collection staff:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStaff();
  };

  const handleStatusChange = async (id: string, newStatus: StaffStatus) => {
    try {
      await staffService.updateStaff(id, { status: newStatus });
      setActionNotice(`Staff member status changed to "${newStatus}".`);
      fetchStaff();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update staff status.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove staff member ${name} from active roster?`)) {
      return;
    }
    try {
      await staffService.deleteStaff(id);
      setActionNotice(`Staff member ${name} removed from roster.`);
      fetchStaff();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to delete staff member.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Sanitation Workforce & Crews
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="text-xs text-slate-400">Personnel Roster</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Collection Staff Management</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Supervise municipal drivers, collection teams, and field supervisors across service zones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/assignments"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Assignment Dispatch
            </Link>
            <Link
              to="/admin/staff/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              Add Staff Member
            </Link>
          </div>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              {actionNotice}
            </span>
            <button onClick={() => setActionNotice(null)} className="text-cyan-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Staff KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Crew</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{stats.total}</p>
            <span className="text-[10px] text-slate-500">Active personnel</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-emerald-400 text-xs">
              <span>On Duty</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-2">{stats.onDuty}</p>
            <span className="text-[10px] text-slate-500">Currently deployed</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-cyan-400 text-xs">
              <span>Available</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-cyan-400 mt-2">{stats.available}</p>
            <span className="text-[10px] text-slate-500">Ready for assignment</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-blue-400 text-xs">
              <span>Drivers</span>
              <Truck className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400 mt-2">{stats.drivers}</p>
            <span className="text-[10px] text-slate-500">Licensed operators</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-rose-400 text-xs">
              <span>Supervisors</span>
              <ShieldCheck className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-bold text-rose-400 mt-2">{stats.supervisors}</p>
            <span className="text-[10px] text-slate-500">Field coordinators</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, employee ID, email, vehicle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="">All Roles</option>
              <option value="Driver">Driver</option>
              <option value="Waste Collector">Waste Collector</option>
              <option value="Supervisor">Supervisor</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="">All Statuses</option>
              <option value="On Duty">On Duty</option>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content View */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-400">Loading collection personnel roster...</p>
          </div>
        ) : staffList.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-xl p-8">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No staff members found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              No personnel match your search filters. Try clearing criteria or register a new crew member.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearch('');
                  setRoleFilter('');
                  setStatusFilter('');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Clear Filters
              </button>
              <Link
                to="/admin/staff/new"
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
              >
                Add Staff Member
              </Link>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {staffList.map((s) => (
              <StaffCard
                key={s.id || s.staffId}
                staff={s}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Name & ID</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Assigned Vehicle</th>
                    <th className="py-3 px-4">Zone</th>
                    <th className="py-3 px-4">Duty Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {staffList.map((s) => (
                    <tr key={s.id || s.staffId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-white block">{s.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {s.employeeId} • {s.staffId}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StaffRoleBadge role={s.role} />
                      </td>
                      <td className="py-3 px-4">
                        <span className="block text-slate-300">{s.email}</span>
                        <span className="text-[11px] text-slate-500">{s.phone || 'N/A'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-eco-400">
                          {s.assignedVehicle || <span className="text-slate-500 italic">None</span>}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{s.assignedArea || 'Central'}</td>
                      <td className="py-3 px-4">
                        <StaffStatusBadge status={s.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/staff/${s.id || s.staffId}`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View Profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(s.id || s.staffId, s.name)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Remove Staff"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
