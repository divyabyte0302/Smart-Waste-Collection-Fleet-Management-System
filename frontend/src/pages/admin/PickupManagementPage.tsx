import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { PickupStatusBadge, WasteTypeBadge } from '../../components/pickup/PickupBadges';
import { pickupService } from '../../services/pickupService';
import { userService } from '../../services/userService';
import { PickupRequest, WasteType, PickupStatus } from '../../types/pickup.types';
import { User } from '../../types/user.types';
import { 
  PackageCheck, 
  Search, 
  Filter, 
  RefreshCw, 
  Truck, 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Send,
  X
} from 'lucide-react';

export const PickupManagementPage: React.FC = () => {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [wasteFilter, setWasteFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Dispatch Assignment Modal State
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);
  const [assignVehicle, setAssignVehicle] = useState('TRK-101 (Compactor)');
  const [assignStaff, setAssignStaff] = useState('');
  const [newStatus, setNewStatus] = useState<PickupStatus>('Approved');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchPickups = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      const [pickupData, usersData] = await Promise.all([
        pickupService.getPickups({
          search: search.trim() || undefined,
          wasteType: wasteFilter !== 'All' ? wasteFilter : undefined,
          status: statusFilter !== 'All' ? statusFilter : undefined
        }),
        userService.getAllUsers({ role: 'Collection Staff' })
      ]);

      setPickups(pickupData || []);
      setStaffList(usersData || []);
      if (usersData && usersData.length > 0 && !assignStaff) {
        setAssignStaff(usersData[0].name);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load pickup records.');
    } finally {
      setIsLoading(false);
    }
  }, [search, wasteFilter, statusFilter, assignStaff]);

  useEffect(() => {
    fetchPickups();
  }, [fetchPickups]);

  const handleOpenManageModal = (pickup: PickupRequest) => {
    setSelectedPickup(pickup);
    setNewStatus(pickup.status);
    setAssignVehicle(pickup.assignedVehicle || 'TRK-101 (Compactor)');
    setAssignStaff(pickup.assignedStaff || (staffList[0]?.name || 'Marcus Chen'));
  };

  const handleSaveDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPickup) return;

    try {
      setIsUpdating(true);
      await pickupService.updatePickup(selectedPickup.id, {
        assignedVehicle: assignVehicle,
        assignedStaff: assignStaff,
        status: newStatus
      });

      setSuccessMsg(`Pickup request ${selectedPickup.requestId} updated.`);
      setSelectedPickup(null);
      fetchPickups();
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update pickup dispatch.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickStatus = async (id: string, status: PickupStatus) => {
    try {
      await pickupService.updateStatus(id, status);
      setSuccessMsg(`Status updated to ${status}.`);
      fetchPickups();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update status.');
    }
  };

  const vehicles = [
    'TRK-101 (Compactor - Organic & Mixed)',
    'TRK-102 (Recycler - Dry Recyclables)',
    'TRK-103 (Electric Mini - E-Waste & Small)',
    'TRK-104 (Flatbed - Bulky Furniture)',
    'TRK-105 (Dump Truck - Garden & Yard)'
  ];

  const wasteTypes = [
    'All',
    'Electronic Waste',
    'Bulk Waste',
    'Garden Waste',
    'Recyclable Waste',
    'Household Waste',
    'Other'
  ];

  const statuses: (PickupStatus | 'All')[] = [
    'All',
    'Pending',
    'Approved',
    'Scheduled',
    'Assigned',
    'Completed',
    'Cancelled'
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-bold text-sky-400 uppercase tracking-wider">
              <PackageCheck className="w-4 h-4" />
              On-Demand Dispatch Desk
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Pickup Request Management
            </h1>
            <p className="text-sm text-slate-400">
              Review on-demand citizen bookings, approve collections, assign vehicles and field crews.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={fetchPickups} isLoading={isLoading}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-3 text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by ID (REQ-2026), citizen name, or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    Status: {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={wasteFilter}
                onChange={(e) => setWasteFilter(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {wasteTypes.map((w) => (
                  <option key={w} value={w}>
                    Waste: {w}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        {isLoading ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Fetching on-demand pickup requests...</span>
          </div>
        ) : pickups.length === 0 ? (
          <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-12 text-center text-slate-400">
            <PackageCheck className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-slate-200">No Pickup Requests</h3>
            <p className="text-xs text-slate-400 mt-1">No citizen bookings match the active filter criteria.</p>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">Citizen</th>
                    <th className="py-3 px-4">Waste Stream & Volume</th>
                    <th className="py-3 px-4">Preferred Slot</th>
                    <th className="py-3 px-4">Pickup Address</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned Fleet</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pickups.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-sky-400 whitespace-nowrap">
                        {p.requestId}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-200">{p.citizenName}</div>
                        <div className="text-[11px] text-slate-500">{p.citizenPhone || p.citizenEmail}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <WasteTypeBadge wasteType={p.wasteType} />
                        </div>
                        <span className="text-[11px] text-slate-400 block">{p.estimatedWasteQuantity}</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-slate-200 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-sky-400" />
                          {p.preferredDate}
                        </div>
                        <span className="text-[11px] text-slate-500">{p.preferredTime}</span>
                      </td>

                      <td className="py-3 px-4 max-w-xs truncate text-slate-400">
                        {p.pickupAddress}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <PickupStatusBadge status={p.status} />
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                        {p.assignedStaff ? (
                          <div>
                            <span className="text-eco-400 font-semibold flex items-center gap-1">
                              <UserCheck className="w-3.5 h-3.5" />
                              {p.assignedStaff}
                            </span>
                            <span className="text-[11px] text-slate-500 block truncate">{p.assignedVehicle}</span>
                          </div>
                        ) : (
                          <span className="text-amber-400 text-xs italic">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenManageModal(p)}
                            className="text-xs py-1 px-2.5"
                          >
                            Assign & Manage
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Dispatch Assignment & Status Triage */}
        {selectedPickup && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-sky-400">
                    {selectedPickup.requestId}
                  </span>
                  <WasteTypeBadge wasteType={selectedPickup.wasteType} />
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPickup(null)}
                  className="text-slate-400 hover:text-slate-200 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDispatch} className="p-6 space-y-4">
                {/* Summary */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                  <p className="text-slate-200">
                    <strong>Citizen:</strong> {selectedPickup.citizenName} ({selectedPickup.pickupAddress})
                  </p>
                  <p className="text-slate-400">
                    <strong>Scheduled Window:</strong> {selectedPickup.preferredDate} ({selectedPickup.preferredTime})
                  </p>
                  <p className="text-slate-400">
                    <strong>Volume:</strong> {selectedPickup.estimatedWasteQuantity}
                  </p>
                </div>

                {/* Status selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Update Request Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as PickupStatus)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Approved">Approved (Awaiting Dispatch)</option>
                    <option value="Scheduled">Scheduled into Route</option>
                    <option value="Assigned">Assigned to Crew</option>
                    <option value="Completed">Completed & Collected</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Vehicle Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Assign Vehicle Unit
                  </label>
                  <select
                    value={assignVehicle}
                    onChange={(e) => setAssignVehicle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    {vehicles.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Staff Operative Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Assign Collection Staff
                  </label>
                  <select
                    value={assignStaff}
                    onChange={(e) => setAssignStaff(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    {staffList.map((st) => (
                      <option key={st.id} value={st.name}>
                        {st.name} ({st.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedPickup(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={isUpdating}>
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Save & Dispatch
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
