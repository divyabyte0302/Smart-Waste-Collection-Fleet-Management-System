/**
 * Waste Pickup Request - Types, Constants, and Enums
 */
const WASTE_TYPES = {
  HOUSEHOLD: 'Household Waste',
  RECYCLABLE: 'Recyclable Waste',
  ELECTRONIC: 'Electronic Waste',
  BULK: 'Bulk Waste',
  GARDEN: 'Garden Waste',
  OTHER: 'Other'
};

const PICKUP_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SCHEDULED: 'Scheduled',
  ASSIGNED: 'Assigned',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

module.exports = {
  WASTE_TYPES,
  PICKUP_STATUS
};
