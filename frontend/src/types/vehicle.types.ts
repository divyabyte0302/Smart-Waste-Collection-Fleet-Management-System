/**
 * Fleet & Vehicle Management - TypeScript Types and Contracts
 */

export type VehicleType =
  | 'Garbage Truck'
  | 'Mini Truck'
  | 'Recycling Vehicle'
  | 'Special Waste Vehicle';

export type VehicleStatus =
  | 'Available'
  | 'Assigned'
  | 'On Route'
  | 'Maintenance'
  | 'Inactive';

export interface VehicleAssignment {
  id: string;
  driverId: string;
  driverName: string;
  area: string;
  assignedAt: string;
  notes?: string;
}

export interface Vehicle {
  id: string;
  vehicleId: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  capacity: string;
  status: VehicleStatus;
  currentArea: string;
  driverId?: string | null;
  driverName?: string | null;
  completedServices?: number;
  assignmentHistory?: VehicleAssignment[];
  statusNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleStats {
  total: number;
  available: number;
  assigned: number;
  onRoute: number;
  maintenance: number;
  inactive: number;
}

export interface CreateVehiclePayload {
  vehicleNumber: string;
  vehicleType: VehicleType;
  capacity: string;
  currentArea?: string;
  status?: VehicleStatus;
  driverId?: string | null;
  driverName?: string | null;
}

export interface UpdateVehiclePayload {
  vehicleNumber?: string;
  vehicleType?: VehicleType;
  capacity?: string;
  currentArea?: string;
  status?: VehicleStatus;
  driverId?: string | null;
  driverName?: string | null;
  assignmentNotes?: string;
  statusNotes?: string;
}
