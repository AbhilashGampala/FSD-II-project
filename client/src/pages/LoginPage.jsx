import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Mail, KeyRound, ShieldAlert, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { user, loginUser, demoMode } = useAuth();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
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

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setInfoMessage('');

    const trimmedEmail = email.toLowerCase().trim();
    if (!trimmedEmail) {
      setError('Please enter your college email address');
      return;
    }

    if (!trimmedEmail.endsWith('@vishnu.edu.in')) {
      setError('Only official Vishnu Institute of Technology emails (@vishnu.edu.in) are permitted');
      return;
    }

    setLoading(true);
    try {
      const res = await api.requestOtp(trimmedEmail);
      setInfoMessage(res.message || 'OTP sent successfully!');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setInfoMessage('');

    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP code');
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyOtp(email.toLowerCase().trim(), otp);

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
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Auto-login Helper
  const handleQuickDemoLogin = async (demoEmail) => {
    setError('');
    setInfoMessage('');
    setEmail(demoEmail);
    setOtp('123456');
    setLoading(true);

    try {
      // 1. Request OTP
      await api.requestOtp(demoEmail);
      // 2. Verify with standard demo OTP '123456'
      const verifyRes = await api.verifyOtp(demoEmail, '123456');
      if (verifyRes.isNewUser) {
        navigate('/signup-profile', {
          state: {
            email: verifyRes.email,
            prefill: verifyRes.prefill
          }
        });
      } else {
        loginUser(verifyRes.user);
        if (verifyRes.user.role === 'admin') navigate('/admin');
        else if (verifyRes.user.role === 'officer') navigate('/officer');
        else navigate('/student');
      }
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6">
        
        {/* College & Project Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-orange via-brand-purple to-brand-green items-center justify-center text-3xl shadow-md text-white mb-1">
            🎓
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            VIT Campus Placement Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Vishnu Institute of Technology (VIT), Bhimavaram
          </p>
        </div>

        {/* Demo Mode Banner */}
        {demoMode && (
          <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-brand-orange/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
            <span className="text-brand-orange font-bold text-base leading-none mt-0.5">ℹ️</span>
            <div>
              <p className="font-semibold text-brand-orange">Demo OTP Mode Active</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                Use OTP <span className="font-mono font-bold text-slate-900 dark:text-white bg-orange-200 dark:bg-orange-900/60 px-1.5 py-0.5 rounded">123456</span> for any login, or use the quick buttons below.
              </p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <Card className="shadow-lg border-slate-200 dark:border-slate-800">
          
          {/* Notification Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: Enter Email */
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  College Single Sign-On
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter your official <span className="font-mono">@vishnu.edu.in</span> email
                </p>
              </div>

              <Input
                label="College Email"
                type="email"
                placeholder="rollnumber@vishnu.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                helperText="Example: 24pa1a05c2@vishnu.edu.in"
              />

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full flex items-center gap-2"
              >
                <span>Request OTP</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          ) : (
            /* STEP 2: Enter OTP */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Enter Verification Code
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-brand-orange hover:underline font-medium"
                  >
                    Change Email
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verification OTP sent for <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>
                </p>
              </div>

              <Input
                label="6-Digit OTP"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                helperText={demoMode ? "Demo code: 123456" : "Check server terminal console for generated code"}
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/3"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="w-2/3"
                >
                  Verify & Sign In
                </Button>
              </div>
            </form>
          )}

          {/* Quick Demo Login Buttons (Visible in DEMO_MODE) */}
          {demoMode && (
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">
                Fast Demo Login (1-Click)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('demo.student01@vishnu.edu.in')}
                  disabled={loading}
                  className="p-2 rounded-xl text-xs font-medium border border-sky-200 dark:border-sky-900 bg-sky-50/60 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 hover:bg-sky-100 transition-colors text-center"
                >
                  👤 Student
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('manikanta@vishnu.edu.in')}
                  disabled={loading}
                  className="p-2 rounded-xl text-xs font-medium border border-purple-200 dark:border-purple-900 bg-purple-50/60 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors text-center"
                >
                  👔 Officer
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('24pa1a0567@vishnu.edu.in')}
                  disabled={loading}
                  className="p-2 rounded-xl text-xs font-medium border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors text-center"
                >
                  🛡️ Admin
                </button>
              </div>
            </div>
          )}

        </Card>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Demo project. Data marked 'Sample data' is fictional.
        </p>

      </div>
    </div>
  );
};
