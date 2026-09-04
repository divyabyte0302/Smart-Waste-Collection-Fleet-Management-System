import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { staffService } from '../../services/staffService';
import { vehicleService } from '../../services/vehicleService';
import { StaffRole, StaffStatus } from '../../types/staff.types';
import { Vehicle } from '../../types/vehicle.types';
import {
  Users,
  ArrowLeft,
  Save,
  AlertCircle,
  Truck,
  Mail,
  Phone,
  MapPin,
  BadgeCheck
} from 'lucide-react';

export const AddStaffPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [role, setRole] = useState<StaffRole>('Driver');
  const [assignedArea, setAssignedArea] = useState('Downtown Central');
  const [assignedVehicle, setAssignedVehicle] = useState('');
  const [status, setStatus] = useState<StaffStatus>('Available');
  const [shiftNotes, setShiftNotes] = useState('');

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const res = await vehicleService.getVehicles();
        setVehicles(res.vehicles);
      } catch (err) {
        console.error('Failed to load fleet vehicles:', err);
      }
    };
    loadVehicles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Full staff member name is required.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Valid email address is required.');
      return;
    }

    if (!employeeId.trim()) {
      setErrorMessage('Employee identification number is required (e.g., EMP-2026-045).');
      return;
    }

    try {
      setIsSubmitting(true);

      await staffService.createStaff({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        employeeId: employeeId.trim().toUpperCase(),
        role,
        assignedArea,
        assignedVehicle: assignedVehicle || null,
        status: assignedVehicle ? 'Assigned' : status,
        shiftNotes: shiftNotes.trim() || undefined
      });

      navigate('/admin/staff');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to onboard staff member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/staff"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Staff Roster
          </Link>
          <span className="text-xs font-mono text-slate-500">Form: STAFF-ONBOARD-01</span>
        </div>

        {/* Title Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Onboard Collection Personnel</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Register a new municipal driver, waste collection crew technician, or route supervisor.
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
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Legal Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Miller"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Employee Identification ID <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. EMP-2026-045"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono uppercase"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Municipal Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="jordan.m@smartwaste.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Contact Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+1 (555) 019-4482"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Staff Role */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Operational Role <span className="text-rose-400">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Driver">Driver (Heavy / Light Commercial)</option>
                <option value="Waste Collector">Waste Collector (Crew Member)</option>
                <option value="Supervisor">Supervisor (Field Operations)</option>
              </select>
            </div>

            {/* Assigned Sector / Zone */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Primary Assigned Zone <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={assignedArea}
                  onChange={(e) => setAssignedArea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Downtown Central">Downtown Central</option>
                  <option value="Metro North Residential">Metro North Residential</option>
                  <option value="Green Valley Eco-District">Green Valley Eco-District</option>
                  <option value="Industrial Harbor Yard">Industrial Harbor Yard</option>
                  <option value="Westside Commercial Corridor">Westside Commercial Corridor</option>
                </select>
              </div>
            </div>

            {/* Assigned Vehicle */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Assigned Fleet Vehicle <span className="text-slate-500">(Optional)</span>
              </label>
              <div className="relative">
                <Truck className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={assignedVehicle}
                  onChange={(e) => setAssignedVehicle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="">-- None (Depot Standby) --</option>
                  {vehicles.map((v) => (
                    <option key={v.id || v.vehicleId} value={v.vehicleNumber}>
                      {v.vehicleNumber} ({v.vehicleType} - {v.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duty Status */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Initial Duty Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StaffStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Available">Available (Ready for dispatch)</option>
                <option value="Assigned">Assigned (Paired with vehicle/route)</option>
                <option value="On Duty">On Duty (Active Shift)</option>
                <option value="Inactive">Inactive (Off Roster)</option>
              </select>
            </div>
          </div>

          {/* Shift Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Shift Notes / Special Qualifications <span className="text-slate-500">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Certified for Class A hydraulic compactor operations, morning shift preference."
              value={shiftNotes}
              onChange={(e) => setShiftNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Link
              to="/admin/staff"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Onboarding...' : 'Onboard Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
