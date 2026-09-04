import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { PickupCard } from '../../components/pickup/PickupCard';
import { Button } from '../../components/common/Button';
import { pickupService } from '../../services/pickupService';
import { PickupRequest, WasteType, PickupStatus } from '../../types/pickup.types';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  RefreshCw, 
  Package, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const MyPickupsPage: React.FC = () => {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [wasteFilter, setWasteFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const fetchPickups = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      const data = await pickupService.getPickups({
        search: search.trim() || undefined,
        wasteType: wasteFilter !== 'All' ? wasteFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined
      });
      setPickups(data || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load your pickup requests.');
    } finally {
      setIsLoading(false);
    }
  }, [search, wasteFilter, statusFilter]);

  useEffect(() => {
    fetchPickups();
  }, [fetchPickups]);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Cancel this pending pickup request?')) return;
    try {
      await pickupService.updateStatus(id, 'Cancelled');
      setSuccessMsg('Pickup request cancelled successfully.');
      fetchPickups();
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to cancel request.');
    }
  };

  const wasteTypes: (WasteType | 'All')[] = [
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
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
              My Waste Pickup Requests
            </h1>
            <p className="text-sm text-slate-400">
              Review booked curbside collections, view assigned vehicles, and cancel unassigned requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={fetchPickups} isLoading={isLoading}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Refresh
            </Button>
            <Link to="/citizen/request-pickup">
              <Button variant="primary" size="sm">
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Book New Pickup
              </Button>
            </Link>
          </div>
        </div>

        {/* Feedback Alerts */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Filters Toolbar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by Request ID (REQ-2026), address, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-eco-500"
              />
            </div>

            <div className="sm:col-span-5 flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-eco-500"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    Status: {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Waste Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {wasteTypes.map((wt) => (
              <button
                key={wt}
                type="button"
                onClick={() => setWasteFilter(wt)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  wasteFilter === wt
                    ? 'bg-eco-500 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {wt}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-44 bg-slate-900/40 border border-slate-800/60 rounded-xl animate-pulse p-6"
              />
            ))}
          </div>
        ) : pickups.length === 0 ? (
          <div className="border border-slate-800 rounded-2xl bg-slate-900/30 p-12 text-center space-y-4">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <div>
              <h3 className="text-base font-semibold text-slate-200">No Pickup Requests Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {search || wasteFilter !== 'All' || statusFilter !== 'All'
                  ? 'No requests matched your filter parameters.'
                  : 'You have no scheduled waste pickups. Need large furniture or electronics collected? Book a pickup.'}
              </p>
            </div>
            <Link to="/citizen/request-pickup">
              <Button variant="primary" size="sm">
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Book a Pickup
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pickups.map((p) => (
              <PickupCard key={p.id} pickup={p} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
