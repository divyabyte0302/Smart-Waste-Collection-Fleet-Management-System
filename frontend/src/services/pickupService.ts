/**
 * Pickup Service - Frontend API Client
 */
import { request } from './api';
import { PickupRequest, CreatePickupPayload, UpdatePickupPayload } from '../types/pickup.types';

export const pickupService = {
  /**
   * Submit a new waste pickup request
   */
  async createPickup(payload: CreatePickupPayload): Promise<PickupRequest> {
    const res = await request<PickupRequest>('/pickups', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  /**
   * Retrieve pickup requests (Citizen gets their own, Admin/Staff gets all)
   */
  async getPickups(params?: { wasteType?: string; status?: string; search?: string }): Promise<PickupRequest[]> {
    const query = new URLSearchParams();
    if (params?.wasteType) query.append('wasteType', params.wasteType);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await request<PickupRequest[]>(`/pickups${qs}`);
    return res.data;
  },

  /**
   * Get single pickup request by ID or requestId (e.g. REQ-2026-1001)
   */
  async getPickupById(id: string): Promise<PickupRequest> {
    const res = await request<PickupRequest>(`/pickups/${id}`);
    return res.data;
  },

  /**
   * Update pickup details or assign vehicle & crew (Admin)
   */
  async updatePickup(id: string, payload: UpdatePickupPayload): Promise<PickupRequest> {
    const res = await request<PickupRequest>(`/pickups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  /**
   * Update pickup request status (Approve, Schedule, Complete, Cancel)
   */
  async updateStatus(id: string, status: string): Promise<PickupRequest> {
    const res = await request<PickupRequest>(`/pickups/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    return res.data;
  },

  /**
   * Cancel or delete pickup request
   */
  async deletePickup(id: string): Promise<void> {
    await request(`/pickups/${id}`, {
      method: 'DELETE'
    });
  }
};
