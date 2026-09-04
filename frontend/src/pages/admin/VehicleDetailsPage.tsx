import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { vehicleService } from '../../services/vehicleService';
import { staffService } from '../../services/staffService';
import { Vehicle, VehicleStatus } from '../../types/vehicle.types';
import { StaffMember } from '../../types/staff.types';
import { VehicleStatusBadge } from '../../components/vehicles/VehicleStatusBadge';
import {
  Truck,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Weight,
  CheckCircle2,
  AlertTriangle,
  History,
  Trash2,
  Edit,
  Save,
  RotateCcw
} from 'lucide-react';

export const VehicleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [drivers, setDrivers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Status update state
  const [selectedStatus, setSelectedStatus] = useState<VehicleStatus>('Available');
  const [statusNotes, setStatusNotes] = useState('');

  // Driver re-assignment state
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');

  const fetchVehicleDetails = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await vehicleService.getVehicleById(id);
      setVehicle(data);
      setSelectedStatus(data.status);
      setSelectedDriverId(data.driverId || '');
    } catch (err: any) {
      console.error('Failed to load vehicle details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleDetails();

    const loadDrivers = async () => {
      try {
        const res = await staffService.getStaff({ role: 'Driver' });
        setDrivers(res.staff);
      } catch (err) {
        console.error('Failed to load drivers list:', err);
      }
    };
    loadDrivers();
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setIsUpdating(true);
      await vehicleService.updateStatus(id, selectedStatus, statusNotes || undefined);
      setActionNotice(`Vehicle status updated to "${selectedStatus}".`);
      setStatusNotes('');
      fetchVehicleDetails();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update vehicle status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setIsUpdating(true);
      const driver = drivers.find((d) => d.id === selectedDriverId || d.staffId === selectedDriverId);

      await vehicleService.updateVehicle(id, {
        driverId: driver ? (driver.userId || driver.id || driver.staffId) : null,
        driverName: driver ? driver.name : null,
        status: driver ? 'Assigned' : 'Available',
        assignmentNotes: assignmentNotes || undefined
      });

      setActionNotice(driver ? `Assigned driver ${driver.name} to vehicle.` : 'Driver unassigned. Vehicle marked Available.');
      setAssignmentNotes('');
      fetchVehicleDetails();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update driver assignment.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!vehicle || !window.confirm(`Permanently remove vehicle ${vehicle.vehicleNumber} from fleet records?`)) {
      return;
    }
    try {
      await vehicleService.deleteVehicle(vehicle.id || vehicle.vehicleId);
      navigate('/admin/vehicles');
    } catch (err: any) {
      alert(err.message || 'Failed to decommission vehicle.');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-eco-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading vehicle specs and telemetry...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!vehicle) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-xl p-8 max-w-md mx-auto">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Vehicle Not Found</h2>
          <p className="text-xs text-slate-400 mt-1">
            The requested vehicle profile could not be located in the municipal database.
          </p>
          <Link
            to="/admin/vehicles"
            className="mt-4 inline-block px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
          >
            Back to Vehicle Fleet
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Top Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/vehicles"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Back to fleet"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-eco-400">{vehicle.vehicleId}</span>
                <VehicleStatusBadge status={vehicle.status} />
              </div>
              <h1 className="text-2xl font-bold text-white mt-0.5">{vehicle.vehicleNumber}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Decommission Vehicle
            </button>
          </div>
        </div>

        {/* Action Notice */}
        {actionNotice && (
          <div className="p-3 bg-eco-500/10 border border-eco-500/30 rounded-xl text-xs text-eco-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-eco-400" />
              {actionNotice}
            </span>
            <button onClick={() => setActionNotice(null)} className="text-eco-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Primary Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Main Telemetry Card */}
          <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-eco-400" />
              Technical Specifications & Profile
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Classification</span>
                <span className="text-xs font-semibold text-slate-200 mt-1 block">{vehicle.vehicleType}</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Payload Limit</span>
                <span className="text-xs font-mono font-bold text-eco-400 mt-1 block">{vehicle.capacity}</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Current Zone</span>
                <span className="text-xs font-medium text-slate-200 mt-1 block">{vehicle.currentArea}</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Assigned Driver</span>
                <span className="text-xs font-semibold text-slate-200 mt-1 block">
                  {vehicle.driverName || <span className="text-slate-500 italic">Unassigned</span>}
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Completed Services</span>
                <span className="text-xs font-mono font-bold text-cyan-400 mt-1 block">
                  {vehicle.completedServices || 0} Routes / Pickups
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Registered At</span>
                <span className="text-xs text-slate-400 mt-1 block">
                  {new Date(vehicle.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {vehicle.statusNotes && (
              <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg text-xs text-slate-300">
                <span className="text-slate-500 font-semibold block text-[10px] uppercase mb-1">
                  Status Telemetry Notes:
                </span>
                "{vehicle.statusNotes}"
              </div>
            )}

            {/* Assignment History Timeline */}
            <div className="pt-4 border-t border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                Driver Assignment History & Audit Trail
              </h4>

              {(!vehicle.assignmentHistory || vehicle.assignmentHistory.length === 0) ? (
                <p className="text-xs text-slate-500 italic py-2">
                  No previous assignment logs recorded for this vehicle.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {vehicle.assignmentHistory.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="bg-slate-950/70 border border-slate-800/60 p-3 rounded-lg flex items-start justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-eco-400" />
                          <span className="font-semibold text-slate-200">{item.driverName}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{item.area}</span>
                        </div>
                        {item.notes && (
                          <p className="text-[11px] text-slate-400 mt-1">{item.notes}</p>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(item.assignedAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Side Controls */}
          <div className="space-y-5">
            {/* Quick Status Updater */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                Update Fleet Status
              </h3>
              <form onSubmit={handleUpdateStatus} className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Operational State</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as VehicleStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-eco-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="On Route">On Route</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Dispatch / Maintenance Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Cleared for route 4 or brake inspection scheduled."
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-eco-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-2 rounded-lg bg-eco-500 hover:bg-eco-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Fleet Status'}
                </button>
              </form>
            </div>

            {/* Reassign Driver Box */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                Assign Municipal Driver
              </h3>
              <form onSubmit={handleAssignDriver} className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Select Driver</label>
                  <select
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-eco-500"
                  >
                    <option value="">-- No Driver (Unassigned) --</option>
                    {drivers.map((d) => (
                      <option key={d.id || d.staffId} value={d.id || d.staffId}>
                        {d.name} ({d.employeeId} - {d.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Assignment Memo</label>
                  <input
                    type="text"
                    placeholder="e.g. Transferred for morning commercial route."
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-eco-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Dispatching...' : 'Update Driver Assignment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
