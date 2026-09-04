/**
 * Smart Waste Collection Management System - Main Application Orchestrator
 */
const App = {
  async init() {
    console.log('Initializing Smart Waste Collection Management Application...');
    this.setupNotifications();

    try {
      await this.loadAllData();
      
      // Initialize sub-modules
      CitizenModule.init();
      AdminModule.init();
      DriverModule.init();

      // Initialize Authentication Gatekeeper and Redirection
      AuthModule.init();

      // Setup live background poll
      setInterval(() => {
        this.loadAllData(true);
      }, 12000);

      console.log('Application initialized successfully.');
    } catch (err) {
      console.error('Initialization error:', err);
      UI.toast('Unable to connect to backend service. Running in demo mode.', 'error');
    }
  },

  setupNotifications() {
    const notifBtn = document.getElementById('btn-notifications-toggle');
    const notifModal = document.getElementById('modal-notifications');
    const markAllBtn = document.getElementById('btn-mark-all-read');

    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        this.renderNotificationsList();
        UI.openModal('modal-notifications');
      });
    }

    if (markAllBtn) {
      markAllBtn.addEventListener('click', async () => {
        await API.notifications.markAllRead();
        await this.loadAllData(true);
        this.renderNotificationsList();
        UI.toast('All alerts marked as read', 'success');
      });
    }
  },

  async loadAllData(silent = false) {
    try {
      const [zonesRes, vehiclesRes, complaintsRes, pickupsRes, schedulesRes, summaryRes, notifRes] = await Promise.all([
        API.auth.getZones(),
        API.vehicles.getAll(),
        API.complaints.getAll(),
        API.pickups.getAll(),
        API.schedules.getAll(),
        API.reports.getSummary(),
        API.notifications.getAll()
      ]);

      State.zones = zonesRes.data || [];
      State.vehicles = vehiclesRes.data || [];
      State.complaints = complaintsRes.data || [];
      State.pickups = pickupsRes.data || [];
      State.schedules = schedulesRes.data || [];
      State.summary = summaryRes.data || null;
      State.notifications = notifRes.data || [];

      // Update notification badge
      const badge = document.getElementById('header-notif-badge');
      const unreadCount = State.notifications.filter(n => !n.is_read).length;
      if (badge) {
        badge.innerText = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
      }

      if (State.currentRole === 'ADMIN') {
        AdminModule.renderKPIs();
      }
    } catch (err) {
      if (!silent) console.error('Failed to load initial dataset:', err);
    }
  },

  renderNotificationsList() {
    const listContainer = document.getElementById('notifications-list-container');
    if (!listContainer) return;

    if (State.notifications.length === 0) {
      listContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No active alerts.</p>`;
      return;
    }

    listContainer.innerHTML = State.notifications.map(n => `
      <div style="padding: 0.85rem 1rem; border-bottom: 1px solid var(--border-subtle); background: ${n.is_read ? 'transparent' : 'rgba(16, 185, 129, 0.05)'};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem;">
          <strong style="color: #fff; font-size: 0.9rem;">${n.title}</strong>
          <span style="font-size: 0.72rem; color: var(--text-dim);">${UI.formatDate(n.created_at)}</span>
        </div>
        <p style="font-size: 0.82rem; color: var(--text-muted);">${n.message}</p>
      </div>
    `).join('');
  }
};

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
