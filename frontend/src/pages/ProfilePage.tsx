import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  KeyRound, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Save
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();

  // Profile Edit State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg('');
    setProfileSuccessMsg('');

    if (!name.trim()) {
      setProfileErrorMsg('Full Name is required.');
      return;
    }

    try {
      setIsUpdatingProfile(true);
      await authService.updateProfile({
        name,
        phone,
        address,
        city,
      });
      await refreshProfile();
      setProfileSuccessMsg('Profile updated successfully!');
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    } catch (err: any) {
      setProfileErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg('');
    setPasswordSuccessMsg('');

    if (!currentPassword) {
      setPasswordErrorMsg('Current password is required.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('New passwords do not match.');
      return;
    }

    try {
      setIsChangingPassword(true);
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      setPasswordSuccessMsg('Password changed successfully! Keep your credentials safe.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccessMsg(''), 4000);
    } catch (err: any) {
      setPasswordErrorMsg(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const roleVariant: 'green' | 'blue' | 'amber' = 
    user?.role === 'Administrator' ? 'blue' :
    user?.role === 'Collection Staff' ? 'amber' : 'green';

  const statusVariant: 'green' | 'rose' = 
    user?.status === 'Active' ? 'green' : 'rose';

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Profile Header Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 p-8 text-white shadow-xl">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
            <ShieldCheck className="w-80 h-80" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-3xl font-extrabold shadow-inner">
              {getInitials(user?.name)}
            </div>

            <div className="text-center md:text-left space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{user?.name}</h1>
                <Badge variant={roleVariant} size="md">
                  {user?.role}
                </Badge>
                <Badge variant={statusVariant} size="md">
                  {user?.status}
                </Badge>
              </div>

              <p className="text-emerald-100 flex items-center justify-center md:justify-start gap-2 text-sm">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-emerald-100/90">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  RBAC Authorized Session
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Column 1: Profile Information */}
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <div className="mb-5 border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-slate-100">Personal Information</h2>
                <p className="text-xs text-slate-400">Update your contact and civic address details for waste collection</p>
              </div>

              {profileSuccessMsg && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              {profileErrorMsg && (
                <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{profileErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input
                  id="profile-name"
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  icon={<UserIcon className="w-4 h-4" />}
                  required
                />

                <Input
                  id="profile-email"
                  label="Registered Email (Read-only)"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  icon={<Mail className="w-4 h-4" />}
                  helperText="Email cannot be changed directly for security and audit trail."
                />

                <Input
                  id="profile-phone"
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  icon={<Phone className="w-4 h-4" />}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="profile-address"
                    label="Street Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 742 Evergreen Terrace"
                    icon={<MapPin className="w-4 h-4" />}
                  />

                  <Input
                    id="profile-city"
                    label="Municipality / City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Springfield Metro"
                    icon={<Building2 className="w-4 h-4" />}
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isUpdatingProfile}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Column 2: Password Change & Security Settings */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <div className="mb-5 border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-slate-100">Security & Password</h2>
                <p className="text-xs text-slate-400">Keep your account safe by setting a strong password</p>
              </div>

              {passwordSuccessMsg && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{passwordSuccessMsg}</span>
                </div>
              )}

              {passwordErrorMsg && (
                <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{passwordErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <Input
                  id="current-password"
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<KeyRound className="w-4 h-4" />}
                  required
                />

                <Input
                  id="new-password"
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  icon={<KeyRound className="w-4 h-4" />}
                  required
                />

                <Input
                  id="confirm-password"
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  icon={<KeyRound className="w-4 h-4" />}
                  required
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full justify-center"
                    isLoading={isChangingPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>

            {/* Account Details Card */}
            <Card>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Access & Permissions
              </h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-500">User ID</span>
                  <span className="font-mono text-slate-300">{user?.id?.substring(0, 12)}...</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-500">Security Clearance</span>
                  <span className="font-semibold text-emerald-400">{user?.role}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-500">Session Protocol</span>
                  <span className="text-slate-300">JWT Bearer HS256</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Account State</span>
                  <span className="text-emerald-400 font-semibold">{user?.status}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
