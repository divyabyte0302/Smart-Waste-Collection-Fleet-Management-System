/**
 * Smart Waste Collection Management System - Admin Command Center Controller
 */
const AdminModule = {
  selectedComplaintId: null,
  selectedPickupId: null,

  init() {
    this.setupEventListeners();
    this.renderAll();
  },

  setupEventListeners() {
    // Admin Sub-Tabs
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        State.setAdminTab(tab);
      });
    });

    State.on('adminTabChanged', (tab) => {
      document.querySelectorAll('.admin-tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tab);
      });
      document.querySelectorAll('.admin-view-section').forEach(sec => {
        sec.style.display = sec.id === `admin-${tab}-sec` ? 'block' : 'none';
      });

      if (tab === 'reports') {
        this.renderCharts();
      }
    });

    // Complaint Filter Tabs (All vs Reported vs In Progress vs Resolved)
    document.querySelectorAll('.complaint-filter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.complaint-filter-pill').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const filter = e.currentTarget.dataset.status;
        this.renderComplaintsTable(filter);
      });
    });

    // Complaint Search
    const searchInput = document.getElementById('admin-complaint-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        this.renderComplaintsTable(null, q);
      });
    }

    // Assign Vehicle Form in Modal
    const assignForm = document.getElementById('form-assign-vehicle');
    if (assignForm) {
      assignForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const vehicleId = document.getElementById('modal-assign-vehicle-select').value;
        if (!this.selectedComplaintId || !vehicleId) return;

        try {
          await API.complaints.assignVehicle(this.selectedComplaintId, vehicleId);
          UI.toast('Vehicle assigned to complaint successfully', 'success');
          UI.closeModal('modal-assign-vehicle');
          await App.loadAllData();
          this.renderAll();
        } catch (err) {
          UI.toast(err.message || 'Failed to assign vehicle', 'error');
        }
      });
    }

    // Resolve Complaint Form in Modal
    const resolveForm = document.getElementById('form-resolve-complaint');
    if (resolveForm) {
      resolveForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const notes = document.getElementById('modal-resolve-notes').value;
        const photoInput = document.getElementById('modal-resolve-photo');
        const photoFile = photoInput && photoInput.files.length ? photoInput.files[0] : null;

        if (!this.selectedComplaintId) return;

        try {
          await API.complaints.updateStatus(this.selectedComplaintId, 'RESOLVED', notes, photoFile);
          UI.toast('Complaint marked as Resolved and alert dispatched!', 'success');
          UI.closeModal('modal-resolve-complaint');
          resolveForm.reset();
          await App.loadAllData();
          this.renderAll();
        } catch (err) {
          UI.toast(err.message || 'Failed to resolve ticket', 'error');
        }
      });
    }

    // Schedule Pickup Form in Modal
    const schedulePickupForm = document.getElementById('form-schedule-pickup-modal');
    if (schedulePickupForm) {
      schedulePickupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!this.selectedPickupId) return;

        const vehicleId = document.getElementById('modal-pickup-vehicle-select').value;
        const schedDate = document.getElementById('modal-pickup-date').value;
        const schedTime = document.getElementById('modal-pickup-time').value;
        const notes = document.getElementById('modal-pickup-notes').value;

        try {
          await API.pickups.schedule(this.selectedPickupId, {
            vehicle_id: vehicleId,
            scheduled_date: schedDate,
            scheduled_time: schedTime,
            notes
          });
          UI.toast('Pickup scheduled with fleet!', 'success');
          UI.closeModal('modal-schedule-pickup');
          await App.loadAllData();
          this.renderAll();
        } catch (err) {
          UI.toast(err.message || 'Failed to schedule pickup', 'error');
        }
      });
    }

    // Create Route Schedule Form
    const createScheduleForm = document.getElementById('form-create-schedule');
    if (createScheduleForm) {
      createScheduleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const zoneId = document.getElementById('new-sch-zone').value;
        const vehicleId = document.getElementById('new-sch-vehicle').value;
        const collectionType = document.getElementById('new-sch-type').value;
        const dayOfWeek = document.getElementById('new-sch-day').value;
        const startTime = document.getElementById('new-sch-start').value;
        const endTime = document.getElementById('new-sch-end').value;

        try {
          await API.schedules.create({
            zone_id: zoneId,
            vehicle_id: vehicleId,
            collection_type: collectionType,
            day_of_week: dayOfWeek,
            start_time: startTime,
            end_time: endTime
          });
          UI.toast('Collection route schedule created', 'success');
          UI.closeModal('modal-create-schedule');
          createScheduleForm.reset();
          await App.loadAllData();
          this.renderAll();
        } catch (err) {
          UI.toast(err.message || 'Failed to create schedule', 'error');
        }
      });
    }

    // Export CSV Buttons
    document.querySelectorAll('.btn-export-csv').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type || 'complaints';
        window.open(API.reports.getExportUrl(type), '_blank');
        UI.toast(`Downloading ${type} CSV report...`, 'success');
      });
    });
  },

  renderAll() {
    this.renderKPIs();
    this.renderFleet();
    this.renderCityMap();
    this.renderComplaintsTable();
    this.renderPickupsTable();
    this.renderSchedulesTable();
    this.populateModalSelects();
    this.renderCharts();
  },

  renderKPIs() {
    const summary = State.summary ? State.summary.overview : null;
    if (!summary) return;

    const elTotalWaste = document.getElementById('kpi-total-waste');
    const elActiveFleet = document.getElementById('kpi-active-fleet');
    const elOpenComplaints = document.getElementById('kpi-open-complaints');
    const elResolutionRate = document.getElementById('kpi-resolution-rate');

    if (elTotalWaste) elTotalWaste.innerHTML = `${summary.totalWasteCollectedTons} <span style="font-size: 1rem; color: var(--text-muted);">Tons</span>`;
    if (elActiveFleet) elActiveFleet.innerHTML = `${summary.activeVehicles} / ${summary.totalVehicles}`;
    if (elOpenComplaints) elOpenComplaints.innerHTML = `${summary.totalComplaints - summary.resolvedComplaints}`;
    if (elResolutionRate) elResolutionRate.innerHTML = `${summary.resolutionRate}%`;
  },

  renderFleet() {
    const container = document.getElementById('admin-fleet-container');
    if (!container) return;

    container.innerHTML = State.vehicles.map(v => {
      const loadPercent = Math.min(100, Math.round((v.current_load_tons / v.capacity_tons) * 100));
      return `
        <div class="vehicle-card">
          <div class="vehicle-card-top">
            <div>
              <div class="vehicle-plate">🚛 ${v.vehicle_number}</div>
              <div class="vehicle-model">${v.model}</div>
            </div>
            ${UI.renderStatusBadge(v.status)}
          </div>

          <!-- Capacity Load Bar -->
          <div class="vehicle-progress-block">
            <div class="progress-label-row">
              <span>Payload Load</span>
              <span><strong>${v.current_load_tons} / ${v.capacity_tons} Tons</strong> (${loadPercent}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill fill-load" style="width: ${loadPercent}%;"></div>
            </div>
          </div>

          <!-- Fuel / Battery Bar -->
          <div class="vehicle-progress-block">
            <div class="progress-label-row">
              <span>Fuel / Battery</span>
              <span>${v.fuel_percentage}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill fill-fuel" style="width: ${v.fuel_percentage}%;"></div>
            </div>
          </div>

          <div class="vehicle-footer">
            <span style="color: var(--text-muted);">Driver: <strong style="color: #fff;">${v.driver_name || 'Unassigned'}</strong></span>
            <button class="btn btn-outline-emerald btn-sm" onclick="AdminModule.openAssignDriverModal('${v.id}')">
              Reassign
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  renderCityMap() {
    const svg = document.getElementById('city-map-svg');
    if (!svg) return;

    // Render interactive SVG map with zones, truck coordinates, and complaint markers
    let content = `
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      <!-- City Zone Polygons -->
      <path d="M 60 50 L 380 40 L 410 220 L 70 210 Z" fill="rgba(16, 185, 129, 0.08)" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1.5" />
      <text x="80" y="80" fill="#10b981" font-size="12" font-weight="700">ZONE 1: Downtown Central</text>

      <path d="M 430 40 L 780 50 L 770 230 L 430 210 Z" fill="rgba(6, 182, 212, 0.08)" stroke="rgba(6, 182, 212, 0.3)" stroke-width="1.5" />
      <text x="450" y="80" fill="#06b6d4" font-size="12" font-weight="700">ZONE 2: Metro North</text>

      <path d="M 70 230 L 410 240 L 390 390 L 80 390 Z" fill="rgba(245, 158, 11, 0.08)" stroke="rgba(245, 158, 11, 0.3)" stroke-width="1.5" />
      <text x="90" y="270" fill="#f59e0b" font-size="12" font-weight="700">ZONE 4: West Industrial & Port</text>

      <path d="M 430 230 L 770 240 L 760 390 L 420 390 Z" fill="rgba(132, 204, 22, 0.08)" stroke="rgba(132, 204, 22, 0.3)" stroke-width="1.5" />
      <text x="450" y="270" fill="#84cc16" font-size="12" font-weight="700">ZONE 3: Green Valley Eco</text>
    `;

    // Active Trucks
    const truckPositions = [
      { x: 190, y: 130, id: 'TRK-101' },
      { x: 580, y: 140, id: 'TRK-102' },
      { x: 550, y: 310, id: 'TRK-103' },
      { x: 220, y: 320, id: 'TRK-104' },
      { x: 260, y: 170, id: 'TRK-105' }
    ];

    truckPositions.forEach((pos, idx) => {
      const veh = State.vehicles[idx];
      const isRoute = veh && veh.status === 'ON_ROUTE';
      content += `
        <g transform="translate(${pos.x}, ${pos.y})" style="cursor: pointer;" onclick="UI.toast('Truck ${pos.id}: ${veh ? veh.model : ''} (${veh ? veh.status : ''})')">
          <circle r="16" fill="${isRoute ? '#06b6d4' : '#10b981'}" opacity="0.3" class="pulse-dot" />
          <circle r="10" fill="${isRoute ? '#06b6d4' : '#10b981'}" />
          <text y="4" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold">🚛</text>
          <text y="24" text-anchor="middle" fill="#f8fafc" font-size="10" font-weight="600">${pos.id}</text>
        </g>
      `;
    });

    // Complaint Incident Markers
    const complaintPositions = [
      { x: 150, y: 110, id: 'cmp_1001', code: 'WST-8812', color: '#f43f5e' },
      { x: 620, y: 110, id: 'cmp_1002', code: 'WST-8813', color: '#f59e0b' },
      { x: 180, y: 300, id: 'cmp_1003', code: 'WST-8814', color: '#f43f5e' },
      { x: 520, y: 330, id: 'cmp_1004', code: 'WST-8799', color: '#10b981' }
    ];

    complaintPositions.forEach(c => {
      content += `
        <g transform="translate(${c.x}, ${c.y})" style="cursor: pointer;" onclick="AdminModule.openResolveModal('${c.id}')">
          <circle r="7" fill="${c.color}" stroke="#fff" stroke-width="1.5" />
          <text x="10" y="4" fill="#cbd5e1" font-size="9" font-weight="600">${c.code}</text>
        </g>
      `;
    });

    svg.innerHTML = content;
  },

  renderComplaintsTable(statusFilter = null, searchQuery = null) {
    const tableBody = document.getElementById('admin-complaints-tbody');
    if (!tableBody) return;

    let list = [...State.complaints];
    if (statusFilter && statusFilter !== 'ALL') {
      list = list.filter(c => c.status === statusFilter);
    }
    if (searchQuery) {
      list = list.filter(c => (
        c.ticket_number.toLowerCase().includes(searchQuery) ||
        c.citizen_name.toLowerCase().includes(searchQuery) ||
        c.category.toLowerCase().includes(searchQuery) ||
        c.address.toLowerCase().includes(searchQuery)
      ));
    }

    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2rem; color: var(--text-muted);">No complaints match this filter.</td></tr>`;
      return;
    }

    tableBody.innerHTML = list.map(c => `
      <tr>
        <td><strong style="color: #fff;">${c.ticket_number}</strong></td>
        <td>
          ${c.photo_url ? `
            <img src="${c.photo_url}" class="table-thumbnail" alt="Complaint" onclick="window.open('${c.photo_url}', '_blank')">
          ` : '<span style="color: var(--text-dim);">No Photo</span>'}
        </td>
        <td>
          <div style="font-weight: 600; color: #fff;">${c.category}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${c.description}
          </div>
        </td>
        <td>${UI.renderPriority(c.priority)}</td>
        <td>📍 ${c.zone_name || 'Sector'}</td>
        <td>${UI.renderStatusBadge(c.status)}</td>
        <td>
          <span style="font-size: 0.82rem; color: ${c.assigned_driver_name ? '#38bdf8' : 'var(--text-dim)'};">
            ${c.assigned_driver_name || 'Unassigned'}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            ${c.status !== 'RESOLVED' ? `
              <button class="btn btn-secondary btn-sm" onclick="AdminModule.openAssignModal('${c.id}')" title="Assign Carrier">
                🚛 Assign
              </button>
              <button class="btn btn-primary btn-sm" onclick="AdminModule.openResolveModal('${c.id}')" title="Resolve Ticket">
                ✓ Resolve
              </button>
            ` : `
              <span style="color: var(--emerald-400); font-size: 0.8rem; font-weight: 600;">Resolved</span>
            `}
          </div>
        </td>
      </tr>
    `).join('');
  },

  renderPickupsTable() {
    const tableBody = document.getElementById('admin-pickups-tbody');
    if (!tableBody) return;

    tableBody.innerHTML = State.pickups.map(p => `
      <tr>
        <td><strong style="color: #fff;">${p.request_number}</strong></td>
        <td>
          <div style="font-weight: 600;">${p.citizen_name}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">${p.citizen_phone}</div>
        </td>
        <td>${p.waste_type}</td>
        <td>${p.estimated_volume}</td>
        <td>${p.address}</td>
        <td>${p.preferred_date}</td>
        <td>${UI.renderStatusBadge(p.status)}</td>
        <td>
          ${p.status !== 'COMPLETED' ? `
            <button class="btn btn-outline-emerald btn-sm" onclick="AdminModule.openSchedulePickupModal('${p.id}')">
              Schedule Fleet
            </button>
          ` : '<span style="color: var(--emerald-400);">Completed</span>'}
        </td>
      </tr>
    `).join('');
  },

  renderSchedulesTable() {
    const tableBody = document.getElementById('admin-schedules-tbody');
    if (!tableBody) return;

    tableBody.innerHTML = State.schedules.map(s => `
      <tr>
        <td><strong>${s.zone_name}</strong></td>
        <td>${s.collection_type}</td>
        <td><span class="badge badge-AVAILABLE">${s.day_of_week}</span></td>
        <td>${s.start_time} - ${s.end_time}</td>
        <td>${s.vehicle_number || 'TRK-101'}</td>
        <td>
          <span style="font-size: 0.8rem; color: var(--emerald-400);">
            ${(s.route_checkpoints || []).length} Checkpoints
          </span>
        </td>
        <td>${UI.renderStatusBadge(s.status)}</td>
      </tr>
    `).join('');
  },

  populateModalSelects() {
    const vehicleSelect = document.getElementById('modal-assign-vehicle-select');
    const pickupVehicleSelect = document.getElementById('modal-pickup-vehicle-select');
    const newSchVehicle = document.getElementById('new-sch-vehicle');
    const newSchZone = document.getElementById('new-sch-zone');

    const vehicleOpts = State.vehicles.map(v => `
      <option value="${v.id}">${v.vehicle_number} - ${v.model} (${v.status})</option>
    `).join('');

    const zoneOpts = State.zones.map(z => `
      <option value="${z.id}">${z.name} (${z.code})</option>
    `).join('');

    if (vehicleSelect) vehicleSelect.innerHTML = vehicleOpts;
    if (pickupVehicleSelect) pickupVehicleSelect.innerHTML = vehicleOpts;
    if (newSchVehicle) newSchVehicle.innerHTML = vehicleOpts;
    if (newSchZone) newSchZone.innerHTML = zoneOpts;
  },

  renderCharts() {
    const barContainer = document.getElementById('volume-bar-chart');
    if (!barContainer) return;

    const days = [
      { label: 'Mon', tons: 14.2 },
      { label: 'Tue', tons: 18.5 },
      { label: 'Wed', tons: 12.0 },
      { label: 'Thu', tons: 21.4 },
      { label: 'Fri', tons: 25.8 },
      { label: 'Sat', tons: 16.3 },
      { label: 'Sun', tons: 9.1 }
    ];

    const maxTons = 30;

    barContainer.innerHTML = days.map(d => {
      const heightPct = Math.round((d.tons / maxTons) * 100);
      return `
        <div class="bar-col">
          <div class="bar-rect" style="height: ${heightPct}%;">
            <div class="bar-val">${d.tons}t</div>
          </div>
          <div class="bar-label">${d.label}</div>
        </div>
      `;
    }).join('');

    // Render Sustainability Card
    const sustainDiv = document.getElementById('sustainability-metrics-box');
    if (sustainDiv && State.summary && State.summary.sustainability) {
      const s = State.summary.sustainability;
      sustainDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="glass-card" style="padding: 1rem; text-align: center;">
            <p style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Recycling Diversion</p>
            <p style="font-size: 1.8rem; font-weight: 800; color: var(--emerald-400);">${s.diversionRatePercentage}%</p>
          </div>
          <div class="glass-card" style="padding: 1rem; text-align: center;">
            <p style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">CO2 Avoided</p>
            <p style="font-size: 1.8rem; font-weight: 800; color: var(--cyan-400);">${(s.co2AvoidedKg / 1000).toFixed(1)}k <span style="font-size: 0.9rem;">kg</span></p>
          </div>
        </div>
      `;
    }
  },

  openAssignModal(complaintId) {
    this.selectedComplaintId = complaintId;
    const complaint = State.complaints.find(c => c.id === complaintId);
    const titleEl = document.getElementById('modal-assign-ticket-title');
    if (titleEl && complaint) {
      titleEl.innerText = `Dispatch Fleet to ${complaint.ticket_number} (${complaint.category})`;
    }
    UI.openModal('modal-assign-vehicle');
  },

  openResolveModal(complaintId) {
    this.selectedComplaintId = complaintId;
    const complaint = State.complaints.find(c => c.id === complaintId);
    const titleEl = document.getElementById('modal-resolve-ticket-title');
    if (titleEl && complaint) {
      titleEl.innerText = `Resolve Ticket ${complaint.ticket_number}`;
    }
    UI.openModal('modal-resolve-complaint');
  },

  openSchedulePickupModal(pickupId) {
    this.selectedPickupId = pickupId;
    const pickup = State.pickups.find(p => p.id === pickupId);
    const titleEl = document.getElementById('modal-pickup-title');
    if (titleEl && pickup) {
      titleEl.innerText = `Assign Carrier for ${pickup.request_number}`;
      document.getElementById('modal-pickup-date').value = pickup.preferred_date;
    }
    UI.openModal('modal-schedule-pickup');
  },

  openAssignDriverModal(vehicleId) {
    const veh = State.vehicles.find(v => v.id === vehicleId);
    if (!veh) return;
    const driverName = prompt(`Enter new driver name for ${veh.vehicle_number}:`, veh.driver_name || '');
    if (driverName && driverName.trim()) {
      API.vehicles.assignDriver(vehicleId, null, driverName.trim())
        .then(() => {
          UI.toast(`Driver assigned to ${veh.vehicle_number}`, 'success');
          return App.loadAllData();
        })
        .then(() => this.renderFleet())
        .catch(err => UI.toast(err.message, 'error'));
    }
  }
};
