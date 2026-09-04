import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ComplaintStatusBadge, ComplaintPriorityBadge, ComplaintCategoryBadge } from '../../components/complaints/ComplaintBadges';
import { complaintService } from '../../services/complaintService';
import { userService } from '../../services/userService';
import { Complaint, ComplaintPriority } from '../../types/complaint.types';
import { User } from '../../types/user.types';
import { 
  ArrowLeft, 
  UserCheck, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Truck, 
  ShieldCheck,
  Send,
  Clock
} from 'lucide-react';

export const AdminAssignComplaintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [dispatchNote, setDispatchNote] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setErrorMsg('');

      const [complaintData, users] = await Promise.all([
        complaintService.getComplaintById(id),
        userService.getAllUsers({ role: 'Collection Staff' })
      ]);

      setComplaint(complaintData);
      setPriority(complaintData.priority);
      setSelectedStaffId(complaintData.assignedStaffId || '');
      setStaffList(users || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load assignment data.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!selectedStaffId) {
      setErrorMsg('Please select a collection staff member to assign.');
      return;
    }

    const assignedStaff = staffList.find((s) => s.id === selectedStaffId);
    const assignedStaffName = assignedStaff ? assignedStaff.name : 'Assigned Crew Member';

    try {
      setIsSubmitting(true);
      setErrorMsg('');

      await complaintService.updateComplaint(id, {
        assignedStaffId: selectedStaffId,
        assignedStaffName,
        priority
      });

      // If dispatch instructions provided, add as a note
      if (dispatchNote.trim()) {
        await complaintService.addComment(
          id,
          `[Dispatch Instructions] ${dispatchNote.trim()}`
        );
      }

      setSuccessMsg(`Complaint assigned to ${assignedStaffName} with ${priority} priority.`);
      setTimeout(() => {
        navigate(`/admin/complaints/${id}`);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to assign complaint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading assignment console...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!complaint) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-4">
          <Link to="/admin/complaints" className="inline-flex items-center text-xs text-sky-400">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Console
          </Link>
          <div className="p-4 rounded-xl bg-rose-500/10 text-rose-300">
            Complaint not found.
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/admin/complaints"
            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Complaints Console
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 mb-1 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Field Crew Dispatch
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Assign Complaint to Staff
          </h1>
          <p className="text-sm text-slate-400">
            Allocate a field operative or route truck to resolve this reported waste issue.
          </p>
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

        {/* Complaint Summary Card */}
        <Card className="bg-slate-900/80 border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-eco-400 bg-eco-500/10 px-2 py-0.5 rounded">
                {complaint.complaintId}
              </span>
              <ComplaintCategoryBadge category={complaint.category} />
            </div>
            <div className="flex items-center gap-2">
              <ComplaintPriorityBadge priority={complaint.priority} />
              <ComplaintStatusBadge status={complaint.status} />
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-100">{complaint.title}</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{complaint.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-eco-400" />
              <span>{complaint.location}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:justify-end">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Reported by {complaint.citizenName}</span>
            </div>
          </div>
        </Card>

        {/* Assignment Form */}
        <form onSubmit={handleAssign} className="space-y-6">
          <Card>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-sky-400" />
              Select Field Operative
            </h3>

            {staffList.length === 0 ? (
              <p className="text-xs text-amber-400">
                No collection staff found in database. Please register collection staff first.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staffList.map((staff) => {
                  const isSelected = selectedStaffId === staff.id;
                  return (
                    <button
                      type="button"
                      key={staff.id}
                      onClick={() => setSelectedStaffId(staff.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-sky-500 bg-sky-500/10 ring-1 ring-sky-500'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-sky-400" />
                          <h4 className="text-sm font-bold text-slate-100">{staff.name}</h4>
                        </div>
                        <p className="text-xs text-slate-400">{staff.email}</p>
                        <span className="inline-block text-[10px] text-eco-400 font-mono bg-eco-500/10 px-1.5 py-0.5 rounded">
                          {staff.city || 'Metro District'}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Adjust Priority & Instructions */}
          <Card className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Operational Priority
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Low', 'Medium', 'High', 'Urgent'] as ComplaintPriority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        isSelected
                          ? p === 'Urgent'
                            ? 'border-rose-500 bg-rose-500/20 text-rose-300 ring-1 ring-rose-500'
                            : 'border-sky-500 bg-sky-500/20 text-sky-300 ring-1 ring-sky-500'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="dispatch-notes"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Special Dispatch Instructions (Optional)
              </label>
              <textarea
                id="dispatch-notes"
                rows={3}
                placeholder="e.g. Bring hydraulic bin lift TRK-102. Alley access requires 2.5m clearance..."
                value={dispatchNote}
                onChange={(e) => setDispatchNote(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 text-xs p-3 focus:outline-none focus:border-sky-500 transition-all"
              />
            </div>
          </Card>

          {/* Submit Action */}
          <div className="flex justify-end gap-3 pt-2">
            <Link to="/admin/complaints">
              <Button type="button" variant="secondary" size="md">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              disabled={!selectedStaffId}
            >
              <Send className="w-4 h-4 mr-2" />
              Dispatch & Assign Crew
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
