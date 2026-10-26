import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, SampleBadge, StatusPill } from '../../components/common/Badge';
import { Spinner, EmptyState } from '../../components/common/Feedback';
import {
  Briefcase,
  PlusCircle,
  Search,
  Users,
  Copy,
  Edit,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const DrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionMessage, setActionMessage] = useState('');
  const [error, setError] = useState('');

  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search) params.search = search;

      const res = await api.getDrives(params);
      if (res.success) {
        setDrives(res.drives);
      }
    } catch (err) {
      setError(err.message || 'Failed to load drives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDrives();
  };

  const handleStatusChange = async (driveId, newStatus) => {
    try {
      await api.updateDriveStatus(driveId, newStatus);
      setActionMessage(`Drive status updated to '${newStatus}'`);
      fetchDrives();
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleDuplicate = async (driveId) => {
    try {
      const res = await api.duplicateDrive(driveId);
      setActionMessage(`Drive duplicated successfully as '${res.drive.title}'`);
      fetchDrives();
    } catch (err) {
      alert(`Error duplicating drive: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Campus Placement Drives</span>
            <span className="text-xs font-normal text-slate-500">({drives.length})</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish on-campus, pool, and off-campus recruitment drives for Vishnu Institute students.
          </p>
        </div>

        <Link to="/officer/drives/new">
          <Button variant="primary" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>Create Drive</span>
          </Button>
        </Link>
      </div>

      {/* Notifications */}
      {actionMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage('')} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200">
          {error}
        </div>
      )}

      {/* Filter Tabs & Search */}
      <Card className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold overflow-x-auto">
          {['all', 'published', 'draft', 'closed'].map((tab) => (
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

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 sm:w-72">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by role or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <Button type="submit" variant="outline" size="sm">
            Go
          </Button>
        </form>
      </Card>

      {/* Drives List */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : drives.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-10 h-10 text-slate-400" />}
          title="No drives match your filters"
          description="Adjust your search criteria or create a new placement drive."
          action={
            <Link to="/officer/drives/new">
              <Button variant="primary" size="sm">
                Create First Drive
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drives.map((drive) => {
            const daysRemaining = Math.ceil((new Date(drive.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            return (
              <Card key={drive._id} className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                <div className="space-y-3">
                  
                  {/* Top Bar: Company, Role & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          {drive.company?.name || 'Partner Company'}
                        </span>
                        <Badge variant="default" size="sm">
                          {drive.driveType}
                        </Badge>
                        {drive.isSample && <SampleBadge />}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {drive.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Role: {drive.jobRole}
                      </p>
                    </div>

                    <StatusPill status={drive.status} />
                  </div>

                  {/* Highlights: Package, Locations, Deadline */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <span className="font-bold text-brand-orange text-sm">
                      ₹ {drive.packageLPA} LPA
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{drive.locations?.join(', ') || 'Bhimavaram'}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Deadline passed'}
                      </span>
                    </span>
                  </div>

                  {/* Requirement Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      🎓 {drive.eligibility?.branches?.length > 0 ? drive.eligibility.branches.join(', ') : 'All Branches'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      📊 CGPA {drive.eligibility?.minCgpa > 0 ? `${drive.eligibility.minCgpa}+` : 'None'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      ⚠️ Backlogs ≤ {drive.eligibility?.maxActiveBacklogs ?? 0}
                    </span>
                  </div>

                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <Link to={`/officer/drives/${drive._id}/applications`}>
                    <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                      <Users className="w-3.5 h-3.5" />
                      <span>Review Candidates</span>
                    </Button>
                  </Link>

                  <div className="flex items-center gap-1">
                    <Link to={`/officer/drives/${drive._id}/edit`}>
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
                        title="Edit Drive"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(drive._id)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
                      title="Duplicate Drive"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Duplicate</span>
                    </button>

                    {drive.status === 'draft' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(drive._id, 'published')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100"
                      >
                        Publish
                      </button>
                    )}

                    {drive.status === 'published' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(drive._id, 'closed')}
                        className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-semibold hover:bg-red-100"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>

              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
};
