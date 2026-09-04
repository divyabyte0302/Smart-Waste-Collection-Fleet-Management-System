import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { scheduleService } from '../services/scheduleService';
import { User, UserRole, UserStatus } from '../types/user.types';
import { Schedule } from '../types/schedule.types';
import {
  Users,
  ShieldCheck,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  BarChart2,
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState<User[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const data = await userService.getAllUsers();
      setUsersList(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      const data = await scheduleService.getSchedules();
      setSchedules(data);
    } catch (err) {
      console.error('Failed to load schedules:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSchedules();
  }, []);

  const handleToggleStatus = async (targetUser: User) => {
    const nextStatus: UserStatus = targetUser.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await userService.updateUserStatus(targetUser.id, nextStatus);
      setUsersList((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: nextStatus } : u))
      );
      setActionMessage(`Updated ${targetUser.name}'s status to ${nextStatus}.`);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update user status.');
    }
  };

  const filteredUsers = usersList.filter((u) => {
    if (selectedRole !== 'ALL' && u.role !== selectedRole) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.city && u.city.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const totalCitizens = usersList.filter((u) => u.role === 'Citizen').length;
  const totalStaff = usersList.filter((u) => u.role === 'Collection Staff').length;
  const totalActive = usersList.filter((u) => u.status === 'Active').length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Administrator Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-900/40 p-6 rounded-2xl border border-slate-800">
          <div>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block mb-1">
              Central Operations Command
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Administrator Console
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Signed in as {user?.name} • Municipal Oversight & Governance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/complaints">
              <Button variant="primary" size="sm">
                📋 Complaints Console
              </Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={fetchUsers}>
              🔄 Refresh Records
            </Button>
          </div>
        </div>

        {/* Action Message Banner */}
        {actionMessage && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-eco-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Citizens</span>
              <Users className="w-4 h-4 text-eco-400" />
            </div>
            <p className="text-2xl font-bold text-white">{totalCitizens}</p>
            <span className="text-[11px] text-eco-400 font-medium">Registered residents</span>
          </Card>

          <Card className="border-l-4 border-l-city-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Collection Staff</span>
              <Truck className="w-4 h-4 text-city-400" />
            </div>
            <p className="text-2xl font-bold text-white">{totalStaff}</p>
            <span className="text-[11px] text-city-400 font-medium">Active field drivers</span>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Active Accounts</span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">{totalActive} / {usersList.length}</p>
            <span className="text-[11px] text-amber-400 font-medium">Operational authorization</span>
          </Card>

          <Card className="border-l-4 border-l-emerald-400">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Routes Assigned</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">{schedules.length}</p>
            <span className="text-[11px] text-emerald-400 font-medium">Across all sectors</span>
          </Card>
        </div>

        {/* User Management Section */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">System User Management</h2>
                <Link to="/admin/users" className="text-xs font-semibold text-eco-400 hover:underline">
                  (Open Dedicated Hub →)
                </Link>
              </div>
              <p className="text-xs text-slate-400">Review all registered Citizens, Collection Staff, and Administrators</p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email..."
                  className="bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-eco-500 w-48 sm:w-60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-eco-500"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="Citizen">Citizens</option>
                <option value="Collection Staff">Collection Staff</option>
                <option value="Administrator">Administrators</option>
              </select>
            </div>
          </div>

          {isLoadingUsers ? (
            <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-eco-400" />
              <span className="text-sm">Querying user database...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Administrative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-200">{u.name}</td>
                      <td className="py-3.5 px-4 text-slate-300">{u.email}</td>
                      <td className="py-3.5 px-4 text-slate-400">{u.phone || 'N/A'}</td>
                      <td className="py-3.5 px-4 text-slate-400">{u.city || 'Metro City'}</td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            u.role === 'Administrator' ? 'rose' : u.role === 'Collection Staff' ? 'blue' : 'green'
                          }
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={u.status === 'Active' ? 'green' : 'slate'}>
                          {u.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {u.role !== 'Administrator' ? (
                          <Button
                            size="sm"
                            variant={u.status === 'Active' ? 'secondary' : 'primary'}
                            className={u.status === 'Active' ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10' : ''}
                            onClick={() => handleToggleStatus(u)}
                          >
                            {u.status === 'Active' ? (
                              <>
                                <XCircle className="w-3.5 h-3.5 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-semibold italic">Protected Root</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="py-8 text-center text-slate-500 text-sm">
                  No user accounts match the current filter or search criteria.
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Collection Routes & Schedules Overview */}
        <Card>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Active Municipal Schedules & Crew Assignments</h2>
              <p className="text-xs text-slate-400">Routes monitored across all city zones</p>
            </div>
            <Calendar className="w-5 h-5 text-city-400" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {schedules.map((sch) => (
              <div key={sch.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{sch.zone}</span>
                  <Badge variant={sch.status === 'Collected' ? 'green' : 'blue'}>{sch.status}</Badge>
                </div>
                <p className="text-xs text-eco-400 font-semibold">{sch.collectionType}</p>
                <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                  <p>🗓️ {sch.dayOfWeek} • {sch.timeSlot}</p>
                  <p>🚛 {sch.vehicleNumber || 'Compactor Unit'}</p>
                  <p>👤 Driver: <strong className="text-slate-200">{sch.assignedStaffName || 'Assigned Staff'}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
