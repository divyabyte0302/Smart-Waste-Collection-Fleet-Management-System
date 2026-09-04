/**
 * Smart Waste Collection Management System - UI Utilities & Helpers
 */
const UI = {
  // Toast notifications
  toast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.innerHTML = `
      <span style="font-size: 1.1rem;">${type === 'error' ? '⚠️' : '✅'}</span>
      <div>${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // Modal Dialogs
  openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('active');
  },

  closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('active');
  },

  // Format Dates
  formatDate(isoString) {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  },

  formatDateOnly(dateString) {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  },

  // Priority color badge helper
  renderPriority(priority) {
    return `<span class="priority-${priority}">● ${priority}</span>`;
  },

  // Status Badge helper
  renderStatusBadge(status) {
    return `<span class="badge badge-${status}">${status.replace('_', ' ')}</span>`;
  }
};
