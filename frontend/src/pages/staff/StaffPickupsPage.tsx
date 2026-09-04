import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { pickupService } from '../../services/pickupService';
import { PickupRequest, PickupStatus } from '../../types/pickup.types';
import { PickupStatusBadge } from '../../components/pickup/PickupBadges';
import {
  Boxes,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Check,
  Search,
  Filter,
  User,
  Phone
} from 'lucide-react';

export const StaffPickupsPage: React.FC = () => {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchPickups = async () => {
    try {
      setIsLoading(true);
      const data = await pickupService.getPickups({
        status: statusFilter || undefined,
        search: search || undefined
      });
      setPickups(data);
    } catch (err) {
      console.error('Failed to load assigned pickups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPickups();
  };

  const handleMarkCompleted = async (id: string, requestId: string) => {
    try {
      await pickupService.updateStatus(id, 'Completed');
      setActionNotice(`Pickup ${requestId} marked as COMPLETED. Service telemetry logged.`);
      fetchPickups();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update pickup status.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                On-Demand Dispatch
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              <span className="text-xs text-slate-400">Citizen Pickups</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Assigned Waste Pickups</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Service on-demand citizen waste requests allocated to your collection truck.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              {pickups.filter((p) => p.status !== 'Completed' && p.status !== 'Cancelled').length} Active Pickups
            </span>
          </div>
        </div>

        {/* Action Notice */}
        {actionNotice && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {actionNotice}
            </span>
            <button onClick={() => setActionNotice(null)} className="text-emerald-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by address, request ID, waste type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </form>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Assigned">Assigned</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Pickup Requests Cards */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-400">Loading assigned on-demand requests...</p>
          </div>
        ) : pickups.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-xl p-8">
            <Boxes className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No assigned pickups</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              No on-demand citizen pickups match your active filter criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pickups.map((p) => (
              <div
                key={p.id || p.requestId}
                className={`p-5 rounded-xl border transition-all ${
                  p.status === 'Completed'
                    ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                    : 'bg-slate-900/70 border-slate-800 shadow-md'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-sky-400">{p.requestId}</span>
                      <PickupStatusBadge status={p.status} />
                      <span className="text-xs font-semibold text-white bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                        {p.wasteType}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-slate-200 font-medium">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{p.pickupAddress}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Preferred Date: <strong className="text-slate-200">{p.preferredDate}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Window: <strong className="text-slate-200">{p.preferredTime}</strong>
                      </span>
                      <span className="flex items-center gap-1 text-eco-400">
                        Est. Volume: <strong>{p.estimatedWasteQuantity}</strong>
                      </span>
                    </div>

                    {/* Citizen contact */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        {p.citizenName}
                      </span>
                      {p.citizenPhone && (
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          {p.citizenPhone}
                        </span>
                      )}
                    </div>

                    {p.description && (
                      <p className="text-xs text-slate-400 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                        "{p.description}"
                      </p>
                    )}
                  </div>

                  {/* Complete Action Button */}
                  <div className="flex items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    {p.status !== 'Completed' && p.status !== 'Cancelled' ? (
                      <button
                        onClick={() => handleMarkCompleted(p.id || p.requestId, p.requestId)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                      >
                        <Check className="w-4 h-4" />
                        Mark Pickup Completed
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 flex items-center gap-1.5 py-1 px-3 bg-slate-950 rounded-lg border border-slate-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Archived Service
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
