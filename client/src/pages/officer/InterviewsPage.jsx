import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, SampleBadge } from '../../components/common/Badge';
import { Spinner, EmptyState } from '../../components/common/Feedback';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle,
  XCircle,
  ExternalLink,
  Users
} from 'lucide-react';

export const InterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.getInterviews(params);
      if (res.success) {
        setInterviews(res.interviews);
      }
    } catch (err) {
      setError(err.message || 'Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [statusFilter]);

  const handleStatusChange = async (interviewId, newStatus) => {
    try {
      await api.updateInterviewStatus(interviewId, newStatus);
      setActionSuccess(`Interview marked as '${newStatus}'`);
      fetchInterviews();
    } catch (err) {
      alert(`Error updating interview: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Interview Schedules</span>
            <span className="text-xs font-normal text-slate-500">({interviews.length})</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor, coordinate, and mark attendance for student technical and HR evaluation panels.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          {['all', 'scheduled', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                statusFilter === tab
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess('')} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200">
          {error}
        </div>
      )}

      {/* Interviews Grid */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-10 h-10 text-slate-400" />}
          title="No interviews found"
          description="Go to any drive's Candidate Review page to schedule interviews for shortlisted students."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviews.map((item) => (
            <Card key={item._id} className="flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-brand-purple uppercase tracking-wider">
                      {item.drive?.company?.name || 'Company Drive'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.roundName}
                    </h3>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                    item.status === 'completed'
                      ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                      : item.status === 'cancelled'
                      ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400'
                      : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Candidate details */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 my-2 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                    <span>{item.student?.name}</span>
                    <span className="font-mono text-slate-500">{item.student?.rollNo || item.student?.branch}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Drive: <span className="font-medium text-slate-700 dark:text-slate-300">{item.drive?.title}</span>
                  </p>
                </div>

                {/* Schedule info */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(item.date).toLocaleDateString()} at <span className="font-semibold">{item.startTime}</span>
                    </span>
                  </div>

                  {item.mode === 'online' ? (
                    <div className="flex items-center gap-2 text-brand-orange">
                      <Video className="w-3.5 h-3.5" />
                      {item.meetingLink ? (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline flex items-center gap-1 font-medium"
                        >
                          <span>Open Meeting Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span>Online Link Pending</span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.venue || 'Placement Block A'}</span>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500 italic pt-1">
                    Panel: {item.panel}
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              {item.status === 'scheduled' && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item._id, 'completed')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Mark Completed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item._id, 'cancelled')}
                    className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-semibold hover:bg-red-100 flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};
