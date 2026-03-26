import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-sm text-white ring-offset-slate-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
          error && 'border-rose-500/50 focus-visible:ring-rose-500/30',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
);

export const Select = forwardRef<HTMLSelectElement, any>(
  ({ className, label, error, children, ...props }, ref) => (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-white ring-offset-slate-950 placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
          error && 'border-rose-500 focus-visible:ring-rose-500/50',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
);
