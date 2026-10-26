import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Badge, SampleBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { GraduationCap, CheckCircle2, Briefcase, Calendar, Award, UserCheck } from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-green-500/10 dark:from-orange-950/30 dark:via-purple-950/30 dark:to-green-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Welcome, {user?.name || 'Student'}!
              </h1>
              {user?.isSample && <SampleBadge />}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Student Placement Portal • Vishnu Institute of Technology, Bhimavaram
            </p>
          </div>
          <Badge variant="info" size="md">
            Roll: {user?.rollNo || 'Pending'}
          </Badge>
        </div>
      </div>

      {/* Student Profile Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-brand-orange flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Branch & Year</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {user?.branch || 'Not set'} {user?.graduationYear ? `(${user.graduationYear})` : ''}
            </p>
            <p className="text-[11px] text-slate-400">Batch: {user?.admissionYear || '2024'} - {user?.graduationYear || '2028'}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Academic CGPA</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {user?.cgpa !== null && user?.cgpa !== undefined ? `${user.cgpa} / 10` : 'Not recorded'}
            </p>
            <p className="text-[11px] text-slate-400">Active Backlogs: {user?.activeBacklogs ?? 0}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-brand-purple flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Account Status</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {user?.isActive ? 'Active Verified' : 'Inactive'}
            </p>
            <p className="text-[11px] text-slate-400">{user?.email}</p>
          </div>
        </Card>

      </div>

      {/* Phase 1 Verification Card */}
      <Card className="border-l-4 border-l-brand-orange">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-brand-orange" />
          <span>Phase 1 Setup Completed</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
          Authentication, session cookies, database connection, and role routing are functioning. The following features will unlock in Phase 4:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <Briefcase className="w-4 h-4 text-brand-orange" />
              <span>Campus Drives</span>
            </div>
            <p className="text-[11px] text-slate-500">Explore on-campus, off-campus, and pool placement drives with live eligibility checks.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <Calendar className="w-4 h-4 text-brand-purple" />
              <span>Interviews</span>
            </div>
            <p className="text-[11px] text-slate-500">Track aptitude, technical, and HR interview rounds with meeting links and venues.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <Award className="w-4 h-4 text-brand-green" />
              <span>Placement Offers</span>
            </div>
            <p className="text-[11px] text-slate-500">View job offers, packages (LPA), letters, and accept or decline before deadlines.</p>
          </div>
        </div>
      </Card>

    </div>
  );
};
