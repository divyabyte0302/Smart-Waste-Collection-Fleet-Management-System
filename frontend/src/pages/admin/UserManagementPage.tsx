import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { userService } from '../../services/userService';
import { User, UserRole, UserStatus } from '../../types/user.types';
import {
  Users,
  ShieldCheck,
  Truck,
  User as UserIcon,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setActionNotice(err.message || 'Failed to load user accounts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (targetUser: User) => {
    const nextStatus: UserStatus = targetUser.status === 'Active' ? 'Inactive' : 'Active';
    setIsUpdatingId(targetUser.id);
    try {
      await userService.updateUserStatus(targetUser.id, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: nextStatus } : u))
      );
      setActionNotice(`Updated ${targetUser.name}'s status to ${nextStatus}.`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update user status.');
    } finally {
      setIsUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q)) ||
        (u.city && u.city.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const totalCitizens = users.filter((u) => u.role === 'Citizen').length;
  const totalStaff = users.filter((u) => u.role === 'Collection Staff').length;
  const totalAdmins = users.filter((u) => u.role === 'Administrator').length;
  const totalActive = users.filter((u) => u.status === 'Active').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-900/40 p-6 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                Security & Identity Hub
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-eco-400" />
              User Account Management
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage citizen accounts, field collection personnel, and administrative privileges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={fetchUsers} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="flex items-center justify-between p-4 bg-eco-950/40 border border-eco-500/40 rounded-xl text-eco-300 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-eco-400 flex-shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-eco-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-slate-900/60 border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total Users</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{users.length}</div>
            <div className="text-[11px] text-eco-400 mt-1">{totalActive} Active accounts</div>
          </Card>

          <Card className="p-4 bg-slate-900/60 border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Citizens</span>
              <UserIcon className="w-4 h-4 text-eco-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalCitizens}</div>
            <div className="text-[11px] text-slate-500 mt-1">Portal registrants</div>
          </Card>

          <Card className="p-4 bg-slate-900/60 border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Collection Staff</span>
              <Truck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalStaff}</div>
            <div className="text-[11px] text-slate-500 mt-1">Drivers & collectors</div>
          </Card>

          <Card className="p-4 bg-slate-900/60 border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Administrators</span>
              <ShieldCheck className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{totalAdmins}</div>
            <div className="text-[11px] text-slate-500 mt-1">Full dispatch control</div>
          </Card>
        </div>

        {/* Filter & Search Bar */}
        <Card className="p-4 bg-slate-900/80 border-slate-800">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, city..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-eco-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-eco-500"
                >
                  <option value="ALL">All Roles</option>
                  <option value="Citizen">Citizen</option>
                  <option value="Collection Staff">Collection Staff</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-eco-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* User Table */}
        <Card className="bg-slate-900/80 border-slate-800 overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-eco-400 animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">Loading user accounts...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-white">No Users Found</h4>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or role filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">User Details</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Contact & Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Registered</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-xs">
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{u.name}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            u.role === 'Administrator'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : u.role === 'Collection Staff'
                              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                              : 'bg-eco-500/10 text-eco-400 border-eco-500/20'
                          }`}
                        >
                          {u.role === 'Administrator' && <ShieldCheck className="w-3 h-3" />}
                          {u.role === 'Collection Staff' && <Truck className="w-3 h-3" />}
                          {u.role === 'Citizen' && <UserIcon className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        {u.city ? (
                          <div className="flex items-center gap-1 text-[11px]">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {u.city}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">—</span>
                        )}
                        {u.phone && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                            <Phone className="w-2.5 h-2.5 text-slate-500" />
                            {u.phone}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant={u.status === 'Active' ? 'green' : 'rose'}>
                          {u.status}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Button
                          variant={u.status === 'Active' ? 'danger' : 'primary'}
                          size="sm"
                          disabled={isUpdatingId === u.id}
                          onClick={() => handleToggleStatus(u)}
                          className="text-[11px] py-1 px-2.5"
                        >
                          {isUpdatingId === u.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : u.status === 'Active' ? (
                            'Deactivate'
                          ) : (
                            'Activate'
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};
