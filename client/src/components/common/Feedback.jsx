import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div
        className={`${sizeMap[size]} border-slate-200 border-t-[#E58A1F] rounded-full animate-spin`}
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
    <div className="flex flex-col items-center justify-center text-center p-8 bg-[#F7F8FA] border border-dashed border-[#E5E7EB] rounded-2xl my-4">
      {icon && <div className="text-slate-400 mb-3">{icon}</div>}
      <h3 className="text-base font-semibold text-[#252525]">{title}</h3>
      <p className="text-xs text-[#666666] max-w-sm mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
