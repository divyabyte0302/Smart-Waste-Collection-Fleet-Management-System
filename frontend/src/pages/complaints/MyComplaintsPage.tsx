import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { ComplaintCard } from '../../components/complaints/ComplaintCard';
import { Button } from '../../components/common/Button';
import { complaintService } from '../../services/complaintService';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../../types/complaint.types';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  RefreshCw, 
  Inbox, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const MyComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Filters & Search
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchComplaints = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      const res = await complaintService.getMyComplaints({
        search: search.trim() || undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        page,
        limit: 6
      });

      setComplaints(res.complaints || []);
      setTotalPages(res.pagination.totalPages || 1);
      setTotalCount(res.pagination.total || 0);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load your complaints.');
    } finally {
      setIsLoading(false);
    }
  }, [search, categoryFilter, statusFilter, page]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

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

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
              My Waste Complaints
            </h1>
            <p className="text-sm text-slate-400">
              Review filed issues, check resolution progress, and track municipal field crew dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchComplaints}
              isLoading={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Refresh
            </Button>

            <Link to="/citizen/report-issue">
              <Button variant="primary" size="sm">
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Report New Issue
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-7 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by Complaint ID (e.g. CMP-2026), location, or description..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-eco-500"
              />
            </div>

            {/* Status Dropdown */}
            <div className="md:col-span-5 flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
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

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-thin">
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
                    ? 'bg-eco-500 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Complaint Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-52 bg-slate-900/40 border border-slate-800/60 rounded-xl animate-pulse p-6 space-y-4"
              >
                <div className="h-4 bg-slate-800 rounded w-1/3" />
                <div className="h-6 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-500">
              <Inbox className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-200">No Complaints Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                {search || categoryFilter !== 'All' || statusFilter !== 'All'
                  ? 'No complaints matched your search filter parameters.'
                  : "You have not filed any waste complaints yet. If you notice overflowing bins or illegal dumping in your neighborhood, let us know."}
              </p>
            </div>
            <Link to="/citizen/report-issue">
              <Button variant="primary" size="sm">
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Report an Issue
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {complaints.map((c) => (
                <ComplaintCard
                  key={c.id}
                  complaint={c}
                  detailsUrl={`/citizen/complaints/${c.id}`}
                />
              ))}
            </div>

            {/* Pagination Controls */}
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
        )}
      </div>
    </DashboardLayout>
  );
};
