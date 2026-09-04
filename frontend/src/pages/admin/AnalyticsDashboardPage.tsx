import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { analyticsService } from '../../services/analyticsService';
import {
  DashboardMetrics,
  SectorStat,
  ComplaintAnalytics,
  PickupAnalytics,
  VehicleAnalytics,
  StaffAnalytics
} from '../../types/analytics.types';
import { StatCard } from '../../components/analytics/StatCard';
import { ChartCard } from '../../components/analytics/ChartCard';
import { FilterPanel } from '../../components/analytics/FilterPanel';
import { ExportButton } from '../../components/analytics/ExportButton';
import {
  BarChartVisual,
  AreaTrendVisual,
  DonutSegmentVisual
} from '../../components/analytics/InteractiveCharts';
import {
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Boxes,
  Truck,
  RotateCcw,
  Percent,
  MapPin,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  Activity
} from 'lucide-react';

export const AnalyticsDashboardPage: React.FC = () => {
  // Filter States
  const [selectedRange, setSelectedRange] = useState('7d');
  const [selectedArea, setSelectedArea] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Analytics Datasets
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalCitizens: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalPickups: 0,
    completedPickups: 0,
    activeVehicles: 0,
    availableVehicles: 0,
    staffOnDuty: 0,
    serviceCompletionRate: 0
  });
  const [sectorStats, setSectorStats] = useState<SectorStat[]>([]);
  const [complaintsData, setComplaintsData] = useState<ComplaintAnalytics | null>(null);
  const [pickupsData, setPickupsData] = useState<PickupAnalytics | null>(null);
  const [vehiclesData, setVehiclesData] = useState<VehicleAnalytics | null>(null);
  const [staffData, setStaffData] = useState<StaffAnalytics | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchAllAnalytics = async () => {
    try {
      setIsLoading(true);
      const params = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        area: selectedArea !== 'All' ? selectedArea : undefined
      };

      const [dashRes, compRes, pickRes, vehRes, staffRes] = await Promise.all([
        analyticsService.getDashboardMetrics(params),
        analyticsService.getComplaintAnalytics(params),
        analyticsService.getPickupAnalytics(params),
        analyticsService.getVehicleAnalytics(params),
        analyticsService.getStaffAnalytics(params)
      ]);

      setMetrics(dashRes.metrics);
      setSectorStats(dashRes.sectorStats);
      setComplaintsData(compRes);
      setPickupsData(pickRes);
      setVehiclesData(vehRes);
      setStaffData(staffRes);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAnalytics();
  }, [selectedRange, selectedArea, startDate, endDate]);

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    const today = new Date();
    if (range === 'today') {
      const d = today.toISOString().split('T')[0];
      setStartDate(d);
      setEndDate(d);
    } else if (range === '7d') {
      const past = new Date();
      past.setDate(today.getDate() - 7);
      setStartDate(past.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (range === '30d') {
      const past = new Date();
      past.setDate(today.getDate() - 30);
      setStartDate(past.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (range === 'ytd') {
      setStartDate(`${today.getFullYear()}-01-01`);
      setEndDate(today.toISOString().split('T')[0]);
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      await analyticsService.downloadCSV('daily', {
        date: startDate,
        area: selectedArea
      });
    } catch (err: any) {
      alert(err.message || 'Failed to download report.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedRange('7d');
    setSelectedArea('All');
    setStartDate('');
    setEndDate('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-eco-400 uppercase tracking-wider">
                Municipal Operations Intelligence
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-eco-400"></span>
              <span className="text-xs text-slate-400">Live Grid Analytics</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">Analytics & Reporting Dashboard</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Real-time operational telemetry, citizen issue tracking, on-demand pickups, and fleet utilization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/reports"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Reports Console
            </Link>

            <ExportButton
              onExportCSV={handleExportCSV}
              onPrint={() => window.print()}
              isExporting={isExporting}
              label="Export Analytics"
            />
          </div>
        </div>

        {/* Dynamic Filter Panel */}
        <FilterPanel
          selectedRange={selectedRange}
          onRangeChange={handleRangeChange}
          selectedArea={selectedArea}
          onAreaChange={setSelectedArea}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onReset={handleResetFilters}
        />

        {/* 10 Core Municipal KPIs (5 columns on desktop) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Core Municipal Key Performance Indicators (KPIs)
            </span>
            {lastUpdated && (
              <span className="text-[10px] text-slate-500 font-mono">
                Synced {lastUpdated}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* 1. Total Citizens */}
            <StatCard
              title="Registered Citizens"
              value={metrics.totalCitizens}
              icon={<Users className="w-4 h-4" />}
              subtitle="Active portal accounts"
              variant="cyan"
            />

            {/* 2. Total Complaints */}
            <StatCard
              title="Total Complaints"
              value={metrics.totalComplaints}
              icon={<AlertTriangle className="w-4 h-4" />}
              subtitle="All reported issues"
              variant="amber"
            />

            {/* 3. Pending Complaints */}
            <StatCard
              title="Pending Complaints"
              value={metrics.pendingComplaints}
              icon={<Clock className="w-4 h-4" />}
              subtitle="In triage / assigned"
              variant="rose"
            />

            {/* 4. Resolved Complaints */}
            <StatCard
              title="Resolved Complaints"
              value={metrics.resolvedComplaints}
              icon={<CheckCircle2 className="w-4 h-4" />}
              subtitle="Closed cases"
              variant="eco"
            />

            {/* 5. Total Pickups */}
            <StatCard
              title="Pickup Requests"
              value={metrics.totalPickups}
              icon={<Boxes className="w-4 h-4" />}
              subtitle="Citizen on-demand"
              variant="cyan"
            />

            {/* 6. Completed Pickups */}
            <StatCard
              title="Completed Pickups"
              value={metrics.completedPickups}
              icon={<CheckCircle2 className="w-4 h-4" />}
              subtitle="Fulfilled waste loads"
              variant="eco"
            />

            {/* 7. Active Vehicles */}
            <StatCard
              title="Active Vehicles"
              value={metrics.activeVehicles}
              icon={<Truck className="w-4 h-4" />}
              subtitle="On route / assigned"
              variant="amber"
            />

            {/* 8. Available Vehicles */}
            <StatCard
              title="Available Vehicles"
              value={metrics.availableVehicles}
              icon={<RotateCcw className="w-4 h-4" />}
              subtitle="Ready for dispatch"
              variant="eco"
            />

            {/* 9. Staff on Duty */}
            <StatCard
              title="Staff On Duty"
              value={metrics.staffOnDuty}
              icon={<Activity className="w-4 h-4" />}
              subtitle="Active route crew"
              variant="cyan"
            />

            {/* 10. Service Completion Rate */}
            <StatCard
              title="Completion Rate"
              value={`${metrics.serviceCompletionRate}%`}
              icon={<Percent className="w-4 h-4" />}
              subtitle="Overall fulfillment"
              variant="eco"
            />
          </div>
        </div>

        {/* Visual Charts Grid: 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Complaints by Category */}
          <ChartCard
            title="Complaints by Category"
            subtitle="Distribution of issues reported across municipality"
            badge="Categories"
          >
            {complaintsData ? (
              <BarChartVisual
                data={complaintsData.byCategory.map((c) => ({
                  label: c.category,
                  value: c.count,
                  percentage: c.percentage
                }))}
                valueSuffix="cases"
              />
            ) : null}
          </ChartCard>

          {/* Chart 2: On-Demand Pickups by Waste Stream */}
          <ChartCard
            title="Pickup Requests by Waste Type"
            subtitle="Classification of citizen collection streams"
            badge="Waste Streams"
          >
            {pickupsData ? (
              <BarChartVisual
                data={pickupsData.byWasteType.map((w) => ({
                  label: w.wasteType,
                  value: w.count,
                  percentage: w.percentage
                }))}
                valueSuffix="pickups"
              />
            ) : null}
          </ChartCard>

          {/* Chart 3: Daily Completed Pickups Trend */}
          <ChartCard
            title="Daily Completed Pickups"
            subtitle="7-day operational completion timeline"
            badge="Timeline"
          >
            {pickupsData ? (
              <AreaTrendVisual
                data={pickupsData.dailyCompleted.map((d) => ({
                  label: d.label,
                  value: d.count
                }))}
                strokeColor="#06b6d4"
                fillColor="#06b6d4"
              />
            ) : null}
          </ChartCard>

          {/* Chart 4: Service Sector Breakdown */}
          <ChartCard
            title="Complaints & Pickups by Sector"
            subtitle="Geographical distribution across municipal zones"
            badge="Sectors"
          >
            <div className="w-full space-y-3 py-1">
              {sectorStats.map((sec) => (
                <div key={sec.sector} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-eco-400" />
                      {sec.sector}
                    </span>
                    <span className="font-mono text-slate-300">{sec.totalTasks} Tasks</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Complaints: <strong className="text-amber-400">{sec.complaints}</strong></span>
                    <span>•</span>
                    <span>Pickups: <strong className="text-sky-400">{sec.pickups}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Chart 5: Vehicle Utilization & Fleet Uptime */}
          <ChartCard
            title="Vehicle Fleet Utilization"
            subtitle="Current operational readiness and truck deployment"
            badge="Fleet Telemetry"
          >
            {vehiclesData ? (
              <div className="w-full flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                <DonutSegmentVisual
                  percentage={vehiclesData.utilizationRate}
                  label="Fleet Utilization"
                  sublabel={`${vehiclesData.active} / ${vehiclesData.total} Active Units`}
                  color="#10b981"
                />

                <div className="space-y-2 text-xs w-full max-w-xs">
                  {vehiclesData.byStatus.map((st) => (
                    <div key={st.status} className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/60">
                      <span className="text-slate-400">{st.status}</span>
                      <span className="font-mono font-bold text-white">{st.count} Units</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </ChartCard>

          {/* Chart 6: Collection Staff Performance */}
          <ChartCard
            title="Collection Staff Operational Performance"
            subtitle="Crew duty distribution and productivity indicators"
            badge="Personnel"
          >
            {staffData ? (
              <div className="w-full flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                <DonutSegmentVisual
                  percentage={staffData.dutyRate}
                  label="Crew on Duty"
                  sublabel={`${staffData.onDuty} / ${staffData.total} Active Personnel`}
                  color="#06b6d4"
                />

                <div className="space-y-2 text-xs w-full max-w-xs">
                  {staffData.byRole.map((r) => (
                    <div key={r.role} className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/60">
                      <span className="text-slate-400">{r.role}</span>
                      <span className="font-mono font-bold text-white">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </ChartCard>
        </div>
      </div>
    </DashboardLayout>
  );
};
