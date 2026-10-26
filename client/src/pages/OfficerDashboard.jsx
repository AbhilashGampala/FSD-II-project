import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Badge, SampleBadge } from '../components/common/Badge';
import { Building2, Briefcase, FileCheck, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const OfficerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      
      {/* Officer Header */}
      <div className="bg-gradient-to-r from-purple-500/10 via-orange-500/10 to-green-500/10 dark:from-purple-950/30 dark:via-orange-950/30 dark:to-green-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Officer Workspace • {user?.name || 'S. Manikanta'}
              </h1>
              {user?.isSample && <SampleBadge />}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Training & Placement Cell • Vishnu Institute of Technology, Bhimavaram
            </p>
          </div>
          <Badge variant="purple" size="md">
            Placement Officer
          </Badge>
        </div>
      </div>

      {/* Summary KPI Cards (Teaser for Phase 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Drives</span>
            <SampleBadge />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">14</span>
            <Briefcase className="w-5 h-5 text-brand-orange" />
          </div>
          <p className="text-[11px] text-slate-400">Available in Phase 3</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Partner Companies</span>
            <SampleBadge />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">8</span>
            <Building2 className="w-5 h-5 text-brand-purple" />
          </div>
          <p className="text-[11px] text-slate-400">Available in Phase 3</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Applications</span>
            <SampleBadge />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">42</span>
            <FileCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-[11px] text-slate-400">Available in Phase 3</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Offers Released</span>
            <SampleBadge />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">9</span>
            <Award className="w-5 h-5 text-brand-green" />
          </div>
          <p className="text-[11px] text-slate-400">Available in Phase 3</p>
        </Card>

      </div>

      {/* Phase 1 Completion Details */}
      <Card className="border-l-4 border-l-brand-purple">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-brand-purple" />
          <span>Placement Officer Role Verified (Phase 1)</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
          You are authenticated as the official Placement Officer (<strong>S. Manikanta</strong>, <span className="font-mono text-slate-800 dark:text-slate-200">manikanta@vishnu.edu.in</span>).
          Server-side role guards ensure that students cannot access officer or admin routes.
        </p>
        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 text-xs text-purple-800 dark:text-purple-300">
          👉 <strong>Coming in Phase 3:</strong> Full Company management, Drive creator with eligibility criteria builder, candidate shortlisting table, interview scheduler, and official placement statistics manager.
        </div>
      </Card>

    </div>
  );
};
