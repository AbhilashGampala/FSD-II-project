import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, SampleBadge, VerifiedBadge, StatusPill } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Feedback';
import {
  Briefcase,
  FileCheck2,
  Calendar,
  Award,
  Clock,
  ArrowRight,
  ExternalLink,
  UserCheck,
  AlertCircle,
  Video,
  MapPin,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.getStudentDashboard();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        setError(err.message || 'Failed to load student dashboard');
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

  const {
    counts = {},
    nextInterview,
    deadlinesClosingSoon = [],
    stats = [],
    completeness = { percentage: 100, isComplete: true, missing: [] },
    profile = {}
  } = data || {};

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-green-500/10 dark:from-orange-950/30 dark:via-purple-950/30 dark:to-green-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Welcome, {profile?.name || 'Student'}!
              </h1>
              {profile?.isSample && <SampleBadge />}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              Vishnu Institute of Technology • {profile?.branch || 'Department'} • Batch {profile?.admissionYear || '2021'}-{profile?.graduationYear || '2025'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/student/drives">
              <Button variant="primary" size="sm" className="gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>Explore Drives</span>
              </Button>
            </Link>
            <Link to="/student/profile">
              <Button variant="outline" size="sm" className="gap-1.5">
                <UserCheck className="w-4 h-4" />
                <span>My Profile</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Completeness Alert / Progress */}
      {!completeness.isComplete && (
        <Card className="border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Profile Incomplete ({completeness.percentage}%)
                </h3>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Please complete: <span className="font-semibold">{completeness.missing?.join(', ')}</span> to verify your drive eligibility.
              </p>
            </div>
            <Link to="/student/profile">
              <Button variant="outline" size="sm" className="text-xs border-amber-300 dark:border-amber-700">
                Complete Profile
              </Button>
            </Link>
          </div>
          <div className="w-full bg-amber-200 dark:bg-amber-900/60 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${completeness.percentage}%` }}
            />
          </div>
        </Card>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Eligible Drives</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {counts.eligibleDrives ?? 0}
          </div>
          <p className="text-[10px] text-slate-400">Matches your criteria</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Applied</span>
            <FileCheck2 className="w-4 h-4 text-brand-orange" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {counts.applied ?? 0}
          </div>
          <p className="text-[10px] text-slate-400">Submitted applications</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Shortlisted</span>
            <Badge variant="purple" size="sm">Status</Badge>
          </div>
          <div className="text-2xl font-bold text-brand-purple">
            {counts.shortlisted ?? 0}
          </div>
          <p className="text-[10px] text-slate-400">Cleared for rounds</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Interviews</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {counts.interviewsUpcoming ?? 0}
          </div>
          <p className="text-[10px] text-slate-400">Scheduled rounds</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Job Offers</span>
            <Award className="w-4 h-4 text-brand-green" />
          </div>
          <div className="text-2xl font-bold text-brand-green">
            {counts.offers ?? 0}
          </div>
          <p className="text-[10px] text-slate-400">Offers received</p>
        </Card>

      </div>

      {/* Spotlight: Next Scheduled Interview */}
      {nextInterview && (
        <Card className="border-l-4 border-l-brand-purple bg-gradient-to-r from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                  Upcoming Interview Round
                </span>
                <Badge variant="purple" size="sm">Scheduled</Badge>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {nextInterview.roundName}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Company: <span className="font-semibold text-slate-800 dark:text-slate-200">{nextInterview.drive?.company?.name}</span> • Package: <span className="font-bold text-brand-orange">{nextInterview.drive?.packageLPA} LPA</span>
              </p>
            </div>

            <div className="space-y-2 text-right">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{new Date(nextInterview.date).toLocaleDateString()} at {nextInterview.startTime}</span>
              </div>

              {nextInterview.mode === 'online' && nextInterview.meetingLink ? (
                <a
                  href={nextInterview.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-purple text-white text-xs font-semibold shadow-sm hover:bg-purple-800 transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Meeting</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="text-xs text-slate-500 flex items-center gap-1 justify-end">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{nextInterview.venue || 'Block A Seminar Hall'}</span>
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Main Two-Column Layout: Closing Deadlines & Placement Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Deadlines Closing Soon */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-orange" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Drives Closing Soon</h2>
            </div>
            <Link to="/student/drives" className="text-xs text-brand-orange font-semibold hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {deadlinesClosingSoon.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No active placement deadlines at this time.</p>
          ) : (
            <div className="space-y-3">
              {deadlinesClosingSoon.map((drive) => {
                const daysRemaining = Math.ceil((new Date(drive.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                const isEligible = drive.eligibility?.eligible;

                return (
                  <div
                    key={drive._id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {drive.title}
                        </h3>
                        {drive.isSample && <SampleBadge />}
                      </div>

                      <p className="text-[11px] text-slate-500">
                        {drive.company?.name} • <span className="font-semibold text-brand-orange">{drive.packageLPA} LPA</span>
                      </p>

                      <div className="mt-1.5 flex items-center gap-2">
                        {isEligible ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>You are eligible</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-red-500 font-medium truncate max-w-xs">
                            ✕ {drive.eligibility?.firstFailingReason || 'Not eligible'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        daysRemaining <= 3
                          ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'
                          : 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400'
                      }`}>
                        {daysRemaining <= 0 ? 'Ends Today' : `${daysRemaining}d left`}
                      </span>

                      <div className="mt-1.5">
                        <Link
                          to={`/student/drives/${drive._id}`}
                          className="text-xs text-brand-purple font-semibold hover:underline"
                        >
                          {drive.hasApplied ? 'View Applied →' : 'Details & Apply →'}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Official Placement Statistics (Data Honesty Enforced) */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-green" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Institutional Placement Stats</h2>
            </div>
            <span className="text-[11px] text-slate-400">Vishnu Institute Reports</span>
          </div>

          <div className="space-y-3">
            {stats.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No placement statistics published yet.</p>
            ) : (
              stats.map((st) => (
                <div
                  key={st._id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {st.label}
                    </p>
                    <p className="text-base font-bold text-brand-orange mt-0.5">
                      {st.value ? st.value : <span className="text-slate-400 text-xs italic font-normal">Awaiting published report</span>}
                    </p>
                  </div>

                  <div className="text-right">
                    <VerifiedBadge
                      verified={st.verified}
                      sourceUrl={st.sourceUrl}
                      year={st.year}
                    />
                    {st.sourceUrl && (
                      <div className="mt-1">
                        <a
                          href={st.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-brand-purple hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          <span>Official Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>

    </div>
  );
};
