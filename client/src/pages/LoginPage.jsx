import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  GraduationCap
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { user, loginUser, demoMode } = useAuth();

  // Mode: 'password' (standard credentials) or 'otp' (college one-time password)
  const [authMethod, setAuthMethod] = useState('password');

  // Password Login Fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Login Fields
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState(1); // 1: Email, 2: OTP

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // If already logged in, redirect to appropriate role portal
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'officer') navigate('/officer');
      else navigate('/student');
    }
  }, [user, navigate]);

  // Handle Password-based Login
  const handlePasswordLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setInfoMessage('');

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setError('Please enter your college email address or roll number.');
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(cleanIdentifier, password);
      if (res.success && res.user) {
        loginUser(res.user);
        if (res.user.role === 'admin') navigate('/admin');
        else if (res.user.role === 'officer') navigate('/officer');
        else navigate('/student');
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setInfoMessage('');

    const trimmedEmail = otpEmail.toLowerCase().trim();
    if (!trimmedEmail) {
      setError('Please enter your college email address.');
      return;
    }

    if (!trimmedEmail.endsWith('@vishnu.edu.in')) {
      setError('Only official Vishnu Institute of Technology emails (@vishnu.edu.in) are permitted.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.requestOtp(trimmedEmail);
      setInfoMessage(res.message || 'OTP sent successfully! Enter code below.');
      setOtpStep(2);
    } catch (err) {
      setError(err.message || 'Failed to request OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setInfoMessage('');

    const cleanOtp = otpCode.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyOtp(otpEmail.toLowerCase().trim(), cleanOtp);

      if (res.isNewUser) {
        // Redirect to first-time student profile setup
        navigate('/signup-profile', {
          state: {
            email: res.email,
            prefill: res.prefill
          }
        });
      } else {
        loginUser(res.user);
        if (res.user.role === 'admin') navigate('/admin');
        else if (res.user.role === 'officer') navigate('/officer');
        else navigate('/student');
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Login Helper
  const handleQuickDemoLogin = async (demoEmail, demoRole) => {
    setError('');
    setInfoMessage('');
    setLoading(true);

    try {
      // First attempt direct password login with default credential
      try {
        const res = await api.login(demoEmail, 'Vishnu@123');
        if (res.success && res.user) {
          loginUser(res.user);
          if (res.user.role === 'admin') navigate('/admin');
          else if (res.user.role === 'officer') navigate('/officer');
          else navigate('/student');
          return;
        }
      } catch (pwErr) {
        // Fallback to demo OTP if needed
        await api.requestOtp(demoEmail);
        const verifyRes = await api.verifyOtp(demoEmail, '123456');
        if (verifyRes.user) {
          loginUser(verifyRes.user);
          if (verifyRes.user.role === 'admin') navigate('/admin');
          else if (verifyRes.user.role === 'officer') navigate('/officer');
          else navigate('/student');
          return;
        }
      }
    } catch (err) {
      setError(err.message || `Quick login failed for ${demoRole}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#F7F8FA]">
      <div className="w-full max-w-md space-y-5">
        
        {/* Vishnu Universal Learning Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img
              src="/vishnu-logo.png"
              alt="Vishnu Universal Learning"
              className="h-16 sm:h-20 w-auto object-contain drop-shadow-xs"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback emblem if logo file is unavailable */}
            <div className="hidden w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E58A1F] via-[#95058A] to-[#94BC36] items-center justify-center text-3xl shadow-sm text-white">
              🎓
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#252525]">
              Campus Placement Tracker
            </h1>
            <p className="text-xs text-[#666666] font-medium mt-0.5">
              Vishnu Institute of Technology (VIT), Bhimavaram
            </p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-[#E5E7EB] bg-white p-6 sm:p-8 rounded-2xl">
          
          {/* Notification Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="mb-4 p-3 rounded-xl bg-[#94BC36]/15 border border-[#94BC36]/30 text-xs text-[#547214] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#94BC36]" />
              <span className="leading-relaxed">{infoMessage}</span>
            </div>
          )}

          {/* Authentication Method Selector */}
          <div className="flex rounded-xl bg-[#F7F8FA] p-1 border border-[#E5E7EB] mb-5">
            <button
              type="button"
              onClick={() => { setAuthMethod('password'); setError(''); setInfoMessage(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                authMethod === 'password'
                  ? 'bg-white text-[#252525] shadow-xs'
                  : 'text-[#666666] hover:text-[#252525]'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('otp'); setError(''); setInfoMessage(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
                authMethod === 'otp'
                  ? 'bg-white text-[#252525] shadow-xs'
                  : 'text-[#666666] hover:text-[#252525]'
              }`}
            >
              College OTP Login
            </button>
          </div>

          {/* 1. PASSWORD-BASED LOGIN FORM */}
          {authMethod === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <Input
                label="College Email or Roll Number"
                type="text"
                placeholder="e.g. 24pa1a0567@vishnu.edu.in or 24PA1A0567"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                disabled={loading}
                helperText="Accepted format: Roll No or @vishnu.edu.in email"
              />

              <Input
                label="Account Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                helperText="Seeded default password: Vishnu@123"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold shadow-sm"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* 2. OTP-BASED LOGIN FORM */}
          {authMethod === 'otp' && (
            <div>
              {otpStep === 1 ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <Input
                    label="Official College Email"
                    type="email"
                    placeholder="rollnumber@vishnu.edu.in"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    required
                    disabled={loading}
                    helperText="Example: 24pa1a0567@vishnu.edu.in"
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold shadow-sm"
                    >
                      <span>Request 6-Digit OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#666666]">
                      Sent to: <span className="font-bold text-[#252525]">{otpEmail}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => { setOtpStep(1); setError(''); }}
                      className="text-xs text-[#E58A1F] hover:underline font-semibold"
                    >
                      Change Email
                    </button>
                  </div>

                  <Input
                    label="Enter 6-Digit OTP"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    disabled={loading}
                    helperText="Demo mode OTP: 123456"
                  />

                  <div className="flex gap-2.5 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOtpStep(1)}
                      className="w-1/3"
                      disabled={loading}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                      disabled={loading}
                      className="w-2/3"
                    >
                      Verify & Sign In
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Quick Demo 1-Click Login Shortcuts */}
          <div className="mt-6 pt-5 border-t border-[#E5E7EB] space-y-2.5">
            <p className="text-[11px] font-bold text-[#666666] uppercase tracking-wider text-center">
              Quick Test Login (1-Click)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('demo.student01@vishnu.edu.in', 'Student')}
                disabled={loading}
                className="p-2.5 rounded-xl text-xs font-semibold border border-[#E5E7EB] bg-white hover:border-[#E58A1F] hover:bg-[#E58A1F]/5 text-[#252525] transition-all text-center shadow-2xs"
                title="Login as sample student"
              >
                👤 Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('manikanta@vishnu.edu.in', 'Officer')}
                disabled={loading}
                className="p-2.5 rounded-xl text-xs font-semibold border border-[#E5E7EB] bg-white hover:border-[#95058A] hover:bg-[#95058A]/5 text-[#252525] transition-all text-center shadow-2xs"
                title="Login as placement officer"
              >
                👔 Officer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('24pa1a0567@vishnu.edu.in', 'Admin')}
                disabled={loading}
                className="p-2.5 rounded-xl text-xs font-semibold border border-[#E5E7EB] bg-white hover:border-rose-400 hover:bg-rose-50 text-[#252525] transition-all text-center shadow-2xs"
                title="Login as system administrator"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

        </Card>

        {/* Footer info */}
        <div className="text-center text-xs text-[#666666] space-y-1">
          <p>
            Vishnu Universal Learning • Training & Placement Cell
          </p>
          <p className="text-[11px] text-slate-400">
            For access assistance, contact placement coordinator at admin@vishnu.edu.in
          </p>
        </div>

      </div>
    </div>
  );
};
