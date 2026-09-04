/**
 * Collection Staff Management - TypeScript Types and Contracts
 */

export type StaffRole =
  | 'Driver'
  | 'Waste Collector'
  | 'Supervisor';

export type StaffStatus =
  | 'Available'
  | 'Assigned'
  | 'On Duty'
  | 'Inactive';

export interface StaffMember {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone?: string;
  employeeId: string;
  role: StaffRole;
  assignedVehicle?: string | null;
  assignedArea?: string;
  status: StaffStatus;
  userId?: string | null;
  shiftNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffStats {
  total: number;
  drivers: number;
  collectors: number;
  supervisors: number;
  available: number;
  assigned: number;
  onDuty: number;
  inactive: number;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  phone?: string;
  employeeId: string;
  role: StaffRole;
  assignedVehicle?: string | null;
  assignedArea?: string;
  status?: StaffStatus;
  shiftNotes?: string;
}

export interface UpdateStaffPayload {
  name?: string;
  email?: string;
  phone?: string;
  employeeId?: string;
  role?: StaffRole;
  assignedVehicle?: string | null;
  assignedArea?: string;
  status?: StaffStatus;
  shiftNotes?: string;
}
