import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Edit, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  Save
} from 'lucide-react';

export const EditSchedulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [area, setArea] = useState('');
  const [collectionDate, setCollectionDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [wasteType, setWasteType] = useState('Household Waste');
  const [vehicleId, setVehicleId] = useState('TRK-101');
  const [staffId, setStaffId] = useState('');
  const [status, setStatus] = useState<ScheduleStatus>('Scheduled');

  const [staffList, setStaffList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setErrorMsg('');
      const [schedule, users] = await Promise.all([
        scheduleService.getScheduleById(id),
        userService.getAllUsers({ role: 'Collection Staff' })
      ]);

      setArea(schedule.area || schedule.zone || '');
      setCollectionDate(schedule.collectionDate || '');
      setStartTime(schedule.startTime || '08:00 AM');
      setEndTime(schedule.endTime || '12:00 PM');
      setWasteType(schedule.wasteType || schedule.collectionType || 'Household Waste');
      setVehicleId(schedule.vehicleId || schedule.vehicleNumber || 'TRK-101');
      setStaffId(schedule.staffId || schedule.assignedStaffId || (users[0]?.id || ''));
      setStatus(schedule.status || 'Scheduled');
      setStaffList(users || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load collection schedule details.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setErrorMsg('');

    const assignedStaff = staffList.find((s) => s.id === staffId);
    const staffName = assignedStaff ? assignedStaff.name : 'Field Crew Member';

    try {
      setIsSubmitting(true);
      await scheduleService.updateSchedule(id, {
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

      setSuccessMsg('Collection schedule updated successfully!');
      setTimeout(() => {
        navigate('/admin/schedules');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update schedule.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to permanently delete this collection schedule?')) return;

    try {
      await scheduleService.deleteSchedule(id);
      navigate('/admin/schedules');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete schedule.');
    }
  };

  const vehicles = [
    'TRK-101 (Compactor)',
    'TRK-102 (Recycler)',
    'TRK-103 (Electric Mini)',
    'TRK-104 (Flatbed Heavy)',
    'TRK-105 (Dump Truck)'
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto py-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-eco-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm">Loading schedule editor...</p>
        </div>
      </DashboardLayout>
    );
  }

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
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Edit className="w-4 h-4" /> Timetable Modifier
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Edit Collection Schedule
            </h1>
            <p className="text-sm text-slate-400">Modify timings, alter vehicle allocation, or adjust route status.</p>
          </div>

          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-1" />
            Delete Schedule
          </Button>
        </div>

        {/* Feedback Alerts */}
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
            <Input
              id="edit-area"
              label="Municipal Area / Zone"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              icon={<MapPin className="w-4 h-4" />}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="edit-date"
                label="Collection Date"
                type="date"
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                icon={<Calendar className="w-4 h-4" />}
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Route Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ScheduleStatus)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-eco-500"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Active">Active (In Progress)</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="edit-start"
                label="Start Time Window"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                icon={<Clock className="w-4 h-4" />}
                required
              />

              <Input
                id="edit-end"
                label="End Time Window"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                icon={<Clock className="w-4 h-4" />}
                required
              />
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Waste Stream
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
                  Vehicle Unit
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
                  Assigned Driver
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
          </Card>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link to="/admin/schedules">
              <Button type="button" variant="secondary" size="md">
                Cancel
              </Button>
            </Link>

            <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              Save Schedule Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
