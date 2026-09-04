import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-slate-900/80 border ${
            error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-700/80 focus:border-eco-500 focus:ring-eco-500/20'
          } rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
            icon ? 'pl-10 pr-4' : 'px-4'
          } py-2.5 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-400 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-400">{helperText}</p>}
    </div>
  );
};
