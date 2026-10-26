import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Feedback';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Award,
  Calendar,
  Lock,
  ArrowRight,
  Activity,
  UserCheck,
  Clock,
  Eye,
  CheckCircle2,
  FileCheck2,
  Building2
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.getAdminDashboard();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        setError(err.message || 'Failed to load admin dashboard');
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

  const counts = data?.counts || {};
  const userCounts = counts.users || {};
  const driveCounts = counts.drives || {};
  const appCounts = counts.applications || {};
  const offerCounts = counts.offers || {};
  const recentAuditLogs = data?.recentAuditLogs || [];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-500/10 via-red-500/10 to-orange-500/10 dark:from-purple-950/30 dark:via-red-950/30 dark:to-orange-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Admin Control Center
              </h1>
              <Badge variant="danger" size="md">
                SUPER ADMIN
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Institutional Administration • Vishnu Institute of Technology, Bhimavaram
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            Current Operator: <span className="font-mono text-brand-purple font-bold">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-brand-purple flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Registered Users</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {userCounts.total ?? 0}
            </p>
            <p className="text-[11px] text-slate-400">
              {userCounts.students ?? 0} Students • {userCounts.officers ?? 0} Officers
            </p>
          </div>
        </Card>

        {/* Drives */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-brand-orange flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Placement Drives</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {driveCounts.total ?? 0}
            </p>
            <p className="text-[11px] text-slate-400">
              {driveCounts.published ?? 0} Published • {driveCounts.draft ?? 0} Drafts
            </p>
          </div>
        </Card>

        {/* Applications */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Applications Processed</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {appCounts.total ?? 0}
            </p>
            <p className="text-[11px] text-slate-400">
              Across institutional recruiters
            </p>
          </div>
        </Card>

        {/* Offers */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950/50 text-brand-green flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Placement Offers</p>
            <p className="text-2xl font-black text-brand-green">
              {offerCounts.total ?? 0}
            </p>
            <p className="text-[11px] text-slate-400">
              {offerCounts.accepted ?? 0} Confirmed Acceptance
            </p>
          </div>
        </Card>
      </div>

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/users" className="block group">
          <Card className="p-4 hover:border-brand-purple transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-brand-purple flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-purple transition-colors">
                  User Directory
                </h4>
                <p className="text-[11px] text-slate-500">
                  Manage accounts, grant roles & create officers
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>

        <Link to="/admin/audit" className="block group">
          <Card className="p-4 hover:border-brand-purple transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-purple transition-colors">
                  Compliance Audit Logs
                </h4>
                <p className="text-[11px] text-slate-500">
                  Immutable event trail of administrative actions
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>

        <Link to="/officer/stats" className="block group">
          <Card className="p-4 hover:border-brand-purple transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/40 text-brand-green flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-purple transition-colors">
                  Placement Statistics
                </h4>
                <p className="text-[11px] text-slate-500">
                  Data honesty verified placement records
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>
      </div>

      {/* Recent Audit Trail Spotlight */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-purple" />
              Recent Institutional Activity Logs
            </h3>
            <p className="text-xs text-slate-500">
              Live updates recorded across all placement modules
            </p>
          </div>
          <Link
            to="/admin/audit"
            className="text-xs font-semibold text-brand-purple hover:underline flex items-center gap-1"
          >
            <span>View All Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentAuditLogs.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No recent activity logs found</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {recentAuditLogs.map((log) => {
              const actor = log.actor || {};
              return (
                <div key={log._id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-brand-purple flex-shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {log.action}
                      </span>
                      <span className="text-slate-500 text-[11px] ml-2">
                        by {actor.name || 'System'} ({actor.email || 'N/A'})
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-400 flex-shrink-0 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
