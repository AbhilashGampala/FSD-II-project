import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'default', 'success', 'warning', 'danger', 'info', 'purple'
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold'
  };

  const variantClasses = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800',
    info: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800',
    purple: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
  };

  return (
    <span className={`inline-flex items-center rounded-md ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const SampleBadge = ({ className = '' }) => {
  return (
    <span
      title="This is fictional demonstration data for testing"
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      Sample data
    </span>
  );
};

export const VerifiedBadge = ({ verified = false, sourceUrl, year, className = '' }) => {
  if (verified && sourceUrl) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        Verified {year ? `(${year})` : ''}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
      Unverified, add from official report
    </span>
  );
};

export const StatusPill = ({ status, className = '' }) => {
  const map = {
    applied: { text: 'Applied', color: 'info' },
    shortlisted: { text: 'Shortlisted', color: 'purple' },
    aptitude: { text: 'Aptitude Round', color: 'warning' },
    technical: { text: 'Technical Round', color: 'warning' },
    hr: { text: 'HR Round', color: 'warning' },
    selected: { text: 'Selected', color: 'success' },
    rejected: { text: 'Rejected', color: 'danger' },
    withdrawn: { text: 'Withdrawn', color: 'default' },
    draft: { text: 'Draft', color: 'default' },
    published: { text: 'Published', color: 'success' },
    closed: { text: 'Closed', color: 'danger' },
    pending: { text: 'Pending', color: 'warning' },
    accepted: { text: 'Accepted', color: 'success' },
    declined: { text: 'Declined', color: 'danger' },
    expired: { text: 'Expired', color: 'default' }
  };

  const current = map[status?.toLowerCase()] || { text: status || 'Unknown', color: 'default' };

  return <Badge variant={current.color} className={className}>{current.text}</Badge>;
};
