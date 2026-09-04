import { ApiResponse } from '../types/api.types';

const getUrl = (endpoint: string) => {
  const rawBase = (import.meta.env.VITE_API_BASE_URL as string) || '/api';
  const base = rawBase.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('smartwaste_jwt_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(getUrl(endpoint), {
    ...options,
    headers,
  });

  const data: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    message: 'Failed to parse response.',
    data: null as any,
  }));

  if (!response.ok) {
    const errorMsg = data.message || (data.errors ? data.errors.join(', ') : `HTTP error ${response.status}`);
    throw new Error(errorMsg);
  }

  return data;
}
