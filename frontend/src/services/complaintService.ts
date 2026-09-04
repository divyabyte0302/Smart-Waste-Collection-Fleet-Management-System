/**
 * Complaint Service - Frontend API Client
 */
import { request } from './api';
import {
  Complaint,
  CreateComplaintPayload,
  UpdateComplaintPayload,
  UpdateComplaintStatusPayload,
  ComplaintFilterParams,
  PaginatedComplaintsResponse,
  ComplaintOverviewMetrics
} from '../types/complaint.types';

export const complaintService = {
  /**
   * File a new waste complaint (Citizen)
   */
  async createComplaint(payload: CreateComplaintPayload): Promise<Complaint> {
    const res = await request<Complaint>('/complaints', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  /**
   * Get all complaints with filtering and pagination (Admin & Staff)
   */
  async getComplaints(params?: ComplaintFilterParams): Promise<PaginatedComplaintsResponse> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.assignedStaffId) query.append('assignedStaffId', params.assignedStaffId);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<PaginatedComplaintsResponse>(`/complaints${qs}`);
    return res.data;
  },

  /**
   * Get complaints submitted by the authenticated citizen
   */
  async getMyComplaints(params?: ComplaintFilterParams): Promise<PaginatedComplaintsResponse> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<PaginatedComplaintsResponse>(`/complaints/my-complaints${qs}`);
    return res.data;
  },

  /**
   * Get single complaint by ID or complaintId (e.g. CMP-2026-1001)
   */
  async getComplaintById(id: string): Promise<Complaint> {
    const res = await request<Complaint>(`/complaints/${id}`);
    return res.data;
  },

  /**
   * Update complaint details, priority or assign staff (Admin)
   */
  async updateComplaint(id: string, payload: UpdateComplaintPayload): Promise<Complaint> {
    const res = await request<Complaint>(`/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  /**
   * Update complaint status with audit timeline entry
   */
  async updateStatus(id: string, payload: UpdateComplaintStatusPayload): Promise<Complaint> {
    const res = await request<Complaint>(`/complaints/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  /**
   * Delete complaint (Citizen can withdraw submitted, Admin can delete)
   */
  async deleteComplaint(id: string): Promise<void> {
    await request(`/complaints/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Add interactive comment/update
   */
  async addComment(id: string, comment: string): Promise<Complaint> {
    const res = await request<Complaint>(`/complaints/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment })
    });
    return res.data;
  },

  /**
   * Overview KPI statistics
   */
  async getOverviewMetrics(): Promise<ComplaintOverviewMetrics> {
    const res = await request<ComplaintOverviewMetrics>('/complaints/stats/overview');
    return res.data;
  }
};
