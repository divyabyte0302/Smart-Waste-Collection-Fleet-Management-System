/**
 * Complaint Service - Business Logic
 */
const ComplaintModel = require('./complaint.model');
const complaintStorage = require('./complaint.storage');
const { COMPLAINT_STATUS } = require('./complaint.types');
const { ROLES } = require('../../config/constants');

class ComplaintService {
  /**
   * File a new waste complaint
   */
  static async createComplaint(user, data) {
    let imageUrl = null;
    if (data.image) {
      imageUrl = complaintStorage.saveImage(data.image);
    }

    const complaintData = {
      citizenId: user.id,
      citizenName: user.name,
      citizenEmail: user.email,
      citizenPhone: user.phone || '',
      category: data.category,
      title: data.title.trim(),
      description: data.description.trim(),
      location: data.location.trim(),
      latitude: data.latitude,
      longitude: data.longitude,
      image: imageUrl,
      priority: data.priority,
      initialComment: data.initialComment
    };

    return await ComplaintModel.create(complaintData);
  }

  /**
   * Retrieve complaints with search, filtering, and pagination
   */
  static async getComplaints(filters = {}) {
    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 10;

    const all = await ComplaintModel.findAll(filters);
    const total = all.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginated = all.slice(offset, offset + limit);

    return {
      complaints: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }

  /**
   * Get single complaint by ID or complaintId
   */
  static async getComplaintById(id, currentUser) {
    const complaint = await ComplaintModel.findById(id);
    if (!complaint) return null;

    // RBAC: Citizens can view their own complaints, Admins and Staff can view all
    if (currentUser && currentUser.role === ROLES.CITIZEN && complaint.citizenId !== currentUser.id) {
      const err = new Error('Access denied: You can only view your own complaints.');
      err.statusCode = 403;
      throw err;
    }

    return complaint;
  }

  /**
   * Update complaint details, priority, or staff assignment
   */
  static async updateComplaint(id, updates, currentUser) {
    const existing = await ComplaintModel.findById(id);
    if (!existing) return null;

    const sanitizedUpdates = {};

    if (updates.title) sanitizedUpdates.title = updates.title.trim();
    if (updates.description) sanitizedUpdates.description = updates.description.trim();
    if (updates.location) sanitizedUpdates.location = updates.location.trim();
    if (updates.latitude !== undefined) sanitizedUpdates.latitude = Number(updates.latitude);
    if (updates.longitude !== undefined) sanitizedUpdates.longitude = Number(updates.longitude);

    if (updates.image) {
      sanitizedUpdates.image = complaintStorage.saveImage(updates.image);
    }

    // Priority change logging
    if (updates.priority && updates.priority !== existing.priority) {
      sanitizedUpdates.priority = updates.priority;
      await ComplaintModel.addTimelineEvent(existing.id, {
        status: existing.status,
        title: `Priority Adjusted to ${updates.priority}`,
        description: `Priority updated from ${existing.priority} to ${updates.priority} by ${currentUser.name}.`,
        updatedBy: currentUser.name
      });
    }

    // Assignment change logging
    if (updates.assignedStaffId && updates.assignedStaffId !== existing.assignedStaffId) {
      sanitizedUpdates.assignedStaffId = updates.assignedStaffId;
      sanitizedUpdates.assignedStaffName = updates.assignedStaffName || 'Assigned Crew Member';
      sanitizedUpdates.status = COMPLAINT_STATUS.ASSIGNED;

      await ComplaintModel.addTimelineEvent(existing.id, {
        status: COMPLAINT_STATUS.ASSIGNED,
        title: 'Assigned to Staff',
        description: `Dispatched to ${sanitizedUpdates.assignedStaffName} by ${currentUser.name}.`,
        updatedBy: currentUser.name
      });
    }

    return await ComplaintModel.update(existing.id, sanitizedUpdates);
  }

  /**
   * Update complaint status with audit timeline entry
   */
  static async updateComplaintStatus(id, newStatus, note, currentUser) {
    const existing = await ComplaintModel.findById(id);
    if (!existing) return null;

    const timelineDescription = note || `Status updated from ${existing.status} to ${newStatus}.`;

    await ComplaintModel.addTimelineEvent(existing.id, {
      status: newStatus,
      title: `Status: ${newStatus}`,
      description: timelineDescription,
      updatedBy: currentUser.name
    });

    return await ComplaintModel.update(existing.id, { status: newStatus });
  }

  /**
   * Delete complaint
   */
  static async deleteComplaint(id, currentUser) {
    const existing = await ComplaintModel.findById(id);
    if (!existing) return false;

    // Citizens can delete only their own submitted (unreviewed) complaints
    if (currentUser.role === ROLES.CITIZEN) {
      if (existing.citizenId !== currentUser.id) {
        const err = new Error('Access denied: You cannot delete this complaint.');
        err.statusCode = 403;
        throw err;
      }
      if (existing.status !== COMPLAINT_STATUS.SUBMITTED) {
        const err = new Error('Cannot delete complaint once review or dispatch has begun.');
        err.statusCode = 400;
        throw err;
      }
    }

    // Clean up stored image if local
    if (existing.image) {
      complaintStorage.deleteImage(existing.image);
    }

    return await ComplaintModel.delete(existing.id);
  }

  /**
   * Add interactive comment/update
   */
  static async addComment(id, commentText, currentUser) {
    const existing = await ComplaintModel.findById(id);
    if (!existing) return null;

    return await ComplaintModel.addComment(existing.id, {
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      comment: commentText.trim()
    });
  }

  /**
   * Get analytical overview metrics
   */
  static async getOverviewMetrics() {
    const complaints = await ComplaintModel.findAll();
    return {
      total: complaints.length,
      submitted: complaints.filter(c => c.status === COMPLAINT_STATUS.SUBMITTED).length,
      underReview: complaints.filter(c => c.status === COMPLAINT_STATUS.UNDER_REVIEW).length,
      assigned: complaints.filter(c => c.status === COMPLAINT_STATUS.ASSIGNED).length,
      inProgress: complaints.filter(c => c.status === COMPLAINT_STATUS.IN_PROGRESS).length,
      resolved: complaints.filter(c => c.status === COMPLAINT_STATUS.RESOLVED || c.status === COMPLAINT_STATUS.CLOSED).length,
      urgentOrHigh: complaints.filter(c => c.priority === 'Urgent' || c.priority === 'High').length
    };
  }
}

module.exports = ComplaintService;
