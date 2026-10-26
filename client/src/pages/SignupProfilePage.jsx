import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';
import { ShieldAlert, UserPlus, CheckCircle } from 'lucide-react';

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

export const SignupProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const passedEmail = location.state?.email || '';
  const prefill = location.state?.prefill || {};

  const [formData, setFormData] = useState({
    email: passedEmail,
    name: '',
    rollNo: prefill.rollNo || '',
    branch: '',
    phone: '',
    admissionYear: prefill.admissionYear || '',
    graduationYear: prefill.graduationYear || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If email was not passed (e.g. direct visit), redirect to login
  React.useEffect(() => {
    if (!passedEmail) {
      navigate('/login');
    }
  }, [passedEmail, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!formData.branch) {
      setError('Please select your engineering branch');
      return;
    }

    setLoading(true);
    try {
      const res = await api.signupProfile({
        email: formData.email,
        name: formData.name,
        rollNo: formData.rollNo,
        branch: formData.branch,
        phone: formData.phone,
        admissionYear: formData.admissionYear ? Number(formData.admissionYear) : null,
        graduationYear: formData.graduationYear ? Number(formData.graduationYear) : null
      });

      if (res.success && res.user) {
        loginUser(res.user);
        navigate('/student');
      }
    } catch (err) {
      setError(err.message || 'Failed to complete profile registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex w-12 h-12 rounded-xl bg-brand-green/20 text-brand-green items-center justify-center mb-1">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Complete Student Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Welcome to VIT Placement Tracker. Please verify and confirm your academic details.
          </p>
        </div>

        <Card className="shadow-lg border-slate-200 dark:border-slate-800">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* College Email (Read-Only) */}
            <Input
              label="College Email"
              name="email"
              value={formData.email}
              readOnly
              disabled
              helperText="Verified via OTP authentication"
            />

            {/* Full Name */}
            <Input
              label="Full Name"
              name="name"
              placeholder="e.g. Abhilash Gampala"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Roll Number (Prefilled) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Roll Number"
                name="rollNo"
                placeholder="e.g. 24PA1A05C2"
                value={formData.rollNo}
                onChange={handleChange}
                helperText="Auto-detected from email prefix"
              />

              {/* Branch Select */}
              <Select
                label="Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                options={BRANCH_OPTIONS}
                placeholder="-- Select Branch --"
                required
                helperText="Confirm your department"
              />
            </div>

            {/* Admission & Graduation Years */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Admission Year"
                type="number"
                name="admissionYear"
                placeholder="2024"
                value={formData.admissionYear}
                onChange={handleChange}
              />
              <Input
                label="Graduation Year"
                type="number"
                name="graduationYear"
                placeholder="2028"
                value={formData.graduationYear}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <Input
              label="Contact Phone"
              type="tel"
              name="phone"
              placeholder="e.g. 9848012345"
              value={formData.phone}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="secondary"
              loading={loading}
              className="w-full mt-4 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm & Enter Student Portal</span>
            </Button>
          </form>
        </Card>

      </div>
    </div>
  );
};
