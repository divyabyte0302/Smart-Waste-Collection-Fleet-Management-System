/**
 * Smart Waste Collection Management System - State Management Store
 */
const State = {
  currentRole: 'CITIZEN', // CITIZEN | ADMIN | DRIVER
  activeAdminTab: 'overview',
  activeCitizenTab: 'report',
  
  // Data caches
  zones: [],
  vehicles: [],
  complaints: [],
  pickups: [],
  schedules: [],
  notifications: [],
  summary: null,
  activeDriverSchedule: null,

  // Event Listeners
  listeners: {},

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  },

  emit(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(fn => fn(payload));
    }
  },

  setRole(role) {
    this.currentRole = role;
    this.emit('roleChanged', role);
  },

  setAdminTab(tab) {
    this.activeAdminTab = tab;
    this.emit('adminTabChanged', tab);
  },

  setCitizenTab(tab) {
    this.activeCitizenTab = tab;
    this.emit('citizenTabChanged', tab);
  }
};
