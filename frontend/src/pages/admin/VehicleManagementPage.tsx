import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { vehicleService } from '../../services/vehicleService';
import { Vehicle, VehicleStats, VehicleType, VehicleStatus } from '../../types/vehicle.types';
import { VehicleCard } from '../../components/vehicles/VehicleCard';
import { VehicleStatusBadge } from '../../components/vehicles/VehicleStatusBadge';
import {
  Truck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  LayoutGrid,
  ListFilter,
  Trash2,
  ExternalLink
} from 'lucide-react';

export const VehicleManagementPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<VehicleStats>({
    total: 0,
    available: 0,
    assigned: 0,
    onRoute: 0,
    maintenance: 0,
    inactive: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchFleet = async () => {
    try {
      setIsLoading(true);
      const res = await vehicleService.getVehicles({
        search: search || undefined,
        status: statusFilter || undefined,
        vehicleType: typeFilter || undefined
      });
      setVehicles(res.vehicles);
      setStats(res.stats);
    } catch (err) {
      console.error('Failed to load fleet vehicles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFleet();
  };

  const handleStatusChange = async (id: string, newStatus: VehicleStatus) => {
    try {
      await vehicleService.updateStatus(id, newStatus);
      setActionNotice(`Vehicle ${id} status updated to ${newStatus}.`);
      fetchFleet();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update vehicle status.');
    }
  };

  const handleDelete = async (id: string, vehicleNumber: string) => {
    if (!window.confirm(`Are you sure you want to decommission and remove vehicle ${vehicleNumber}?`)) {
      return;
    }
    try {
      await vehicleService.deleteVehicle(id);
      setActionNotice(`Vehicle ${vehicleNumber} successfully decommissioned.`);
      fetchFleet();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to remove vehicle.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-eco-400 uppercase tracking-wider">
                Fleet Logistics & Assets
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-eco-400"></span>
              <span className="text-xs text-slate-400">Municipal Depot Control</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Vehicle Fleet Management</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Monitor, deploy, and service municipal waste collection vehicles across city sectors.
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
              to="/admin/vehicles/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-eco-500 to-city-500 hover:from-eco-600 hover:to-city-600 text-white text-xs font-semibold shadow-md shadow-eco-500/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </Link>
          </div>
        </div>

        {/* Action Notice Alert */}
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

        {/* Fleet KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Fleet</span>
              <Truck className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{stats.total}</p>
            <span className="text-[10px] text-slate-500">Registered units</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-emerald-400 text-xs">
              <span>Available</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-2">{stats.available}</p>
            <span className="text-[10px] text-slate-500">Ready for dispatch</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-cyan-400 text-xs">
              <span>Assigned</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-cyan-400 mt-2">{stats.assigned}</p>
            <span className="text-[10px] text-slate-500">Paired with crew</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-amber-400 text-xs">
              <span>On Route</span>
              <RotateCcw className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-400 mt-2">{stats.onRoute}</p>
            <span className="text-[10px] text-slate-500">Active collection</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-rose-400 text-xs">
              <span>Maintenance</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-bold text-rose-400 mt-2">{stats.maintenance}</p>
            <span className="text-[10px] text-slate-500">In depot workshop</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, plate, area, driver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-eco-500"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-1 focus:ring-eco-500"
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="On Route">On Route</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-1 focus:ring-eco-500"
            >
              <option value="">All Types</option>
              <option value="Garbage Truck">Garbage Truck</option>
              <option value="Mini Truck">Mini Truck</option>
              <option value="Recycling Vehicle">Recycling Vehicle</option>
              <option value="Special Waste Vehicle">Special Waste Vehicle</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-slate-800 text-eco-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-slate-800 text-eco-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section: Loading / Empty / Grid / Table */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-eco-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-400">Loading municipal fleet telemetry...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-xl p-8">
            <Truck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No vehicles found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              No vehicles matched your current filter criteria. Try resetting your search or register a new vehicle into the fleet.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setTypeFilter('');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Clear Filters
              </button>
              <Link
                to="/admin/vehicles/new"
                className="px-3.5 py-1.5 rounded-lg bg-eco-500 hover:bg-eco-600 text-white text-xs font-semibold"
              >
                Add Vehicle
              </Link>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id || v.vehicleId}
                vehicle={v}
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
                    <th className="py-3 px-4">Vehicle ID & Reg</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Capacity</th>
                    <th className="py-3 px-4">Assigned Driver</th>
                    <th className="py-3 px-4">Current Area</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {vehicles.map((v) => (
                    <tr key={v.id || v.vehicleId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-white block">{v.vehicleNumber}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{v.vehicleId}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-200">{v.vehicleType}</td>
                      <td className="py-3 px-4 text-eco-400 font-mono">{v.capacity}</td>
                      <td className="py-3 px-4">
                        {v.driverName ? (
                          <span className="text-slate-200">{v.driverName}</span>
                        ) : (
                          <span className="text-slate-500 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{v.currentArea}</td>
                      <td className="py-3 px-4">
                        <VehicleStatusBadge status={v.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/vehicles/${v.id || v.vehicleId}`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View Details"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(v.id || v.vehicleId, v.vehicleNumber)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Decommission Vehicle"
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
