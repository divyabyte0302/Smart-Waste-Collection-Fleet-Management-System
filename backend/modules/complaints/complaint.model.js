/**
 * Complaint Model - Data persistence and auto-ID generator
 */
const db = require('../../config/database');
const { COMPLAINT_CATEGORIES, COMPLAINT_STATUS, COMPLAINT_PRIORITY } = require('./complaint.types');

// Counter for unique Complaint IDs
let complaintCounter = 1001;

class ComplaintModel {
  /**
   * Generate human-friendly unique complaint ID: CMP-2026-XXXX
   */
  static generateComplaintId() {
    const year = new Date().getFullYear();
    const count = complaintCounter++;
    return `CMP-${year}-${count}`;
  }

  /**
   * Seed sample complaints if table is empty
   */
  static async seedSampleComplaints() {
    const existing = await db.find('complaints');
    if (existing && existing.length > 0) {
      complaintCounter = existing.length + 1001;
      return;
    }

    const initialComplaints = [
      {
        id: 'cmp_seed_001',
        complaintId: 'CMP-2026-1001',
        citizenId: 'usr_citizen_001',
        citizenName: 'Sophia Martinez',
        citizenEmail: 'citizen@smartwaste.gov',
        citizenPhone: '+1 (555) 234-5678',
        category: COMPLAINT_CATEGORIES.OVERFLOWING_BIN,
        title: 'Overflowing Commercial Bin on 5th Ave',
        description: 'The green commercial waste bin outside the shopping plaza has been overflowing since yesterday evening. Wind is blowing litter across the sidewalk.',
        location: '5th Avenue & Elm Street, Downtown Central',
        latitude: 40.7128,
        longitude: -74.0060,
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
        priority: COMPLAINT_PRIORITY.HIGH,
        status: COMPLAINT_STATUS.IN_PROGRESS,
        assignedStaffId: 'usr_staff_001',
        assignedStaffName: 'Marcus Chen',
        comments: [
          {
            id: 'cmt_001',
            authorId: 'usr_citizen_001',
            authorName: 'Sophia Martinez',
            authorRole: 'Citizen',
            comment: 'Report submitted with photo. Sidewalk is obstructed.',
            createdAt: '2026-09-02T14:30:00.000Z'
          },
          {
            id: 'cmt_002',
            authorId: 'usr_admin_001',
            authorName: 'Director Arthur Vance',
            authorRole: 'Administrator',
            comment: 'Dispatched Marcus Chen (TRK-101) to expedite clean-up.',
            createdAt: '2026-09-02T15:10:00.000Z'
          }
        ],
        timeline: [
          {
            status: COMPLAINT_STATUS.SUBMITTED,
            title: 'Complaint Registered',
            description: 'Complaint registered by citizen Sophia Martinez.',
            timestamp: '2026-09-02T14:30:00.000Z',
            updatedBy: 'Sophia Martinez'
          },
          {
            status: COMPLAINT_STATUS.UNDER_REVIEW,
            title: 'Under Municipal Review',
            description: 'Reviewed by Municipal Control Dispatcher.',
            timestamp: '2026-09-02T14:50:00.000Z',
            updatedBy: 'Dispatch System'
          },
          {
            status: COMPLAINT_STATUS.ASSIGNED,
            title: 'Assigned to Fleet Crew',
            description: 'Assigned to Staff Member Marcus Chen (TRK-101).',
            timestamp: '2026-09-02T15:10:00.000Z',
            updatedBy: 'Arthur Vance'
          },
          {
            status: COMPLAINT_STATUS.IN_PROGRESS,
            title: 'Vehicle Dispatched',
            description: 'Crew en-route to Elm Street commercial hub.',
            timestamp: '2026-09-03T09:00:00.000Z',
            updatedBy: 'Marcus Chen'
          }
        ],
        createdAt: '2026-09-02T14:30:00.000Z',
        updatedAt: '2026-09-03T09:00:00.000Z'
      },
      {
        id: 'cmp_seed_002',
        complaintId: 'CMP-2026-1002',
        citizenId: 'usr_citizen_001',
        citizenName: 'Sophia Martinez',
        citizenEmail: 'citizen@smartwaste.gov',
        citizenPhone: '+1 (555) 234-5678',
        category: COMPLAINT_CATEGORIES.MISSED_COLLECTION,
        title: 'Missed Weekly Recyclables Pickup',
        description: 'Recycling truck did not stop on the odd-numbered block of Maplewood Avenue during Wednesday morning scheduled route.',
        location: '742 Maplewood Avenue, Metro North Residential',
        latitude: 40.7589,
        longitude: -73.9851,
        image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
        priority: COMPLAINT_PRIORITY.MEDIUM,
        status: COMPLAINT_STATUS.UNDER_REVIEW,
        assignedStaffId: null,
        assignedStaffName: null,
        comments: [
          {
            id: 'cmt_003',
            authorId: 'usr_citizen_001',
            authorName: 'Sophia Martinez',
            authorRole: 'Citizen',
            comment: 'Blue recycling bins are still on the curbside.',
            createdAt: '2026-09-03T11:20:00.000Z'
          }
        ],
        timeline: [
          {
            status: COMPLAINT_STATUS.SUBMITTED,
            title: 'Complaint Registered',
            description: 'Curbside missed pickup reported.',
            timestamp: '2026-09-03T11:20:00.000Z',
            updatedBy: 'Sophia Martinez'
          },
          {
            status: COMPLAINT_STATUS.UNDER_REVIEW,
            title: 'Route Verification',
            description: 'Verifying GPS telemetry for TRK-102 route.',
            timestamp: '2026-09-03T13:00:00.000Z',
            updatedBy: 'Arthur Vance'
          }
        ],
        createdAt: '2026-09-03T11:20:00.000Z',
        updatedAt: '2026-09-03T13:00:00.000Z'
      },
      {
        id: 'cmp_seed_003',
        complaintId: 'CMP-2026-1003',
        citizenId: 'usr_citizen_001',
        citizenName: 'Sophia Martinez',
        citizenEmail: 'citizen@smartwaste.gov',
        citizenPhone: '+1 (555) 234-5678',
        category: COMPLAINT_CATEGORIES.DAMAGED_BIN,
        title: 'Cracked Public Solar Compactor Door',
        description: 'The solar compactor bin lid hinge is damaged and no longer closes, exposing contents to rainwater and birds.',
        location: 'Civic Center Plaza East Wing',
        latitude: 40.7138,
        longitude: -74.0010,
        image: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80',
        priority: COMPLAINT_PRIORITY.LOW,
        status: COMPLAINT_STATUS.RESOLVED,
        assignedStaffId: 'usr_staff_001',
        assignedStaffName: 'Marcus Chen',
        comments: [
          {
            id: 'cmt_004',
            authorId: 'usr_staff_001',
            authorName: 'Marcus Chen',
            authorRole: 'Collection Staff',
            comment: 'Replaced broken hydraulic hinge assembly and tested sensor.',
            createdAt: '2026-09-04T07:45:00.000Z'
          }
        ],
        timeline: [
          {
            status: COMPLAINT_STATUS.SUBMITTED,
            title: 'Report Received',
            description: 'Solar compactor damage reported.',
            timestamp: '2026-09-01T09:15:00.000Z',
            updatedBy: 'Sophia Martinez'
          },
          {
            status: COMPLAINT_STATUS.ASSIGNED,
            title: 'Maintenance Assigned',
            description: 'Assigned to field technician Marcus Chen.',
            timestamp: '2026-09-01T10:00:00.000Z',
            updatedBy: 'Arthur Vance'
          },
          {
            status: COMPLAINT_STATUS.RESOLVED,
            title: 'Repair Complete',
            description: 'Hinge replaced and verified operational.',
            timestamp: '2026-09-04T07:45:00.000Z',
            updatedBy: 'Marcus Chen'
          }
        ],
        createdAt: '2026-09-01T09:15:00.000Z',
        updatedAt: '2026-09-04T07:45:00.000Z'
      }
    ];

    for (const c of initialComplaints) {
      await db.insert('complaints', c);
    }
    complaintCounter = 1004;
  }

