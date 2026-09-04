import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { scheduleService } from '../../services/scheduleService';
import { userService } from '../../services/userService';
import { ScheduleStatus } from '../../types/schedule.types';
import { User } from '../../types/user.types';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Truck, 
  UserCheck, 
  PlusCircle, 
  AlertCircle,
  CheckCircle2,
  Send
} from 'lucide-react';

export const CreateSchedulePage: React.FC = () => {
  const navigate = useNavigate();

  const [area, setArea] = useState('Downtown Central');
  const [collectionDate, setCollectionDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('12:00 PM');
  const [wasteType, setWasteType] = useState('Household Waste');
  const [vehicleId, setVehicleId] = useState('TRK-101 (Compactor)');
  const [staffId, setStaffId] = useState('');
  const [status, setStatus] = useState<ScheduleStatus>('Scheduled');

  const [staffList, setStaffList] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const users = await userService.getAllUsers({ role: 'Collection Staff' });
        setStaffList(users || []);
        if (users && users.length > 0) {
          setStaffId(users[0].id);
        }
      } catch (err) {
        console.error('Failed to load collection staff:', err);
      }
    };
    loadStaff();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!area.trim()) {
      setErrorMsg('Area or sector name is required.');
      return;
    }

    if (!collectionDate) {
      setErrorMsg('Valid collection date is required.');
      return;
    }

    const assignedStaff = staffList.find((s) => s.id === staffId);
    const staffName = assignedStaff ? assignedStaff.name : 'Field Crew Member';

    try {
      setIsSubmitting(true);
      const newSchedule = await scheduleService.createSchedule({
        area: area.trim(),
        collectionDate,
        startTime,
        endTime,
        wasteType,
        vehicleId,
        staffId,
        staffName,
        status
      });

      setSuccessMsg(`Collection schedule ${newSchedule.scheduleId || ''} created successfully!`);
      setTimeout(() => {
        navigate('/admin/schedules');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create collection schedule.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const areas = [
    'Downtown Central',
    'Metro North Residential',
    'Green Valley Eco-District',
    'Harbor Wharf District',
    'Highland Ridge Sector',
    'Civic Commercial Center'
  ];

  const wasteTypes = [
    'Household Waste',
    'Recyclable Waste',
    'Electronic Waste',
    'Bulk Waste',
    'Garden Waste',
    'Organic Waste',
    'Other'
  ];

  const vehicles = [
    'TRK-101 (Compactor)',
    'TRK-102 (Recycler)',
    'TRK-103 (Electric Mini)',
    'TRK-104 (Flatbed Heavy)',
    'TRK-105 (Dump Truck)'
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link
            to="/admin/schedules"
            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Schedule Management
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 mb-1 text-eco-400 text-xs font-bold uppercase tracking-wider">
            <PlusCircle className="w-4 h-4" /> Route Planner
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Create Collection Schedule
          </h1>
          <p className="text-sm text-slate-400">
            Establish a recurring or single municipal route timetable, allocate vehicle and driver.
          </p>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Route Zone & Date
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Municipal Area / Sector
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-eco-500"
                >
                  {areas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                id="collection-date"
                label="Collection Date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                icon={<Calendar className="w-4 h-4" />}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="start-time"
                label="Start Time Window"
                placeholder="e.g. 08:00 AM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                icon={<Clock className="w-4 h-4" />}
                required
              />

              <Input
                id="end-time"
                label="End Time Window"
                placeholder="e.g. 12:00 PM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                icon={<Clock className="w-4 h-4" />}
                required
              />
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Waste Stream & Fleet Allocation
            </h2>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Waste Classification
              </label>
              <select
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-eco-500"
              >
                {wasteTypes.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Assigned Vehicle Unit
                </label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-eco-500"
                >
                  {vehicles.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Assigned Driver / Crew Member
                </label>
                <select
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-eco-500"
                >
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Initial Schedule Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ScheduleStatus)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-eco-500"
              >
                <option value="Scheduled">Scheduled (Upcoming)</option>
                <option value="Active">Active (Currently en route)</option>
              </select>
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link to="/admin/schedules">
              <Button type="button" variant="secondary" size="md">
                Cancel
              </Button>
            </Link>

            <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
              <Send className="w-4 h-4 mr-2" />
              Publish Collection Schedule
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
