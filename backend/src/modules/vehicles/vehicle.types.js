/**
 * Vehicle Module - Types, Constants, and Enums
 */
const VEHICLE_TYPES = {
  GARBAGE_TRUCK: 'Garbage Truck',
  MINI_TRUCK: 'Mini Truck',
  RECYCLING_VEHICLE: 'Recycling Vehicle',
  SPECIAL_WASTE_VEHICLE: 'Special Waste Vehicle'
};

const VEHICLE_STATUS = {
  AVAILABLE: 'Available',
  ASSIGNED: 'Assigned',
  ON_ROUTE: 'On Route',
  MAINTENANCE: 'Maintenance',
  INACTIVE: 'Inactive'
};

module.exports = {
  VEHICLE_TYPES,
  VEHICLE_STATUS
};
