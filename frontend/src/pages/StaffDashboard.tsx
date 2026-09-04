import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../hooks/useAuth';
import { scheduleService } from '../services/scheduleService';
import { staffService } from '../services/staffService';
import { vehicleService } from '../services/vehicleService';
import { pickupService } from '../services/pickupService';
import { Schedule, CollectionStatus } from '../types/schedule.types';
import { StaffMember } from '../types/staff.types';
import { Vehicle } from '../types/vehicle.types';
import { PickupRequest } from '../types/pickup.types';
import { StaffStatusBadge } from '../components/staff/StaffStatusBadge';
import { VehicleStatusBadge } from '../components/vehicles/VehicleStatusBadge';
import { PickupStatusBadge } from '../components/pickup/PickupBadges';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Loader2,
  Navigation,
  Check,
  Play,
  Boxes,
  History,
  ArrowRight,
  Shield,
  Weight,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { user } = useAuth();

  const [staffProfile, setStaffProfile] = useState<StaffMember | null>(null);
  const [assignedVehicle, setAssignedVehicle] = useState<Vehicle | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [pendingPickups, setPendingPickups] = useState<PickupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isTogglingShift, setIsTogglingShift] = useState(false);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // 1. Load staff profile for logged in user
      const profile = await staffService.getMyProfile();
      setStaffProfile(profile);

      // 2. Load schedules and on-demand pickups in parallel
      const [schData, pkpData, fleetData] = await Promise.all([
        scheduleService.getSchedules(),
        pickupService.getPickups(),
        vehicleService.getVehicles()
      ]);

      setSchedules(schData);
      setPendingPickups(pkpData.filter((p) => p.status !== 'Completed' && p.status !== 'Cancelled'));

      // 3. Match assigned vehicle
      if (profile && profile.assignedVehicle) {
        const matchingVehicle = fleetData.vehicles.find(
          (v) =>
            v.vehicleNumber.toLowerCase() === profile.assignedVehicle?.toLowerCase() ||
            v.vehicleId.toLowerCase() === profile.assignedVehicle?.toLowerCase()
        );
        if (matchingVehicle) setAssignedVehicle(matchingVehicle);
      } else if (fleetData.vehicles.length > 0) {
        // Fallback to first vehicle if none assigned
        setAssignedVehicle(fleetData.vehicles[0]);
      }
    } catch (err) {
      console.error('Failed to load staff dashboard telemetry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleDuty = async () => {
    if (!staffProfile) return;
    try {
      setIsTogglingShift(true);
      const nextStatus = staffProfile.status === 'On Duty' ? 'Available' : 'On Duty';

      await staffService.updateStaff(staffProfile.id || staffProfile.staffId, {
        status: nextStatus
      });

      if (assignedVehicle) {
        await vehicleService.updateStatus(
          assignedVehicle.id || assignedVehicle.vehicleId,
          nextStatus === 'On Duty' ? 'On Route' : 'Available',
          nextStatus === 'On Duty' ? 'Driver commenced route collection.' : 'Driver concluded collection shift.'
        );
      }

      setStaffProfile((prev) => (prev ? { ...prev, status: nextStatus } : null));
      setActionNotice(
        nextStatus === 'On Duty'
          ? 'Collection Shift Started! Telemetry online and route GPS enabled.'
          : 'Shift concluded. Vehicle status updated to Available.'
      );
      setTimeout(() => setActionNotice(null), 4000);
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle duty status.');
    } finally {
      setIsTogglingShift(false);
    }
  };

  const handleUpdateScheduleStatus = async (scheduleId: string, status: CollectionStatus) => {
    try {
      await scheduleService.updateStatus(scheduleId, status);
      setSchedules((prev) =>
        prev.map((s) => (s.id === scheduleId ? { ...s, status } : s))
      );
      setActionNotice(`Updated route ${scheduleId} to "${status}". Telemetry synced with dispatch.`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update collection status.');
    }
  };

  const handleCompletePickup = async (id: string, reqId: string) => {
    try {
      await pickupService.updateStatus(id, 'Completed');
      setPendingPickups((prev) => prev.filter((p) => (p.id !== id && p.requestId !== id)));
      setActionNotice(`Pickup ${reqId} marked completed. Logged to service history.`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to complete pickup.');
    }
  };

  const getStatusBadge = (status: CollectionStatus) => {
    switch (status) {
      case 'Collected':
        return <Badge variant="green">Collected</Badge>;
      case 'In Progress':
        return <Badge variant="blue">In Progress</Badge>;
      case 'Skipped':
        return <Badge variant="rose">Skipped</Badge>;
      default:
        return <Badge variant="amber">Pending</Badge>;
    }
  };

  const completedCount = schedules.filter((s) => s.status === 'Collected').length;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Shift Terminal Header */}
        <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-slate-950 p-6 rounded-2xl border border-cyan-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  Crew In-Cab Terminal
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-300 font-mono">
                  {staffProfile?.employeeId || 'STAFF-EMP-01'}
                </span>
                {staffProfile && <StaffStatusBadge status={staffProfile.status} />}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {assignedVehicle ? `${assignedVehicle.vehicleNumber} • ${assignedVehicle.vehicleType}` : 'Collection Unit Standby'}
              </h1>

              <p className="text-xs text-slate-400 mt-1">
                Operator: <strong className="text-slate-200">{user?.name}</strong> • Zone: <strong className="text-eco-400">{staffProfile?.assignedArea || 'Downtown Central'}</strong>
              </p>
            </div>
          </div>

          {/* Shift Toggle & Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleToggleDuty}
              disabled={isTogglingShift}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
                staffProfile?.status === 'On Duty'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/20 hover:scale-[1.02]'
              } disabled:opacity-50`}
            >
              {staffProfile?.status === 'On Duty' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Active On Duty (Finish Shift)
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Collection Shift
                </>
              )}
            </button>

            <div className="px-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-right">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Routes Cleared</span>
              <span className="text-base font-mono font-bold text-eco-400">
                {completedCount} / {schedules.length}
              </span>
            </div>
          </div>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              {actionNotice}
            </span>
            <button onClick={() => setActionNotice(null)} className="text-cyan-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Operational Telemetry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Assigned Vehicle Info */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-eco-400" />
                Assigned Vehicle
              </span>
              {assignedVehicle && <VehicleStatusBadge status={assignedVehicle.status} />}
            </div>

            {assignedVehicle ? (
              <div>
                <h3 className="text-lg font-bold text-white font-mono">{assignedVehicle.vehicleNumber}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{assignedVehicle.vehicleType}</p>
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Capacity:</span>
                    <span className="font-mono text-eco-400 font-semibold">{assignedVehicle.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Depot Sector:</span>
                    <span className="text-slate-200">{assignedVehicle.currentArea}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-2">No vehicle currently linked to profile.</p>
            )}
          </div>

          {/* Card 2: Collection Sector */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Collection Sector
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Active Zone
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                {staffProfile?.assignedArea || 'Downtown Central'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Municipal primary priority corridor</p>
              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Pending Stops:</span>
                  <span className="font-bold text-amber-400">{schedules.filter(s => s.status !== 'Collected').length} remaining</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Citizen Requests:</span>
                  <span className="font-bold text-sky-400">{pendingPickups.length} scheduled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Quick Portal Links */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Operational Modules
              </span>
              <div className="space-y-2">
                <Link
                  to="/staff/schedule"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 hover:bg-slate-800/60 border border-slate-800 text-xs text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-eco-400" /> Today's Route Stops
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </Link>

                <Link
                  to="/staff/pickups"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 hover:bg-slate-800/60 border border-slate-800 text-xs text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Boxes className="w-3.5 h-3.5 text-sky-400" /> Assigned Citizen Pickups
                  </span>
                  <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded">
                    {pendingPickups.length}
                  </span>
                </Link>

                <Link
                  to="/staff/history"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 hover:bg-slate-800/60 border border-slate-800 text-xs text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-slate-400" /> Verified Service History
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Citizen Pickups Section */}
        {pendingPickups.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-sky-400" />
                  Assigned Citizen Waste Pickups
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  On-demand waste requests awaiting collection in your sector.
                </p>
              </div>
              <Link
                to="/staff/pickups"
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
              >
                View All ({pendingPickups.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPickups.slice(0, 2).map((p) => (
                <div
                  key={p.id || p.requestId}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between text-xs space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-sky-400">{p.requestId}</span>
                      <PickupStatusBadge status={p.status} />
                    </div>
                    <div className="font-medium text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      {p.pickupAddress}
                    </div>
                    <p className="text-slate-400 mt-1">
                      {p.wasteType} • Est: <strong className="text-slate-200">{p.estimatedWasteQuantity}</strong>
                    </p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Window: {p.preferredDate} ({p.preferredTime})
                    </p>
                  </div>

                  <button
                    onClick={() => handleCompletePickup(p.id || p.requestId, p.requestId)}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-500/10"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark Pickup Completed
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Route Stops Card */}
        <Card>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Today's Collection Stops & Checkpoints</h2>
              <p className="text-xs text-slate-400">Update checkpoint status as collection stops are serviced</p>
            </div>
            <Link
              to="/staff/schedule"
              className="text-xs text-eco-400 hover:text-eco-300 font-semibold flex items-center gap-1"
            >
              Expand Schedule <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="text-sm">Retrieving assigned stops...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((sch) => (
                <div
                  key={sch.id}
                  className={`p-5 rounded-xl border transition-all ${
                    sch.status === 'Collected'
                      ? 'bg-emerald-950/15 border-emerald-500/30'
                      : sch.status === 'In Progress'
                      ? 'bg-cyan-950/15 border-cyan-500/30'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Route Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-white">{sch.zone}</span>
                        {getStatusBadge(sch.status)}
                      </div>

                      <p className="text-xs font-semibold text-eco-400 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        {sch.collectionType} • {sch.vehicleNumber}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {sch.dayOfWeek}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {sch.timeSlot}
                        </span>
                      </div>

                      {/* Checkpoint tags */}
                      {sch.checkpoints && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {sch.checkpoints.map((cp, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md"
                            >
                              📍 {cp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Status Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleUpdateScheduleStatus(sch.id, 'In Progress')}
                        disabled={sch.status === 'In Progress'}
                        className="text-xs"
                      >
                        In Progress
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleUpdateScheduleStatus(sch.id, 'Collected')}
                        disabled={sch.status === 'Collected'}
                        className="text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark Collected
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateScheduleStatus(sch.id, 'Skipped')}
                        className="text-xs text-rose-400 hover:bg-rose-500/10 border-rose-500/20"
                      >
                        Skip
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};
