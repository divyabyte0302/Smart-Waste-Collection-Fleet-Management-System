import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import {
  Recycle,
  ShieldCheck,
  Truck,
  Users,
  MapPin,
  Clock,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Cloud,
  Database,
  Bell,
  Cpu,
  Mail,
  Phone,
  Send,
  Building2,
  Sparkles,
  Zap,
  Activity,
  FileCheck2,
  HelpCircle
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const LandingPage: React.FC = () => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-eco-500 selection:text-white scroll-smooth">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-20 px-4 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col justify-center text-center overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-eco-500/20 via-city-500/15 to-emerald-600/10 blur-[150px] pointer-events-none rounded-full" />
        <div className="absolute -top-10 right-10 w-96 h-96 bg-city-600/10 blur-[120px] pointer-events-none" />

        {/* Live operational badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-eco-400 mx-auto mb-8 shadow-xl backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-eco-400 animate-ping" />
          <span>Municipal Cloud Active • Amazon RDS & S3 Integrated</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight sm:leading-none">
          Smart Waste Collection &{' '}
          <span className="bg-gradient-to-r from-eco-400 via-emerald-300 to-city-400 bg-clip-text text-transparent">
            Fleet Management System
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          The enterprise municipal sanitation platform connecting citizens, dispatchers, and field crews. 
          Real-time complaint tracking, automated route scheduling, driver telematics, and Amazon Web Services cloud infrastructure.
        </p>

        {/* Hero Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="shadow-2xl shadow-eco-500/30 px-8 py-3.5 text-base font-semibold group">
              Citizen Portal Register
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="px-8 py-3.5 text-base font-semibold border-slate-700 bg-slate-900/80 hover:bg-slate-800">
              Sign In to Workspace
            </Button>
          </Link>
        </div>

        {/* Real-time KPI Stats Ribbon */}
        <div className="mt-16 pt-8 border-t border-slate-900/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto w-full">
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-eco-400">99.4%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Service SLA Compliance</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-city-400">&lt; 15 Mins</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Avg Dispatch Triage</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">4 Sectors</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Autonomous Route Coverage</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100% Cloud</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">AWS Resilient Architecture</div>
          </div>
        </div>
      </section>

      {/* 2. PROJECT INTRODUCTION */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-900 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-city-500/10 text-city-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-city-500/20">
                <Building2 className="w-3.5 h-3.5" />
                Municipal Infrastructure Revolution
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Transforming Municipal Sanitation with Real-Time Intelligence
              </h2>
              <p className="mt-5 text-slate-300 text-base leading-relaxed">
                Traditional municipal waste systems struggle with overflowing bins, missed collections, and opaque paper-based dispatching. The <strong>Smart Waste Collection Management System</strong> bridges the gap between citizens and municipal authorities through an integrated digital command center.
              </p>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                Every citizen report generates an auditable tracking record with GPS coordinates and photographic proof stored on Amazon S3. Municipal dispatchers optimize collection vehicle routes in real time, while collection staff receive digital itineraries directly on their in-cab terminals.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-eco-400 flex-shrink-0" />
                  <span>Zero-paper audit trail from submission to resolved bin collection</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-eco-400 flex-shrink-0" />
                  <span>Instant SMS/Email alerts powered by Amazon Simple Notification Service (SNS)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-eco-400 flex-shrink-0" />
                  <span>Sub-second analytics with PostgreSQL connection pooling and CloudWatch monitoring</span>
                </div>
              </div>
            </div>

            {/* Visual preview card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-slate-400 ml-2">smartwaste.gov/dispatch-telemetry</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-eco-500/20 text-eco-400 font-semibold">ONLINE</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-300">[CMP-2026-0042] Overflowing Bin</span>
                  <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">In Progress</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-300">[REQ-2026-0018] Bulk Furniture Pickup</span>
                  <span className="text-eco-400 bg-eco-950/60 px-2 py-0.5 rounded">Assigned: TRK-101</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-300">[SCH-2026-0091] Sector 2 Morning Route</span>
                  <span className="text-city-400 bg-city-950/60 px-2 py-0.5 rounded">Active (Driver: M. Chen)</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-300">AWS CloudWatch Status</span>
                  <span className="text-emerald-400 font-bold">200 OK (Latency: 18ms)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-20 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-eco-500/10 text-eco-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-eco-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Built for Scale, Engineered for Reliability
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Every feature is built as an independent, loosely coupled module ensuring clean code, zero regressions, and effortless horizontal scaling.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-eco-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-eco-500/10 border border-eco-500/20 flex items-center justify-center text-eco-400 mb-5 group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Complaint Management</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Report missed pickups, overflowing bins, and illegal dumping with GPS geolocation, photo upload evidence, and real-time resolution timeline tracking.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-city-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-city-500/10 border border-city-500/20 flex items-center justify-center text-city-400 mb-5 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">On-Demand Waste Pickup</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Citizens schedule specialized pickups for e-waste, bulk furniture, recyclables, or garden debris with preferred date/time slot selection.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-amber-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Fleet & Staff Dispatch</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Assign vehicles, track driver shift statuses (Available, Assigned, On Duty), maintain truck capacity limits, and monitor fuel levels.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Analytics & Reporting</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              10 municipal KPIs, SVG dynamic area/trend charts, daily/weekly/monthly collection reports, and streaming RFC-4180 CSV export generation.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Amazon SNS Push Alerts</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated notifications for complaint status changes, pickup approvals, crew arrival, and city-wide weather/service advisories.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-rose-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Production Security</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Helmet-equivalent HTTP security headers, IP rate limiting, bcrypt salted hashing, strict CORS whitelist, and sanitized input validation.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-slate-900/30 border-y border-slate-900 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-city-500/10 text-city-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-city-500/20">
              <Activity className="w-3.5 h-3.5" />
              Operational Workflow
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              How Smart Waste Management Works
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              From issue detection to verified resolution in four streamlined steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative">
              <div className="text-4xl font-black text-slate-800 mb-4">01</div>
              <h3 className="text-base font-bold text-white mb-2">Report or Request</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Citizens submit a waste complaint or request on-demand pickup with GPS location and photo evidence.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative">
              <div className="text-4xl font-black text-slate-800 mb-4">02</div>
              <h3 className="text-base font-bold text-white mb-2">Dispatcher Triage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Admins review requests, allocate collection schedules, and assign trucks and staff based on capacity.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative">
              <div className="text-4xl font-black text-slate-800 mb-4">03</div>
              <h3 className="text-base font-bold text-white mb-2">Route Execution</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Collection staff view assigned runs in their in-cab terminal, log waypoint status, and execute pickups.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 relative">
              <div className="text-4xl font-black text-slate-800 mb-4">04</div>
              <h3 className="text-base font-bold text-white mb-2">Notification & Audit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Amazon SNS notifies the citizen immediately while CloudWatch logs performance metrics and analytics KPIs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CITIZEN BENEFITS & MUNICIPALITY BENEFITS */}
      <section id="benefits" className="py-20 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-eco-500/10 text-eco-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-eco-500/20">
            <Users className="w-3.5 h-3.5" />
            Proven Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Delivering Tangible Value to Every Stakeholder
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Citizen Benefits */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-950 border border-eco-500/30 rounded-2xl p-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-eco-500/15 border border-eco-500/30 flex items-center justify-center text-eco-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Citizen Benefits</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-eco-400 flex-shrink-0 mt-0.5" />
                <span><strong>Instant Reporting:</strong> File waste incidents in under 60 seconds with camera photo capture and automatic geolocation.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-eco-400 flex-shrink-0 mt-0.5" />
                <span><strong>Transparent Status Tracking:</strong> Real-time audit trail of complaint review, dispatch, and final clean-up.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-eco-400 flex-shrink-0 mt-0.5" />
                <span><strong>Hassle-Free Bulk Pickups:</strong> On-demand scheduling for bulky furniture and electronics right from home.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-eco-400 flex-shrink-0 mt-0.5" />
                <span><strong>Healthier Neighborhoods:</strong> Prevent pest infestation and sanitation hazards through fast response times.</span>
              </li>
            </ul>
          </div>

          {/* Municipality Benefits */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-950 border border-city-500/30 rounded-2xl p-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-city-500/15 border border-city-500/30 flex items-center justify-center text-city-400">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Municipality & City Hall Benefits</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-city-400 flex-shrink-0 mt-0.5" />
                <span><strong>Up to 38% Fuel Savings:</strong> Optimized zone routing minimizes unnecessary vehicle miles and idle truck emissions.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-city-400 flex-shrink-0 mt-0.5" />
                <span><strong>Total Fleet Accountability:</strong> Live status tracking of garbage trucks, drivers, and daily tonnages collected.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-city-400 flex-shrink-0 mt-0.5" />
                <span><strong>Executive KPI Dashboards:</strong> Instant insight into complaint resolution rates and sector performance.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-city-400 flex-shrink-0 mt-0.5" />
                <span><strong>Automated Compliance Reports:</strong> Export RFC-4180 certified CSV summaries for regulatory environmental audits.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. TECHNOLOGY STACK (AWS CLOUD ARCHITECTURE) */}
      <section id="technology" className="py-20 bg-slate-900/40 border-y border-slate-900 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-500/20">
              <Cloud className="w-3.5 h-3.5" />
              Enterprise Cloud Topology
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Powered by Amazon Web Services
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Architected for 99.99% availability, multi-tenant security isolation, and sub-second operational telemetry.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Amazon RDS</h4>
              <p className="text-[11px] text-slate-400 mt-1">PostgreSQL relational core</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Cloud className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Amazon S3</h4>
              <p className="text-[11px] text-slate-400 mt-1">Complaint photo store</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Amazon SNS</h4>
              <p className="text-[11px] text-slate-400 mt-1">Multi-channel push alerts</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">CloudWatch</h4>
              <p className="text-[11px] text-slate-400 mt-1">Log & error telemetry</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">AWS EC2 / EB</h4>
              <p className="text-[11px] text-slate-400 mt-1">Node.js Express backend</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">AWS Amplify</h4>
              <p className="text-[11px] text-slate-400 mt-1">React + Vite Edge Hosting</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTACT & MUNICIPAL SUPPORT SECTION */}
      <section id="contact" className="py-20 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl relative">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-eco-500/10 text-eco-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-eco-500/20">
              <Phone className="w-3.5 h-3.5" />
              24/7 Sanitation Support
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Contact Municipal Dispatch
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Have questions regarding city waste collection zones, bulk collection scheduling, or emergency hazardous waste spillages? Get in touch with our operations center.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <Phone className="w-5 h-5 text-eco-400 mx-auto mb-2" />
              <div className="text-xs text-slate-400">Emergency Dispatch Hotline</div>
              <div className="text-sm font-bold text-white mt-1">1-800-SMART-WASTE</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <Mail className="w-5 h-5 text-city-400 mx-auto mb-2" />
              <div className="text-xs text-slate-400">Official Municipal Email</div>
              <div className="text-sm font-bold text-white mt-1">support@smartwaste.gov</div>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <MapPin className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <div className="text-xs text-slate-400">Central Sanitation HQ</div>
              <div className="text-sm font-bold text-white mt-1">Civic Center, Sector 1</div>
            </div>
          </div>

          {/* Form */}
          {contactSubmitted ? (
            <div className="p-6 bg-eco-950/40 border border-eco-500/50 rounded-xl text-center">
              <CheckCircle2 className="w-10 h-10 text-eco-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white">Thank You for Contacting Us</h4>
              <p className="text-sm text-slate-300 mt-1">Your inquiry has been received. Our municipal dispatch staff will respond within 2 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="citizen@smartwaste.gov"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Inquiry regarding neighborhood collection route"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your question or municipal feedback..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-eco-500 transition-colors"
                />
              </div>
              <div className="text-center pt-2">
                <Button type="submit" size="lg" className="w-full sm:w-auto px-8">
                  <Send className="w-4 h-4 mr-2" />
                  Transmit Inquiry to Dispatch
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-10 bg-slate-950 border-t border-slate-900 max-w-7xl mx-auto w-full px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-eco-500/20 border border-eco-500/30 flex items-center justify-center text-eco-400">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Smart Waste Collection Management System</div>
              <div className="text-xs text-slate-500">Official Municipal Sanitation & Fleet Command Platform</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#features" className="hover:text-eco-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-eco-400 transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-eco-400 transition-colors">Benefits</a>
            <a href="#technology" className="hover:text-eco-400 transition-colors">AWS Tech</a>
            <a href="#contact" className="hover:text-eco-400 transition-colors">Contact</a>
            <Link to="/login" className="text-eco-400 font-semibold hover:underline">Sign In</Link>
          </div>

          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} EcoCity Municipality • All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
};
