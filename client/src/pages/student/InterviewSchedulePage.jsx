import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Badge, SampleBadge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Feedback';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Building2,
  Users,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Briefcase
} from 'lucide-react';

export const InterviewSchedulePage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('upcoming'); // 'upcoming' | 'past' | 'all'

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getMyInterviews();
      if (res.success) {
        setInterviews(res.interviews || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch interview schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const now = new Date();

  const isUpcoming = (item) => {
    const interviewDate = new Date(item.date);
    return interviewDate >= now || item.status === 'scheduled';
  };

  const filteredInterviews = interviews.filter((item) => {
    if (filter === 'upcoming') return isUpcoming(item) && item.status !== 'cancelled';
    if (filter === 'past') return !isUpcoming(item) || item.status === 'completed' || item.status === 'cancelled';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-brand-orange" />
            Interview Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track your upcoming technical rounds, campus interviews, and online assessments
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start sm:self-auto border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'upcoming'
                ? 'bg-white dark:bg-slate-900 text-brand-orange shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Upcoming ({interviews.filter(isUpcoming).length})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'past'
                ? 'bg-white dark:bg-slate-900 text-brand-orange shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Past Rounds
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-900 text-brand-orange shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({interviews.length})
          </button>
        </div>
      </div>

      {/* Guidelines Box */}
      <div className="p-4 rounded-xl bg-orange-500/10 dark:bg-orange-950/20 border border-orange-500/20 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <p className="font-semibold text-slate-900 dark:text-white">
            VIT Campus Interview Guidelines
          </p>
          <p>
            Please join virtual interviews at least 10 minutes prior with a working webcam, formal dress code, and your resume copy ready. For in-person interviews at the VIT Placement Block, carry 3 printed copies of your updated resume and your college ID card.
          </p>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : filteredInterviews.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No interviews found in this view
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            When recruiters schedule technical tests or face-to-face interviews for drives you have applied to, they will appear here with timing and meeting links.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map((interview) => {
            const drive = interview.drive || {};
            const company = drive.company || {};
            const isCompleted = interview.status === 'completed';
            const isCancelled = interview.status === 'cancelled';

            return (
              <Card
                key={interview._id}
                className="hover:border-slate-300 dark:hover:border-slate-700 transition-all border-l-4 border-l-brand-orange"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Company & Round */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {interview.roundName || 'Interview Round'}
                      </h3>
                      <Badge
                        variant={
                          isCompleted
                            ? 'success'
                            : isCancelled
                            ? 'danger'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {interview.status?.toUpperCase()}
                      </Badge>
                      {interview.isSample && <SampleBadge />}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {company.name || 'Company'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        {drive.jobRole || drive.title || 'Role'}
                      </span>
                      {drive.packageLPA && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-brand-green">
                            ₹{drive.packageLPA} LPA
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Middle Column: Date & Time */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-brand-orange flex items-center justify-center font-bold text-xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Date</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {new Date(interview.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Time</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {interview.startTime || '10:00 AM'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Mode & Join Link / Venue */}
                  <div className="flex flex-col items-start lg:items-end gap-2">
                    {interview.mode === 'online' ? (
                      <div className="space-y-1.5 w-full lg:w-auto">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                          <Video className="w-4 h-4" />
                          <span>Online Interview</span>
                        </div>
                        {interview.meetingLink ? (
                          <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                          >
                            <span>Join Meeting</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Meeting link will be shared 15m before</span>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                          <MapPin className="w-4 h-4" />
                          <span>In-Person Campus Interview</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          Venue: {interview.venue || 'Placement Cell, Room 204'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Optional Panel & Instructions */}
                {(interview.panel || interview.instructions) && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {interview.panel && (
                      <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                        <Users className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Interview Panel: </span>
                          <span>{interview.panel}</span>
                        </div>
                      </div>
                    )}
                    {interview.instructions && (
                      <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Instructions: </span>
                          <span>{interview.instructions}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
