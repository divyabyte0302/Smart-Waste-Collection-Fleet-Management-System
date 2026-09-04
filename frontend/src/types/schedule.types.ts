export type ScheduleStatus =
  | 'Scheduled'
  | 'Active'
  | 'Completed'
  | 'Cancelled'
  | 'Pending'
  | 'In Progress'
  | 'Collected'
  | 'Skipped';

export type CollectionStatus = ScheduleStatus;

export interface Schedule {
  id: string;
  scheduleId?: string;
  area: string;
  zone?: string;
  collectionDate: string;
  dayOfWeek?: string;
  startTime: string;
  endTime: string;
  timeSlot?: string;
  wasteType: string;
  collectionType?: string;
  vehicleId?: string;
  vehicleNumber?: string;
  staffId?: string;
  staffName?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  status: ScheduleStatus;
  checkpoints?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchedulePayload {
  area: string;
  collectionDate: string;
  startTime: string;
  endTime: string;
  wasteType: string;
  vehicleId?: string;
  staffId?: string;
  staffName?: string;
  status?: ScheduleStatus;
}

export interface UpdateSchedulePayload {
  area?: string;
  collectionDate?: string;
  startTime?: string;
  endTime?: string;
  wasteType?: string;
  vehicleId?: string;
  staffId?: string;
  staffName?: string;
  status?: ScheduleStatus;
}

export interface ScheduleFilterParams {
  area?: string;
  date?: string;
  wasteType?: string;
  status?: string;
  search?: string;
  staffId?: string;
}
