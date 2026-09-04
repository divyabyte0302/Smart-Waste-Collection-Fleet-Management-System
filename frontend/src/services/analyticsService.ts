/**
 * Analytics Service - Frontend API Client & CSV Exporter
 */
import { request } from './api';
import {
  DashboardAnalyticsResponse,
  ComplaintAnalytics,
  PickupAnalytics,
  VehicleAnalytics,
  StaffAnalytics,
  DailyReportData,
  WeeklyReportData,
  MonthlyReportData
} from '../types/analytics.types';

export interface AnalyticsFilterParams {
  startDate?: string;
  endDate?: string;
  area?: string;
}

export const analyticsService = {
  getDashboardMetrics: async (params: AnalyticsFilterParams = {}): Promise<DashboardAnalyticsResponse> => {
    const query = new URLSearchParams();
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    if (params.area && params.area !== 'All') query.append('area', params.area);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request<DashboardAnalyticsResponse>(`/analytics/dashboard${queryString}`);
    return res.data;
  },

  getComplaintAnalytics: async (params: AnalyticsFilterParams = {}): Promise<ComplaintAnalytics> => {
    const query = new URLSearchParams();
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    if (params.area && params.area !== 'All') query.append('area', params.area);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request<ComplaintAnalytics>(`/analytics/complaints${queryString}`);
    return res.data;
  },

  getPickupAnalytics: async (params: AnalyticsFilterParams = {}): Promise<PickupAnalytics> => {
    const query = new URLSearchParams();
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    if (params.area && params.area !== 'All') query.append('area', params.area);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request<PickupAnalytics>(`/analytics/pickups${queryString}`);
    return res.data;
  },

  getVehicleAnalytics: async (params: AnalyticsFilterParams = {}): Promise<VehicleAnalytics> => {
    const query = new URLSearchParams();
    if (params.area && params.area !== 'All') query.append('area', params.area);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request<VehicleAnalytics>(`/analytics/vehicles${queryString}`);
    return res.data;
  },

  getStaffAnalytics: async (params: AnalyticsFilterParams = {}): Promise<StaffAnalytics> => {
    const query = new URLSearchParams();
    if (params.area && params.area !== 'All') query.append('area', params.area);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request<StaffAnalytics>(`/analytics/staff${queryString}`);
    return res.data;
  },

  getDailyReport: async (date?: string, area?: string): Promise<DailyReportData> => {
    const query = new URLSearchParams();
    if (date) query.append('date', date);
    if (area && area !== 'All') query.append('area', area);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request<DailyReportData>(`/reports/daily${queryString}`);
    return res.data;
  },

  getWeeklyReport: async (area?: string): Promise<WeeklyReportData> => {
    const query = new URLSearchParams();
    if (area && area !== 'All') query.append('area', area);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request<WeeklyReportData>(`/reports/weekly${queryString}`);
    return res.data;
  },

  getMonthlyReport: async (month?: string, year?: number, area?: string): Promise<MonthlyReportData> => {
    const query = new URLSearchParams();
    if (month) query.append('month', month);
    if (year) query.append('year', String(year));
    if (area && area !== 'All') query.append('area', area);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request<MonthlyReportData>(`/reports/monthly${queryString}`);
    return res.data;
  },

  downloadCSV: async (reportType: 'daily' | 'weekly' | 'monthly', params: { date?: string; area?: string } = {}) => {
    const token = localStorage.getItem('smartwaste_jwt_token');
    const query = new URLSearchParams();
    query.append('format', 'csv');
    if (params.date) query.append('date', params.date);
    if (params.area && params.area !== 'All') query.append('area', params.area);

    const response = await fetch(`/api/reports/${reportType}?${query.toString()}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    if (!response.ok) {
      throw new Error('Failed to generate CSV export.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `municipal-${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
