import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] ${
        hover ? 'hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
