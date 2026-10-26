import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, SampleBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Spinner } from '../../components/common/Feedback';
import {
  Users,
  Search,
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  Filter
} from 'lucide-react';

export const UserDirectoryPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  // Create Officer Modal State
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
  const [officerForm, setOfficerForm] = useState({ name: '', email: '', phone: '' });
  const [officerSubmitting, setOfficerSubmitting] = useState(false);
  const [officerError, setOfficerError] = useState('');

  // Status Toggle Modal State
  const [selectedUserForStatus, setSelectedUserForStatus] = useState(null);
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await api.getUsers(params);
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleChange = async (userId, targetUserEmail, newRole) => {
    if (userId === currentUser?._id && newRole !== 'admin') {
      alert('Administrators cannot remove their own admin privileges.');
      return;
    }

    if (!window.confirm(`Are you sure you want to change role for ${targetUserEmail} to ${newRole.toUpperCase()}?`)) {
      return;
    }

    try {
      const res = await api.updateUserRole(userId, newRole);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        await fetchUsers();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update user role' });
    }
  };

  const handleConfirmStatusToggle = async () => {
    if (!selectedUserForStatus) return;
    try {
      setStatusSubmitting(true);
      const res = await api.toggleUserStatus(selectedUserForStatus._id, !selectedUserForStatus.isActive);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setSelectedUserForStatus(null);
        await fetchUsers();
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle account status');
    } finally {
      setStatusSubmitting(false);
    }
  };

  const handleCreateOfficerSubmit = async (e) => {
    e.preventDefault();
    setOfficerError('');

    if (!officerForm.name.trim()) {
      setOfficerError('Officer name is required');
      return;
    }

    if (!officerForm.email.trim().toLowerCase().endsWith('@vishnu.edu.in')) {
      setOfficerError('Email must use the institutional @vishnu.edu.in domain');
      return;
    }

    try {
      setOfficerSubmitting(true);
      const res = await api.createOfficerAccount(officerForm);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setIsOfficerModalOpen(false);
        setOfficerForm({ name: '', email: '', phone: '' });
        await fetchUsers();
      }
    } catch (err) {
      setOfficerError(err.message || 'Failed to create officer account');
    } finally {
      setOfficerSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-purple" />
            Institutional User Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage authenticated accounts, role-based privileges, and account activation states
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsOfficerModalOpen(true)}
          className="bg-brand-purple hover:bg-purple-700 text-white self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Placement Officer
        </Button>
      </div>

      {/* Action Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm border flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-200 border-green-200'
              : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, roll number, or branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
              <option value="">All Roles (Students, Officers, Admins)</option>
              <option value="student">Students</option>
              <option value="officer">Placement Officers</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
              <option value="">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="false">Deactivated Only</option>
            </select>
          </div>

          <div className="sm:col-span-1">
            <Button type="submit" variant="secondary" className="w-full text-xs py-2">
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : users.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No matching user accounts found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Try adjusting your search criteria or resetting filters.
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Academic Details</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Role Management</th>
                <th className="py-3 px-4 text-right">Account Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {users.map((item) => {
                const isCurrent = item._id === currentUser?._id;
                const isAdmin = item.role === 'admin';
                const isOfficer = item.role === 'officer';

                return (
                  <tr
                    key={item._id}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                      !item.isActive ? 'opacity-60 bg-slate-50/30' : ''
                    }`}
                  >
                    {/* User Details */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                          <span>{item.name || 'Unnamed User'}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-purple-100 dark:bg-purple-950/60 text-brand-purple px-1.5 py-0.5 rounded font-bold">
                              YOU
                            </span>
                          )}
                          {item.isSample && <SampleBadge />}
                        </div>
                        <p className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {item.email}
                        </p>
                        {item.phone && (
                          <p className="text-slate-400 text-[11px] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {item.phone}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Academic Details (Students) */}
                    <td className="py-3 px-4">
                      {item.role === 'student' ? (
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {item.rollNo || 'Pending Roll'} ({item.branch || 'Branch N/A'})
                          </p>
                          <p className="text-[11px] text-slate-500">
                            CGPA: <strong className="text-brand-orange">{item.cgpa ? item.cgpa.toFixed(2) : 'N/A'}</strong> | Backlogs: {item.activeBacklogs ?? 'N/A'}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Institutional Staff</span>
                      )}
                    </td>

                    {/* Current Role Badge */}
                    <td className="py-3 px-4">
                      <Badge
                        variant={isAdmin ? 'danger' : isOfficer ? 'info' : 'warning'}
                        size="sm"
                      >
                        {item.role.toUpperCase()}
                      </Badge>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <Badge variant={item.isActive ? 'success' : 'neutral'} size="sm">
                        {item.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                      </Badge>
                    </td>

                    {/* Role Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={item.role}
                        disabled={isCurrent}
                        onChange={(e) => handleRoleChange(item._id, item.email, e.target.value)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-purple ${
                          isCurrent ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                        }`}
                        title={isCurrent ? 'You cannot change your own admin role' : 'Change role'}
                      >
                        <option value="student">Student</option>
                        <option value="officer">Placement Officer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>

                    {/* Account Actions (Activate/Deactivate) */}
                    <td className="py-3 px-4 text-right">
                      {isCurrent ? (
                        <span className="text-[11px] text-slate-400 italic">Protected</span>
                      ) : (
                        <Button
                          variant={item.isActive ? 'danger' : 'secondary'}
                          size="sm"
                          onClick={() => setSelectedUserForStatus(item)}
                          className="text-xs"
                        >
                          {item.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Officer Modal */}
      {isOfficerModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsOfficerModalOpen(false)}
          title="Create Placement Officer Account"
        >
          <form onSubmit={handleCreateOfficerSubmit} className="space-y-4">
            <p className="text-xs text-slate-500">
              Create an administrative Placement Officer login for Vishnu Institute of Technology Training & Placement Cell.
            </p>

            {officerError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200">
                {officerError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Manikanta K"
                value={officerForm.name}
                onChange={(e) => setOfficerForm({ ...officerForm, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vishnu Email Address (@vishnu.edu.in) *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. officer.name@vishnu.edu.in"
                value={officerForm.email}
                onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={officerForm.phone}
                onChange={(e) => setOfficerForm({ ...officerForm, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsOfficerModalOpen(false)}
                disabled={officerSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={officerSubmitting}
                className="bg-brand-purple hover:bg-purple-700 text-white"
              >
                {officerSubmitting ? 'Creating...' : 'Create Officer Account'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Status Toggle Modal */}
      {selectedUserForStatus && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedUserForStatus(null)}
          title={selectedUserForStatus.isActive ? 'Deactivate User Account' : 'Activate User Account'}
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
              <p className="font-bold text-slate-800 dark:text-white">
                {selectedUserForStatus.name} ({selectedUserForStatus.email})
              </p>
              <p className="text-slate-500">
                Role: <span className="font-semibold uppercase">{selectedUserForStatus.role}</span>
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              {selectedUserForStatus.isActive
                ? 'Deactivating this user will revoke active login sessions and prevent them from authenticating into the placement portal.'
                : 'Activating this account will restore access and allow the user to log in.'}
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="secondary"
                onClick={() => setSelectedUserForStatus(null)}
                disabled={statusSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant={selectedUserForStatus.isActive ? 'danger' : 'primary'}
                onClick={handleConfirmStatusToggle}
                disabled={statusSubmitting}
                className={!selectedUserForStatus.isActive ? 'bg-brand-green hover:bg-green-600 text-white' : ''}
              >
                {statusSubmitting
                  ? 'Updating...'
                  : selectedUserForStatus.isActive
                  ? 'Confirm Deactivation'
                  : 'Confirm Activation'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
