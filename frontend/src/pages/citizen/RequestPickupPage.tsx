import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { pickupService } from '../../services/pickupService';
import { WasteType } from '../../types/pickup.types';
import { 
  PackagePlus, 
  MapPin, 
  Calendar, 
  Clock, 
  Trash2, 
  Recycle, 
  Cpu, 
  Package, 
  Leaf, 
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Send
} from 'lucide-react';

export const RequestPickupPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [wasteType, setWasteType] = useState<WasteType>('Electronic Waste');
  const [estimatedQuantity, setEstimatedQuantity] = useState('3-5 Items (Medium)');
  const [pickupAddress, setPickupAddress] = useState(user?.address || '');
  const [preferredDate, setPreferredDate] = useState(() => {
    // Tomorrow as default date
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('09:00 AM - 12:00 PM');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const wasteOptions: { type: WasteType; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      type: 'Electronic Waste',
      title: 'E-Waste Recycling',
      desc: 'Computers, TVs, microwaves, batteries, cables',
      icon: <Cpu className="w-5 h-5 text-sky-400" />
    },
    {
      type: 'Bulk Waste',
      title: 'Bulky Household Items',
      desc: 'Furniture, mattresses, desks, disassembled shelving',
      icon: <Package className="w-5 h-5 text-amber-400" />
    },
    {
      type: 'Garden Waste',
      title: 'Green & Garden Organic',
      desc: 'Tree branches, lawn trimmings, leaves in biodegradable sacks',
      icon: <Leaf className="w-5 h-5 text-emerald-400" />
    },
    {
      type: 'Recyclable Waste',
      title: 'Large-Batch Recyclables',
      desc: 'Corrugated cardboard bales, sorted plastics, glass',
      icon: <Recycle className="w-5 h-5 text-eco-400" />
    },
    {
      type: 'Household Waste',
      title: 'General Non-Hazardous',
      desc: 'Standard residential overflow bags',
      icon: <Trash2 className="w-5 h-5 text-slate-400" />
    },
    {
      type: 'Other',
      title: 'Special Waste Assessment',
      desc: 'Unique material or municipal consultation needed',
      icon: <HelpCircle className="w-5 h-5 text-indigo-400" />
    }
  ];

  const timeWindows = [
    '08:00 AM - 11:00 AM (Morning Slot)',
    '11:00 AM - 02:00 PM (Midday Slot)',
    '02:00 PM - 05:00 PM (Afternoon Slot)',
    '05:00 PM - 08:00 PM (Twilight Slot)'
  ];

  const quantityTiers = [
    '1-2 Small Items (Up to 15 kg)',
    '3-5 Items (Medium load, up to 50 kg)',
    'Large Furniture / Appliances (Up to 150 kg)',
    'Full Vehicle Load (Commercial / Multi-room cleanout)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!pickupAddress.trim()) {
      setErrorMsg('Please specify a pickup street address.');
      return;
    }

    if (!preferredDate) {
      setErrorMsg('Please select a preferred pickup date.');
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await pickupService.createPickup({
        wasteType,
        estimatedWasteQuantity: estimatedQuantity,
        pickupAddress: pickupAddress.trim(),
        preferredDate,
        preferredTime,
        description: description.trim() || undefined
      });

      navigate(`/citizen/pickup-tracking?id=${created.requestId}`, {
        state: { newRequestId: created.requestId }
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit pickup request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-xl bg-eco-500/10 text-eco-400 border border-eco-500/20">
              <PackagePlus className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
                Book On-Demand Waste Pickup
              </h1>
              <p className="text-sm text-slate-400">
                Schedule curbside collection for electronics, bulky furniture, garden trimmings, and overflow waste.
              </p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Waste Classification */}
          <Card>
            <div className="mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                1. Select Waste Stream
              </h2>
              <p className="text-xs text-slate-500">
                Ensure proper vehicle compactor and recycling sorting equipment is dispatched
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {wasteOptions.map((opt) => {
                const isSelected = wasteType === opt.type;
                return (
                  <button
                    type="button"
                    key={opt.type}
                    onClick={() => setWasteType(opt.type)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-eco-500 bg-eco-500/10 ring-1 ring-eco-500 shadow-md shadow-eco-500/10'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-lg bg-slate-800/80">{opt.icon}</div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-eco-400" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{opt.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 2. Estimated Volume */}
          <Card>
            <div className="mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                2. Approximate Quantity / Volume
              </h2>
              <p className="text-xs text-slate-500">Helps dispatchers determine vehicle capacity</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quantityTiers.map((q) => {
                const isSelected = estimatedQuantity === q;
                return (
                  <button
                    type="button"
                    key={q}
                    onClick={() => setEstimatedQuantity(q)}
                    className={`p-3 rounded-lg border text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-500/10 text-sky-300 ring-1 ring-sky-500'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {q}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 3. Date & Time Window */}
          <Card>
            <div className="mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                3. Preferred Date & Time
              </h2>
              <p className="text-xs text-slate-500">Select when curbside items will be placed outside</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="pickup-date"
                label="Pickup Date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                icon={<Calendar className="w-4 h-4" />}
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Preferred Time Window
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-eco-500"
                >
                  {timeWindows.map((tw) => (
                    <option key={tw} value={tw}>
                      {tw}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* 4. Pickup Address & Instructions */}
          <Card>
            <div className="mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                4. Curbside Location & Notes
              </h2>
              <p className="text-xs text-slate-500">Location where driver can safely load items</p>
            </div>

            <div className="space-y-4">
              <Input
                id="pickup-address"
                label="Street Address / Frontage"
                placeholder="e.g. 742 Evergreen Terrace, Curbside by driveway"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                icon={<MapPin className="w-4 h-4" />}
                required
              />

              <div>
                <label
                  htmlFor="pickup-desc"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Special Handling Instructions (Optional)
                </label>
                <textarea
                  id="pickup-desc"
                  rows={3}
                  placeholder="e.g. Items are wrapped in plastic; narrow alleyway access; please call upon arrival..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs p-3 focus:outline-none focus:border-eco-500 transition-all"
                />
              </div>
            </div>
          </Card>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Pickups are subject to municipal schedule confirmation. You will receive real-time status alerts.
            </p>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full sm:w-auto px-8"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Pickup Request
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
