import { request } from './api';
import { AuthResponseData, User, UpdateProfilePayload, ChangePasswordPayload } from '../types/user.types';

export const authService = {
  async register(payload: { name: string; email: string; password: string; phone?: string; address?: string; city?: string }) {
    const res = await request<AuthResponseData>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async login(payload: { email: string; password: string }) {
    const res = await request<AuthResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('smartwaste_jwt_token');
      localStorage.removeItem('smartwaste_user_data');
    }
  },

  async getProfile() {
    const res = await request<User>('/auth/profile');
    return res.data;
  },

  async updateProfile(payload: UpdateProfilePayload) {
    const res = await request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async changePassword(payload: ChangePasswordPayload) {
    const res = await request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res;
  },
};
