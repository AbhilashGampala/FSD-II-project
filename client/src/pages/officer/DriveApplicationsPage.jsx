import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, StatusPill, SampleBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Select } from '../../components/common/Input';
import { Spinner, EmptyState } from '../../components/common/Feedback';
import {
  ArrowLeft,
  Users,
  Calendar,
  CheckCircle2,
  Filter,
  UserCheck,
  Award,
  History,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'aptitude', label: 'Aptitude Round' },
  { value: 'technical', label: 'Technical Interview' },
  { value: 'hr', label: 'HR Interview' },
  { value: 'selected', label: 'Selected' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' }
];

export const DriveApplicationsPage = () => {
  const { driveId } = useParams();

  const [drive, setDrive] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  // Filters
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [minCgpaFilter, setMinCgpaFilter] = useState('');

  // Checkbox selection for Bulk Shortlist
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [statusModalApp, setStatusModalApp] = useState(null);
  const [newStatus, setNewStatus] = useState('shortlisted');
  const [statusNote, setStatusNote] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  const [profileModalStudent, setProfileModalStudent] = useState(null);

  // Quick Interview Schedule Modal
  const [interviewModalApp, setInterviewModalApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    roundName: 'Round 1: Technical Interview',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    startTime: '10:00 AM',
    mode: 'offline',
    venue: 'Training & Placement Seminar Hall, Block A',
    meetingLink: '',
    panel: 'Technical Panel 1',
    instructions: 'Carry 2 copies of resume, college ID, and certificates.'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch drive info
      const driveRes = await api.getDrive(driveId);
      if (driveRes.success) setDrive(driveRes.drive);

      // Fetch applications for this drive
      const params = {};
      if (branchFilter) params.branch = branchFilter;
      if (statusFilter) params.status = statusFilter;
      if (minCgpaFilter) params.minCgpa = minCgpaFilter;

      const appRes = await api.getApplicationsByDrive(driveId, params);
      if (appRes.success) {
        setApplications(appRes.applications);
      }
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [driveId, branchFilter, statusFilter, minCgpaFilter]);

  // Checkbox handling
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(applications.map((a) => a._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleRowCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Shortlist
  const handleBulkShortlist = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await api.bulkShortlist(selectedIds, 'Shortlisted via placement officer candidate table');
      setNotification(res.message);
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      alert(`Error during bulk shortlist: ${err.message}`);
    }
  };

  // Change single status
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!statusModalApp) return;

    setStatusUpdating(true);
    try {
      await api.updateApplicationStatus(statusModalApp._id, newStatus, statusNote);
      setNotification(`Candidate status updated to '${newStatus}'`);
      setStatusModalApp(null);
      setStatusNote('');
      fetchData();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setStatusUpdating(false);
    }
  };

  // Schedule Interview Submit
  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!interviewModalApp) return;

    try {
      await api.createInterview({
        applicationId: interviewModalApp._id,
        ...interviewForm
      });
      setNotification(`Interview successfully scheduled for ${interviewModalApp.student.name}`);
      setInterviewModalApp(null);
      fetchData();
    } catch (err) {
      alert(`Schedule error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Drive Summary Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/officer/drives"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Drives</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Candidate Applications
            </h1>
            {drive?.isSample && <SampleBadge />}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {drive?.company?.name} • <span className="font-semibold text-slate-800 dark:text-slate-200">{drive?.title}</span> • Package: <span className="font-bold text-brand-orange">{drive?.packageLPA} LPA</span>
          </p>
        </div>

        {/* Bulk Shortlist CTA when rows selected */}
        {selectedIds.length > 0 && (
          <Button
            variant="purple"
            onClick={handleBulkShortlist}
            className="gap-2 shadow-md animate-pulse"
          >
            <UserCheck className="w-4 h-4" />
            <span>Shortlist ({selectedIds.length}) Selected</span>
          </Button>
        )}
      </div>

      {/* Notification banner */}
      {notification && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification('')} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200">
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <Card className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Select
          label="Filter Branch"
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          options={['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI&DS', 'CSE-AIML']}
          placeholder="All Branches"
        />

        <Select
          label="Filter Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={STATUS_OPTIONS}
          placeholder="All Statuses"
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
            Min CGPA Filter
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 8.0"
            value={minCgpaFilter}
            onChange={(e) => setMinCgpaFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            size="md"
            onClick={() => { setBranchFilter(''); setStatusFilter(''); setMinCgpaFilter(''); }}
            className="w-full text-xs"
          >
            Reset Filters
          </Button>
        </div>
      </Card>

      {/* Applications Table */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<Users className="w-10 h-10 text-slate-400" />}
          title="No applications found"
          description="No student applications matched your selected filter criteria."
        />
      ) : (
        <Card className="p-0 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 uppercase font-semibold text-[11px] tracking-wider">
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === applications.length && applications.length > 0}
                      onChange={handleSelectAll}
                      className="rounded text-brand-orange focus:ring-brand-orange"
                    />
                  </th>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Branch & Batch</th>
                  <th className="p-3">CGPA</th>
                  <th className="p-3">10th / 12th %</th>
                  <th className="p-3">Backlogs</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3">Applied Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {applications.map((app) => {
                  const student = app.student;
                  const isChecked = selectedIds.includes(app._id);
                  return (
                    <tr
                      key={app._id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        isChecked ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleRowCheckbox(app._id)}
                          className="rounded text-brand-orange focus:ring-brand-orange"
                        />
                      </td>

                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => setProfileModalStudent({ student, history: app.history })}
                          className="font-bold text-slate-900 dark:text-white hover:text-brand-orange text-left"
                        >
                          {student?.name || 'Unknown'}
                        </button>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {student?.rollNo || student?.email}
                        </p>
                      </td>

                      <td className="p-3 font-medium">
                        <span className="text-slate-800 dark:text-slate-200">{student?.branch}</span>
                        <p className="text-[11px] text-slate-400">Grad: {student?.graduationYear || '2025'}</p>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {student?.cgpa !== null && student?.cgpa !== undefined ? student.cgpa : '—'}
                        </span>
                      </td>

                      <td className="p-3 text-slate-600 dark:text-slate-300">
                        <span>{student?.tenthPct ? `${student.tenthPct}%` : '—'}</span> / <span>{student?.twelfthPct ? `${student.twelfthPct}%` : '—'}</span>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          (student?.activeBacklogs || 0) > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {student?.activeBacklogs ?? 0}
                        </span>
                      </td>

                      <td className="p-3">
                        <StatusPill status={app.status} />
                      </td>

                      <td className="p-3 text-slate-400">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Change Status Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setStatusModalApp(app);
                              setNewStatus(app.status);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                          >
                            Status
                          </button>

                          {/* Schedule Interview */}
                          <button
                            type="button"
                            onClick={() => setInterviewModalApp(app)}
                            className="p-1 rounded-lg text-slate-500 hover:text-brand-purple hover:bg-purple-50 dark:hover:bg-purple-950/40"
                            title="Schedule Interview Round"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        </Card>
      )}

      {/* MODAL 1: Update Application Status & Note */}
      <Modal
        isOpen={Boolean(statusModalApp)}
        onClose={() => setStatusModalApp(null)}
        title={`Change Status: ${statusModalApp?.student?.name}`}
      >
        <form onSubmit={handleStatusSubmit} className="space-y-4">
          <Select
            label="New Placement Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            options={STATUS_OPTIONS}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Officer Review Note (Appends to candidate history)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Cleared technical interview with score 8/10. Recommended for HR round."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStatusModalApp(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={statusUpdating}
            >
              Update Status
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: View Student Detailed Profile & History */}
      <Modal
        isOpen={Boolean(profileModalStudent)}
        onClose={() => setProfileModalStudent(null)}
        title="Student Profile & Application History"
      >
        {profileModalStudent && (
          <div className="space-y-4">
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold text-lg">
                🎓
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {profileModalStudent.student?.name}
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  Roll: {profileModalStudent.student?.rollNo || 'N/A'} • Branch: {profileModalStudent.student?.branch}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">College Email</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 break-all">{profileModalStudent.student?.email}</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Contact Phone</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{profileModalStudent.student?.phone || 'Not provided'}</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Academic CGPA</span>
                <span className="font-bold text-brand-orange">{profileModalStudent.student?.cgpa || '0'} / 10</span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Active Backlogs</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{profileModalStudent.student?.activeBacklogs ?? 0}</span>
              </div>
            </div>

            {/* Application History Timeline */}
            <div className="pt-2">
              <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-brand-purple" />
                <span>Application History Log</span>
              </h5>
              <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-3">
                {profileModalStudent.history?.map((hist, idx) => (
                  <div key={idx} className="relative text-xs">
                    <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-brand-purple border-2 border-white dark:border-slate-900" />
                    <div className="flex items-center gap-2">
                      <StatusPill status={hist.status} />
                      <span className="text-[11px] text-slate-400">{new Date(hist.at).toLocaleString()}</span>
                    </div>
                    {hist.note && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 italic">
                        "{hist.note}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setProfileModalStudent(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 3: Schedule Interview */}
      <Modal
        isOpen={Boolean(interviewModalApp)}
        onClose={() => setInterviewModalApp(null)}
        title={`Schedule Interview: ${interviewModalApp?.student?.name}`}
      >
        <form onSubmit={handleScheduleInterviewSubmit} className="space-y-3">
          <Input
            label="Round Name"
            value={interviewForm.roundName}
            onChange={(e) => setInterviewForm({ ...interviewForm, roundName: e.target.value })}
            placeholder="e.g. Technical Round 1"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Interview Date"
              type="date"
              value={interviewForm.date}
              onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
              required
            />
            <Input
              label="Start Time"
              value={interviewForm.startTime}
              onChange={(e) => setInterviewForm({ ...interviewForm, startTime: e.target.value })}
              placeholder="e.g. 10:30 AM"
              required
            />
          </div>

          <Select
            label="Mode"
            value={interviewForm.mode}
            onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value })}
            options={[
              { value: 'offline', label: 'In-Person / On Campus' },
              { value: 'online', label: 'Online Meeting' }
            ]}
          />

          {interviewForm.mode === 'offline' ? (
            <Input
              label="Campus Venue"
              value={interviewForm.venue}
              onChange={(e) => setInterviewForm({ ...interviewForm, venue: e.target.value })}
              placeholder="e.g. Seminar Hall, Block A"
            />
          ) : (
            <Input
              label="Meeting Link URL"
              type="url"
              value={interviewForm.meetingLink}
              onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
              placeholder="https://meet.google.com/xyz"
            />
          )}

          <Input
            label="Interview Panel"
            value={interviewForm.panel}
            onChange={(e) => setInterviewForm({ ...interviewForm, panel: e.target.value })}
            placeholder="e.g. Technical Panel A"
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
              Candidate Instructions
            </label>
            <textarea
              rows={2}
              value={interviewForm.instructions}
              onChange={(e) => setInterviewForm({ ...interviewForm, instructions: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="outline" type="button" onClick={() => setInterviewModalApp(null)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Confirm & Schedule
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
