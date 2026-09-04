/**
 * Smart Waste Collection Management System - Citizen Portal Controller
 */
const CitizenModule = {
  init() {
    this.setupEventListeners();
    this.renderRecentTickets();
    this.renderScheduleLookup();
    this.populateZoneOptions();
  },

  setupEventListeners() {
    // Citizen Sub-Tabs (Report Issue vs Special Pickup vs Track Status vs Schedules)
    document.querySelectorAll('.citizen-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        State.setCitizenTab(tab);
      });
    });

    State.on('citizenTabChanged', (tab) => {
      document.querySelectorAll('.citizen-tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tab);
      });
      document.querySelectorAll('.citizen-view-section').forEach(sec => {
        sec.style.display = sec.id === `citizen-${tab}-sec` ? 'block' : 'none';
      });
    });

    // File Dropzone Preview for Complaints
    const complaintFileInput = document.getElementById('complaint-photo-input');
    const dropzone = document.getElementById('complaint-dropzone');
    const previewWrapper = document.getElementById('complaint-preview-wrapper');
    const previewImg = document.getElementById('complaint-preview-img');
    const btnRemove = document.getElementById('btn-remove-complaint-photo');

    if (dropzone && complaintFileInput) {
      dropzone.addEventListener('click', () => complaintFileInput.click());
      dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
          complaintFileInput.files = e.dataTransfer.files;
          this.handleFilePreview(complaintFileInput.files[0], previewWrapper, previewImg);
        }
      });

      complaintFileInput.addEventListener('change', () => {
        if (complaintFileInput.files.length) {
          this.handleFilePreview(complaintFileInput.files[0], previewWrapper, previewImg);
        }
      });

      if (btnRemove) {
        btnRemove.addEventListener('click', (e) => {
          e.stopPropagation();
          complaintFileInput.value = '';
          previewWrapper.style.display = 'none';
        });
      }
    }

    // Geolocation Detect Button
    const btnDetectGps = document.getElementById('btn-detect-gps');
    if (btnDetectGps) {
      btnDetectGps.addEventListener('click', () => {
        btnDetectGps.innerHTML = '📍 Pinning...';
        setTimeout(() => {
          const lat = (40.7128 + (Math.random() - 0.5) * 0.04).toFixed(4);
          const lng = (-74.0060 + (Math.random() - 0.5) * 0.04).toFixed(4);
          document.getElementById('complaint-lat').value = lat;
          document.getElementById('complaint-lng').value = lng;
          btnDetectGps.innerHTML = `📍 GPS Fixed (${lat}, ${lng})`;
          UI.toast(`Location pinned at ${lat}, ${lng}`, 'success');
        }, 600);
      });
    }

    // Complaint Form Submission
    const complaintForm = document.getElementById('form-report-waste');
    if (complaintForm) {
      complaintForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = complaintForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting...';

        try {
          const formData = new FormData(complaintForm);
          const res = await API.complaints.create(formData);

          UI.toast(`Issue Reported! Ticket #${res.data.ticket_number}`, 'success');
          complaintForm.reset();
          if (previewWrapper) previewWrapper.style.display = 'none';

          // Refresh state & tickets
          await App.loadAllData();
          this.renderRecentTickets();

          // Auto track new ticket
          this.trackTicket(res.data.ticket_number);
          State.setCitizenTab('track');
        } catch (err) {
          UI.toast(err.message || 'Failed to submit report', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Submit Waste Issue Report';
        }
      });
    }

    // Special Pickup Form Submission
    const pickupForm = document.getElementById('form-special-pickup');
    if (pickupForm) {
      pickupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = pickupForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Booking Pickup...';

        try {
          const formData = new FormData(pickupForm);
          const res = await API.pickups.create(formData);

          UI.toast(`Pickup Booked! Request #${res.data.request_number}`, 'success');
          pickupForm.reset();

          await App.loadAllData();
          this.trackTicket(res.data.request_number);
          State.setCitizenTab('track');
        } catch (err) {
          UI.toast(err.message || 'Failed to submit request', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Confirm Pickup Booking';
        }
      });
    }

    // Ticket Tracker Search Form
    const searchForm = document.getElementById('form-track-search');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = document.getElementById('track-search-input').value.trim();
        if (query) {
          this.trackTicket(query);
        }
      });
    }
  },

  handleFilePreview(file, wrapper, img) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
      wrapper.style.display = 'block';
    };
    reader.readAsDataURL(file);
  },

  populateZoneOptions() {
    const select = document.getElementById('complaint-zone-select');
    const pickupSelect = document.getElementById('pickup-zone-select');
    if (!select && !pickupSelect) return;

    const optionsHtml = (State.zones || []).map(z => {
      return `<option value="${z.id}" data-name="${z.name}">${z.name} (${z.code})</option>`;
    }).join('');

    if (select) select.innerHTML = optionsHtml;
    if (pickupSelect) pickupSelect.innerHTML = optionsHtml;
  },

  async trackTicket(ticketOrRequestNumber) {
    const container = document.getElementById('tracking-result-container');
    if (!container) return;

    container.innerHTML = `<div style="text-align: center; padding: 2rem;"><p>🔍 Searching ticket database...</p></div>`;

    try {
      let isPickup = ticketOrRequestNumber.toUpperCase().startsWith('PCK');
      let data = null;

      if (isPickup) {
        const res = await API.pickups.getOne(ticketOrRequestNumber);
        data = res.data;
        this.renderPickupTimeline(data, container);
      } else {
        const res = await API.complaints.getOne(ticketOrRequestNumber);
        data = res.data;
        this.renderComplaintTimeline(data, container);
      }
    } catch {
      container.innerHTML = `
        <div class="tracking-result-card" style="text-align: center; padding: 2rem;">
          <p style="color: var(--rose-500); font-size: 1.1rem; font-weight: 700;">No record found for "${ticketOrRequestNumber}"</p>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 0.5rem;">
            Please double-check your Ticket Number (e.g. WST-2026-8812) or Pickup Request Number (e.g. PCK-2026-0312).
          </p>
        </div>
      `;
    }
  },

  renderComplaintTimeline(complaint, container) {
    const statusOrder = ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];
    const currentIdx = statusOrder.indexOf(complaint.status);

    const steps = [
      {
        title: 'Complaint Reported',
        time: UI.formatDate(complaint.created_at),
        desc: `Logged by ${complaint.citizen_name}. Issue category: ${complaint.category} at ${complaint.address}.`
      },
      {
        title: 'Vehicle & Crew Assigned',
        time: complaint.assigned_driver_name ? 'Dispatched' : 'Awaiting Assignment',
        desc: complaint.assigned_driver_name ? `Assigned to ${complaint.assigned_driver_name} (TRK Crew).` : 'Municipal supervisor reviewing ticket priority.'
      },
      {
        title: 'Crew On-Site / In Transit',
        time: currentIdx >= 2 ? 'In Progress' : 'Pending',
        desc: currentIdx >= 2 ? 'Sanitation team active on location.' : 'Scheduled in current operational route.'
      },
      {
        title: 'Resolved & Cleaned',
        time: complaint.resolved_at ? UI.formatDate(complaint.resolved_at) : 'Estimated within 24h',
        desc: complaint.resolution_notes || 'Pending final verification by route supervisor.'
      }
    ];

    let stepsHtml = steps.map((s, idx) => {
      const isCompleted = idx < currentIdx || (currentIdx === 3 && idx === 3);
      const isActive = idx === currentIdx;
      const statusClass = isCompleted ? 'completed' : (isActive ? 'active' : '');
      const icon = isCompleted ? '✓' : idx + 1;

      return `
        <div class="timeline-step ${statusClass}">
          <div class="step-marker">${icon}</div>
          <div class="step-title">${s.title}</div>
          <div class="step-time">${s.time}</div>
          <div class="step-desc">${s.desc}</div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="tracking-result-card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <h3 style="font-family: var(--font-display); font-size: 1.3rem; color: #fff;">${complaint.ticket_number}</h3>
              ${UI.renderStatusBadge(complaint.status)}
              ${UI.renderPriority(complaint.priority)}
            </div>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">📍 ${complaint.address} (${complaint.zone_name})</p>
          </div>
          <div>
            <span style="font-size: 0.8rem; color: var(--text-dim);">Filed: ${UI.formatDate(complaint.created_at)}</span>
          </div>
        </div>

        <p style="background: rgba(255,255,255,0.03); padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.9rem; color: #e2e8f0; margin-bottom: 1rem;">
          "${complaint.description}"
        </p>

        ${complaint.photo_url ? `
          <div style="margin-bottom: 1.5rem;">
            <p style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.5rem;">Attached Issue Photo</p>
            <img src="${complaint.photo_url}" alt="Complaint Photo" style="max-height: 180px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); object-fit: cover;">
          </div>
        ` : ''}

        <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-dim); letter-spacing: 0.05em; margin-bottom: 0.5rem;">Service Resolution Progress</h4>
        <div class="timeline-stepper">
          ${stepsHtml}
        </div>

        ${complaint.resolution_photo_url ? `
          <div style="margin-top: 1rem; padding: 1rem; background: rgba(16, 185, 129, 0.08); border-radius: var(--radius-sm); border: 1px solid rgba(16, 185, 129, 0.2);">
            <p style="font-weight: 700; color: var(--emerald-400); font-size: 0.85rem; margin-bottom: 0.5rem;">Verified Resolution Proof:</p>
            <img src="${complaint.resolution_photo_url}" alt="Resolution Proof" style="max-height: 160px; border-radius: var(--radius-sm); object-fit: cover;">
          </div>
        ` : ''}
      </div>
    `;
  },

  renderPickupTimeline(pickup, container) {
    const statusOrder = ['REQUESTED', 'CONFIRMED', 'SCHEDULED', 'COMPLETED'];
    const currentIdx = statusOrder.indexOf(pickup.status);

    container.innerHTML = `
      <div class="tracking-result-card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <h3 style="font-family: var(--font-display); font-size: 1.3rem; color: #fff;">${pickup.request_number}</h3>
              ${UI.renderStatusBadge(pickup.status)}
            </div>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">📦 Waste Type: <strong>${pickup.waste_type}</strong> (${pickup.estimated_volume})</p>
          </div>
          <div style="text-align: right;">
            <p style="color: var(--emerald-400); font-weight: 700; font-size: 0.95rem;">Scheduled: ${pickup.scheduled_date || pickup.preferred_date}</p>
            <p style="color: var(--text-dim); font-size: 0.8rem;">Time: ${pickup.scheduled_time || pickup.preferred_timeslot}</p>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-muted);">Pickup Address: ${pickup.address}</p>
        ${pickup.assigned_vehicle_number ? `
          <p style="font-size: 0.85rem; color: var(--cyan-400); margin-top: 0.25rem;">Assigned Carrier: <strong>${pickup.assigned_vehicle_number}</strong></p>
        ` : ''}
      </div>
    `;
  },

  renderRecentTickets() {
    const tableBody = document.getElementById('recent-tickets-tbody');
    if (!tableBody) return;

    const complaints = State.complaints.slice(0, 5);
    if (complaints.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No reports logged yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = complaints.map(c => `
      <tr>
        <td><strong style="color: #fff; cursor: pointer;" onclick="CitizenModule.trackTicket('${c.ticket_number}')">${c.ticket_number}</strong></td>
        <td>${c.category}</td>
        <td>${c.address}</td>
        <td>${UI.renderStatusBadge(c.status)}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="CitizenModule.trackTicket('${c.ticket_number}'); State.setCitizenTab('track');">
            Track Live
          </button>
        </td>
      </tr>
    `).join('');
  },

  renderScheduleLookup() {
    const container = document.getElementById('schedules-lookup-list');
    if (!container) return;

    container.innerHTML = State.schedules.map(sch => `
      <div class="glass-card" style="margin-bottom: 1rem; padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <h4 style="color: #fff; font-size: 1.05rem;">${sch.zone_name}</h4>
          <span class="badge badge-AVAILABLE">${sch.day_of_week}s</span>
        </div>
        <p style="color: var(--emerald-400); font-size: 0.85rem; font-weight: 600;">♻️ ${sch.collection_type}</p>
        <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 0.25rem;">Operating Hours: ${sch.start_time} - ${sch.end_time} (${sch.frequency})</p>
        <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${(sch.route_checkpoints || []).map(cp => `
            <span style="font-size: 0.75rem; background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              📍 ${cp.name}
            </span>
          `).join('')}
        </div>
      </div>
    `).join('');
  }
};
