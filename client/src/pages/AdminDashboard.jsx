import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ShieldCheck, Users, Activity, CheckCircle2, Lock } from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-500/10 via-purple-500/10 to-orange-500/10 dark:from-red-950/30 dark:via-purple-950/30 dark:to-orange-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Admin Control Center
              </h1>
              <Badge variant="danger" size="md">
                Super Admin
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              System Administration • Vishnu Institute of Technology, Bhimavaram
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            Authenticated: <span className="font-mono text-slate-700 dark:text-slate-300">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Admin KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">RBAC Security</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">Role Enforced</p>
            <p className="text-[11px] text-slate-400">Strict server-side validation</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-brand-purple flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">User Directory</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">14 Accounts</p>
            <p className="text-[11px] text-slate-400">Admin, Officer & Demo Students</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">System Health</p>
            <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">Operational</p>
            <p className="text-[11px] text-slate-400">API & DB Services Active</p>
          </div>
        </Card>

      </div>

      {/* Phase 1 Verification Card */}
      <Card className="border-l-4 border-l-red-500">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-red-500" />
          <span>Super Admin Access Established (Phase 1)</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          You are logged in as the master administrator (<span className="font-mono text-slate-800 dark:text-slate-200">24pa1a0567@vishnu.edu.in</span>).
          Only admin credentials can view this route.
        </p>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
          👉 <strong>Coming in Phase 5:</strong> User management table with search and role filters, role switching, user activation/deactivation, and comprehensive Audit Log viewer.
        </div>
      </Card>

    </div>
  );
};
