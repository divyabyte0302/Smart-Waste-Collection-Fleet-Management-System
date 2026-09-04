import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, MapPin, User, Weight, ChevronRight, CheckCircle2, AlertTriangle, Settings } from 'lucide-react';
import { Vehicle } from '../../types/vehicle.types';
import { VehicleStatusBadge } from './VehicleStatusBadge';

interface VehicleCardProps {
  vehicle: Vehicle;
  onStatusChange?: (id: string, status: any) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onStatusChange }) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 transition-all shadow-md group flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-eco-500/10 border border-eco-500/20 flex items-center justify-center text-eco-400 group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-slate-400">
                  {vehicle.vehicleId}
                </span>
                <VehicleStatusBadge status={vehicle.status} />
              </div>
              <h4 className="text-base font-bold text-white tracking-wide">
                {vehicle.vehicleNumber}
              </h4>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="space-y-2 py-3 border-y border-slate-800/80 my-3 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500">Vehicle Type:</span>
            <span className="font-medium text-slate-200">{vehicle.vehicleType}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500 flex items-center gap-1">
              <Weight className="w-3.5 h-3.5" /> Payload:
            </span>
            <span className="font-medium text-eco-400">{vehicle.capacity}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Current Area:
            </span>
            <span className="font-medium text-slate-200">{vehicle.currentArea}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-500 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Assigned Driver:
            </span>
            <span className="font-medium text-slate-200">
              {vehicle.driverName || <span className="text-slate-500 italic">Unassigned</span>}
            </span>
          </div>
        </div>

        {/* Performance Snippet */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
          <span className="flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-eco-400" />
            {vehicle.completedServices || 0} Routes Completed
          </span>
          <span className="text-[10px] text-slate-500">
            Updated {new Date(vehicle.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/50">
        <Link
          to={`/admin/vehicles/${vehicle.id || vehicle.vehicleId}`}
          className="flex-1 text-center py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center justify-center gap-1.5"
        >
          Telemetry & Details
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        {onStatusChange && (
          <select
            value={vehicle.status}
            onChange={(e) => onStatusChange(vehicle.id || vehicle.vehicleId, e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 rounded-lg text-xs py-2 px-2.5 focus:outline-none focus:ring-1 focus:ring-eco-500 cursor-pointer"
            title="Quick change vehicle status"
          >
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="On Route">On Route</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>
        )}
      </div>
    </div>
  );
};
