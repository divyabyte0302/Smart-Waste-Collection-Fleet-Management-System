import React from 'react';
import { Link } from 'react-router-dom';
import { Complaint } from '../../types/complaint.types';
import { Card } from '../common/Card';
import { ComplaintStatusBadge, ComplaintPriorityBadge, ComplaintCategoryBadge } from './ComplaintBadges';
import { MapPin, Clock, ArrowRight, UserCheck, MessageSquare } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  detailsUrl?: string;
  showCitizen?: boolean;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  detailsUrl,
  showCitizen = false
}) => {
  const targetUrl = detailsUrl || `/citizen/complaints/${complaint.id}`;

  return (
    <Card hoverEffect className="flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header with ID & Category */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-eco-400 bg-eco-500/10 px-2 py-0.5 rounded border border-eco-500/20">
              {complaint.complaintId}
            </span>
            <ComplaintCategoryBadge category={complaint.category} />
          </div>
          <div className="flex items-center gap-1.5">
            <ComplaintPriorityBadge priority={complaint.priority} />
            <ComplaintStatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Content & Image Row */}
        <div className="flex gap-4">
          {complaint.image && (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-slate-800 shrink-0 bg-slate-950">
              <img
                src={complaint.image}
                alt={complaint.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <Link
              to={targetUrl}
              className="text-base font-bold text-slate-100 hover:text-eco-400 transition-colors line-clamp-1"
            >
              {complaint.title}
            </Link>
            <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {complaint.description}
            </p>
          </div>
        </div>

        {/* Location & Metadata Row */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-eco-400 shrink-0" />
            <span className="truncate">{complaint.location}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:justify-end text-slate-500">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Assigned Staff or Citizen Details */}
        {(showCitizen || complaint.assignedStaffName) && (
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800/50">
            {showCitizen && (
              <span className="text-slate-400">
                Reporter: <strong className="text-slate-200">{complaint.citizenName}</strong>
              </span>
            )}
            {complaint.assignedStaffName ? (
              <span className="flex items-center gap-1 text-sky-400 font-medium ml-auto">
                <UserCheck className="w-3.5 h-3.5" />
                {complaint.assignedStaffName}
              </span>
            ) : (
              <span className="text-slate-500 italic ml-auto">Unassigned</span>
            )}
          </div>
        )}
      </div>

      {/* Footer Link Action */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5" />
          {complaint.comments ? complaint.comments.length : 0} updates
        </span>

        <Link
          to={targetUrl}
          className="inline-flex items-center text-xs font-semibold text-eco-400 hover:text-eco-300 transition-colors group"
        >
          View Details & Progress
          <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Card>
  );
};
