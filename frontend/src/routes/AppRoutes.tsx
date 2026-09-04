import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ProtectedRoute } from './ProtectedRoute';

// Core Pages
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { CitizenDashboard } from '../pages/CitizenDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
import { StaffDashboard } from '../pages/StaffDashboard';
import { ProfilePage } from '../pages/ProfilePage';

// Complaint Module Pages
import { ReportIssuePage } from '../pages/complaints/ReportIssuePage';
import { MyComplaintsPage } from '../pages/complaints/MyComplaintsPage';
import { ComplaintTrackingPage } from '../pages/complaints/ComplaintTrackingPage';
import { ComplaintDetailPage } from '../pages/complaints/ComplaintDetailPage';
import { AdminComplaintsPage } from '../pages/complaints/AdminComplaintsPage';
import { AdminAssignComplaintPage } from '../pages/complaints/AdminAssignComplaintPage';

// Waste Pickup & Scheduling Module Pages
import { RequestPickupPage } from '../pages/citizen/RequestPickupPage';
import { MyPickupsPage } from '../pages/citizen/MyPickupsPage';
import { PickupTrackingPage } from '../pages/citizen/PickupTrackingPage';
import { CitizenSchedulePage } from '../pages/citizen/CitizenSchedulePage';
import { PickupManagementPage } from '../pages/admin/PickupManagementPage';
import { ScheduleManagementPage } from '../pages/admin/ScheduleManagementPage';
import { CreateSchedulePage } from '../pages/admin/CreateSchedulePage';
import { EditSchedulePage } from '../pages/admin/EditSchedulePage';

// Fleet & Collection Staff Module Pages
import { VehicleManagementPage } from '../pages/admin/VehicleManagementPage';
import { AddVehiclePage } from '../pages/admin/AddVehiclePage';
import { VehicleDetailsPage } from '../pages/admin/VehicleDetailsPage';
import { StaffManagementPage } from '../pages/admin/StaffManagementPage';
import { AddStaffPage } from '../pages/admin/AddStaffPage';
import { StaffDetailsPage } from '../pages/admin/StaffDetailsPage';
import { AssignmentManagementPage } from '../pages/admin/AssignmentManagementPage';

// Staff Portal Pages
import { StaffSchedulePage } from '../pages/staff/StaffSchedulePage';
import { StaffPickupsPage } from '../pages/staff/StaffPickupsPage';
import { StaffHistoryPage } from '../pages/staff/StaffHistoryPage';

// Analytics & Reports Pages
import { AnalyticsDashboardPage } from '../pages/admin/AnalyticsDashboardPage';
import { ReportsPage } from '../pages/admin/ReportsPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';

// Helper component to redirect authenticated users to their respective role dashboard
const AuthRedirect: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated && user) {
    if (user.role === 'Administrator') return <Navigate to="/admin" replace />;
    if (user.role === 'Collection Staff') return <Navigate to="/staff" replace />;
    return <Navigate to="/citizen" replace />;
  }

  return children;
};

// Helper component for generic /dashboard path
const RoleHomeRedirect: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'Administrator') return <Navigate to="/admin" replace />;
  if (user?.role === 'Collection Staff') return <Navigate to="/staff" replace />;
  return <Navigate to="/citizen" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={
          <AuthRedirect>
            <LoginPage />
          </AuthRedirect>
        } 
      />
      <Route 
        path="/register" 
        element={
          <AuthRedirect>
            <RegisterPage />
          </AuthRedirect>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <AuthRedirect>
            <ForgotPasswordPage />
          </AuthRedirect>
        } 
      />

      {/* Role-Protected Citizen Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Citizen', 'Administrator']} />}>
        <Route path="/citizen" element={<CitizenDashboard />} />
        
        {/* Complaints */}
        <Route path="/citizen/report-issue" element={<ReportIssuePage />} />
        <Route path="/citizen/my-complaints" element={<MyComplaintsPage />} />
        <Route path="/citizen/tracking" element={<ComplaintTrackingPage />} />
        <Route path="/citizen/complaints/:id" element={<ComplaintDetailPage />} />

        {/* Waste Pickups & Schedules */}
        <Route path="/citizen/request-pickup" element={<RequestPickupPage />} />
        <Route path="/citizen/my-pickups" element={<MyPickupsPage />} />
        <Route path="/citizen/pickup-tracking" element={<PickupTrackingPage />} />
        <Route path="/citizen/schedule" element={<CitizenSchedulePage />} />
      </Route>

      {/* Role-Protected Administrator Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Administrator']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Complaints */}
        <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
        <Route path="/admin/complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="/admin/complaints/:id/assign" element={<AdminAssignComplaintPage />} />

        {/* Waste Pickups & Schedules */}
        <Route path="/admin/pickups" element={<PickupManagementPage />} />
        <Route path="/admin/schedules" element={<ScheduleManagementPage />} />
        <Route path="/admin/schedules/create" element={<CreateSchedulePage />} />
        <Route path="/admin/schedules/:id/edit" element={<EditSchedulePage />} />

        {/* Fleet & Staff Management */}
        <Route path="/admin/vehicles" element={<VehicleManagementPage />} />
        <Route path="/admin/vehicles/new" element={<AddVehiclePage />} />
        <Route path="/admin/vehicles/:id" element={<VehicleDetailsPage />} />
        <Route path="/admin/staff" element={<StaffManagementPage />} />
        <Route path="/admin/staff/new" element={<AddStaffPage />} />
        <Route path="/admin/staff/:id" element={<StaffDetailsPage />} />
        <Route path="/admin/assignments" element={<AssignmentManagementPage />} />

        {/* User Management */}
        <Route path="/admin/users" element={<UserManagementPage />} />

        {/* Analytics & Reports */}
        <Route path="/admin/analytics" element={<AnalyticsDashboardPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
      </Route>

      {/* Role-Protected Collection Staff Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Collection Staff', 'Administrator']} />}>
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/schedule" element={<StaffSchedulePage />} />
        <Route path="/staff/pickups" element={<StaffPickupsPage />} />
        <Route path="/staff/history" element={<StaffHistoryPage />} />
        <Route path="/staff/complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="/staff/schedules" element={<StaffSchedulePage />} />
      </Route>

      {/* Authenticated Routes (All Roles) */}
      <Route element={<ProtectedRoute allowedRoles={['Citizen', 'Administrator', 'Collection Staff']} />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="/dashboard" element={<RoleHomeRedirect />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