  static async create(complaintData) {
    await this.seedSampleComplaints();

    const now = new Date().toISOString();
    const complaintId = this.generateComplaintId();

    const initialTimeline = [
      {
        status: COMPLAINT_STATUS.SUBMITTED,
        title: 'Complaint Registered',
        description: 'Complaint submitted to municipal smart waste dispatch.',
        timestamp: now,
        updatedBy: complaintData.citizenName || 'Citizen'
      }
    ];

    const record = {
      complaintId,
      citizenId: complaintData.citizenId,
      citizenName: complaintData.citizenName || 'Anonymous Citizen',
      citizenEmail: complaintData.citizenEmail || '',
      citizenPhone: complaintData.citizenPhone || '',
      category: complaintData.category || COMPLAINT_CATEGORIES.OTHER,
      title: complaintData.title,
      description: complaintData.description,
      location: complaintData.location,
      latitude: complaintData.latitude !== undefined ? Number(complaintData.latitude) : null,
      longitude: complaintData.longitude !== undefined ? Number(complaintData.longitude) : null,
      image: complaintData.image || null,
      priority: complaintData.priority || COMPLAINT_PRIORITY.MEDIUM,
      status: COMPLAINT_STATUS.SUBMITTED,
      assignedStaffId: null,
      assignedStaffName: null,
      comments: complaintData.initialComment ? [
        {
          id: `cmt_${Date.now()}`,
          authorId: complaintData.citizenId,
          authorName: complaintData.citizenName || 'Citizen',
          authorRole: 'Citizen',
          comment: complaintData.initialComment,
          createdAt: now
        }
      ] : [],
      timeline: initialTimeline,
      createdAt: now,
      updatedAt: now
    };

    return await db.insert('complaints', record);
  }

