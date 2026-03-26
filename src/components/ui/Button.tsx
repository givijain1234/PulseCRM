import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02]',
      secondary: 'bg-slate-800 text-white hover:bg-slate-700 shadow-lg',
      outline: 'border border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:border-slate-600',
      ghost: 'text-slate-400 hover:text-white hover:bg-slate-800/50',
      danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg',
      md: 'px-4 py-2 text-sm rounded-xl',
      lg: 'px-6 py-3 text-base rounded-2xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
