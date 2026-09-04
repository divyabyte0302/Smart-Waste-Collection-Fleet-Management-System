/**
 * Complaint Management - Types, Constants, and Enums
 */
const COMPLAINT_CATEGORIES = {
  MISSED_COLLECTION: 'Missed Collection',
  OVERFLOWING_BIN: 'Overflowing Bin',
  ILLEGAL_DUMPING: 'Illegal Dumping',
  DAMAGED_BIN: 'Damaged Bin',
  OTHER: 'Other'
};

const COMPLAINT_STATUS = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed'
};

const COMPLAINT_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent'
};

module.exports = {
  COMPLAINT_CATEGORIES,
  COMPLAINT_STATUS,
  COMPLAINT_PRIORITY
};
