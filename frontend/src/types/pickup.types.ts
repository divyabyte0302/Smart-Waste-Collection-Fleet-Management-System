/**
 * Waste Pickup Request - Frontend Types & Contracts
 */

export type WasteType =
  | 'Household Waste'
  | 'Recyclable Waste'
  | 'Electronic Waste'
  | 'Bulk Waste'
  | 'Garden Waste'
  | 'Other';

export type PickupStatus =
  | 'Pending'
  | 'Approved'
  | 'Scheduled'
  | 'Assigned'
  | 'Completed'
  | 'Cancelled';

export interface PickupRequest {
  id: string;
  requestId: string;
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhone?: string;
  wasteType: WasteType;
  estimatedWasteQuantity: string;
  pickupAddress: string;
  preferredDate: string;
  preferredTime: string;
  description?: string;
  status: PickupStatus;
  assignedVehicle?: string | null;
  assignedStaff?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePickupPayload {
  wasteType: WasteType;
  estimatedWasteQuantity?: string;
  pickupAddress: string;
  preferredDate: string;
  preferredTime: string;
  description?: string;
}

export interface UpdatePickupPayload {
  pickupAddress?: string;
  preferredDate?: string;
  preferredTime?: string;
  estimatedWasteQuantity?: string;
  description?: string;
  assignedVehicle?: string | null;
  assignedStaff?: string | null;
  status?: PickupStatus;
}
