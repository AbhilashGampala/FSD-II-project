import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusPill, SampleBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Spinner, EmptyState } from '../../components/common/Feedback';
import {
  FileCheck2,
  Clock,
  ArrowRight,
  AlertTriangle,
  History,
  Trash2,
  Briefcase
} from 'lucide-react';

export const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  // Withdraw Modal
  const [withdrawingApp, setWithdrawingApp] = useState(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getMyApplications();
      if (res.success) {
        setApplications(res.applications);
      }
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleConfirmWithdraw = async () => {
    if (!withdrawingApp) return;

    setWithdrawLoading(true);
    try {
      await api.withdrawApplication(withdrawingApp._id);
      setNotification(`Application for '${withdrawingApp.drive?.title}' successfully withdrawn.`);
      setWithdrawingApp(null);
      fetchApplications();
    } catch (err) {
      alert(`Withdrawal failed: ${err.message}`);
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>My Placement Applications</span>
            <span className="text-xs font-normal text-slate-500">({applications.length})</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track your recruitment progress, review evaluation notes, and manage submissions.
          </p>
        </div>

        <Link to="/student/drives">
          <Button variant="primary" size="sm" className="gap-2">
            <Briefcase className="w-4 h-4" />
            <span>Explore More Drives</span>
          </Button>
        </Link>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification('')} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200">
          {error}
        </div>
      )}

      {/* Applications List */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<FileCheck2 className="w-10 h-10 text-slate-400" />}
          title="No applications submitted yet"
          description="Browse published placement drives and apply for roles matching your engineering branch."
          action={
            <Link to="/student/drives">
              <Button variant="primary" size="sm">
                Explore Available Drives
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app._id} className="space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              
              {/* Top Row: Drive Details & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {app.drive?.company?.name}
                    </span>
                    {app.drive?.isSample && <SampleBadge />}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {app.drive?.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Package: <strong className="text-brand-orange">₹ {app.drive?.packageLPA} LPA</strong> • Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusPill status={app.status} />

                  {/* Withdraw Button: Only active when status is 'applied' */}
                  {app.status === 'applied' && (
                    <button
                      type="button"
                      onClick={() => setWithdrawingApp(app)}
                      className="px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Withdraw</span>
                    </button>
                  )}
                </div>
              </div>

              {/* History Timeline */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-brand-purple" />
                  <span>Evaluation Timeline</span>
                </span>

                <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-3">
                  {app.history?.map((step, idx) => (
                    <div key={idx} className="relative text-xs">
                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-brand-purple border-2 border-white dark:border-slate-900" />
                      <div className="flex items-center gap-2">
                        <StatusPill status={step.status} />
                        <span className="text-[11px] text-slate-400">{new Date(step.at).toLocaleString()}</span>
                      </div>
                      {step.note && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 italic">
                          "{step.note}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Drive Details Link */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Link
                  to={`/student/drives/${app.drive?._id || app.drive}`}
                  className="text-xs text-brand-orange hover:underline font-semibold flex items-center gap-1"
                >
                  <span>View Drive Description</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </Card>
          ))}
        </div>
      )}

      {/* Withdraw Confirmation Modal */}
      <Modal
        isOpen={Boolean(withdrawingApp)}
        onClose={() => setWithdrawingApp(null)}
        title="Confirm Application Withdrawal"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Are you sure you want to withdraw your application for <strong>{withdrawingApp?.drive?.title}</strong>?
          </p>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300">
            Once withdrawn, your candidate profile is removed from the active shortlisting pool for this drive.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setWithdrawingApp(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              loading={withdrawLoading}
              onClick={handleConfirmWithdraw}
            >
              Confirm Withdrawal
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
