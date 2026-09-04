import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <AuthLayout title="Password Recovery" subtitle="Receive secure password reset instructions for your account">
      {isSubmitted ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Reset Link Dispatched</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            If an account exists for <strong className="text-slate-200">{email}</strong>, you will receive password reset instructions within 2 minutes.
          </p>
          <div className="pt-4">
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed mb-2">
            Enter your registered email address and we will issue an authorized password recovery token.
          </p>

          <Input
            label="Registered Email"
            type="email"
            placeholder="citizen@smartwaste.gov"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Send Recovery Link
          </Button>

          <div className="text-center pt-2">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-eco-400">
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
