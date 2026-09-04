import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ImageUploadPreview } from '../../components/complaints/ImageUploadPreview';
import { complaintService } from '../../services/complaintService';
import { ComplaintCategory, ComplaintPriority } from '../../types/complaint.types';
import { 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Navigation, 
  Trash2, 
  Wrench, 
  Flame, 
  HelpCircle,
  FileText,
  Send
} from 'lucide-react';

export const ReportIssuePage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [category, setCategory] = useState<ComplaintCategory>('Overflowing Bin');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');
  const [image, setImage] = useState<string | null>(null);
  const [initialComment, setInitialComment] = useState('');

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationNote, setLocationNote] = useState('');

  const categories: { type: ComplaintCategory; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      type: 'Missed Collection',
      label: 'Missed Collection',
      icon: <Trash2 className="w-5 h-5 text-emerald-400" />,
      desc: 'Scheduled waste or recycling pickup was skipped'
    },
    {
      type: 'Overflowing Bin',
      label: 'Overflowing Bin',
      icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
      desc: 'Public or commercial waste container is full & spilling'
    },
    {
      type: 'Illegal Dumping',
      label: 'Illegal Dumping',
      icon: <Flame className="w-5 h-5 text-rose-400" />,
      desc: 'Unauthorized disposal of construction, tyres or hazardous waste'
    },
    {
      type: 'Damaged Bin',
      label: 'Damaged Public Bin',
      icon: <Wrench className="w-5 h-5 text-sky-400" />,
      desc: 'Broken lid, damaged hinges, vandalized or burned container'
    },
    {
      type: 'Other',
      label: 'Other Waste Issue',
      icon: <HelpCircle className="w-5 h-5 text-slate-400" />,
      desc: 'Littering, dead animal removal, or special hazard inquiry'
    }
  ];

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationNote('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setLocationNote(`GPS captured: ${lat}, ${lng}`);
        if (!location) {
          setLocation(`Civic Coordinates: ${lat}, ${lng}`);
        }
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setLocationNote('Could not auto-detect GPS. Please enter street address manually.');
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please provide a brief title for your complaint.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please describe the waste problem in detail.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Please specify the location or landmark of the issue.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newComplaint = await complaintService.createComplaint({
        category,
        title,
        description,
        location,
        latitude,
        longitude,
        priority,
        image,
        initialComment: initialComment.trim() || undefined
      });

      // Redirect to complaint details / confirmation
      navigate(`/citizen/complaints/${newComplaint.id}`, {
        state: { newlyCreated: true, complaintId: newComplaint.complaintId }
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Hero Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-xl bg-eco-500/10 text-eco-400 border border-eco-500/20">
              <FileText className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
                Report a Waste Issue
              </h1>
              <p className="text-sm text-slate-400">
                Log missed pickups, overflowing bins, or illegal dumping directly to municipal dispatch.
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Category Selection Grid */}
          <Card>
            <div className="mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                1. Select Issue Category
              </h2>
              <p className="text-xs text-slate-500">
                Choose the category that best matches the waste situation
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const isSelected = category === cat.type;
                return (
                  <button
                    type="button"
                    key={cat.type}
                    onClick={() => setCategory(cat.type)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-eco-500 bg-eco-500/10 shadow-md shadow-eco-500/10 ring-1 ring-eco-500'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-lg bg-slate-800/80">{cat.icon}</div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-eco-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-200">{cat.label}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 2. Issue Details & Priority */}
          <Card>
            <div className="mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                2. Complaint Details
              </h2>
              <p className="text-xs text-slate-500">Provide clear information for fleet routing</p>
            </div>

            <div className="space-y-4">
              <Input
                id="complaint-title"
                label="Complaint Title"
                placeholder="e.g. Commercial dumpster overflowing onto pedestrian sidewalk"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div>
                <label
                  htmlFor="complaint-desc"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Detailed Description
                </label>
                <textarea
                  id="complaint-desc"
                  rows={4}
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 text-sm p-3.5 focus:outline-none focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20 transition-all"
                  placeholder="Describe the problem, approximate volume of waste, any safety hazards or access obstructions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Priority Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Urgency / Priority Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['Low', 'Medium', 'High', 'Urgent'] as ComplaintPriority[]).map((p) => {
                    const isSelected = priority === p;
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                          isSelected
                            ? p === 'Urgent'
                              ? 'border-rose-500 bg-rose-500/20 text-rose-300 ring-1 ring-rose-500'
                              : p === 'High'
                              ? 'border-amber-500 bg-amber-500/20 text-amber-300 ring-1 ring-amber-500'
                              : 'border-eco-500 bg-eco-500/20 text-eco-300 ring-1 ring-eco-500'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* 3. Location & GPS */}
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  3. Location & Geotagging
                </h2>
                <p className="text-xs text-slate-500">
                  Specify street address or use automatic device GPS
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetLocation}
                isLoading={isLocating}
              >
                <Navigation className="w-4 h-4 mr-1.5 text-eco-400" />
                Detect My GPS
              </Button>
            </div>

            <div className="space-y-3">
              <Input
                id="complaint-location"
                label="Street Address / Landmark"
                placeholder="e.g. Corner of Elm Street & 5th Avenue, outside City Market"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                icon={<MapPin className="w-4 h-4" />}
                required
              />

              {locationNote && (
                <p className="text-xs text-eco-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {locationNote}
                </p>
              )}
            </div>
          </Card>

          {/* 4. Evidence Photo Upload */}
          <Card>
            <div className="mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                4. Photo Evidence
              </h2>
              <p className="text-xs text-slate-500">
                Visual proof expedites triage and crew vehicle allocation
              </p>
            </div>

            <ImageUploadPreview value={image} onChange={setImage} />
          </Card>

          {/* Submit Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Your submission will be immediately routed to the municipal dispatch center.
            </p>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full sm:w-auto px-8"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Complaint
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
