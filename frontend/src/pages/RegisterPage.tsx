import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, Phone, MapPin, Building, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: 'Metro City',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate('/citizen');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Citizen Registration" subtitle="Sign up for municipality waste collection & reporting services">
      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2.5 text-xs text-rose-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-1">
        <Input
          label="Full Name"
          name="name"
          placeholder="Sophia Martinez"
          value={formData.name}
          onChange={handleChange}
          icon={<User className="w-4 h-4" />}
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="sophia@example.com"
          value={formData.email}
          onChange={handleChange}
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Password (min. 6 characters)"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
            icon={<Phone className="w-4 h-4" />}
          />

          <Input
            label="City / Municipality"
            name="city"
            placeholder="Metro City"
            value={formData.city}
            onChange={handleChange}
            icon={<Building className="w-4 h-4" />}
          />
        </div>

        <Input
          label="Street Address / Residence"
          name="address"
          placeholder="742 Evergreen Terrace, Sector 4"
          value={formData.address}
          onChange={handleChange}
          icon={<MapPin className="w-4 h-4" />}
        />

        <Button type="submit" className="w-full mt-4" size="lg" isLoading={isLoading}>
          Create Citizen Account
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-eco-400 hover:underline">
          Sign In Here
        </Link>
      </div>
    </AuthLayout>
  );
};
