import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { analyticsService } from '../../services/analyticsService';
import {
  DailyReportData,
  WeeklyReportData,
  MonthlyReportData,
  ReportType
} from '../../types/analytics.types';
import { ReportTable } from '../../components/analytics/ReportTable';
import { ExportButton } from '../../components/analytics/ExportButton';
import {
  FileText,
  Calendar,
  MapPin,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  TrendingUp,
  Truck,
  Users,
  AlertTriangle,
  ArrowLeft,
  Filter
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('daily');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [dailyData, setDailyData] = useState<DailyReportData | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyReportData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyReportData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const loadReport = async () => {
    try {
      setIsLoading(true);
      if (reportType === 'daily' || reportType === 'complaints') {
        const data = await analyticsService.getDailyReport(selectedDate, selectedArea);
        setDailyData(data);
      } else if (reportType === 'weekly' || reportType === 'vehicles') {
        const data = await analyticsService.getWeeklyReport(selectedArea);
        setWeeklyData(data);
      } else {
        const data = await analyticsService.getMonthlyReport(undefined, undefined, selectedArea);
        setMonthlyData(data);
      }
    } catch (err) {
      console.error('Failed to load report data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [reportType, selectedArea, selectedDate]);

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const csvType = reportType === 'weekly' ? 'weekly' : reportType === 'monthly' ? 'monthly' : 'daily';
      await analyticsService.downloadCSV(csvType, {
        date: selectedDate,
        area: selectedArea
      });
    } catch (err: any) {
      alert(err.message || 'Failed to download report CSV.');
    } finally {
      setIsExporting(false);
    }
  };

  const areas = [
    'All',
    'Downtown Central',
    'Metro North Residential',
    'Green Valley Eco-District',
    'Industrial Harbor Yard',
    'Westside Commercial Corridor'
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/analytics"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Back to Analytics"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Compliance & Reporting Center
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span className="text-xs text-slate-400">Official Municipal Audit</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-0.5">Municipal Service Reports</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ExportButton
              onExportCSV={handleExportCSV}
              onPrint={() => window.print()}
              isExporting={isExporting}
              label="Download / Print"
            />
          </div>
        </div>

        {/* Report Selector Tabs */}
        <div className="bg-slate-900/60 border border-slate-800 p-2 rounded-xl flex flex-wrap gap-1.5">
          {[
            { id: 'daily', label: 'Daily Collection Report' },
            { id: 'weekly', label: 'Weekly Collection Report' },
            { id: 'monthly', label: 'Monthly Performance Report' },
            { id: 'complaints', label: 'Complaint Resolution Report' },
            { id: 'vehicles', label: 'Vehicle Utilization Report' },
            { id: 'staff', label: 'Staff Performance Report' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as ReportType)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                reportType === tab.id
                  ? 'bg-gradient-to-r from-eco-500 to-city-500 text-white shadow-md shadow-eco-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Filter className="w-4 h-4 text-eco-400" />
            <span className="font-semibold">Report Parameters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            {(reportType === 'daily' || reportType === 'complaints') && (
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-eco-500"
                />
              </div>
            )}

            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-eco-500"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a === 'All' ? 'All Municipal Sectors' : a}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Metric Strip for Active Report */}
        {reportType === 'daily' && dailyData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Total Tasks Tracked</span>
              <p className="text-2xl font-bold text-white mt-1">{dailyData.summary.totalTasks}</p>
              <span className="text-[10px] text-slate-500">{dailyData.summary.areaFilter}</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-emerald-400">Routes Collected</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{dailyData.summary.routesCollected}</p>
              <span className="text-[10px] text-slate-500">Scheduled runs</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-sky-400">Citizen Pickups</span>
              <p className="text-2xl font-bold text-sky-400 mt-1">{dailyData.summary.pickupsCompleted}</p>
              <span className="text-[10px] text-slate-500">Fulfilled loads</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-amber-400">Active Crew on Duty</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{dailyData.summary.crewOnDuty}</p>
              <span className="text-[10px] text-slate-500">{dailyData.summary.activeFleetCount} Vehicles active</span>
            </div>
          </div>
        )}

        {reportType === 'weekly' && weeklyData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Weekly Total Tonnage</span>
              <p className="text-2xl font-bold text-white mt-1 font-mono">{weeklyData.summary.totalTonnage} Tons</p>
              <span className="text-[10px] text-slate-500">Municipal scale</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-emerald-400">Citizen Pickups</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{weeklyData.summary.totalPickupsCompleted}</p>
              <span className="text-[10px] text-slate-500">On-demand requests</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-cyan-400">Average Route Efficiency</span>
              <p className="text-2xl font-bold text-cyan-400 mt-1">{weeklyData.summary.averageEfficiency}</p>
              <span className="text-[10px] text-slate-500">On-time rate</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-amber-400">Compliance Audit</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{weeklyData.summary.complianceScore}</p>
              <span className="text-[10px] text-slate-500">City health standard</span>
            </div>
          </div>
        )}

        {reportType === 'monthly' && monthlyData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400">Monthly Volume</span>
              <p className="text-2xl font-bold text-white mt-1 font-mono">{monthlyData.summary.totalTonnageCollected}</p>
              <span className="text-[10px] text-slate-500">{monthlyData.summary.period}</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-emerald-400">Routes Executed</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{monthlyData.summary.totalRoutesExecuted}</p>
              <span className="text-[10px] text-slate-500">Sector sweeps</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-sky-400">Issues Resolved</span>
              <p className="text-2xl font-bold text-sky-400 mt-1">{monthlyData.summary.totalComplaintsResolved}</p>
              <span className="text-[10px] text-slate-500">Closed citizen cases</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-cyan-400">Fleet Uptime</span>
              <p className="text-2xl font-bold text-cyan-400 mt-1">{monthlyData.summary.overallFleetUptime}</p>
              <span className="text-[10px] text-slate-500">Operational readiness</span>
            </div>
          </div>
        )}

        {/* Report Data Table */}
        {reportType === 'daily' || reportType === 'complaints' ? (
          <ReportTable
            headers={[
              { label: 'Task ID', key: 'id' },
              { label: 'Type', key: 'category' },
              { label: 'Title / Stream', key: 'title' },
              { label: 'Sector / Location', key: 'area' },
              { label: 'Vehicle', key: 'assignedAsset' },
              { label: 'Crew Member', key: 'assignedTo' },
              { label: 'Status', key: 'status' },
              { label: 'Time Window', key: 'timestamp' }
            ]}
            rows={dailyData?.rows || []}
            isLoading={isLoading}
            summaryFooter={
              <div className="flex items-center justify-between font-medium">
                <span>Total Items Reported: {dailyData?.rows.length || 0}</span>
                <span className="text-slate-400">Report Generated: {new Date().toLocaleString()}</span>
              </div>
            }
          />
        ) : reportType === 'weekly' || reportType === 'vehicles' ? (
          <ReportTable
            headers={[
              { label: 'Day of Week', key: 'day', className: 'font-bold' },
              { label: 'Total Routes', key: 'totalRoutes' },
              { label: 'Routes Completed', key: 'routesCompleted' },
              { label: 'Pickups Completed', key: 'pickupsCompleted' },
              { label: 'Tonnage (Tons)', key: 'tonnageCollected', className: 'font-mono text-eco-400' },
              { label: 'Efficiency Rate (%)', key: 'efficiencyRate', className: 'font-mono' }
            ]}
            rows={weeklyData?.weeklyBreakdown || []}
            isLoading={isLoading}
            summaryFooter={
              <div className="flex items-center justify-between font-medium">
                <span>Weekly Average Efficiency: {weeklyData?.summary.averageEfficiency || '97.2%'}</span>
                <span>Cumulative Waste: {weeklyData?.summary.totalTonnage || 0} Tons</span>
              </div>
            }
          />
        ) : (
          <ReportTable
            headers={[
              { label: 'Municipal Sector', key: 'sector', className: 'font-bold text-white' },
              { label: 'Routes Cleared', key: 'routesCleared' },
              { label: 'Tonnage Handled (Tons)', key: 'tonnage', className: 'font-mono text-eco-400' },
              { label: 'Complaints Resolved', key: 'complaintsResolved' },
              { label: 'Citizen Satisfaction', key: 'satisfaction', className: 'font-mono text-emerald-400' }
            ]}
            rows={monthlyData?.sectorPerformance || []}
            isLoading={isLoading}
            summaryFooter={
              <div className="flex items-center justify-between font-medium">
                <span>Month Total Volume: {monthlyData?.summary.totalTonnageCollected || '0 Tons'}</span>
                <span>Audit Period: {monthlyData?.summary.period || 'Current Period'}</span>
              </div>
            }
          />
        )}
      </div>
    </DashboardLayout>
  );
};
