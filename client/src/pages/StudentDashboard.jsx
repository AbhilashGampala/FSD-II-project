import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Badge, SampleBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Feedback';
import {
  GraduationCap,
  Briefcase,
  Calendar,
  Award,
  UserCheck,
  ArrowRight,
  Clock,
  Building2,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await api.getStudentDashboard();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.warn('Dashboard fetch warning:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const counts = data?.counts || {
    applied: 0,
    shortlisted: 0,
    interviewsUpcoming: 0,
    offers: 0,
    eligibleDrives: 0
  };

  const nextInterview = data?.nextInterview;
  const deadlinesClosingSoon = data?.deadlinesClosingSoon || [];
  const completeness = data?.completeness || { percentage: 80 };

  return (
    <div className="space-y-6">
      
      {/* Welcome Institutional Banner */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#E58A1F]"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[#252525]">
                Welcome, {user?.name || 'Student'}!
              </h1>
              {user?.isSample && <SampleBadge />}
            </div>
            <p className="text-xs sm:text-sm text-[#666666]">
              Student Placement Portal • Vishnu Institute of Technology, Bhimavaram
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="orange" size="md">
              Roll: {user?.rollNo || 'Pending'}
            </Badge>
            <Badge variant="purple" size="md">
              Branch: {user?.branch || 'CSE'}
            </Badge>
          </div>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Applied Drives */}
        <Card className="p-5 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#E58A1F]/10 text-[#E58A1F] flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#666666] font-medium">Applied Drives</p>
            <p className="text-2xl font-bold text-[#252525]">
              {counts.applied}
            </p>
            <p className="text-[11px] text-[#94BC36] font-semibold">
              {counts.shortlisted} Shortlisted
            </p>
          </div>
        </Card>

        {/* Eligible Drives */}
        <Card className="p-5 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#94BC36]/15 text-[#94BC36] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#666666] font-medium">Eligible Drives</p>
            <p className="text-2xl font-bold text-[#252525]">
              {counts.eligibleDrives}
            </p>
            <Link to="/student/drives" className="text-[11px] text-[#E58A1F] hover:underline font-semibold">
              Explore drives →
            </Link>
          </div>
        </Card>

        {/* Upcoming Interviews */}
        <Card className="p-5 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#95058A]/10 text-[#95058A] flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#666666] font-medium">Interviews</p>
            <p className="text-2xl font-bold text-[#252525]">
              {counts.interviewsUpcoming}
            </p>
            <Link to="/student/interviews" className="text-[11px] text-[#95058A] hover:underline font-semibold">
              View schedule →
            </Link>
          </div>
        </Card>

        {/* Job Offers */}
        <Card className="p-5 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#666666] font-medium">Offers Received</p>
            <p className="text-2xl font-bold text-emerald-600">
              {counts.offers}
            </p>
            <Link to="/student/offers" className="text-[11px] text-emerald-600 hover:underline font-semibold">
              Check letters →
            </Link>
          </div>
        </Card>

      </div>

      {/* Main Grid: Next Event & Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Next Scheduled Interview or Closing Drives */}
        <div className="lg:col-span-2 space-y-4">
          
          {nextInterview ? (
            <Card className="border-l-4 border-l-[#95058A] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#95058A] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Next Upcoming Interview
                </span>
                <span className="text-xs text-[#666666]">
                  {new Date(nextInterview.date).toLocaleDateString()} at {nextInterview.startTime}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#252525]">
                  {nextInterview.roundName}
                </h3>
                <p className="text-xs text-[#666666]">
                  {nextInterview.drive?.company?.name} • {nextInterview.drive?.title}
                </p>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <Link to="/student/interviews">
                  <Button variant="outline" size="sm">
                    View Interview Details
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center space-y-2 bg-[#F7F8FA]/60">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-[#252525]">No upcoming interviews scheduled today</h4>
              <p className="text-xs text-[#666666]">
                When your applications are shortlisted, interview dates and venue instructions will appear here.
              </p>
            </Card>
          )}

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/student/drives" className="block group">
              <Card className="p-4 hover:border-[#E58A1F] transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E58A1F]/10 text-[#E58A1F] flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#252525] group-hover:text-[#E58A1F]">
                      Explore Drives
                    </h4>
                    <p className="text-[11px] text-[#666666]">View campus openings</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#E58A1F] group-hover:translate-x-0.5 transition-all" />
              </Card>
            </Link>

            <Link to="/student/applications" className="block group">
              <Card className="p-4 hover:border-[#94BC36] transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#94BC36]/15 text-[#94BC36] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#252525] group-hover:text-[#94BC36]">
                      Applications
                    </h4>
                    <p className="text-[11px] text-[#666666]">Track progress</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#94BC36] group-hover:translate-x-0.5 transition-all" />
              </Card>
            </Link>

            <Link to="/student/profile" className="block group">
              <Card className="p-4 hover:border-[#95058A] transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#95058A]/10 text-[#95058A] flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#252525] group-hover:text-[#95058A]">
                      My Profile
                    </h4>
                    <p className="text-[11px] text-[#666666]">Academic records</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#95058A] group-hover:translate-x-0.5 transition-all" />
              </Card>
            </Link>
          </div>

        </div>

        {/* Right Col: Academic Status Summary */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#252525] flex items-center justify-between">
              <span>Academic Snapshot</span>
              <span className="text-xs font-normal text-[#94BC36]">Verified</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                <span className="text-[#666666]">CGPA</span>
                <span className="font-bold text-[#252525]">
                  {user?.cgpa !== null && user?.cgpa !== undefined ? `${user.cgpa} / 10` : 'Not recorded'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                <span className="text-[#666666]">Active Backlogs</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  (user?.activeBacklogs || 0) > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {user?.activeBacklogs ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                <span className="text-[#666666]">10th / 12th Marks</span>
                <span className="font-semibold text-[#252525]">
                  {user?.tenthPct ? `${user.tenthPct}%` : '—'} / {user?.twelfthPct ? `${user.twelfthPct}%` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[#666666]">Graduation Batch</span>
                <span className="font-semibold text-[#252525]">
                  {user?.graduationYear || '2025'}
                </span>
              </div>
            </div>

            <Link to="/student/profile" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Update Academic Details
              </Button>
            </Link>
          </Card>
        </div>

      </div>

    </div>
  );
};
