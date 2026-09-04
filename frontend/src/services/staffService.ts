/**
 * Staff Service - Frontend API Client
 */
import { request } from './api';
import {
  StaffMember,
  StaffStats,
  CreateStaffPayload,
  UpdateStaffPayload
} from '../types/staff.types';

export const staffService = {
  getStaff: async (params: {
    role?: string;
    status?: string;
    assignedArea?: string;
    search?: string;
    me?: boolean;
  } = {}): Promise<{ staff: StaffMember[]; stats: StaffStats }> => {
    const query = new URLSearchParams();
    if (params.role) query.append('role', params.role);
    if (params.status) query.append('status', params.status);
    if (params.assignedArea) query.append('assignedArea', params.assignedArea);
    if (params.search) query.append('search', params.search);
    if (params.me) query.append('me', 'true');

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request<StaffMember[]>(`/staff${queryString}`);
    return {
      staff: res.data || [],
      stats: (res as any).stats || {
        total: 0,
        drivers: 0,
        collectors: 0,
        supervisors: 0,
        available: 0,
        assigned: 0,
        onDuty: 0,
        inactive: 0
      }
    };
  },

  getMyProfile: async (): Promise<StaffMember | null> => {
    try {
      const res = await request<StaffMember>('/staff?me=true');
      return res.data;
    } catch {
      return null;
    }
  },

  getStaffById: async (id: string): Promise<StaffMember> => {
    const res = await request<StaffMember>(`/staff/${id}`);
    return res.data;
  },

  createStaff: async (payload: CreateStaffPayload): Promise<StaffMember> => {
    const res = await request<StaffMember>('/staff', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  updateStaff: async (id: string, payload: UpdateStaffPayload): Promise<StaffMember> => {
    const res = await request<StaffMember>(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  deleteStaff: async (id: string): Promise<void> => {
    await request<null>(`/staff/${id}`, {
      method: 'DELETE'
    });
  }
};
