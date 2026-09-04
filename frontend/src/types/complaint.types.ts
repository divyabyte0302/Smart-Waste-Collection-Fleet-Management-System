/**
 * Complaint Management TypeScript Types & Data Contracts
 */

export type ComplaintCategory =
  | 'Missed Collection'
  | 'Overflowing Bin'
  | 'Illegal Dumping'
  | 'Damaged Bin'
  | 'Other';

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface ComplaintComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  comment: string;
  createdAt: string;
}

export interface ComplaintTimelineEvent {
  status: ComplaintStatus;
  title: string;
  description: string;
  timestamp: string;
  updatedBy: string;
}

export interface Complaint {
  id: string;
  complaintId: string;
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhone?: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  image?: string | null;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedStaffId?: string | null;
  assignedStaffName?: string | null;
  comments?: ComplaintComment[];
  timeline?: ComplaintTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateComplaintPayload {
  category: ComplaintCategory;
  title: string;
  description: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  image?: string | null;
  priority?: ComplaintPriority;
  initialComment?: string;
}

export interface UpdateComplaintPayload {
  title?: string;
  description?: string;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  image?: string | null;
  priority?: ComplaintPriority;
  assignedStaffId?: string | null;
  assignedStaffName?: string | null;
}

export interface UpdateComplaintStatusPayload {
  status: ComplaintStatus;
  note?: string;
}

export interface ComplaintFilterParams {
  category?: string;
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
  assignedStaffId?: string;
}

export interface PaginatedComplaintsResponse {
  complaints: Complaint[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ComplaintOverviewMetrics {
  total: number;
  submitted: number;
  underReview: number;
  assigned: number;
  inProgress: number;
  resolved: number;
  urgentOrHigh: number;
}
