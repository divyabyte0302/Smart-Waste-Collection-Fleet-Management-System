/**
 * Analytics & Reports Module - TypeScript Types & Contracts
 */

export interface DashboardMetrics {
  totalCitizens: number;
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  totalPickups: number;
  completedPickups: number;
  activeVehicles: number;
  availableVehicles: number;
  staffOnDuty: number;
  serviceCompletionRate: number;
}

export interface SectorStat {
  sector: string;
  complaints: number;
  pickups: number;
  totalTasks: number;
}

export interface DashboardAnalyticsResponse {
  metrics: DashboardMetrics;
  sectorStats: SectorStat[];
  totals: {
    totalFleet: number;
    totalStaff: number;
    totalSchedules: number;
  };
  lastUpdated: string;
}

export interface CategoryMetric {
  category: string;
  count: number;
  percentage: number;
}

export interface StatusMetric {
  status: string;
  count: number;
}

export interface PriorityMetric {
  priority: string;
  count: number;
}

export interface AreaMetric {
  area: string;
  count: number;
}

export interface ComplaintAnalytics {
  total: number;
  resolutionRate: number;
  byCategory: CategoryMetric[];
  byStatus: StatusMetric[];
  byPriority: PriorityMetric[];
  byArea: AreaMetric[];
}

export interface WasteTypeMetric {
  wasteType: string;
  count: number;
  percentage: number;
}

export interface DailyTrendMetric {
  date: string;
  label: string;
  count: number;
}

export interface PickupAnalytics {
  total: number;
  completed: number;
  byWasteType: WasteTypeMetric[];
  byStatus: StatusMetric[];
  dailyCompleted: DailyTrendMetric[];
}

export interface VehicleAnalytics {
  total: number;
  active: number;
  utilizationRate: number;
  byStatus: StatusMetric[];
  byType: { type: string; count: number }[];
  topVehicles: {
    vehicleId: string;
    vehicleNumber: string;
    vehicleType: string;
    completedServices: number;
    status: string;
    area: string;
  }[];
}

export interface StaffAnalytics {
  total: number;
  onDuty: number;
  dutyRate: number;
  byRole: { role: string; count: number }[];
  byStatus: StatusMetric[];
  staffPerformance: {
    staffId: string;
    name: string;
    role: string;
    area: string;
    status: string;
    tasksCompleted: number;
    efficiencyScore: number;
  }[];
}

export interface ReportTaskRow {
  id: string;
  category: string;
  title: string;
  area: string;
  assignedAsset: string;
  assignedTo: string;
  status: string;
  timestamp: string;
}

export interface DailyReportData {
  summary: {
    reportDate: string;
    areaFilter: string;
    totalTasks: number;
    routesCollected: number;
    pickupsCompleted: number;
    complaintsActive: number;
    activeFleetCount: number;
    crewOnDuty: number;
  };
  rows: ReportTaskRow[];
}

export interface WeeklyDayMetric {
  day: string;
  totalRoutes: number;
  routesCompleted: number;
  pickupsCompleted: number;
  tonnageCollected: number;
  efficiencyRate: number;
}

export interface WeeklyReportData {
  summary: {
    weekRange: string;
    areaFilter: string;
    totalTonnage: string;
    totalPickupsCompleted: number;
    averageEfficiency: string;
    complianceScore: string;
  };
  weeklyBreakdown: WeeklyDayMetric[];
}

export interface MonthlySectorMetric {
  sector: string;
  routesCleared: number;
  tonnage: number;
  complaintsResolved: number;
  satisfaction: string;
}

export interface MonthlyReportData {
  summary: {
    period: string;
    totalTonnageCollected: string;
    totalRoutesExecuted: number;
    totalComplaintsResolved: number;
    overallFleetUptime: string;
    overallCompletionRate: string;
  };
  sectorPerformance: MonthlySectorMetric[];
}

export type ReportType =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'complaints'
  | 'vehicles'
  | 'staff';
