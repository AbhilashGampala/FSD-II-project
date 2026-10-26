import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { SignupProfilePage } from './pages/SignupProfilePage';
import { StudentDashboard } from './pages/StudentDashboard';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage, UnauthorizedPage } from './pages/ErrorPages';
import { Spinner } from './components/common/Feedback';

// Smart Home Redirector based on user role
const HomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
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
        </Route>

        {/* Placement Officer Portal */}
        <Route element={<ProtectedRoute allowedRoles={['officer', 'admin']} />}>
          <Route path="/officer" element={<OfficerDashboard />} />
        </Route>

        {/* Admin Portal */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
