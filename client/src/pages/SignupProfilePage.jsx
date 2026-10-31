import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';
import { AlertCircle, UserPlus, CheckCircle, Eye, EyeOff } from 'lucide-react';

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
    password: '',
    rollNo: prefill.rollNo || '',
    branch: '',
    phone: '',
    admissionYear: prefill.admissionYear || '',
    graduationYear: prefill.graduationYear || ''
  });

  const [showPassword, setShowPassword] = useState(false);
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
        password: formData.password || 'Vishnu@123',
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#F7F8FA]">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <img
              src="/vishnu-logo.png"
              alt="Vishnu Universal Learning"
              className="h-16 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#252525]">
            Complete Student Profile
          </h1>
          <p className="text-xs text-[#666666]">
            Vishnu Institute of Technology • Confirm academic credentials
          </p>
        </div>

        <Card className="shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-[#E5E7EB] bg-white p-6 sm:p-8 rounded-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
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
              helperText="Verified via official Vishnu college domain"
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

            {/* Set Account Password */}
            <Input
              label="Create Login Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="e.g. Set account password (optional, default: Vishnu@123)"
              value={formData.password}
              onChange={handleChange}
              helperText="You will use this password to sign in"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Roll Number & Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Roll Number"
                name="rollNo"
                placeholder="e.g. 24PA1A05C2"
                value={formData.rollNo}
                onChange={handleChange}
                helperText="Auto-detected from email"
              />

              <Select
                label="Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                options={BRANCH_OPTIONS}
                placeholder="-- Select Branch --"
                required
                helperText="Engineering department"
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
              variant="primary"
              loading={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3"
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
