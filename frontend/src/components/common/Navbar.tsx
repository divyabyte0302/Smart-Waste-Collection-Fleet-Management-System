import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Recycle, LogOut, User as UserIcon, Shield, Truck, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from './Badge';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'Administrator':
        return 'rose';
      case 'Collection Staff':
        return 'blue';
      default:
        return 'green';
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'Administrator':
        return '/admin';
      case 'Collection Staff':
        return '/staff';
      default:
        return '/citizen';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-eco-500 to-city-500 flex items-center justify-center shadow-lg shadow-eco-500/20 group-hover:scale-105 transition-transform">
            <Recycle className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-eco-400 uppercase tracking-widest block leading-none">
              Smart Municipality
            </span>
            <span className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              EcoCity Waste Management
            </span>
          </div>
        </Link>

        {/* User Navigation / Auth Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                to={getDashboardPath()}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-eco-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                Dashboard
              </Link>

              {/* User Pill */}
              <Link
                to="/profile"
                className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-full transition-all group"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:border-eco-500 transition-colors">
                  {user.role === 'Administrator' ? (
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                  ) : user.role === 'Collection Staff' ? (
                    <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-eco-400" />
                  )}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-semibold text-slate-200 leading-none">{user.name}</p>
                </div>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {user.role}
                </Badge>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition-all"
                title="Sign Out"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold bg-eco-500 hover:bg-eco-600 text-white px-4 py-2 rounded-lg shadow-md shadow-eco-500/20 transition-all"
              >
                Citizen Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
