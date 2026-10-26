import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div
        className={`${sizeMap[size]} border-4 border-slate-200 dark:border-slate-700 border-t-brand-orange rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export const EmptyState = ({
  icon,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl my-4">
      {icon && <div className="text-slate-400 mb-3">{icon}</div>}
      <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
