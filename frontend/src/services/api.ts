import { ApiResponse } from '../types/api.types';
import { handleDemoRequest } from './demoService';

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

  let response: Response | null = null;
  try {
    response = await fetch(getUrl(endpoint), {
      ...options,
      headers,
    });
  } catch (netErr) {
    console.warn(`[API] Network failure calling ${endpoint}. Engaging demo engine:`, netErr);
    return handleDemoRequest<T>(endpoint, options);
  }

  // Check if static host returned HTML instead of JSON (Vercel rewrite to index.html without a backend)
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    console.info(`[API] Endpoint ${endpoint} returned HTML (static host detected). Falling back to client-side demo engine.`);
    return handleDemoRequest<T>(endpoint, options);
  }

  const data: ApiResponse<T> = await response.json().catch(() => {
    console.warn(`[API] Could not parse JSON from ${endpoint}. Engaging demo fallback.`);
    return handleDemoRequest<T>(endpoint, options);
  });

  if (!response.ok && !data.success) {
    const errorMsg = data.message || (data.errors ? data.errors.join(', ') : `HTTP error ${response.status}`);
    throw new Error(errorMsg);
  }

  return data;
}
