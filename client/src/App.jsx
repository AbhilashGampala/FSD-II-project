import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { SignupProfilePage } from './pages/SignupProfilePage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { ExploreDrivesPage } from './pages/student/ExploreDrivesPage';
import { DriveDetailPage } from './pages/student/DriveDetailPage';
import { MyApplicationsPage } from './pages/student/MyApplicationsPage';
import { InterviewSchedulePage } from './pages/student/InterviewSchedulePage';
import { MyOffersPage } from './pages/student/MyOffersPage';
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { CompaniesPage } from './pages/officer/CompaniesPage';
import { DrivesPage } from './pages/officer/DrivesPage';
import { DriveFormPage } from './pages/officer/DriveFormPage';
import { DriveApplicationsPage } from './pages/officer/DriveApplicationsPage';
import { InterviewsPage } from './pages/officer/InterviewsPage';
import { OffersPage } from './pages/officer/OffersPage';
import { PlacementStatsPage } from './pages/officer/PlacementStatsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserDirectoryPage } from './pages/admin/UserDirectoryPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { NotFoundPage, UnauthorizedPage } from './pages/ErrorPages';
import { Spinner } from './components/common/Feedback';

// Smart Home Redirector based on user role
const HomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'officer') return <Navigate to="/officer" replace />;
  return <Navigate to="/student" replace />;
};

export default function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup-profile" element={<SignupProfilePage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Root redirect */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Protected Layout Routes */}
      <Route element={<AppLayout />}>
        {/* Student Portal */}
        <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/drives" element={<ExploreDrivesPage />} />
          <Route path="/student/drives/:id" element={<DriveDetailPage />} />
          <Route path="/student/applications" element={<MyApplicationsPage />} />
          <Route path="/student/interviews" element={<InterviewSchedulePage />} />
          <Route path="/student/offers" element={<MyOffersPage />} />
        </Route>

        {/* Placement Officer Portal (Accessible to Officer & Admin) */}
        <Route element={<ProtectedRoute allowedRoles={['officer', 'admin']} />}>
          <Route path="/officer" element={<OfficerDashboard />} />
          <Route path="/officer/companies" element={<CompaniesPage />} />
          <Route path="/officer/drives" element={<DrivesPage />} />
          <Route path="/officer/drives/new" element={<DriveFormPage />} />
          <Route path="/officer/drives/:id/edit" element={<DriveFormPage />} />
          <Route path="/officer/drives/:driveId/applications" element={<DriveApplicationsPage />} />
          <Route path="/officer/interviews" element={<InterviewsPage />} />
          <Route path="/officer/offers" element={<OffersPage />} />
          <Route path="/officer/stats" element={<PlacementStatsPage />} />
        </Route>

        {/* Admin Portal */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserDirectoryPage />} />
          <Route path="/admin/audit" element={<AuditLogsPage />} />
        </Route>
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
