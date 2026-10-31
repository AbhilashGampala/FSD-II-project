import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'default', 'success', 'warning', 'danger', 'info', 'purple', 'orange'
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold'
  };

  const variantClasses = {
    default: 'bg-[#F7F8FA] text-[#666666] border border-[#E5E7EB]',
    success: 'bg-[#94BC36]/15 text-[#547214] border border-[#94BC36]/30',
    warning: 'bg-[#E58A1F]/15 text-[#A85F0A] border border-[#E58A1F]/30',
    orange: 'bg-[#E58A1F]/15 text-[#A85F0A] border border-[#E58A1F]/30',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    purple: 'bg-[#95058A]/10 text-[#95058A] border border-[#95058A]/25'
  };

  return (
    <span className={`inline-flex items-center rounded-lg ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {children}
    </span>
  );
};

export const SampleBadge = ({ className = '' }) => {
  return (
    <span
      title="This is fictional demonstration data for testing"
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F7F8FA] text-[#666666] border border-[#E5E7EB] ${className}`}
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
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#94BC36]/15 text-[#547214] border border-[#94BC36]/30 ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-[#94BC36]"></span>
        Verified {year ? `(${year})` : ''}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
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
