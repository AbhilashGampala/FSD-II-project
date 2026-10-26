import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Spinner } from '../../components/common/Feedback';
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Clock,
  User,
  Activity,
  Layers,
  FileText,
  AlertCircle
} from 'lucide-react';

const COMMON_ACTIONS = [
  { label: 'All Actions', value: '' },
  { label: 'User Login', value: 'LOGIN' },
  { label: 'User Logout', value: 'LOGOUT' },
  { label: 'Create Drive', value: 'CREATE_DRIVE' },
  { label: 'Update Drive', value: 'UPDATE_DRIVE' },
  { label: 'Submit Application', value: 'APPLY_DRIVE' },
  { label: 'Withdraw Application', value: 'WITHDRAW_APPLICATION' },
  { label: 'Update Application Status', value: 'UPDATE_APPLICATION_STATUS' },
  { label: 'Bulk Shortlist', value: 'BULK_SHORTLIST' },
  { label: 'Schedule Interview', value: 'SCHEDULE_INTERVIEW' },
  { label: 'Update Interview', value: 'UPDATE_INTERVIEW' },
  { label: 'Create Job Offer', value: 'CREATE_OFFER' },
  { label: 'Change User Role', value: 'CHANGE_USER_ROLE' },
  { label: 'Activate User', value: 'ACTIVATE_USER' },
  { label: 'Deactivate User', value: 'DEACTIVATE_USER' },
  { label: 'Create Officer Account', value: 'CREATE_OFFICER_ACCOUNT' }
];

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('');
  const [selectedDetails, setSelectedDetails] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const params = { limit: 100 };
      if (actionFilter) params.action = actionFilter;
      if (targetTypeFilter) params.targetType = targetTypeFilter;

      const res = await api.getAuditLogs(params);
      if (res.success) {
        setLogs(res.logs || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch audit log entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, targetTypeFilter]);

  const getActionBadgeVariant = (action = '') => {
    if (action.includes('LOGIN') || action.includes('LOGOUT')) return 'neutral';
    if (action.includes('CREATE') || action.includes('SHORTLIST') || action.includes('ACTIVATE')) return 'success';
    if (action.includes('DEACTIVATE') || action.includes('WITHDRAW')) return 'danger';
    if (action.includes('ROLE') || action.includes('INTERVIEW')) return 'info';
    return 'warning';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-purple" />
            Security & Compliance Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Immutable system audit trail tracking administrative actions, status updates, and privilege changes
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          Showing latest <strong>{logs.length}</strong> events
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Filter by Action Type
            </label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
              {COMMON_ACTIONS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Filter by Target Entity
            </label>
            <select
              value={targetTypeFilter}
              onChange={(e) => setTargetTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
              <option value="">All Entities</option>
              <option value="User">User</option>
              <option value="Drive">Drive</option>
              <option value="Application">Application</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Stat">Stat</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-end">
            <Button
              variant="secondary"
              onClick={() => {
                setActionFilter('');
                setTargetTypeFilter('');
              }}
              className="w-full text-xs py-2"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Logs Table */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : logs.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No audit records match the current filters
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            System actions and administrative state modifications will appear here in chronological order.
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Summary</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-[11px]">
              {logs.map((entry) => {
                const actor = entry.actor || {};
                const variant = getActionBadgeVariant(entry.action);

                return (
                  <tr
                    key={entry._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors font-sans"
                  >
                    {/* Timestamp */}
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(entry.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Actor */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {actor.name || 'System / Unregistered'}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {actor.email || 'N/A'}
                        </p>
                        {actor.role && (
                          <Badge variant="neutral" size="sm">
                            {actor.role.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4">
                      <Badge variant={variant} size="sm">
                        {entry.action}
                      </Badge>
                    </td>

                    {/* Target */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5 font-mono text-[11px]">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {entry.targetType}
                        </span>
                        {entry.targetId && (
                          <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            ID: {entry.targetId}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Summary */}
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300 max-w-xs">
                      {entry.details && Object.keys(entry.details).length > 0 ? (
                        <div className="truncate">
                          {entry.details.role ||
                            entry.details.roundName ||
                            entry.details.title ||
                            entry.details.newStatus ||
                            entry.details.status ||
                            entry.details.packageLPA ? (
                            <span>
                              {entry.details.title || entry.details.roundName || ''}
                              {entry.details.role ? ` Role: ${entry.details.role}` : ''}
                              {entry.details.newStatus ? ` -> ${entry.details.newStatus}` : ''}
                              {entry.details.packageLPA ? ` (${entry.details.packageLPA} LPA)` : ''}
                            </span>
                          ) : (
                            JSON.stringify(entry.details)
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No extra metadata</span>
                      )}
                    </td>

                    {/* Details Action */}
                    <td className="py-3 px-4 text-right">
                      {entry.details && Object.keys(entry.details).length > 0 ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedDetails(entry)}
                          className="text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View
                        </Button>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* JSON Details Modal */}
      {selectedDetails && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDetails(null)}
          title={`Audit Log Details: ${selectedDetails.action}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Actor</p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {selectedDetails.actor?.name || 'Unknown'} ({selectedDetails.actor?.email})
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Timestamp</p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {new Date(selectedDetails.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Target Type</p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {selectedDetails.targetType}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Target ID</p>
                <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  {selectedDetails.targetId || 'N/A'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-purple" />
                Raw Event Payload:
              </p>
              <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 max-h-64">
                {JSON.stringify(selectedDetails.details, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="secondary" onClick={() => setSelectedDetails(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
