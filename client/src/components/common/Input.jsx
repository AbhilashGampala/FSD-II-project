import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  id,
  type = 'text',
  className = '',
  required = false,
  rightElement,
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#252525] tracking-wide uppercase">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={type}
          required={required}
          className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-[#252525] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E58A1F]/30 focus:border-[#E58A1F] transition-all duration-150 text-sm shadow-2xs ${
            rightElement ? 'pr-11' : ''
          } ${
            error
              ? 'border-red-400 focus:ring-red-400/30 focus:border-red-500'
              : 'border-[#E5E7EB] hover:border-slate-300'
          } ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-slate-400">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600 font-medium mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#666666] mt-1">{helperText}</p>}
    </div>
  );
};

export const Select = ({
  label,
  error,
  helperText,
  id,
  options = [],
  className = '',
  required = false,
  placeholder = 'Select an option',
  ...props
}) => {
  const selectId = id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-[#252525] tracking-wide uppercase">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={selectId}
        required={required}
        className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#E58A1F]/30 focus:border-[#E58A1F] transition-all duration-150 text-sm shadow-2xs ${
          error
            ? 'border-red-400 focus:ring-red-400/30 focus:border-red-500'
            : 'border-[#E5E7EB] hover:border-slate-300'
        } ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className="text-xs text-red-600 font-medium mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#666666] mt-1">{helperText}</p>}
    </div>
  );
};
