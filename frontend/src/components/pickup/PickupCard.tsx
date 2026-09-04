import React from 'react';
import { Link } from 'react-router-dom';
import { PickupRequest } from '../../types/pickup.types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { PickupStatusBadge, WasteTypeBadge } from './PickupBadges';
import { MapPin, Calendar, Clock, Truck, UserCheck, Package, XCircle, ArrowRight } from 'lucide-react';

interface PickupCardProps {
  pickup: PickupRequest;
  onCancel?: (id: string) => void;
  isAdmin?: boolean;
  onManage?: (pickup: PickupRequest) => void;
}

export const PickupCard: React.FC<PickupCardProps> = ({
  pickup,
  onCancel,
  isAdmin = false,
  onManage
}) => {
  const canCancel = (pickup.status === 'Pending' || pickup.status === 'Approved') && onCancel;

  return (
    <Card hoverEffect className="flex flex-col justify-between overflow-hidden">
      <div className="space-y-3">
        {/* Header with ID, Waste Type, and Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              {pickup.requestId}
            </span>
            <WasteTypeBadge wasteType={pickup.wasteType} />
          </div>
          <PickupStatusBadge status={pickup.status} />
        </div>

        {/* Volume & Description */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            Estimated Volume: <span className="text-slate-100">{pickup.estimatedWasteQuantity}</span>
          </div>
          {pickup.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {pickup.description}
            </p>
          )}
        </div>

        {/* Schedule & Address Details */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-eco-400 shrink-0" />
            <span className="truncate">{pickup.pickupAddress}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              {pickup.preferredDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {pickup.preferredTime}
            </span>
          </div>
        </div>

        {/* Assigned Vehicle & Crew */}
        {(pickup.assignedVehicle || pickup.assignedStaff) && (
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
            {pickup.assignedVehicle && (
              <span className="flex items-center gap-1 text-slate-300 font-medium">
                <Truck className="w-3.5 h-3.5 text-sky-400" />
                {pickup.assignedVehicle}
              </span>
            )}
            {pickup.assignedStaff && (
              <span className="flex items-center gap-1 text-eco-400 font-medium">
                <UserCheck className="w-3.5 h-3.5" />
                {pickup.assignedStaff}
              </span>
            )}
          </div>
        )}

        {isAdmin && pickup.citizenName && (
          <div className="text-[11px] text-slate-500">
            Citizen: <strong className="text-slate-300">{pickup.citizenName}</strong> ({pickup.citizenEmail})
          </div>
        )}
      </div>

      {/* Footer Action Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <Link
          to={`/citizen/pickup-tracking?id=${pickup.requestId}`}
          className="text-xs text-eco-400 hover:text-eco-300 font-semibold flex items-center gap-1"
        >
          Track Status
          <ArrowRight className="w-3 h-3" />
        </Link>

        <div className="flex items-center gap-2">
          {canCancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onCancel(pickup.id)}
              className="text-xs py-1 px-2.5"
            >
              <XCircle className="w-3.5 h-3.5 mr-1" />
              Cancel
            </Button>
          )}

          {isAdmin && onManage && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onManage(pickup)}
              className="text-xs py-1 px-3"
            >
              Manage & Dispatch
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
