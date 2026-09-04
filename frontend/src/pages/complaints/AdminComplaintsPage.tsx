import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ComplaintStatusBadge, ComplaintPriorityBadge, ComplaintCategoryBadge } from '../../components/complaints/ComplaintBadges';
import { ComplaintCard } from '../../components/complaints/ComplaintCard';
import { complaintService } from '../../services/complaintService';
import { 
  Complaint, 
  ComplaintCategory, 
  ComplaintStatus, 
  ComplaintPriority,
  ComplaintOverviewMetrics 
} from '../../types/complaint.types';
import { 
  AlertCircle, 
  RefreshCw, 
  Search, 
  Filter, 
  UserCheck, 
  Eye, 
  Trash2, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  Flame, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export const AdminComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [metrics, setMetrics] = useState<ComplaintOverviewMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // View mode: 'table' | 'grid'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchComplaints = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      const [res, stats] = await Promise.all([
        complaintService.getComplaints({
          search: search.trim() || undefined,
          category: categoryFilter !== 'All' ? categoryFilter : undefined,
          status: statusFilter !== 'All' ? statusFilter : undefined,
          priority: priorityFilter !== 'All' ? priorityFilter : undefined,
          page,
          limit: viewMode === 'table' ? 10 : 6
        }),
        complaintService.getOverviewMetrics()
      ]);

      setComplaints(res.complaints || []);
      setTotalPages(res.pagination.totalPages || 1);
      setTotalCount(res.pagination.total || 0);
      setMetrics(stats);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load complaints registry.');
    } finally {
      setIsLoading(false);
    }
  }, [search, categoryFilter, statusFilter, priorityFilter, page, viewMode]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleQuickStatusChange = async (complaintId: string, newStatus: ComplaintStatus) => {
    try {
      await complaintService.updateStatus(complaintId, { status: newStatus });
      setSuccessMsg(`Complaint status updated to ${newStatus}.`);
      fetchComplaints();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update status.');
    }
  };

  const handleDeleteComplaint = async (complaintId: string) => {
    if (!window.confirm('Delete this complaint record permanently?')) return;
    try {
      await complaintService.deleteComplaint(complaintId);
      setSuccessMsg('Complaint removed from registry.');
      fetchComplaints();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete complaint.');
    }
  };

  const categories: (ComplaintCategory | 'All')[] = [
    'All',
    'Missed Collection',
    'Overflowing Bin',
    'Illegal Dumping',
    'Damaged Bin',
    'Other'
  ];

  const statuses: (ComplaintStatus | 'All')[] = [
    'All',
    'Submitted',
    'Under Review',
    'Assigned',
    'In Progress',
    'Resolved',
    'Closed'
  ];

  const priorities: (ComplaintPriority | 'All')[] = ['All', 'Low', 'Medium', 'High', 'Urgent'];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Municipal Operations Command
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Complaint Management Console
            </h1>
            <p className="text-sm text-slate-400">
              Triage citizen complaints, adjust priorities, assign field staff, and monitor resolution timelines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={fetchComplaints} isLoading={isLoading}>
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Top KPI Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card className="bg-slate-900/60 border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Total Complaints</span>
              <div className="text-2xl font-bold text-slate-100 mt-1">{metrics.total}</div>
              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-eco-400" /> All-time reports
              </span>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800">
              <span className="text-xs text-sky-400 font-medium">Review & Triage</span>
              <div className="text-2xl font-bold text-sky-300 mt-1">
                {metrics.submitted + metrics.underReview}
              </div>
              <span className="text-[11px] text-slate-500 mt-1">Awaiting crew dispatch</span>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800">
              <span className="text-xs text-amber-400 font-medium">Active in Field</span>
              <div className="text-2xl font-bold text-amber-300 mt-1">
                {metrics.assigned + metrics.inProgress}
              </div>
              <span className="text-[11px] text-slate-500 mt-1">Dispatched to vehicles</span>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800">
              <span className="text-xs text-emerald-400 font-medium">Resolved & Closed</span>
              <div className="text-2xl font-bold text-emerald-300 mt-1">{metrics.resolved}</div>
              <span className="text-[11px] text-slate-500 mt-1">Confirmed remediated</span>
            </Card>

            <Card className="bg-slate-900/60 border-rose-900/40">
              <span className="text-xs text-rose-400 font-medium flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Urgent / High
              </span>
              <div className="text-2xl font-bold text-rose-300 mt-1">{metrics.urgentOrHigh}</div>
              <span className="text-[11px] text-slate-500 mt-1">Requires priority response</span>
            </Card>
          </div>
        )}

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

        {/* Filters and Control Toolbar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by ID (CMP-2026), keyword, street, or citizen name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Status Selector */}
            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    Status: {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Selector */}
            <div className="sm:col-span-3">
              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    Priority: {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary Filter Row: Category Tabs & View Mode Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategoryFilter(cat);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${
                  viewMode === 'table'
                    ? 'bg-slate-800 text-sky-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${
                  viewMode === 'grid'
                    ? 'bg-slate-800 text-sky-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Data Display */}
        {isLoading ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Fetching complaint logs...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-slate-200">No Complaints Match Criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms or clearing status filters.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {complaints.map((c) => (
              <ComplaintCard
                key={c.id}
                complaint={c}
                detailsUrl={`/admin/complaints/${c.id}`}
                showCitizen
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Complaint ID</th>
                    <th className="py-3 px-4">Category & Title</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned Crew</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-sky-400 whitespace-nowrap">
                        {c.complaintId}
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-200 truncate">{c.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{c.category}</span>
                          <span>•</span>
                          <span>{c.citizenName}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-xs truncate text-slate-400">
                        {c.location}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <ComplaintPriorityBadge priority={c.priority} />
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <select
                          value={c.status}
                          onChange={(e) =>
                            handleQuickStatusChange(c.id, e.target.value as ComplaintStatus)
                          }
                          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                        >
                          {statuses
                            .filter((s) => s !== 'All')
                            .map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                        </select>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                        {c.assignedStaffName ? (
                          <span className="text-sky-400 flex items-center gap-1 font-medium">
                            <UserCheck className="w-3.5 h-3.5" />
                            {c.assignedStaffName}
                          </span>
                        ) : (
                          <Link
                            to={`/admin/complaints/${c.id}/assign`}
                            className="text-amber-400 hover:underline flex items-center gap-1"
                          >
                            + Assign Staff
                          </Link>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/complaints/${c.id}/assign`}
                            className="p-1.5 rounded hover:bg-slate-800 text-sky-400 hover:text-sky-300"
                            title="Assign Crew Member"
                          >
                            <UserCheck className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/admin/complaints/${c.id}`}
                            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                            title="View Case File"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeleteComplaint(c.id)}
                            className="p-1.5 rounded hover:bg-slate-800 text-rose-400 hover:text-rose-300"
                            title="Delete Complaint"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
            <span>
              Showing page <strong className="text-slate-200">{page}</strong> of{' '}
              <strong className="text-slate-200">{totalPages}</strong> ({totalCount} total)
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
