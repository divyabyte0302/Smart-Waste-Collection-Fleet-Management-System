import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ComplaintTimeline } from '../../components/complaints/ComplaintTimeline';
import { ComplaintStatusBadge, ComplaintPriorityBadge, ComplaintCategoryBadge } from '../../components/complaints/ComplaintBadges';
import { complaintService } from '../../services/complaintService';
import { Complaint } from '../../types/complaint.types';
import { 
  Search, 
  MapPin, 
  Clock, 
  ArrowRight, 
  UserCheck, 
  AlertCircle,
  CheckCircle2,
  FileSearch,
  Sparkles
} from 'lucide-react';

export const ComplaintTrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [inputQuery, setInputQuery] = useState(initialId);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const lookupComplaint = async (targetId: string) => {
    if (!targetId.trim()) return;
    try {
      setIsSearching(true);
      setErrorMsg('');
      const data = await complaintService.getComplaintById(targetId.trim());
      setComplaint(data);
      setSearchParams({ id: targetId.trim() });
    } catch (err: any) {
      setComplaint(null);
      setErrorMsg(err.message || `No active record found for '${targetId}'.`);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      lookupComplaint(initialId);
    }
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupComplaint(inputQuery);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-eco-500/10 border border-eco-500/20 text-eco-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Live Municipal Dispatch Radar
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Real-Time Complaint Status Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Enter your unique complaint reference number (e.g., CMP-2026-1001) to trace review status, field crew assignment, and resolution progress.
          </p>
        </div>

        {/* Tracking Lookup Bar */}
        <Card className="p-4 sm:p-6 bg-slate-900/90 border-slate-700/80 shadow-2xl">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter Complaint ID (e.g. CMP-2026-1001)..."
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
              Track Status
            </Button>
          </form>

          {/* Quick Demo Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>Quick lookup samples:</span>
            {['CMP-2026-1001', 'CMP-2026-1002', 'CMP-2026-1003'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setInputQuery(sample);
                  lookupComplaint(sample);
                }}
                className="font-mono text-eco-400 hover:text-eco-300 underline underline-offset-2"
              >
                {sample}
              </button>
            ))}
          </div>
        </Card>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Complaint Result View */}
        {complaint ? (
          <div className="space-y-6 animate-fade-in">
            {/* Overview Card */}
            <Card className="border-eco-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-eco-400 bg-eco-500/10 px-2.5 py-1 rounded border border-eco-500/20">
                      {complaint.complaintId}
                    </span>
                    <ComplaintCategoryBadge category={complaint.category} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-100 pt-1">
                    {complaint.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <ComplaintPriorityBadge priority={complaint.priority} size="md" />
                  <ComplaintStatusBadge status={complaint.status} size="md" />
                </div>
              </div>

              {/* Progress Stepper & Timeline */}
              <div className="py-6">
                <ComplaintTimeline
                  currentStatus={complaint.status}
                  events={complaint.timeline}
                />
              </div>

              {/* Location & Assigned Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500">Incident Location</span>
                  <p className="text-slate-200 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-eco-400 shrink-0" />
                    {complaint.location}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500">Assigned Field Crew</span>
                  <p className="text-slate-200 flex items-center gap-1.5 font-medium">
                    <UserCheck className="w-4 h-4 text-sky-400 shrink-0" />
                    {complaint.assignedStaffName || 'Under Review for Dispatch'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500">Logged Timestamp</span>
                  <p className="text-slate-200 flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    {new Date(complaint.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
                <Link to={`/citizen/complaints/${complaint.id}`}>
                  <Button variant="primary" size="sm">
                    View Complete Case File
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        ) : !isSearching && !errorMsg && (
          <div className="border border-slate-800/80 rounded-2xl bg-slate-900/30 p-12 text-center space-y-3">
            <FileSearch className="w-12 h-12 mx-auto text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-300">
              No Complaint Active in Tracker
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Search by reference ID above or browse your history in My Complaints.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
