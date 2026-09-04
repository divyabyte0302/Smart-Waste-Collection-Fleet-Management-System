import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { PickupStatusBadge, WasteTypeBadge } from '../../components/pickup/PickupBadges';
import { pickupService } from '../../services/pickupService';
import { PickupRequest, PickupStatus } from '../../types/pickup.types';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Truck, 
  UserCheck, 
  Package, 
  CheckCircle, 
  AlertCircle,
  XCircle,
  Sparkles
} from 'lucide-react';

export const PickupTrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [inputQuery, setInputQuery] = useState(initialId);
  const [pickup, setPickup] = useState<PickupRequest | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const lookupPickup = async (targetId: string) => {
    if (!targetId.trim()) return;
    try {
      setIsSearching(true);
      setErrorMsg('');
      const data = await pickupService.getPickupById(targetId.trim());
      setPickup(data);
      setSearchParams({ id: targetId.trim() });
    } catch (err: any) {
      setPickup(null);
      setErrorMsg(err.message || `No pickup record found for '${targetId}'.`);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      lookupPickup(initialId);
    }
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupPickup(inputQuery);
  };

  const handleCancel = async () => {
    if (!pickup) return;
    if (!window.confirm('Cancel this pending pickup request?')) return;
    try {
      await pickupService.updateStatus(pickup.id, 'Cancelled');
      setSuccessMsg('Pickup request successfully cancelled.');
      lookupPickup(pickup.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to cancel request.');
    }
  };

  const STAGES: { status: PickupStatus; label: string }[] = [
    { status: 'Pending', label: 'Submitted' },
    { status: 'Approved', label: 'Approved' },
    { status: 'Scheduled', label: 'Scheduled' },
    { status: 'Assigned', label: 'Crew Assigned' },
    { status: 'Completed', label: 'Collected' }
  ];

  const getStageIndex = (status: PickupStatus) => {
    if (status === 'Cancelled') return -1;
    return STAGES.findIndex((s) => s.status === status);
  };

  const currentStageIndex = pickup ? getStageIndex(pickup.status) : 0;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Live Dispatch Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Track Waste Pickup Request
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Enter your unique pickup booking reference (e.g. REQ-2026-1001) to view crew dispatch and vehicle allocation.
          </p>
        </div>

        {/* Search Lookup Bar */}
        <Card className="p-4 sm:p-6 bg-slate-900/90 border-slate-700/80 shadow-2xl">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter Booking ID (e.g. REQ-2026-1001)..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSearching}
              className="py-3 px-6"
            >
              Track Pickup
            </Button>
          </form>

          {/* Quick Samples */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>Sample reference IDs:</span>
            {['REQ-2026-1001', 'REQ-2026-1002', 'REQ-2026-1003'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setInputQuery(sample);
                  lookupPickup(sample);
                }}
                className="font-mono text-eco-400 hover:text-eco-300 underline underline-offset-2"
              >
                {sample}
              </button>
            ))}
          </div>
        </Card>

        {/* Feedback Messages */}
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

        {/* Pickup Result Detail */}
        {pickup && (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-eco-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/20">
                      {pickup.requestId}
                    </span>
                    <WasteTypeBadge wasteType={pickup.wasteType} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-100 pt-1">
                    {pickup.estimatedWasteQuantity}
                  </h2>
                </div>

                <PickupStatusBadge status={pickup.status} size="md" />
              </div>

              {/* Stepper Progress */}
              {pickup.status === 'Cancelled' ? (
                <div className="my-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center space-y-1">
                  <XCircle className="w-6 h-6 text-rose-400 mx-auto" />
                  <h4 className="text-sm font-bold text-rose-300">Request Cancelled</h4>
                  <p className="text-xs text-rose-400/80">This pickup was withdrawn before service completion.</p>
                </div>
              ) : (
                <div className="py-8">
                  <div className="overflow-x-auto pb-4">
                    <div className="min-w-[480px] flex items-center justify-between relative px-4">
                      {/* Connecting Bar */}
                      <div className="absolute top-5 left-10 right-10 h-1 bg-slate-800 -z-0">
                        <div
                          className="h-full bg-gradient-to-r from-eco-500 to-sky-500 transition-all duration-500"
                          style={{
                            width: `${(Math.max(0, currentStageIndex) / (STAGES.length - 1)) * 100}%`
                          }}
                        />
                      </div>

                      {STAGES.map((st, idx) => {
                        const isPast = idx < currentStageIndex;
                        const isCurrent = idx === currentStageIndex;

                        let nodeClasses = 'border-slate-700 bg-slate-900 text-slate-500';
                        if (isPast) {
                          nodeClasses = 'border-eco-500 bg-eco-500/20 text-eco-400';
                        } else if (isCurrent) {
                          nodeClasses = 'border-sky-400 bg-sky-500/30 text-sky-300 ring-4 ring-sky-500/20 animate-pulse';
                        }

                        return (
                          <div key={st.status} className="flex flex-col items-center relative z-10">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs ${nodeClasses}`}>
                              {idx + 1}
                            </div>
                            <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-sky-400 font-semibold' : isPast ? 'text-slate-200' : 'text-slate-500'}`}>
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500">Curbside Pickup Address</span>
                  <p className="text-slate-200 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-eco-400 shrink-0" />
                    {pickup.pickupAddress}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500">Requested Time Window</span>
                  <p className="text-slate-200 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                    {pickup.preferredDate} ({pickup.preferredTime})
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500">Assigned Vehicle</span>
                  <p className="text-slate-200 flex items-center gap-1.5 font-medium">
                    <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                    {pickup.assignedVehicle || 'Pending Route Optimization'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500">Collection Driver</span>
                  <p className="text-slate-200 flex items-center gap-1.5 font-medium">
                    <UserCheck className="w-4 h-4 text-eco-400 shrink-0" />
                    {pickup.assignedStaff || 'Awaiting Field Allocation'}
                  </p>
                </div>
              </div>

              {pickup.description && (
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs">
                  <span className="text-slate-500 block mb-1">Special Handling Instructions</span>
                  <p className="text-slate-300 italic">{pickup.description}</p>
                </div>
              )}

              {/* Actions */}
              {(pickup.status === 'Pending' || pickup.status === 'Approved') && (
                <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
                  <Button variant="danger" size="sm" onClick={handleCancel}>
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Cancel Request
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
