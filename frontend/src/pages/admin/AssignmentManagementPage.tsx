import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { vehicleService } from '../../services/vehicleService';
import { staffService } from '../../services/staffService';
import { Vehicle } from '../../types/vehicle.types';
import { StaffMember } from '../../types/staff.types';
import { VehicleStatusBadge } from '../../components/vehicles/VehicleStatusBadge';
import { StaffStatusBadge } from '../../components/staff/StaffStatusBadge';
import {
  Truck,
  Users,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Send,
  Calendar,
  XCircle
} from 'lucide-react';

export const AssignmentManagementPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDispatching, setIsDispatching] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Dispatch Form State
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedArea, setSelectedArea] = useState('Downtown Central');
  const [assignmentNote, setAssignmentNote] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [vRes, sRes] = await Promise.all([
        vehicleService.getVehicles(),
        staffService.getStaff()
      ]);
      setVehicles(vRes.vehicles);
      setStaff(sRes.staff);
    } catch (err) {
      console.error('Failed to load fleet and personnel assignments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDispatchPair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId || !selectedStaffId) {
      alert('Please select both a vehicle and a staff member for dispatch.');
      return;
    }

    try {
      setIsDispatching(true);
      const vehicle = vehicles.find((v) => v.id === selectedVehicleId || v.vehicleId === selectedVehicleId);
      const staffMember = staff.find((s) => s.id === selectedStaffId || s.staffId === selectedStaffId);

      if (!vehicle || !staffMember) return;

      // 1. Update vehicle with driver and area
      await vehicleService.updateVehicle(vehicle.id || vehicle.vehicleId, {
        driverId: staffMember.userId || staffMember.id || staffMember.staffId,
        driverName: staffMember.name,
        currentArea: selectedArea,
        status: 'Assigned',
        assignmentNotes: assignmentNote || `Paired with ${staffMember.name} for ${selectedArea}`
      });

      // 2. Update staff member with assigned vehicle and area
      await staffService.updateStaff(staffMember.id || staffMember.staffId, {
        assignedVehicle: vehicle.vehicleNumber,
        assignedArea: selectedArea,
        status: 'Assigned',
        shiftNotes: assignmentNote || `Assigned to ${vehicle.vehicleNumber}`
      });

      setActionNotice(`Successfully dispatched ${staffMember.name} with ${vehicle.vehicleNumber} to ${selectedArea}.`);
      setSelectedVehicleId('');
      setSelectedStaffId('');
      setAssignmentNote('');
      loadData();
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch fleet assignment.');
    } finally {
      setIsDispatching(false);
    }
  };

  const handleUnassign = async (vehicle: Vehicle) => {
    if (!window.confirm(`Recall and unassign vehicle ${vehicle.vehicleNumber} from ${vehicle.driverName || 'driver'}?`)) {
      return;
    }

    try {
      // Find driver to unassign as well
      const matchingStaff = staff.find(
        (s) => s.assignedVehicle === vehicle.vehicleNumber || s.name === vehicle.driverName
      );

      await vehicleService.updateVehicle(vehicle.id || vehicle.vehicleId, {
        driverId: null,
        driverName: null,
        status: 'Available',
        assignmentNotes: 'Unassigned by municipal dispatch controller.'
      });

      if (matchingStaff) {
        await staffService.updateStaff(matchingStaff.id || matchingStaff.staffId, {
          assignedVehicle: null,
          status: 'Available',
          shiftNotes: 'Vehicle released. Returned to standby pool.'
        });
      }

      setActionNotice(`Vehicle ${vehicle.vehicleNumber} successfully recalled and returned to available pool.`);
      loadData();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to recall vehicle.');
    }
  };

  const availableVehicles = vehicles.filter((v) => v.status === 'Available' || !v.driverId);
  const availableStaff = staff.filter((s) => s.status === 'Available' || !s.assignedVehicle);
  const activeAssignments = vehicles.filter((v) => v.driverName || v.status === 'Assigned' || v.status === 'On Route');

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-eco-400 uppercase tracking-wider">
                Fleet Dispatch Operations
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-eco-400"></span>
              <span className="text-xs text-slate-400">Assignment Control</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Assignment Management</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Pair municipal collection vehicles with drivers and crew technicians for daily sector operations.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/admin/vehicles"
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Manage Vehicles
            </Link>
            <Link
              to="/admin/staff"
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Manage Staff
            </Link>
          </div>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="p-3.5 bg-eco-500/10 border border-eco-500/30 rounded-xl text-xs text-eco-300 flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-eco-400" />
              {actionNotice}
            </span>
            <button onClick={() => setActionNotice(null)} className="text-eco-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Dispatch Console (Form + Quick Stats) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dispatch Form Card */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-eco-500/10 border border-eco-500/20 flex items-center justify-center text-eco-400">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Deploy Fleet & Crew Assignment</h3>
                <p className="text-xs text-slate-400">Match ready vehicles with available staff operators.</p>
              </div>
            </div>

            <form onSubmit={handleDispatchPair} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Select Vehicle */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Available Vehicle <span className="text-rose-400">*</span></span>
                    <span className="text-[10px] text-eco-400 font-mono">({availableVehicles.length} ready)</span>
                  </label>
                  <select
                    required
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-eco-500"
                  >
                    <option value="">-- Choose Vehicle --</option>
                    {availableVehicles.map((v) => (
                      <option key={v.id || v.vehicleId} value={v.id || v.vehicleId}>
                        {v.vehicleNumber} ({v.vehicleType} - {v.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Staff Member */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Available Staff Member <span className="text-rose-400">*</span></span>
                    <span className="text-[10px] text-cyan-400 font-mono">({availableStaff.length} ready)</span>
                  </label>
                  <select
                    required
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="">-- Choose Staff Member --</option>
                    {availableStaff.map((s) => (
                      <option key={s.id || s.staffId} value={s.id || s.staffId}>
                        {s.name} ({s.role} - {s.employeeId})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Sector */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Target Operational Sector
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-eco-500"
                  >
                    <option value="Downtown Central">Downtown Central</option>
                    <option value="Metro North Residential">Metro North Residential</option>
                    <option value="Green Valley Eco-District">Green Valley Eco-District</option>
                    <option value="Industrial Harbor Yard">Industrial Harbor Yard</option>
                    <option value="Westside Commercial Corridor">Westside Commercial Corridor</option>
                  </select>
                </div>

                {/* Memo */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Shift Memo / Route Directive
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Morning commercial pickup and residential zone B."
                    value={assignmentNote}
                    onChange={(e) => setAssignmentNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-eco-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-slate-800/80">
                <button
                  type="submit"
                  disabled={isDispatching || availableVehicles.length === 0 || availableStaff.length === 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-eco-500 to-city-500 hover:from-eco-600 hover:to-city-600 text-white text-xs font-semibold shadow-md shadow-eco-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isDispatching ? 'Confirming Dispatch...' : 'Dispatch Fleet Assignment'}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Metrics & Pool Overview */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Live Deployment Capacity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-eco-400" /> Active Dispatches
                  </span>
                  <span className="font-mono font-bold text-white">{activeAssignments.length}</span>
                </div>

                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Standby Vehicles
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{availableVehicles.length}</span>
                </div>

                <div className="flex items-center justify-between text-xs p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" /> Available Operators
                  </span>
                  <span className="font-mono font-bold text-cyan-400">{availableStaff.length}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-lg text-[11px] text-slate-400">
              <p className="font-medium text-slate-300 mb-0.5">Municipal Protocol:</p>
              Pairings notify the driver's device instantly and automatically allocate upcoming residential route checkpoints.
            </div>
          </div>
        </div>

        {/* Active Dispatches Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Active Sector Deployments</h3>
            <span className="text-xs text-slate-400 font-mono">
              {activeAssignments.length} Units On Duty / Assigned
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-eco-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-400">Syncing live sector deployments...</p>
            </div>
          ) : activeAssignments.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-xl p-6">
              <Truck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No active fleet deployments</p>
              <p className="text-xs text-slate-400 mt-0.5">
                All vehicles are currently at depot standby. Use the dispatch form above to deploy a route crew.
              </p>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Vehicle</th>
                      <th className="py-3 px-4">Assigned Driver / Crew</th>
                      <th className="py-3 px-4">Operational Zone</th>
                      <th className="py-3 px-4">Fleet Status</th>
                      <th className="py-3 px-4">Last Dispatched</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {activeAssignments.map((v) => (
                      <tr key={v.id || v.vehicleId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <Link
                            to={`/admin/vehicles/${v.id || v.vehicleId}`}
                            className="font-bold text-white hover:text-eco-400 font-mono block"
                          >
                            {v.vehicleNumber}
                          </Link>
                          <span className="text-[10px] text-slate-500">{v.vehicleType}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="font-medium text-slate-200">{v.driverName || 'Operator'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-eco-400" />
                            <span>{v.currentArea}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <VehicleStatusBadge status={v.status} />
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(v.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleUnassign(v)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 text-[11px] font-medium transition-colors"
                            title="Recall vehicle and unassign crew"
                          >
                            <XCircle className="w-3 h-3" />
                            Recall & Unassign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
