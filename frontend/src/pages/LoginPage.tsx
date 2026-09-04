import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, AlertCircle, Shield, Truck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await login({ email, password });
      redirectByUserRole(user.role);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectByUserRole = (role: string) => {
    switch (role) {
      case 'Administrator':
        navigate('/admin');
        break;
      case 'Collection Staff':
        navigate('/staff');
        break;
      default:
        navigate('/citizen');
        break;
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <AuthLayout title="Sign In to EcoCity" subtitle="Enter your credentials to access your designated portal">
      {/* 1-Click Quick Demo Accounts */}
      <div className="mb-6 p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          ⚡ 1-Click Demo Profiles
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@smartwaste.gov')}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all text-center group"
          >
            <Shield className="w-4 h-4 text-rose-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200">Admin</span>
            <span className="text-[10px] text-slate-500">Arthur V.</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('staff@smartwaste.gov')}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all text-center group"
          >
            <Truck className="w-4 h-4 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200">Staff</span>
            <span className="text-[10px] text-slate-500">Marcus C.</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('citizen@smartwaste.gov')}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-eco-500/50 hover:bg-eco-500/5 transition-all text-center group"
          >
            <UserCheck className="w-4 h-4 text-eco-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-200">Citizen</span>
            <span className="text-[10px] text-slate-500">Sophia M.</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2.5 text-xs text-rose-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-1">
        <Input
          label="Email Address"
          type="email"
          placeholder="admin@smartwaste.gov"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="flex items-center justify-between py-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
            <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-eco-500 focus:ring-0" />
            Remember session
          </label>
          <Link to="/forgot-password" className="text-eco-400 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full mt-4" size="lg" isLoading={isLoading}>
          Sign In to Workspace
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
        New resident in EcoCity?{' '}
        <Link to="/register" className="font-semibold text-eco-400 hover:underline">
          Create Citizen Account
        </Link>
      </div>
    </AuthLayout>
  );
};
