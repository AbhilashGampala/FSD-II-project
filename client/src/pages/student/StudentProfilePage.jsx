import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Spinner } from '../../components/common/Feedback';
import { SampleBadge } from '../../components/common/Badge';
import {
  User,
  GraduationCap,
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Award
} from 'lucide-react';

const BRANCH_OPTIONS = [
  'CSE',
  'IT',
  'ECE',
  'EEE',
  'MECH',
  'CIVIL',
  'AI&DS',
  'CSE-AIML'
];

export const StudentProfilePage = () => {
  const { setUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [completeness, setCompleteness] = useState({ percentage: 0, isComplete: false, missing: [] });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    branch: '',
    phone: '',
    admissionYear: '',
    graduationYear: '',
    cgpa: '',
    tenthPct: '',
    twelfthPct: '',
    activeBacklogs: 0,
    isSample: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.getProfile();
        if (res.success && res.profile) {
          const p = res.profile;
          setFormData({
            name: p.name || '',
            email: p.email || '',
            rollNo: p.rollNo || '',
            branch: p.branch || '',
            phone: p.phone || '',
            admissionYear: p.admissionYear ?? '',
            graduationYear: p.graduationYear ?? '',
            cgpa: p.cgpa !== null && p.cgpa !== undefined ? String(p.cgpa) : '',
            tenthPct: p.tenthPct !== null && p.tenthPct !== undefined ? String(p.tenthPct) : '',
            twelfthPct: p.twelfthPct !== null && p.twelfthPct !== undefined ? String(p.twelfthPct) : '',
            activeBacklogs: p.activeBacklogs ?? 0,
            isSample: Boolean(p.isSample)
          });
          setCompleteness(res.completeness || { percentage: 0, isComplete: false, missing: [] });
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Front-end validation
    if (formData.cgpa !== '') {
      const num = Number(formData.cgpa);
      if (isNaN(num) || num < 0 || num > 10) {
        setError('CGPA must be a decimal between 0.0 and 10.0');
        return;
      }
    }

    if (formData.tenthPct !== '') {
      const num = Number(formData.tenthPct);
      if (isNaN(num) || num < 0 || num > 100) {
        setError('10th percentage must be between 0 and 100');
        return;
      }
    }

    if (formData.twelfthPct !== '') {
      const num = Number(formData.twelfthPct);
      if (isNaN(num) || num < 0 || num > 100) {
        setError('12th percentage must be between 0 and 100');
        return;
      }
    }

    if (formData.activeBacklogs !== '') {
      const num = Number(formData.activeBacklogs);
      if (isNaN(num) || num < 0) {
        setError('Active backlogs cannot be negative');
        return;
      }
    }

    setSaving(true);
    try {
      const res = await api.updateProfile(formData);
      if (res.success && res.profile) {
        setSuccessMsg('Academic profile updated successfully!');
        setCompleteness(res.completeness);
        setUser(res.profile);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" className="py-20" />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Academic & Placement Profile
          </h1>
          {formData.isSample && <SampleBadge />}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Maintain accurate CGPA and academic credentials. These scores determine placement eligibility.
        </p>
      </div>

      {/* Completeness Bar */}
      <Card className="p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-green" />
            <span>Profile Completeness: {completeness.percentage}%</span>
          </span>
          <span className="text-slate-400 font-medium">
            {completeness.isComplete ? 'All fields verified' : `${completeness.missing?.length} field(s) pending`}
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              completeness.percentage === 100 ? 'bg-brand-green' : 'bg-brand-orange'
            }`}
            style={{ width: `${completeness.percentage}%` }}
          />
        </div>
        {!completeness.isComplete && (
          <p className="text-[11px] text-amber-700 dark:text-amber-400">
            Missing: <span className="font-semibold">{completeness.missing?.join(', ')}</span>
          </p>
        )}
      </Card>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Personal & Department Section */}
        <Card className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            1. Student Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="College Email"
              name="email"
              value={formData.email}
              readOnly
              disabled
              helperText="Verified official college ID"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Roll Number"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              placeholder="e.g. 21PA1A0501"
              required
            />

            <Select
              label="Engineering Branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              options={BRANCH_OPTIONS}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Admission Year"
              type="number"
              name="admissionYear"
              value={formData.admissionYear}
              onChange={handleChange}
              placeholder="2021"
            />

            <Input
              label="Graduation Year"
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              placeholder="2025"
            />

            <Input
              label="Contact Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 9848012345"
            />
          </div>
        </Card>

        {/* Academic Marks & Eligibility Scores */}
        <Card className="space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              2. Academic Scores & Placement Criteria
            </h2>
            <p className="text-[11px] text-slate-400">
              These scores are validated by the server whenever you submit a placement drive application.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Undergraduate CGPA (0 - 10)"
              type="number"
              step="0.01"
              min="0"
              max="10"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              placeholder="e.g. 8.75"
              required
              helperText="Aggregate up to current semester"
            />

            <Input
              label="10th (SSC / CBSE) %"
              type="number"
              step="0.1"
              min="0"
              max="100"
              name="tenthPct"
              value={formData.tenthPct}
              onChange={handleChange}
              placeholder="e.g. 92.5"
              required
              helperText="Standard X board percentage"
            />

            <Input
              label="12th / Diploma %"
              type="number"
              step="0.1"
              min="0"
              max="100"
              name="twelfthPct"
              value={formData.twelfthPct}
              onChange={handleChange}
              placeholder="e.g. 89.0"
              required
              helperText="Intermediate / Polytechnic %"
            />
          </div>

          <div className="max-w-xs">
            <Input
              label="Active Backlogs Count"
              type="number"
              min="0"
              name="activeBacklogs"
              value={formData.activeBacklogs}
              onChange={handleChange}
              required
              helperText="Current uncleared backlogs (0 if none)"
            />
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Academic Profile</span>
          </Button>
        </div>

      </form>

    </div>
  );
};
