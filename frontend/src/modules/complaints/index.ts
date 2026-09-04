/**
 * Complaint Management - Modular Barrel Export
 * Bundles types, services, components, and pages into an independent module.
 */

// Types
export * from '../../types/complaint.types';

// Services
export { complaintService } from '../../services/complaintService';

// Components
export { ComplaintCard } from '../../components/complaints/ComplaintCard';
export { ComplaintTimeline } from '../../components/complaints/ComplaintTimeline';
export {
  ComplaintStatusBadge,
  ComplaintPriorityBadge,
  ComplaintCategoryBadge
} from '../../components/complaints/ComplaintBadges';
export { ImageUploadPreview } from '../../components/complaints/ImageUploadPreview';

// Pages
export { ReportIssuePage } from '../../pages/complaints/ReportIssuePage';
export { MyComplaintsPage } from '../../pages/complaints/MyComplaintsPage';
export { ComplaintTrackingPage } from '../../pages/complaints/ComplaintTrackingPage';
export { ComplaintDetailPage } from '../../pages/complaints/ComplaintDetailPage';
export { AdminComplaintsPage } from '../../pages/complaints/AdminComplaintsPage';
export { AdminAssignComplaintPage } from '../../pages/complaints/AdminAssignComplaintPage';
