import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { VerifiedBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Spinner } from '../../components/common/Feedback';
import {
  BarChart3,
  Edit2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';

export const PlacementStatsPage = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit Modal State
  const [editingStat, setEditingStat] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    label: '',
    value: '',
    year: '2024',
    sourceUrl: '',
    sourceNote: '',
    verified: false
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      setError(err.message || 'Failed to load placement stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenEdit = (stat) => {
    setEditingStat(stat);
    setFormData({
      label: stat.label,
      value: stat.value || '',
      year: stat.year || '2024',
      sourceUrl: stat.sourceUrl || '',
      sourceNote: stat.sourceNote || '',
      verified: Boolean(stat.verified)
    });
    setFormError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Strict Data Honesty rule: verified requires sourceUrl
    if (formData.verified && (!formData.sourceUrl || !formData.sourceUrl.trim())) {
      setFormError('Data Honesty Rule: A statistic cannot be marked as verified without a valid published source URL.');
      return;
    }

    setFormLoading(true);
    try {
      await api.updateStat(editingStat._id, formData);
      setSuccessMsg(`Statistic '${formData.label}' updated successfully.`);
      setEditingStat(null);
      fetchStats();
    } catch (err) {
      setFormError(err.message || 'Failed to update statistic');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Placement Statistics Settings</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage institutional placement metrics displayed to students, accredited agencies, and public visitors.
        </p>
      </div>

      {/* Data Honesty Policy Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
        <Info className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Institutional Data Honesty Policy</p>
          <p className="leading-relaxed">
            Per Vishnu Institute guidelines, no placement statistic may be marked as <strong>Verified</strong> unless backed by a published official URL (e.g., published annual NIRF report or certified placement cell report). Empty figures will display as <em>Unverified</em>.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200">
          {error}
        </div>
      )}

      {/* Stats Table */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((item) => (
            <Card key={item._id} className="flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.label}
                  </h3>
                  <VerifiedBadge
                    verified={item.verified}
                    sourceUrl={item.sourceUrl}
                    year={item.year}
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Recorded Value</span>
                  <div className="text-2xl font-bold text-brand-orange mt-0.5">
                    {item.value ? item.value : <span className="text-slate-400 text-sm italic font-normal">Pending official report</span>}
                  </div>
                  <span className="text-[11px] text-slate-400">Reporting Year: {item.year || 2024}</span>
                </div>

                <div className="text-xs space-y-1 text-slate-500 dark:text-slate-400">
                  <p>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Note:</span> {item.sourceNote || 'Awaiting official report'}
                  </p>
                  {item.sourceUrl ? (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-brand-purple hover:underline font-semibold"
                    >
                      <span>Published Source URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">No official source link attached</span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEdit(item)}
                  className="gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Update Figure</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Stat Modal */}
      <Modal
        isOpen={Boolean(editingStat)}
        onClose={() => setEditingStat(null)}
        title={`Update Statistic: ${editingStat?.label}`}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <Input
            label="Metric Label"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Official Value"
              placeholder="e.g. 44.0 LPA or 92%"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              helperText="Leave blank if awaiting official confirmation"
            />
            <Input
              label="Academic Year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              required
            />
          </div>

          <Input
            label="Source URL (Required for Verified Status)"
            type="url"
            placeholder="https://vishnu.edu.in/placements/report-2024.pdf"
            value={formData.sourceUrl}
            onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
            helperText="Link to published report or official circular"
          />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
              Citation / Source Note
            </label>
            <textarea
              rows={2}
              value={formData.sourceNote}
              onChange={(e) => setFormData({ ...formData, sourceNote: e.target.value })}
              placeholder="e.g. Verified from Controller of Examinations Placement Annual Audit"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          {/* Verified Toggle */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="w-4 h-4 rounded text-brand-green focus:ring-brand-green"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Mark as Verified Official Statistic
              </span>
            </label>
            <p className="text-[11px] text-slate-400 pl-6">
              Requires a valid, accessible Source URL. Unchecked metrics will display an Unverified badge.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="outline" type="button" onClick={() => setEditingStat(null)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit" loading={formLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
