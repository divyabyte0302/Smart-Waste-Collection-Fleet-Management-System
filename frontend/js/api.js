/**
 * Smart Waste Collection Management System - Frontend REST API Client
 */
const API = {
  baseUrl: '/api',

  // Generic Request Helper with JWT / Session Header Injection
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('smartwaste_token');
    const headers = options.headers || {};

    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || (data.error && data.error.message) || `HTTP error ${res.status}`);
      }
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  // Authentication & Users
  auth: {
    login: (credentials) => {
      return API.request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
    },
    register: (userData) => {
      return API.request('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    },
    getMe: () => API.request('/auth/me'),
    getUsers: (role) => API.request(`/auth/users${role ? `?role=${role}` : ''}`),
    getZones: () => API.request('/auth/zones')
  },

  // Complaints
  complaints: {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return API.request(`/complaints${qs ? `?${qs}` : ''}`);
    },
    getOne: (idOrTicket) => API.request(`/complaints/${encodeURIComponent(idOrTicket)}`),
    create: (formData) => {
      return API.request('/complaints', {
        method: 'POST',
        body: formData // multipart form-data
      });
    },
    updateStatus: (id, status, notes, photoFile = null) => {
      const formData = new FormData();
      formData.append('status', status);
      if (notes) formData.append('resolution_notes', notes);
      if (photoFile) formData.append('resolution_photo', photoFile);

      return API.request(`/complaints/${id}/status`, {
        method: 'PUT',
        body: formData
      });
    },
    assignVehicle: (id, vehicleId) => {
      return API.request(`/complaints/${id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle_id: vehicleId })
      });
    },
    delete: (id) => API.request(`/complaints/${id}`, { method: 'DELETE' })
  },

  // Pickups
  pickups: {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return API.request(`/pickups${qs ? `?${qs}` : ''}`);
    },
    getOne: (idOrNumber) => API.request(`/pickups/${encodeURIComponent(idOrNumber)}`),
    create: (formData) => {
      return API.request('/pickups', {
        method: 'POST',
        body: formData
      });
    },
    updateStatus: (id, status, notes) => {
      return API.request(`/pickups/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
    },
    schedule: (id, data) => {
      return API.request(`/pickups/${id}/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
  },

  // Vehicles
  vehicles: {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return API.request(`/vehicles${qs ? `?${qs}` : ''}`);
    },
    getOne: (id) => API.request(`/vehicles/${id}`),
    create: (data) => {
      return API.request('/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    },
    assignDriver: (id, driverId, driverName) => {
      return API.request(`/vehicles/${id}/assign-driver`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driver_id: driverId, driver_name: driverName })
      });
    },
    updateTelemetry: (id, telemetry) => {
      return API.request(`/vehicles/${id}/telemetry`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telemetry)
      });
    }
  },

  // Schedules
  schedules: {
    getAll: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return API.request(`/schedules${qs ? `?${qs}` : ''}`);
    },
    create: (data) => {
      return API.request('/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    },
    updateCheckpoint: (scheduleId, checkpointIndex, status) => {
      return API.request(`/schedules/${scheduleId}/checkpoint`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkpoint_index: checkpointIndex, status })
      });
    }
  },

  // Reports & Analytics
  reports: {
    getSummary: () => API.request('/reports/summary'),
    getLogs: () => API.request('/reports/logs'),
    getExportUrl: (type) => `${API.baseUrl}/reports/export/${type}`
  },

  // Notifications
  notifications: {
    getAll: (role) => API.request(`/notifications${role ? `?role=${role}` : ''}`),
    markRead: (id) => API.request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => API.request('/notifications/mark-all-read', { method: 'POST' })
  }
};
