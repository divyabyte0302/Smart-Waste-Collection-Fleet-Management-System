import React, { ReactNode } from 'react';
import { Navbar } from '../components/common/Navbar';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-eco-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-city-500/10 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-8">
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
            <p className="text-sm text-slate-400 mt-1.5">{subtitle}</p>
          </div>
          {children}
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900 z-10">
        EcoCity Smart Waste Collection Management System • Enterprise Municipal Portal
      </footer>
    </div>
  );
};