  static async findAll(filters = {}) {
    await this.seedSampleComplaints();
    let complaints = await db.find('complaints');

    if (filters.citizenId) {
      complaints = complaints.filter(c => c.citizenId === filters.citizenId);
    }
    if (filters.category) {
      complaints = complaints.filter(c => c.category === filters.category);
    }
    if (filters.status) {
      complaints = complaints.filter(c => c.status === filters.status);
    }
    if (filters.priority) {
      complaints = complaints.filter(c => c.priority === filters.priority);
    }
    if (filters.assignedStaffId) {
      complaints = complaints.filter(c => c.assignedStaffId === filters.assignedStaffId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      complaints = complaints.filter(c => 
        (c.complaintId && c.complaintId.toLowerCase().includes(q)) ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.location && c.location.toLowerCase().includes(q)) ||
        (c.citizenName && c.citizenName.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return complaints;
  }

  static async findById(id) {
    await this.seedSampleComplaints();
    // Support either internal id or human complaintId (e.g. CMP-2026-1001)
    const complaints = await db.find('complaints');
    return complaints.find(c => c.id === id || c.complaintId === id) || null;
  }

  static async update(id, updates) {
    const existing = await this.findById(id);
    if (!existing) return null;
    return await db.update('complaints', existing.id, updates);
  }

  static async delete(id) {
    const existing = await this.findById(id);
    if (!existing) return false;
    return await db.delete('complaints', existing.id);
  }

  static async addComment(id, commentData) {
    const complaint = await this.findById(id);
    if (!complaint) return null;

    const newComment = {
      id: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      authorId: commentData.authorId,
      authorName: commentData.authorName,
      authorRole: commentData.authorRole,
      comment: commentData.comment,
      createdAt: new Date().toISOString()
    };

    const comments = Array.isArray(complaint.comments) ? [...complaint.comments, newComment] : [newComment];
    return await db.update('complaints', complaint.id, { comments });
  }

  static async addTimelineEvent(id, timelineData) {
    const complaint = await this.findById(id);
    if (!complaint) return null;

    const newEvent = {
      status: timelineData.status || complaint.status,
      title: timelineData.title || `Status updated to ${timelineData.status}`,
      description: timelineData.description || '',
      timestamp: new Date().toISOString(),
      updatedBy: timelineData.updatedBy || 'System'
    };

    const timeline = Array.isArray(complaint.timeline) ? [...complaint.timeline, newEvent] : [newEvent];
    return await db.update('complaints', complaint.id, { timeline, status: newEvent.status });
  }
}

// Auto-seed on load
ComplaintModel.seedSampleComplaints();

module.exports = ComplaintModel;
