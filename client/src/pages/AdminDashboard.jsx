import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Feedback';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Award,
  ArrowRight,
  Activity,
  CheckCircle2,
  FileCheck2
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
      <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
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
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#95058A]"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[#252525]">
                Admin Control Center
              </h1>
              <Badge variant="purple" size="md">
                SUPER ADMIN
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#666666]">
              Institutional Administration • Vishnu Institute of Technology, Bhimavaram
            </p>
          </div>
          <div className="text-right text-xs text-[#666666]">
            Active Administrator: <span className="font-mono text-[#95058A] font-bold">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-[#95058A]/10 text-[#95058A] flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#666666] font-medium">Total Registered Users</p>
            <p className="text-2xl font-bold text-[#252525]">
              {userCounts.total ?? 0}
            </p>
            <p className="text-[11px] text-[#666666]">
              {userCounts.students ?? 0} Students • {userCounts.officers ?? 0} Officers
            </p>
          </div>
        </Card>

        {/* Drives */}
        <Card className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-[#E58A1F]/10 text-[#E58A1F] flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#666666] font-medium">Placement Drives</p>
            <p className="text-2xl font-bold text-[#252525]">
              {driveCounts.total ?? 0}
            </p>
            <p className="text-[11px] text-[#666666]">
              {driveCounts.published ?? 0} Published • {driveCounts.draft ?? 0} Drafts
            </p>
          </div>
        </Card>

        {/* Applications */}
        <Card className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#666666] font-medium">Applications Processed</p>
            <p className="text-2xl font-bold text-[#252525]">
              {appCounts.total ?? 0}
            </p>
            <p className="text-[11px] text-[#666666]">
              Across corporate recruiters
            </p>
          </div>
        </Card>

        {/* Offers */}
        <Card className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-[#94BC36]/15 text-[#94BC36] flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#666666] font-medium">Placement Offers</p>
            <p className="text-2xl font-bold text-[#94BC36]">
              {offerCounts.total ?? 0}
            </p>
            <p className="text-[11px] text-[#666666]">
              {offerCounts.accepted ?? 0} Confirmed Acceptance
            </p>
          </div>
        </Card>
      </div>

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/users" className="block group">
          <Card className="p-4 hover:border-[#95058A] transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#95058A]/10 text-[#95058A] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#252525] group-hover:text-[#95058A] transition-colors">
                  User Directory
                </h4>
                <p className="text-[11px] text-[#666666]">
                  Manage accounts, grant roles & create officers
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#95058A] group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>

        <Link to="/admin/audit" className="block group">
          <Card className="p-4 hover:border-red-400 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#252525] group-hover:text-red-600 transition-colors">
                  Compliance Audit Logs
                </h4>
                <p className="text-[11px] text-[#666666]">
                  Immutable event trail of administrative actions
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>

        <Link to="/officer/stats" className="block group">
          <Card className="p-4 hover:border-[#94BC36] transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#94BC36]/15 text-[#94BC36] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#252525] group-hover:text-[#94BC36] transition-colors">
                  Placement Statistics
                </h4>
                <p className="text-[11px] text-[#666666]">
                  Institutional verified placement records
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#94BC36] group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>
      </div>

      {/* Recent Audit Trail Spotlight */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#252525] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#95058A]" />
              Recent Institutional Activity Logs
            </h3>
            <p className="text-xs text-[#666666]">
              Live updates recorded across placement operations
            </p>
          </div>
          <Link
            to="/admin/audit"
            className="text-xs font-semibold text-[#95058A] hover:underline flex items-center gap-1"
          >
            <span>View All Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentAuditLogs.length === 0 ? (
          <p className="text-xs text-[#666666] py-6 text-center">No recent activity logs found</p>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {recentAuditLogs.map((log) => {
              const actor = log.actor || {};
              return (
                <div key={log._id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-[#95058A] flex-shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-[#252525]">
                        {log.action}
                      </span>
                      <span className="text-[#666666] text-[11px] ml-2">
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
