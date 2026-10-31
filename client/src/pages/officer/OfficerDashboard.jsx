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
      <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
        {error}
      </div>
    );
  }

  const { counts = {}, upcomingDeadlines = [], recentApplications = [] } = data || {};

  return (
    <div className="space-y-6">
      
      {/* Officer Header with Quick Actions */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#95058A]"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[#252525]">
                Placement Officer Control Panel
              </h1>
              <SampleBadge />
            </div>
            <p className="text-xs sm:text-sm text-[#666666] mt-1">
              Vishnu Institute of Technology (VIT), Bhimavaram • Training & Placement Cell
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/officer/drives/new">
              <Button variant="primary" size="sm" className="gap-1.5 shadow-sm">
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
          <div className="flex items-center justify-between text-[#666666]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Drives</span>
            <Briefcase className="w-4 h-4 text-[#E58A1F]" />
          </div>
          <div className="text-2xl font-bold text-[#252525]">
            {counts.activeDrives || 0}
          </div>
          <p className="text-[10px] text-slate-400">Published drives</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-[#666666]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Companies</span>
            <Building2 className="w-4 h-4 text-[#95058A]" />
          </div>
          <div className="text-2xl font-bold text-[#252525]">
            {counts.totalCompanies || 0}
          </div>
          <p className="text-[10px] text-slate-400">Partner employers</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-[#666666]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Applications</span>
            <FileCheck2 className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-[#252525]">
            {counts.totalApplications || 0}
          </div>
          <p className="text-[10px] text-slate-400">Candidate submissions</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-[#666666]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Shortlisted</span>
            <Badge variant="purple" size="sm">Review</Badge>
          </div>
          <div className="text-2xl font-bold text-[#95058A]">
            {counts.shortlistedCount || 0}
          </div>
          <p className="text-[10px] text-slate-400">Cleared for rounds</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-[#666666]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Interviews</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-[#252525]">
            {counts.interviewsThisWeek || 0}
          </div>
          <p className="text-[10px] text-slate-400">Next 7 days</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-[#666666]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Offers Made</span>
            <Award className="w-4 h-4 text-[#94BC36]" />
          </div>
          <div className="text-2xl font-bold text-[#94BC36]">
            {counts.offersMade || 0}
          </div>
          <p className="text-[10px] text-slate-400">Students selected</p>
        </Card>

      </div>

      {/* Main Content Split: Upcoming Deadlines & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming Drive Deadlines */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#E58A1F]" />
              <h2 className="text-sm font-bold text-[#252525]">Upcoming Drive Deadlines</h2>
            </div>
            <Link to="/officer/drives" className="text-xs text-[#E58A1F] font-semibold hover:underline flex items-center gap-1">
              <span>All Drives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <p className="text-xs text-[#666666] py-4 text-center">No upcoming application deadlines.</p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((drive) => {
                const daysLeft = Math.ceil((new Date(drive.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div
                    key={drive._id}
                    className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-[#252525] truncate">
                          {drive.title}
                        </p>
                        {drive.isSample && <SampleBadge />}
                      </div>
                      <p className="text-[11px] text-[#666666]">
                        {drive.company?.name} • <span className="font-bold text-[#E58A1F]">{drive.packageLPA} LPA</span>
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                        daysLeft <= 3
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {daysLeft <= 0 ? 'Ends Today' : `${daysLeft} days left`}
                      </span>
                      <div className="mt-1">
                        <Link
                          to={`/officer/drives/${drive._id}/applications`}
                          className="text-[11px] text-[#95058A] font-semibold hover:underline"
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
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#95058A]" />
              <h2 className="text-sm font-bold text-[#252525]">Recent Applications</h2>
            </div>
            <Link to="/officer/drives" className="text-xs text-[#95058A] font-semibold hover:underline flex items-center gap-1">
              <span>Review Candidates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <p className="text-xs text-[#666666] py-4 text-center">No candidate applications recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app._id}
                  className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#252525] truncate">
                        {app.student?.name}
                      </p>
                      <span className="text-[11px] text-[#666666]">({app.student?.rollNo || app.student?.branch})</span>
                    </div>
                    <p className="text-[11px] text-[#666666] truncate">
                      Applied for: <span className="font-semibold text-[#252525]">{app.drive?.title}</span>
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
