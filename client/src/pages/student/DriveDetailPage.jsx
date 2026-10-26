import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { checkEligibility } from '../../utils/eligibility';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, SampleBadge, StatusPill } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Feedback';
import {
  ArrowLeft,
  Building2,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

export const DriveDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drive, setDrive] = useState(null);
  const [student, setStudent] = useState(null);
  const [existingApp, setExistingApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchDriveAndProfile = async () => {
      try {
        setLoading(true);
        setError('');

        const [driveRes, profileRes, appsRes] = await Promise.all([
          api.getDrive(id),
          api.getProfile(),
          api.getMyApplications()
        ]);

        if (driveRes.success) setDrive(driveRes.drive);
        if (profileRes.success) setStudent(profileRes.profile);
        if (appsRes.success) {
          const matchingApp = appsRes.applications.find(
            (a) => (a.drive?._id || a.drive) === id
          );
          setExistingApp(matchingApp || null);
        }
      } catch (err) {
        setError(err.message || 'Failed to load drive details');
      } finally {
        setLoading(false);
      }
    };

    fetchDriveAndProfile();
  }, [id]);

  const handleApply = async () => {
    setError('');
    setSuccessMsg('');
    setApplying(true);

    try {
      const res = await api.applyForDrive(id);
      if (res.success) {
        setSuccessMsg('Your application was submitted successfully!');
        setExistingApp(res.application);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" className="py-20" />;
  }

  if (!drive) {
    return (
      <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs">
        Drive not found or unavailable.
      </div>
    );
  }

  const eligibility = checkEligibility(student, drive.eligibility);
  const isDeadlinePassed = new Date() > new Date(drive.deadline);
  const daysLeft = Math.ceil((new Date(drive.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Back button */}
      <div>
        <Link
          to="/student/drives"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Drives</span>
        </Link>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hero Drive Banner */}
      <Card className="p-6 space-y-4 shadow-md border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {drive.company?.name}
              </span>
              <Badge variant="default" size="sm">
                {drive.driveType}
              </Badge>
              {drive.isSample && <SampleBadge />}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {drive.title}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Designated Job Role: <span className="text-slate-800 dark:text-slate-200 font-bold">{drive.jobRole}</span>
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-slate-400 block uppercase tracking-wider">CTC Compensation</span>
            <span className="text-2xl font-extrabold text-brand-orange">
              ₹ {drive.packageLPA} LPA
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Locations</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {drive.locations?.join(', ') || 'Bhimavaram'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Application Deadline</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {new Date(drive.deadline).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Drive Event Date</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {new Date(drive.driveDate).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Time Remaining</span>
            <span className={`font-bold ${daysLeft <= 3 ? 'text-red-500' : 'text-brand-orange'}`}>
              {daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline Passed'}
            </span>
          </div>
        </div>
      </Card>

      {/* Two Column Layout: Eligibility Breakdown & Job Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Description & Rounds */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Job Description Card */}
          <Card className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
              Role Overview & Responsibilities
            </h2>
            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {drive.description || 'No detailed job description provided.'}
            </div>
          </Card>

          {/* Hiring Evaluation Rounds */}
          <Card className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
              Selection Rounds & Evaluation Stages
            </h2>
            <div className="space-y-2">
              {drive.rounds?.map((round, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="w-6 h-6 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span>{round}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Company Background Card */}
          {drive.company && (
            <Card className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                About {drive.company.name}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {drive.company.description || 'Corporate recruitment partner at Vishnu Institute of Technology.'}
              </p>
              {drive.company.website && (
                <a
                  href={drive.company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-brand-purple hover:underline font-semibold"
                >
                  <span>Visit Company Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </Card>
          )}

        </div>

        {/* Right 1 Col: Interactive Eligibility Breakdown & Application Action */}
        <div className="space-y-6">
          
          {/* Eligibility Breakdown Card */}
          <Card className="space-y-4 border-l-4 border-l-brand-orange">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Eligibility Breakdown
              </h2>
              <p className="text-[11px] text-slate-500">
                Live verification of your profile vs company criteria.
              </p>
            </div>

            <div className="space-y-2.5">
              {eligibility.criteria?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px]">
                      {item.rule}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Req: {item.required} • Yours: <strong className="text-slate-700 dark:text-slate-300">{item.actual}</strong>
                    </span>
                  </div>

                  {item.passed ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Pass</span>
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold flex items-center gap-1 text-xs">
                      <XCircle className="w-4 h-4" />
                      <span>Fail</span>
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Overall Eligibility Verdict */}
            <div className="pt-2">
              {eligibility.eligible ? (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>You meet all academic criteria!</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Ineligible to Apply</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    {eligibility.firstFailingReason || 'Does not satisfy required criteria.'}
                  </p>
                </div>
              )}
            </div>

            {/* CTA Application Button */}
            <div className="pt-2">
              {existingApp ? (
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Application Submitted</span>
                  </div>
                  <StatusPill status={existingApp.status} />
                  <div className="pt-1">
                    <Link to="/student/applications" className="text-xs text-brand-orange hover:underline font-semibold block">
                      Track Application Status →
                    </Link>
                  </div>
                </div>
              ) : isDeadlinePassed ? (
                <Button disabled variant="outline" className="w-full">
                  Applications Closed
                </Button>
              ) : !eligibility.eligible ? (
                <Button
                  disabled
                  variant="outline"
                  className="w-full text-xs text-red-600 dark:text-red-400 opacity-60 cursor-not-allowed"
                >
                  Blocked: Criteria Not Met
                </Button>
              ) : (
                <Button
                  variant="primary"
                  loading={applying}
                  onClick={handleApply}
                  className="w-full gap-2 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Application Now</span>
                </Button>
              )}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};
