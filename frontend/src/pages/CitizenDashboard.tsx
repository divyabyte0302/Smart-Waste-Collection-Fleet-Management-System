import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../hooks/useAuth';
import { scheduleService } from '../services/scheduleService';
import { Schedule } from '../types/schedule.types';
import {
  AlertTriangle,
  PackagePlus,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Trash2,
  Send,
  Loader2,
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(true);

  // Form states
  const [reportCategory, setReportCategory] = useState('Overflowing Public Bin');
  const [reportPriority, setReportPriority] = useState('Medium');
  const [reportAddress, setReportAddress] = useState(user?.address || '');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  // Special Pickup state
  const [pickupType, setPickupType] = useState('Electronic Waste');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupVolume, setPickupVolume] = useState('1-3 Items (Small)');
  const [isSubmittingPickup, setIsSubmittingPickup] = useState(false);
  const [pickupSuccess, setPickupSuccess] = useState<string | null>(null);

  // Simulated active citizen reports
  const [myTickets, setMyTickets] = useState([
    {
      id: 'TKT-2026-901',
      category: 'Overflowing Bin',
      location: user?.address || 'Curbside',
      status: 'In Progress',
      priority: 'High',
      date: 'Today, 08:30 AM',
    },
    {
      id: 'TKT-2026-874',
      category: 'Missed Collection',
      location: 'Maplewood Ave Sector 2',
      status: 'Resolved',
      priority: 'Medium',
      date: 'Yesterday',
    },
  ]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await scheduleService.getSchedules();
        setSchedules(data);
      } catch (err) {
        console.error('Failed to load schedules:', err);
      } finally {
        setIsLoadingSchedules(false);
      }
    };
    fetchSchedules();
  }, []);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReport(true);

    setTimeout(() => {
      const newTicketId = `TKT-2026-${Math.floor(100 + Math.random() * 900)}`;
      setMyTickets((prev) => [
        {
          id: newTicketId,
          category: reportCategory,
          location: reportAddress,
          status: 'Pending',
          priority: reportPriority,
          date: 'Just now',
        },
        ...prev,
      ]);
      setIsSubmittingReport(false);
      setReportSuccess(`Incident logged successfully under Ticket #${newTicketId}! Sanitation crew alerted.`);
      setReportDescription('');
    }, 600);
  };

  const handlePickupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPickup(true);

    setTimeout(() => {
      setIsSubmittingPickup(false);
      setPickupSuccess(`Special pickup scheduled for ${pickupDate}! Assigned carrier will confirm morning window.`);
    }, 600);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-900/40 p-6 rounded-2xl border border-slate-800">
          <div>
            <span className="text-xs font-bold text-eco-400 uppercase tracking-widest block mb-1">
              Citizen Self-Service Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-eco-400" />
              {user?.address ? `${user.address}, ${user.city}` : 'Metro City Residence'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/citizen/report-issue">
              <Button variant="primary" size="sm">
                + Report Issue
              </Button>
            </Link>
            <Link to="/citizen/my-complaints">
              <Button variant="secondary" size="sm">
                📋 My Complaints
              </Button>
            </Link>
            <Link to="/citizen/tracking">
              <Button variant="outline" size="sm">
                🎯 Track by ID
              </Button>
            </Link>
          </div>
        </div>

        {/* Action Grid: Report Issue & Special Pickup */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 1. Report Issue */}
          <Card>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Report Waste Issue</h2>
                <p className="text-xs text-slate-400">Flag missed pickups, overflowing bins, or illegal spills</p>
              </div>
            </div>

            {reportSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{reportSuccess}</span>
              </div>
            )}

            <form onSubmit={handleReportSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Issue Category
                </label>
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-eco-500"
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                >
                  <option>Overflowing Public Bin</option>
                  <option>Missed Collection</option>
                  <option>Illegal Dumping</option>
                  <option>Hazardous Waste Spill</option>
                  <option>Damaged Wheelie Bin</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Priority Level
                  </label>
                  <select
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-eco-500"
                    value={reportPriority}
                    onChange={(e) => setReportPriority(e.target.value)}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Street Location
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-eco-500"
                    value={reportAddress}
                    onChange={(e) => setReportAddress(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Observations & Description
                </label>
                <textarea
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-eco-500"
                  rows={2}
                  placeholder="Describe location landmark, overflow severity..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" isLoading={isSubmittingReport}>
                <Send className="w-4 h-4 mr-2" />
                Submit Waste Incident
              </Button>
            </form>
          </Card>

          {/* 2. Special Pickup Request */}
          <Card>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-city-500/10 border border-city-500/20 text-city-400 flex items-center justify-center">
                <PackagePlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Book Special Pickup</h2>
                <p className="text-xs text-slate-400">Curbside collection for electronics, furniture, or bulky items</p>
              </div>
            </div>

            {pickupSuccess && (
              <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs text-cyan-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{pickupSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePickupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Waste Classification
                </label>
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-eco-500"
                  value={pickupType}
                  onChange={(e) => setPickupType(e.target.value)}
                >
                  <option>Electronic Waste (Computers, Monitors, TV)</option>
                  <option>Bulky Furniture (Sofa, Mattress, Tables)</option>
                  <option>Green & Yard Trimmings</option>
                  <option>Construction & Metal Scrap</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Estimated Volume
                  </label>
                  <select
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-eco-500"
                    value={pickupVolume}
                    onChange={(e) => setPickupVolume(e.target.value)}
                  >
                    <option>1-3 Items (Small)</option>
                    <option>Medium Truckload (4-8 Items)</option>
                    <option>Full Flatbed Capacity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Preferred Collection Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-eco-500"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400">
                📌 Place items curbside before 07:30 AM on confirmed pickup morning. Municipal fee is waived for recyclables.
              </div>

              <Button type="submit" variant="secondary" className="w-full text-eco-400 border-eco-500/30 hover:bg-eco-500/10" isLoading={isSubmittingPickup}>
                Confirm Special Pickup Booking
              </Button>
            </form>
          </Card>
        </div>

        {/* Section: My Reported Incidents */}
        <Card>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">My Active Reports & Pickup Requests</h2>
              <p className="text-xs text-slate-400">Track resolution progress and field crew dispatch</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {myTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-200">{t.id}</td>
                    <td className="py-3 px-4 text-slate-300">{t.category}</td>
                    <td className="py-3 px-4 text-slate-400">{t.location}</td>
                    <td className="py-3 px-4">
                      <span className={t.priority === 'High' ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{t.date}</td>
                    <td className="py-3 px-4">
                      <Badge variant={t.status === 'Resolved' ? 'green' : t.status === 'In Progress' ? 'blue' : 'amber'}>
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Section: Neighborhood Collection Schedules */}
        <Card>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Neighborhood Collection Schedules</h2>
              <p className="text-xs text-slate-400">Regular recurring routes across Metro City sectors</p>
            </div>
            <Calendar className="w-5 h-5 text-eco-400" />
          </div>

          {isLoadingSchedules ? (
            <div className="py-8 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-eco-400" />
              <span>Loading municipal route schedules...</span>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedules.map((sch) => (
                <div key={sch.id} className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{sch.zone}</span>
                    <Badge variant={sch.status === 'Collected' ? 'green' : 'blue'}>{sch.dayOfWeek}</Badge>
                  </div>
                  <p className="text-xs font-semibold text-eco-400">{sch.collectionType}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {sch.timeSlot}
                  </p>
                  {sch.checkpoints && (
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1">
                      {sch.checkpoints.map((cp, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded">
                          📍 {cp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};
