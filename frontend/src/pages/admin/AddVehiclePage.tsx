import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { vehicleService } from '../../services/vehicleService';
import { staffService } from '../../services/staffService';
import { StaffMember } from '../../types/staff.types';
import { VehicleType, VehicleStatus } from '../../types/vehicle.types';
import {
  Truck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
  Weight,
  MapPin,
  User,
  ShieldAlert
} from 'lucide-react';

export const AddVehiclePage: React.FC = () => {
  const navigate = useNavigate();

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Garbage Truck');
  const [capacity, setCapacity] = useState('');
  const [currentArea, setCurrentArea] = useState('Downtown Central');
  const [status, setStatus] = useState<VehicleStatus>('Available');
  const [selectedDriverId, setSelectedDriverId] = useState('');

  const [drivers, setDrivers] = useState<StaffMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load collection drivers for optional assignment
    const loadDrivers = async () => {
      try {
        const res = await staffService.getStaff({ role: 'Driver' });
        setDrivers(res.staff);
      } catch (err) {
        console.error('Failed to load drivers for assignment:', err);
      }
    };
    loadDrivers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!vehicleNumber.trim()) {
      setErrorMessage('Vehicle registration number is required (e.g., "METRO-TRK-105").');
      return;
    }

    if (!capacity.trim()) {
      setErrorMessage('Vehicle capacity is required (e.g., "12 Tons (Compactor)").');
      return;
    }

    try {
      setIsSubmitting(true);

      const assignedDriver = drivers.find((d) => d.id === selectedDriverId || d.staffId === selectedDriverId);

      await vehicleService.createVehicle({
        vehicleNumber: vehicleNumber.trim(),
        vehicleType,
        capacity: capacity.trim(),
        currentArea,
        status: assignedDriver ? 'Assigned' : status,
        driverId: assignedDriver ? (assignedDriver.userId || assignedDriver.id || assignedDriver.staffId) : null,
        driverName: assignedDriver ? assignedDriver.name : null
      });

      navigate('/admin/vehicles');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to register vehicle into fleet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/vehicles"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vehicle Fleet
          </Link>
          <span className="text-xs font-mono text-slate-500">Form: FLEET-REG-01</span>
        </div>

        {/* Title Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-eco-500/10 border border-eco-500/20 flex items-center justify-center text-eco-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Register Municipal Vehicle</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Onboard a new collection truck or maintenance vehicle to the city sanitation grid.
              </p>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Registration Error</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Vehicle Number / Plate */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Vehicle Registration / License Plate <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. METRO-TRK-105"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-eco-500 font-mono uppercase"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Official municipality plate or asset tag ID.
              </span>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Vehicle Classification <span className="text-rose-400">*</span>
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-eco-500"
              >
                <option value="Garbage Truck">Garbage Truck (Compactor)</option>
                <option value="Mini Truck">Mini Truck (Residential & Narrow Streets)</option>
                <option value="Recycling Vehicle">Recycling Vehicle (Dual Stream)</option>
                <option value="Special Waste Vehicle">Special Waste Vehicle (Bulk & HazMat)</option>
              </select>
            </div>

            {/* Payload Capacity */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Payload / Compaction Capacity <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Weight className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 Tons (24 m³)"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-eco-500"
                />
              </div>
            </div>

            {/* Assigned Sector / Zone */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Assigned Operational Sector <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={currentArea}
                  onChange={(e) => setCurrentArea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-eco-500"
                >
                  <option value="Downtown Central">Downtown Central</option>
                  <option value="Metro North Residential">Metro North Residential</option>
                  <option value="Green Valley Eco-District">Green Valley Eco-District</option>
                  <option value="Industrial Harbor Yard">Industrial Harbor Yard</option>
                  <option value="Westside Commercial Corridor">Westside Commercial Corridor</option>
                </select>
              </div>
            </div>

            {/* Initial Driver Assignment */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Assign Municipal Driver <span className="text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-eco-500"
                >
                  <option value="">-- No Driver Assigned (Available) --</option>
                  {drivers.map((d) => (
                    <option key={d.id || d.staffId} value={d.id || d.staffId}>
                      {d.name} ({d.employeeId} - {d.status})
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Assigning a driver will automatically mark this vehicle as "Assigned".
              </span>
            </div>

            {/* Initial Status */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Initial Fleet Status
              </label>
              <select
                disabled={Boolean(selectedDriverId)}
                value={selectedDriverId ? 'Assigned' : status}
                onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-eco-500 disabled:opacity-50"
              >
                <option value="Available">Available (Ready for assignment)</option>
                <option value="Assigned">Assigned</option>
                <option value="Maintenance">Maintenance (Under inspection)</option>
                <option value="Inactive">Inactive (Decommissioned)</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Link
              to="/admin/vehicles"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-eco-500 to-city-500 hover:from-eco-600 hover:to-city-600 text-white text-xs font-semibold shadow-md shadow-eco-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Registering...' : 'Register Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
