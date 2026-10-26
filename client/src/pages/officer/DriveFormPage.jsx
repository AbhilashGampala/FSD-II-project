import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Spinner } from '../../components/common/Feedback';
import { ArrowLeft, Save, Send, AlertCircle } from 'lucide-react';

const BRANCH_LIST = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI&DS', 'CSE-AIML'];

export const DriveFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    company: '',
    title: '',
    jobRole: '',
    driveType: 'on-campus',
    packageLPA: '',
    locations: 'Bhimavaram, Hyderabad',
    rounds: 'Online Aptitude Test, Technical Interview, HR Interview',
    description: '',
    deadline: '',
    driveDate: '',
    status: 'draft',
    // Eligibility
    branches: [],
    minCgpa: '7.0',
    min10thPct: '60',
    min12thPct: '60',
    maxActiveBacklogs: '0',
    graduationYear: '2025'
  });

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        // Load companies for the dropdown
        const compRes = await api.getCompanies();
        if (compRes.success) {
          setCompanies(compRes.companies);
        }

        if (isEditing) {
          const driveRes = await api.getDrive(id);
          if (driveRes.success && driveRes.drive) {
            const d = driveRes.drive;
            setFormData({
              company: d.company?._id || d.company,
              title: d.title,
              jobRole: d.jobRole,
              driveType: d.driveType,
              packageLPA: d.packageLPA,
              locations: Array.isArray(d.locations) ? d.locations.join(', ') : d.locations,
              rounds: Array.isArray(d.rounds) ? d.rounds.join(', ') : d.rounds,
              description: d.description || '',
              deadline: d.deadline ? new Date(d.deadline).toISOString().substring(0, 10) : '',
              driveDate: d.driveDate ? new Date(d.driveDate).toISOString().substring(0, 10) : '',
              status: d.status,
              branches: d.eligibility?.branches || [],
              minCgpa: d.eligibility?.minCgpa ?? '0',
              min10thPct: d.eligibility?.min10thPct ?? '0',
              min12thPct: d.eligibility?.min12thPct ?? '0',
              maxActiveBacklogs: d.eligibility?.maxActiveBacklogs ?? '0',
              graduationYear: d.eligibility?.graduationYear || ''
            });
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to initialize form');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, isEditing]);

  const handleBranchToggle = (branch) => {
    setFormData((prev) => {
      const exists = prev.branches.includes(branch);
      if (exists) {
        return { ...prev, branches: prev.branches.filter((b) => b !== branch) };
      } else {
        return { ...prev, branches: [...prev.branches, branch] };
      }
    });
  };

  const handleSelectAllBranches = () => {
    setFormData((prev) => ({
      ...prev,
      branches: prev.branches.length === BRANCH_LIST.length ? [] : [...BRANCH_LIST]
    }));
  };

  const handleSubmit = async (targetStatus) => {
    setError('');

    if (!formData.company) {
      setError('Please select a hiring company');
      return;
    }
    if (!formData.title.trim()) {
      setError('Please provide a drive title');
      return;
    }
    if (!formData.jobRole.trim()) {
      setError('Please specify the job role');
      return;
    }
    if (!formData.packageLPA || Number(formData.packageLPA) <= 0) {
      setError('Please enter a valid package in LPA');
      return;
    }
    if (!formData.deadline) {
      setError('Please select an application deadline');
      return;
    }
    if (!formData.driveDate) {
      setError('Please select a drive event date');
      return;
    }

    if (new Date(formData.deadline) > new Date(formData.driveDate)) {
      setError('Application deadline cannot be after the drive event date');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        company: formData.company,
        title: formData.title.trim(),
        jobRole: formData.jobRole.trim(),
        driveType: formData.driveType,
        packageLPA: Number(formData.packageLPA),
        locations: formData.locations.split(',').map((s) => s.trim()).filter(Boolean),
        rounds: formData.rounds.split(',').map((s) => s.trim()).filter(Boolean),
        description: formData.description.trim(),
        deadline: new Date(formData.deadline),
        driveDate: new Date(formData.driveDate),
        status: targetStatus || formData.status,
        eligibility: {
          branches: formData.branches,
          minCgpa: Number(formData.minCgpa) || 0,
          min10thPct: Number(formData.min10thPct) || 0,
          min12thPct: Number(formData.min12thPct) || 0,
          maxActiveBacklogs: Number(formData.maxActiveBacklogs) || 0,
          graduationYear: formData.graduationYear ? Number(formData.graduationYear) : null
        }
      };

      if (isEditing) {
        await api.updateDrive(id, payload);
      } else {
        await api.createDrive(payload);
      }

      navigate('/officer/drives');
    } catch (err) {
      setError(err.message || 'Failed to save placement drive');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" className="py-20" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between">
        <Link
          to="/officer/drives"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Drives</span>
        </Link>
        <span className="text-xs text-slate-400">
          {isEditing ? 'Editing Drive' : 'New Drive Setup'}
        </span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {isEditing ? 'Edit Placement Drive' : 'Create New Placement Drive'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure hiring role, CTC packages, application dates, and academic eligibility criteria.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Cards */}
      <div className="space-y-6">
        
        {/* Section 1: Job & Company Details */}
        <Card className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            1. Role & Organization Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Hiring Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              options={companies.map((c) => ({ value: c._id, label: `${c.name} (${c.industry})` }))}
              placeholder="-- Select Company --"
              required
            />

            <Select
              label="Drive Type"
              value={formData.driveType}
              onChange={(e) => setFormData({ ...formData, driveType: e.target.value })}
              options={[
                { value: 'on-campus', label: 'On-Campus (Exclusive for VIT)' },
                { value: 'pool', label: 'Pool Campus (Regional Hub)' },
                { value: 'off-campus', label: 'Off-Campus Drive' }
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Drive Title"
              placeholder="e.g. Graduate Software Trainee 2025"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Input
              label="Designated Job Role"
              placeholder="e.g. Software Engineer / Data Analyst"
              value={formData.jobRole}
              onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Annual Package (LPA in ₹)"
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g. 8.5"
              value={formData.packageLPA}
              onChange={(e) => setFormData({ ...formData, packageLPA: e.target.value })}
              required
              helperText="Cost to Company (CTC) in Lakhs per Annum"
            />

            <Input
              label="Job Locations"
              placeholder="Bhimavaram, Hyderabad, Bangalore"
              value={formData.locations}
              onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
              helperText="Comma separated cities"
            />
          </div>

          <Input
            label="Evaluation Rounds"
            placeholder="Online Test, Technical Round, HR Round"
            value={formData.rounds}
            onChange={(e) => setFormData({ ...formData, rounds: e.target.value })}
            helperText="Comma separated names of interview rounds"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
              Job Description & Responsibilities
            </label>
            <textarea
              rows={4}
              placeholder="Outline project duties, tech stack, bond period, or special instructions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
        </Card>

        {/* Section 2: Dates Schedule */}
        <Card className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            2. Schedule & Deadlines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student Application Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
              helperText="Applications close at 11:59 PM on this date"
            />

            <Input
              label="Drive Assessment / Event Date"
              type="date"
              value={formData.driveDate}
              onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
              required
              helperText="Date when written rounds or panels commence"
            />
          </div>
        </Card>

        {/* Section 3: Student Eligibility Criteria (Shared Engine) */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                3. Academic Eligibility Criteria
              </h2>
              <p className="text-[11px] text-slate-500">
                Enforced by server API and checked dynamically on student drive cards.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSelectAllBranches}
              className="text-xs text-brand-orange hover:underline font-semibold"
            >
              {formData.branches.length === BRANCH_LIST.length ? 'Clear Branches' : 'Select All Branches'}
            </button>
          </div>

          {/* Branch Checkboxes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
              Eligible Engineering Branches {formData.branches.length === 0 && <span className="text-brand-green font-normal">(Open to all branches)</span>}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {BRANCH_LIST.map((b) => {
                const selected = formData.branches.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleBranchToggle(b)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                      selected
                        ? 'border-brand-orange bg-orange-50 dark:bg-orange-950/40 text-brand-orange'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>{b}</span>
                    {selected && <span className="text-xs font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Input
              label="Minimum CGPA (0-10)"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={formData.minCgpa}
              onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
              helperText="0 = No CGPA cutoff"
            />

            <Input
              label="Min 10th Percentage"
              type="number"
              min="0"
              max="100"
              value={formData.min10thPct}
              onChange={(e) => setFormData({ ...formData, min10thPct: e.target.value })}
              helperText="SSC/CBSE 10th minimum %"
            />

            <Input
              label="Min 12th/Inter Percentage"
              type="number"
              min="0"
              max="100"
              value={formData.min12thPct}
              onChange={(e) => setFormData({ ...formData, min12thPct: e.target.value })}
              helperText="Intermediate/Diploma minimum %"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Max Active Backlogs Allowed"
              type="number"
              min="0"
              value={formData.maxActiveBacklogs}
              onChange={(e) => setFormData({ ...formData, maxActiveBacklogs: e.target.value })}
              helperText="0 = Strict no backlogs policy"
            />

            <Input
              label="Target Graduation Year"
              type="number"
              placeholder="e.g. 2025"
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
              helperText="Batch passing year (empty = any year)"
            />
          </div>
        </Card>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Link to="/officer/drives" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>

          <Button
            type="button"
            variant="outline"
            loading={saving}
            onClick={() => handleSubmit('draft')}
            className="w-full sm:w-auto gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save as Draft</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            loading={saving}
            onClick={() => handleSubmit('published')}
            className="w-full sm:w-auto gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{isEditing ? 'Update & Publish' : 'Publish Drive Live'}</span>
          </Button>
        </div>

      </div>

    </div>
  );
};
