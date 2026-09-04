import { request } from './api';
import { User, UserStatus } from '../types/user.types';

export const userService = {
  async getAllUsers(params: { role?: string; status?: string; search?: string } = {}) {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    const res = await request<User[]>(`/users${qs ? `?${qs}` : ''}`);
    return res.data;
  },

  async updateUserStatus(id: string, status: UserStatus) {
    const res = await request<User>(`/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return res.data;
  },
};
