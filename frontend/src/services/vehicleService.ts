/**
 * Vehicle Service - Frontend API Client
 */
import { request } from './api';
import {
  Vehicle,
  VehicleStats,
  VehicleStatus,
  CreateVehiclePayload,
  UpdateVehiclePayload
} from '../types/vehicle.types';

export const vehicleService = {
  getVehicles: async (params: {
    status?: string;
    vehicleType?: string;
    currentArea?: string;
    driverId?: string;
    search?: string;
  } = {}): Promise<{ vehicles: Vehicle[]; stats: VehicleStats }> => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.vehicleType) query.append('vehicleType', params.vehicleType);
    if (params.currentArea) query.append('currentArea', params.currentArea);
    if (params.driverId) query.append('driverId', params.driverId);
    if (params.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request<Vehicle[]>(`/vehicles${queryString}`);
    return {
      vehicles: res.data || [],
      stats: (res as any).stats || {
        total: 0,
        available: 0,
        assigned: 0,
        onRoute: 0,
        maintenance: 0,
        inactive: 0
      }
    };
  },

  getVehicleById: async (id: string): Promise<Vehicle> => {
    const res = await request<Vehicle>(`/vehicles/${id}`);
    return res.data;
  },

  createVehicle: async (payload: CreateVehiclePayload): Promise<Vehicle> => {
    const res = await request<Vehicle>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  updateVehicle: async (id: string, payload: UpdateVehiclePayload): Promise<Vehicle> => {
    const res = await request<Vehicle>(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  updateStatus: async (id: string, status: VehicleStatus, notes?: string): Promise<Vehicle> => {
    const res = await request<Vehicle>(`/vehicles/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
    return res.data;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await request<null>(`/vehicles/${id}`, {
      method: 'DELETE'
    });
  }
};
