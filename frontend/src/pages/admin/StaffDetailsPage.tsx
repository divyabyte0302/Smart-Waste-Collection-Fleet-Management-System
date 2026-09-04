import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { staffService } from '../../services/staffService';
import { vehicleService } from '../../services/vehicleService';
import { StaffMember, StaffRole, StaffStatus } from '../../types/staff.types';
import { Vehicle } from '../../types/vehicle.types';
import { StaffStatusBadge } from '../../components/staff/StaffStatusBadge';
import { StaffRoleBadge } from '../../components/staff/StaffRoleBadge';
import {
  Users,
  ArrowLeft,
  Mail,
  Phone,
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Save,
  RotateCcw,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const StaffDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Form states for profile editing
  const [status, setStatus] = useState<StaffStatus>('Available');
  const [role, setRole] = useState<StaffRole>('Driver');
  const [assignedVehicle, setAssignedVehicle] = useState('');
  const [assignedArea, setAssignedArea] = useState('');
  const [shiftNotes, setShiftNotes] = useState('');

  const fetchStaffDetails = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await staffService.getStaffById(id);
      setStaff(data);
      setStatus(data.status);
      setRole(data.role);
      setAssignedVehicle(data.assignedVehicle || '');
      setAssignedArea(data.assignedArea || 'Downtown Central');
      setShiftNotes(data.shiftNotes || '');
    } catch (err: any) {
      console.error('Failed to load staff details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffDetails();

    const loadVehicles = async () => {
      try {
        const res = await vehicleService.getVehicles();
        setVehicles(res.vehicles);
      } catch (err) {
        console.error('Failed to load fleet vehicles:', err);
      }
    };
    loadVehicles();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setIsUpdating(true);
      await staffService.updateStaff(id, {
        status,
        role,
        assignedVehicle: assignedVehicle || null,
        assignedArea,
        shiftNotes: shiftNotes.trim() || undefined
      });
      setActionNotice('Staff details and duty assignments updated successfully.');
      fetchStaffDetails();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update staff member.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!staff || !window.confirm(`Are you sure you want to remove ${staff.name} from the roster?`)) {
      return;
    }
    try {
      await staffService.deleteStaff(staff.id || staff.staffId);
      navigate('/admin/staff');
    } catch (err: any) {
      alert(err.message || 'Failed to delete staff member.');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading collection crew profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!staff) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-xl p-8 max-w-md mx-auto">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Staff Member Not Found</h2>
          <p className="text-xs text-slate-400 mt-1">
            Could not find records for the requested staff identifier.
          </p>
          <Link
            to="/admin/staff"
            className="mt-4 inline-block px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
          >
            Back to Staff Roster
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/staff"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Back to roster"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400">{staff.employeeId}</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-xs text-cyan-400">{staff.staffId}</span>
                <StaffRoleBadge role={staff.role} />
                <StaffStatusBadge status={staff.status} />
              </div>
              <h1 className="text-2xl font-bold text-white mt-0.5">{staff.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Remove Staff Member
            </button>
          </div>
        </div>

        {/* Action Notice */}
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

        {/* Profile Details & Deployment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Main Info Card */}
          <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              Personnel Details & Contact
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Email Address</span>
                <span className="text-xs font-semibold text-slate-200 mt-1 block truncate" title={staff.email}>
                  {staff.email}
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Phone</span>
                <span className="text-xs font-mono font-medium text-slate-200 mt-1 block">
                  {staff.phone || 'N/A'}
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Assigned Vehicle</span>
                <span className="text-xs font-semibold text-eco-400 mt-1 block">
                  {staff.assignedVehicle || <span className="text-slate-500 italic">None</span>}
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Service Zone</span>
                <span className="text-xs font-medium text-slate-200 mt-1 block">
                  {staff.assignedArea || 'Central Depot'}
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Linked System User</span>
                <span className="text-xs font-mono text-slate-400 mt-1 block">
                  {staff.userId || 'Standalone Staff'}
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Onboarded Date</span>
                <span className="text-xs text-slate-400 mt-1 block">
                  {new Date(staff.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {staff.shiftNotes && (
              <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg text-xs text-slate-300">
                <span className="text-slate-500 font-semibold block text-[10px] uppercase mb-1">
                  Active Shift Memo:
                </span>
                "{staff.shiftNotes}"
              </div>
            )}

            {/* Quick Operational Notice */}
            <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl flex items-start gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-cyan-300">Dispatch & Safety Compliance</h4>
                <p className="text-slate-400 mt-0.5">
                  Staff duty status automatically syncs with route schedules and on-demand citizen pickup assignments. When On Duty, the staff member receives immediate mobile telematics.
                </p>
              </div>
            </div>
          </div>

          {/* Duty & Assignment Editor */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              Duty & Asset Assignment
            </h3>

            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Duty Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StaffStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="On Duty">On Duty</option>
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Role Designation</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Driver">Driver</option>
                  <option value="Waste Collector">Waste Collector</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Assigned Vehicle</label>
                <select
                  value={assignedVehicle}
                  onChange={(e) => setAssignedVehicle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="">-- No Vehicle Assigned --</option>
                  {vehicles.map((v) => (
                    <option key={v.id || v.vehicleId} value={v.vehicleNumber}>
                      {v.vehicleNumber} ({v.vehicleType} - {v.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Operational Area</label>
                <select
                  value={assignedArea}
                  onChange={(e) => setAssignedArea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Downtown Central">Downtown Central</option>
                  <option value="Metro North Residential">Metro North Residential</option>
                  <option value="Green Valley Eco-District">Green Valley Eco-District</option>
                  <option value="Industrial Harbor Yard">Industrial Harbor Yard</option>
                  <option value="Westside Commercial Corridor">Westside Commercial Corridor</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Shift Notes</label>
                <textarea
                  rows={2}
                  value={shiftNotes}
                  onChange={(e) => setShiftNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Update Staff Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
