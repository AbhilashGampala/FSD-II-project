import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { checkEligibility } from '../../utils/eligibility';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, SampleBadge } from '../../components/common/Badge';
import { Spinner, EmptyState } from '../../components/common/Feedback';
import {
  Briefcase,
  Search,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Filter
} from 'lucide-react';

const BRANCH_OPTIONS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI&DS', 'CSE-AIML'];

export const ExploreDrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [student, setStudent] = useState(null);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [driveTypeFilter, setDriveTypeFilter] = useState('');
  const [minPackage, setMinPackage] = useState('');
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [closingSoonOnly, setClosingSoonOnly] = useState(false);
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline' or 'package'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [driveRes, profileRes, appsRes] = await Promise.all([
          api.getDrives(),
          api.getProfile(),
          api.getMyApplications()
        ]);

        if (driveRes.success) setDrives(driveRes.drives);
        if (profileRes.success) setStudent(profileRes.profile);
        if (appsRes.success) setMyApplications(appsRes.applications);
      } catch (err) {
        setError(err.message || 'Failed to load drives');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const appliedDriveMap = new Map();
  myApplications.forEach((app) => {
    const dId = app.drive?._id || app.drive;
    appliedDriveMap.set(String(dId), app);
  });

  // Client-side filtering & sorting
  const now = new Date();
  const processedDrives = drives
    .map((drive) => {
      const eligibility = checkEligibility(student, drive.eligibility);
      const daysRemaining = Math.ceil((new Date(drive.deadline) - now) / (1000 * 60 * 60 * 24));
      const hasApplied = appliedDriveMap.has(String(drive._id));
      const app = appliedDriveMap.get(String(drive._id));
      return { ...drive, eligibility, daysRemaining, hasApplied, userApp: app };
    })
    .filter((drive) => {
      if (search) {
        const q = search.toLowerCase();
        const matchTitle = drive.title.toLowerCase().includes(q);
        const matchRole = drive.jobRole.toLowerCase().includes(q);
        const matchCompany = drive.company?.name.toLowerCase().includes(q);
        if (!matchTitle && !matchRole && !matchCompany) return false;
      }

      if (branchFilter) {
        const branches = drive.eligibility?.branches || [];
        if (branches.length > 0 && !branches.includes(branchFilter)) return false;
      }

      if (driveTypeFilter && drive.driveType !== driveTypeFilter) {
        return false;
      }

      if (minPackage && drive.packageLPA < Number(minPackage)) {
        return false;
      }

      if (eligibleOnly && !drive.eligibility?.eligible) {
        return false;
      }

      if (closingSoonOnly && (drive.daysRemaining < 0 || drive.daysRemaining > 7)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'package') {
        return b.packageLPA - a.packageLPA;
      }
      // Default: deadline soonest first
      return new Date(a.deadline) - new Date(b.deadline);
    });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Explore Placement Drives</span>
          <span className="text-xs font-normal text-slate-500">({processedDrives.length} available)</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Campus placement opportunities tailored for Vishnu Institute students with live eligibility checks.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200">
          {error}
        </div>
      )}

      {/* Filter & Search Bar */}
      <Card className="p-4 space-y-3 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-brand-orange text-slate-800 dark:text-slate-200"
          >
            <option value="">All Branches</option>
            {BRANCH_OPTIONS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Drive Type */}
          <select
            value={driveTypeFilter}
            onChange={(e) => setDriveTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-brand-orange text-slate-800 dark:text-slate-200"
          >
            <option value="">All Drive Types</option>
            <option value="on-campus">On-Campus Only</option>
            <option value="pool">Pool Campus</option>
            <option value="off-campus">Off-Campus</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-brand-orange text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="deadline">Sort: Deadline (Earliest)</option>
            <option value="package">Sort: Package (Highest)</option>
          </select>

        </div>

        {/* Toggle Pills: Eligible for me only & Deadline soon */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg">
            <input
              type="checkbox"
              checked={eligibleOnly}
              onChange={(e) => setEligibleOnly(e.target.checked)}
              className="w-3.5 h-3.5 text-brand-green rounded focus:ring-brand-green"
            />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Eligible for me only
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg">
            <input
              type="checkbox"
              checked={closingSoonOnly}
              onChange={(e) => setClosingSoonOnly(e.target.checked)}
              className="w-3.5 h-3.5 text-brand-orange rounded focus:ring-brand-orange"
            />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Deadline soon (&lt; 7 days)
            </span>
          </label>

          {(search || branchFilter || driveTypeFilter || eligibleOnly || closingSoonOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setBranchFilter('');
                setDriveTypeFilter('');
                setMinPackage('');
                setEligibleOnly(false);
                setClosingSoonOnly(false);
              }}
              className="text-brand-orange font-semibold hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </Card>

      {/* Drives Card Grid */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : processedDrives.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-10 h-10 text-slate-400" />}
          title="No drives match your filters"
          description="Try broadening your filter criteria or unchecking 'Eligible for me only'."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processedDrives.map((drive) => {
            const isEligible = drive.eligibility?.eligible;
            const isIncomplete = drive.eligibility?.isIncomplete;
            const firstReason = drive.eligibility?.firstFailingReason;

            return (
              <Card
                key={drive._id}
                className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-3">
                  
                  {/* Top: Company, Drive Type, Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate">
                          {drive.company?.name || 'Recruiter'}
                        </span>
                        <Badge variant="default" size="sm">
                          {drive.driveType}
                        </Badge>
                      </div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {drive.title}
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {drive.jobRole}
                      </p>
                    </div>

                    {drive.isSample && <SampleBadge />}
                  </div>

                  {/* Highlights */}
                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">CTC Package</span>
                      <span className="text-lg font-bold text-brand-orange">
                        ₹ {drive.packageLPA} LPA
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Deadline</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {drive.daysRemaining > 0 ? `${drive.daysRemaining} days left` : 'Closed'}
                      </span>
                    </div>
                  </div>

                  {/* Eligibility chips */}
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      🎓 {drive.eligibility?.branches?.length > 0 ? drive.eligibility.branches.join(', ') : 'All Branches'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      📊 CGPA {drive.eligibility?.minCgpa > 0 ? `${drive.eligibility.minCgpa}+` : 'None'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Backlogs ≤ {drive.eligibility?.maxActiveBacklogs ?? 0}
                    </span>
                  </div>

                  {/* Dynamic Eligibility Indicator */}
                  <div className="pt-1">
                    {isIncomplete ? (
                      <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">Complete profile to check eligibility</span>
                      </div>
                    ) : isEligible ? (
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>You are eligible for this drive</span>
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate" title={firstReason}>
                          {firstReason || 'Not eligible'}
                        </span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Footer action */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  {drive.hasApplied ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      {drive.locations?.slice(0, 2).join(', ')}
                    </span>
                  )}

                  <Link to={`/student/drives/${drive._id}`}>
                    <Button variant={isEligible ? 'primary' : 'outline'} size="sm" className="gap-1.5">
                      <span>{drive.hasApplied ? 'View Status' : 'Details & Apply'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
};
