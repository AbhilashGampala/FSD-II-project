import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, SampleBadge, StatusPill } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Feedback';
import {
  Briefcase,
  Building2,
  FileCheck2,
  Calendar,
  Award,
  Clock,
  ArrowRight,
  PlusCircle,
  BarChart3
} from 'lucide-react';

export const OfficerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getOfficerDashboard();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        setError(err.message || 'Failed to load officer dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <Spinner size="lg" className="py-20" />;
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm border border-red-200">
        {error}
      </div>
    );
  }

  const { counts = {}, upcomingDeadlines = [], recentApplications = [] } = data || {};

  return (
    <div className="space-y-6">
      
      {/* Officer Header with Quick Actions */}
      <div className="bg-gradient-to-r from-purple-500/10 via-orange-500/10 to-green-500/10 dark:from-purple-950/40 dark:via-orange-950/40 dark:to-green-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Placement Officer Control Panel
              </h1>
              <SampleBadge />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Vishnu Institute of Technology (VIT), Bhimavaram • Training & Placement Cell
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/officer/drives/new">
              <Button variant="primary" size="sm" className="gap-1.5">
                <PlusCircle className="w-4 h-4" />
                <span>Create Drive</span>
              </Button>
            </Link>
            <Link to="/officer/companies">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>Companies</span>
              </Button>
            </Link>
            <Link to="/officer/stats">
              <Button variant="outline" size="sm" className="gap-1.5">
                <BarChart3 className="w-4 h-4" />
                <span>Placement Stats</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Drives</span>
            <Briefcase className="w-4 h-4 text-brand-orange" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {counts.activeDrives || 0}
          </div>
          <p className="text-[10px] text-slate-400">Published drives</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Companies</span>
            <Building2 className="w-4 h-4 text-brand-purple" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {counts.totalCompanies || 0}
          </div>
          <p className="text-[10px] text-slate-400">Partner employers</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Applications</span>
            <FileCheck2 className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {counts.totalApplications || 0}
          </div>
          <p className="text-[10px] text-slate-400">Candidate submissions</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Shortlisted</span>
            <Badge variant="purple" size="sm">Review</Badge>
          </div>
          <div className="text-2xl font-bold text-brand-purple">
            {counts.shortlistedCount || 0}
          </div>
          <p className="text-[10px] text-slate-400">Cleared for rounds</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Interviews</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {counts.interviewsThisWeek || 0}
          </div>
          <p className="text-[10px] text-slate-400">Next 7 days</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Offers Made</span>
            <Award className="w-4 h-4 text-brand-green" />
          </div>
          <div className="text-2xl font-bold text-brand-green">
            {counts.offersMade || 0}
          </div>
          <p className="text-[10px] text-slate-400">Students selected</p>
        </Card>

      </div>

      {/* Main Content Split: Upcoming Deadlines & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming Drive Deadlines */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-orange" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Drive Deadlines</h2>
            </div>
            <Link to="/officer/drives" className="text-xs text-brand-orange font-semibold hover:underline flex items-center gap-1">
              <span>All Drives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No upcoming application deadlines.</p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((drive) => {
                const daysLeft = Math.ceil((new Date(drive.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div
                    key={drive._id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {drive.title}
                        </p>
                        {drive.isSample && <SampleBadge />}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {drive.company?.name} • <span className="font-semibold text-brand-orange">{drive.packageLPA} LPA</span>
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        daysLeft <= 3
                          ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'
                          : 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400'
                      }`}>
                        {daysLeft <= 0 ? 'Ends Today' : `${daysLeft} days left`}
                      </span>
                      <div className="mt-1">
                        <Link
                          to={`/officer/drives/${drive._id}/applications`}
                          className="text-[11px] text-brand-purple font-medium hover:underline"
                        >
                          View Candidates →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent Applications Feed */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-brand-purple" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Applications</h2>
            </div>
            <Link to="/officer/drives" className="text-xs text-brand-purple font-semibold hover:underline flex items-center gap-1">
              <span>Review Candidates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No candidate applications recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app._id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {app.student?.name}
                      </p>
                      <span className="text-[11px] text-slate-400">({app.student?.rollNo || app.student?.branch})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      Applied for: <span className="font-medium text-slate-700 dark:text-slate-300">{app.drive?.title}</span>
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <StatusPill status={app.status} />
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>

    </div>
  );
};
