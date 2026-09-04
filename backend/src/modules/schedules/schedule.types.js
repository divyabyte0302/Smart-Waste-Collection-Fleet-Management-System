/**
 * Collection Schedule - Types and Enums
 */
const SCHEDULE_STATUS = {
  SCHEDULED: 'Scheduled',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

const SCHEDULE_WASTE_TYPES = {
  HOUSEHOLD: 'Household Waste',
  RECYCLABLE: 'Recyclable Waste',
  ELECTRONIC: 'Electronic Waste',
  BULK: 'Bulk Waste',
  GARDEN: 'Garden Waste',
  ORGANIC: 'Organic Waste',
  OTHER: 'Other'
};

module.exports = {
  SCHEDULE_STATUS,
  SCHEDULE_WASTE_TYPES
};
