/**
 * Smart Waste Collection Management System - Driver Field Operations Controller
 */
const DriverModule = {
  currentVehicle: null,
  activeSchedule: null,

  init() {
    this.setupEventListeners();
    this.syncDriverData();
  },

  setupEventListeners() {
    // Report Field Issue button
    const btnReportFieldIssue = document.getElementById('btn-driver-report-issue');
    if (btnReportFieldIssue) {
      btnReportFieldIssue.addEventListener('click', () => {
        const desc = prompt('Describe checkpoint obstacle or bin overflow issue:');
        if (desc && desc.trim()) {
          API.complaints.create({
            citizen_name: 'Driver Field Report',
            citizen_phone: '+1 (555) DRIVER',
            category: 'Damaged Bin / Infrastructure',
            description: `[Driver TRK Alert] ${desc.trim()}`,
            priority: 'HIGH',
            zone_id: this.currentVehicle ? this.currentVehicle.assigned_zone_id : 'zone_01',
            address: 'Active Route Checkpoint'
          }).then(() => {
            UI.toast('Field incident logged with dispatch!', 'success');
            return App.loadAllData();
          }).catch(err => UI.toast(err.message, 'error'));
        }
      });
    }
  },

  syncDriverData() {
    // Default to first active vehicle/schedule for demo
    this.currentVehicle = State.vehicles[0] || null;
    this.activeSchedule = State.schedules[0] || null;
    this.render();
  },

  render() {
    this.renderBanner();
    this.renderCheckpoints();
  },

  renderBanner() {
    const banner = document.getElementById('driver-banner-container');
    if (!banner || !this.currentVehicle) return;

    const v = this.currentVehicle;
    banner.innerHTML = `
      <div class="driver-info-block">
        <h2>🚛 Vehicle ${v.vehicle_number}</h2>
        <p>${v.model} • Driver: <strong>${v.driver_name || 'Field Operator'}</strong></p>
      </div>

      <div class="driver-stats-strip">
        <div class="driver-stat-pill">
          <div class="driver-stat-label">Current Payload</div>
          <div class="driver-stat-num" style="color: var(--emerald-400);">${v.current_load_tons} / ${v.capacity_tons}t</div>
        </div>
        <div class="driver-stat-pill">
          <div class="driver-stat-label">Fuel Level</div>
          <div class="driver-stat-num" style="color: var(--cyan-400);">${v.fuel_percentage}%</div>
        </div>
        <div class="driver-stat-pill">
          <div class="driver-stat-label">Route Status</div>
          <div class="driver-stat-num">${v.status}</div>
        </div>
      </div>
    `;
  },

  renderCheckpoints() {
    const container = document.getElementById('driver-checkpoints-container');
    if (!container || !this.activeSchedule) return;

    const checkpoints = this.activeSchedule.route_checkpoints || [];
    const completedCount = checkpoints.filter(c => c.status === 'COMPLETED').length;

    const progressEl = document.getElementById('driver-route-progress-label');
    if (progressEl) {
      progressEl.innerText = `${completedCount} of ${checkpoints.length} Checkpoints Completed`;
    }

    container.innerHTML = checkpoints.map((cp, idx) => {
      const isCompleted = cp.status === 'COMPLETED';
      const isInProgress = cp.status === 'IN_PROGRESS';

      return `
        <div class="checkpoint-card ${isCompleted ? 'completed' : (isInProgress ? 'in_progress' : '')}">
          <div class="checkpoint-main">
            <div class="checkpoint-seq">${isCompleted ? '✓' : idx + 1}</div>
            <div>
              <div class="checkpoint-title">${cp.name}</div>
              <div class="checkpoint-meta">
                <span>⏰ Scheduled: ${cp.time || '08:00'}</span>
                <span>Status: <strong>${cp.status}</strong></span>
              </div>
            </div>
          </div>

          <div class="checkpoint-actions">
            ${!isCompleted ? `
              <button class="btn btn-primary btn-sm" onclick="DriverModule.markCollected(${idx})">
                ✓ Mark Collected
              </button>
            ` : `
              <span style="color: var(--emerald-400); font-weight: 700; font-size: 0.85rem;">
                Collected
              </span>
            `}
          </div>
        </div>
      `;
    }).join('');
  },

  async markCollected(checkpointIndex) {
    if (!this.activeSchedule) return;

    try {
      await API.schedules.updateCheckpoint(this.activeSchedule.id, checkpointIndex, 'COMPLETED');
      
      // Increment vehicle load telemetry
      if (this.currentVehicle) {
        const newLoad = Math.min(this.currentVehicle.capacity_tons, parseFloat((this.currentVehicle.current_load_tons + 0.8).toFixed(1)));
        await API.vehicles.updateTelemetry(this.currentVehicle.id, {
          load_tons: newLoad,
          lat: this.currentVehicle.current_lat + (Math.random() - 0.5) * 0.005,
          lng: this.currentVehicle.current_lng + (Math.random() - 0.5) * 0.005
        });
      }

      UI.toast(`Checkpoint ${checkpointIndex + 1} marked as collected!`, 'success');
      await App.loadAllData();
      this.syncDriverData();
    } catch (err) {
      UI.toast(err.message || 'Failed to update checkpoint', 'error');
    }
  }
};
