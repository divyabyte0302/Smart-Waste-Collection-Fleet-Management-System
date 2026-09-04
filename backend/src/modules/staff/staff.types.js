/**
 * Collection Staff Module - Types, Constants, and Enums
 */
const STAFF_ROLES = {
  DRIVER: 'Driver',
  WASTE_COLLECTOR: 'Waste Collector',
  SUPERVISOR: 'Supervisor'
};

const STAFF_STATUS = {
  AVAILABLE: 'Available',
  ASSIGNED: 'Assigned',
  ON_DUTY: 'On Duty',
  INACTIVE: 'Inactive'
};

module.exports = {
  STAFF_ROLES,
  STAFF_STATUS
};
