import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ComplaintTimeline } from '../../components/complaints/ComplaintTimeline';
import { ComplaintStatusBadge, ComplaintPriorityBadge, ComplaintCategoryBadge } from '../../components/complaints/ComplaintBadges';
import { complaintService } from '../../services/complaintService';
import { Complaint, ComplaintStatus } from '../../types/complaint.types';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  Trash2, 
  ExternalLink,
  Shield,
  User,
  Navigation
} from 'lucide-react';

export const ComplaintDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Comment State
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Status Change State (Admin)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusNote, setStatusNote] = useState('');

  const isAdmin = user?.role === 'Administrator';
  const isStaff = user?.role === 'Collection Staff';

  const fetchComplaint = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setErrorMsg('');
      const data = await complaintService.getComplaintById(id);
      setComplaint(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load complaint details.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.trim()) return;

    try {
      setIsPostingComment(true);
      setErrorMsg('');
      const updated = await complaintService.addComment(id, newComment);
      setComplaint(updated);
      setNewComment('');
      setSuccessMsg('Note posted successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to post note.');
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleStatusChange = async (newStatus: ComplaintStatus) => {
    if (!id) return;
    try {
      setIsUpdatingStatus(true);
      setErrorMsg('');
      const updated = await complaintService.updateStatus(id, {
        status: newStatus,
        note: statusNote.trim() || undefined
      });
      setComplaint(updated);
      setStatusNote('');
      setSuccessMsg(`Status updated to ${newStatus}.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this complaint record? This cannot be undone.')) {
      return;
    }

    try {
      await complaintService.deleteComplaint(id);
      if (isAdmin) {
        navigate('/admin/complaints');
      } else {
        navigate('/citizen/my-complaints');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete complaint.');
    }
  };

  const backUrl = isAdmin
    ? '/admin/complaints'
    : isStaff
    ? '/staff'
    : '/citizen/my-complaints';

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto py-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-eco-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading complaint case file...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (errorMsg || !complaint) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-4">
          <Link to={backUrl} className="inline-flex items-center text-xs text-eco-400 hover:text-eco-300">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Link>
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 shrink-0 text-rose-400" />
            <div>
              <h3 className="font-semibold text-sm">Complaint Not Found or Access Denied</h3>
              <p className="text-xs text-rose-400/90 mt-0.5">{errorMsg || 'Could not find this record.'}</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Navigation & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <Link
            to={backUrl}
            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to {isAdmin ? 'Complaints Console' : 'My Complaints'}
          </Link>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to={`/admin/complaints/${complaint.id}/assign`}>
                <Button variant="outline" size="sm">
                  <UserCheck className="w-4 h-4 mr-1.5 text-sky-400" />
                  Assign / Reassign Staff
                </Button>
              </Link>
            )}

            {(isAdmin || (complaint.status === 'Submitted' && complaint.citizenId === user?.id)) && (
              <Button variant="danger" size="sm" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete Case
              </Button>
            )}
          </div>
        </div>

        {/* Feedback Messages */}
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

        {/* Hero Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold text-eco-400 bg-eco-500/10 px-2.5 py-1 rounded border border-eco-500/20">
                  {complaint.complaintId}
                </span>
                <ComplaintCategoryBadge category={complaint.category} />
                <ComplaintPriorityBadge priority={complaint.priority} size="md" />
                <ComplaintStatusBadge status={complaint.status} size="md" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">{complaint.title}</h1>
            </div>

            <div className="text-xs text-slate-400 md:text-right space-y-1">
              <div>
                Logged on: <strong className="text-slate-200">{new Date(complaint.createdAt).toLocaleString()}</strong>
              </div>
              <div>
                Last update: <strong className="text-slate-200">{new Date(complaint.updatedAt).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Left (Details & Evidence), Right (Timeline & Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Evidence & Location */}
          <div className="lg:col-span-7 space-y-6">
            {/* Description & Citizen Details */}
            <Card>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Issue Description
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {complaint.description}
              </p>

              <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Reporting Citizen
                  </span>
                  <p className="font-medium text-slate-200">{complaint.citizenName}</p>
                  <p className="text-slate-400">{complaint.citizenEmail}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-sky-400" /> Assigned Fleet Crew
                  </span>
                  <p className="font-medium text-slate-200">
                    {complaint.assignedStaffName || 'Not yet assigned'}
                  </p>
                  {complaint.assignedStaffName && (
                    <p className="text-slate-400">Municipal Collection Division</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Geolocation & Address */}
            <Card>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-eco-400" />
                Geotagged Location
              </h3>
              <p className="text-sm text-slate-200 font-medium">{complaint.location}</p>

              {(complaint.latitude && complaint.longitude) && (
                <div className="mt-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-sky-400" />
                    GPS: {complaint.latitude}, {complaint.longitude}
                  </span>
                  <a
                    href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-eco-400 hover:text-eco-300 flex items-center gap-1"
                  >
                    Open in Maps
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </Card>

            {/* Attached Photo Evidence */}
            {complaint.image && (
              <Card>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Photo Evidence
                </h3>
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 max-h-96">
                  <img
                    src={complaint.image}
                    alt="Evidence"
                    className="w-full h-full object-contain mx-auto"
                  />
                </div>
              </Card>
            )}

            {/* Comments / Discussion Thread */}
            <Card>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-eco-400" />
                Case Notes & Updates ({complaint.comments?.length || 0})
              </h3>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-1">
                {complaint.comments && complaint.comments.length > 0 ? (
                  complaint.comments.map((cmt) => (
                    <div
                      key={cmt.id}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-200">{cmt.authorName}</strong>
                          <span className="text-[10px] uppercase font-bold text-eco-400 bg-eco-500/10 px-1.5 py-0.5 rounded">
                            {cmt.authorRole}
                          </span>
                        </div>
                        <span className="text-slate-500 text-[11px]">
                          {new Date(cmt.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{cmt.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No notes logged yet.</p>
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Post an update or note to this complaint..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-eco-500"
                />
                <Button type="submit" size="sm" variant="primary" isLoading={isPostingComment}>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Post
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Column (5 cols): Timeline & Admin Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Admin Status Triage Controls */}
            {(isAdmin || isStaff) && (
              <Card className="border-sky-500/30 bg-gradient-to-b from-sky-950/20 to-slate-900">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-sky-300 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    Dispatch Status Control
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update case triage state to notify the reporting citizen
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {(['Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'] as ComplaintStatus[]).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          disabled={isUpdatingStatus || complaint.status === st}
                          onClick={() => handleStatusChange(st)}
                          className={`py-2 px-2.5 rounded-lg text-xs font-semibold border text-center transition-all ${
                            complaint.status === st
                              ? 'border-sky-500 bg-sky-500/20 text-sky-300 ring-1 ring-sky-500'
                              : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Optional audit log note (e.g. Crew TRK-101 en route)..."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </Card>
            )}

            {/* Stepper Progress & Timeline */}
            <Card>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Resolution Timeline
              </h3>
              <ComplaintTimeline
                currentStatus={complaint.status}
                events={complaint.timeline}
              />
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
