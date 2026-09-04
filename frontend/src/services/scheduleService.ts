/**
 * Collection Schedule Service - Frontend API Client
 */
import { request } from './api';
import { 
  Schedule, 
  ScheduleStatus, 
  CreateSchedulePayload, 
  UpdateSchedulePayload, 
  ScheduleFilterParams 
} from '../types/schedule.types';

export const scheduleService = {
  async getSchedules(params?: ScheduleFilterParams): Promise<Schedule[]> {
    const query = new URLSearchParams();
    if (params?.area) query.append('area', params.area);
    if (params?.date) query.append('date', params.date);
    if (params?.wasteType) query.append('wasteType', params.wasteType);
    if (params?.status) query.append('status', params.status);
    if (params?.staffId) query.append('staffId', params.staffId);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<Schedule[]>(`/schedules${qs}`);
    return res.data;
  },

  async getScheduleById(id: string): Promise<Schedule> {
    const res = await request<Schedule>(`/schedules/${id}`);
    return res.data;
  },

  async createSchedule(payload: CreateSchedulePayload): Promise<Schedule> {
    const res = await request<Schedule>('/schedules', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  async updateSchedule(id: string, payload: UpdateSchedulePayload): Promise<Schedule> {
    const res = await request<Schedule>(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  async updateStatus(id: string, status: ScheduleStatus | string): Promise<Schedule> {
    const res = await request<Schedule>(`/schedules/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    return res.data;
  },

  async deleteSchedule(id: string): Promise<void> {
    await request(`/schedules/${id}`, {
      method: 'DELETE'
    });
  }
};
