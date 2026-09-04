/**
 * Smart Waste Collection Management System - System Constants & RBAC Roles
 */
module.exports = {
  ROLES: {
    CITIZEN: 'Citizen',
    ADMINISTRATOR: 'Administrator',
    COLLECTION_STAFF: 'Collection Staff'
  },

  USER_STATUS: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive'
  },

  COLLECTION_STATUS: {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COLLECTED: 'Collected',
    SKIPPED: 'Skipped'
  },

  WASTE_TYPES: [
    'Organic Waste',
    'Recyclable Materials',
    'Electronic Waste',
    'Bulky Furniture',
    'Hazardous / Chemicals'
  ]
};
