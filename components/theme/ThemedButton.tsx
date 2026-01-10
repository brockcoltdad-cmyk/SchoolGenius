'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';

interface ThemedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

export const ThemedButton = forwardRef<HTMLButtonElement, ThemedButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const { currentTheme } = useTheme();

    const variantStyles = {
      primary: `bg-gradient-to-r from-[${currentTheme.colors.primary}] to-[${currentTheme.colors.secondary}]`,
      secondary: `bg-[${currentTheme.colors.secondary}] bg-opacity-20 text-[${currentTheme.colors.secondary}] border-2 border-[${currentTheme.colors.secondary}]`,
      accent: `bg-[${currentTheme.colors.accent}] text-slate-900`,
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg font-bold',
    };

    const buttonStyle = currentTheme.style.buttonStyle;
    const shapeClass = {
      rounded: 'rounded-xl',
      'extra-rounded': 'rounded-3xl',
      sharp: 'rounded-none',
      pixel: 'rounded-sm',
      smooth: 'rounded-2xl',
      angular: 'rounded-none',
    }[buttonStyle] || 'rounded-xl';

    const isBattle = currentTheme.id === 'battle';

    return (
      <button
        ref={ref}
        className={cn(
          'font-semibold text-white transition-all duration-200 relative overflow-hidden',
          shapeClass,
          !isBattle && currentTheme.buttonClass,
          isBattle && 'border-2 border-red-500/60 hover:border-red-500 bg-gradient-to-br from-slate-800 via-stone-900 to-zinc-900 hover:from-slate-700 hover:via-stone-800 hover:to-zinc-800',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        style={{
          backgroundColor: !isBattle && variant === 'primary' ? currentTheme.colors.primary : undefined,
          borderColor: !isBattle && variant === 'secondary' ? currentTheme.colors.secondary : undefined,
          clipPath: isBattle ? 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' : undefined,
          boxShadow: isBattle ? '0 0 20px rgba(239, 68, 68, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.5)' : undefined,
        }}
        onMouseEnter={(e) => {
          if (isBattle) {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.5)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }
        }}
        onMouseLeave={(e) => {
          if (isBattle) {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.5)';
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
        {...props}
      >
        {isBattle && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-amber-500/10 opacity-50" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
          </>
        )}
        <span className="relative z-10 font-bold tracking-wide uppercase">{children}</span>
      </button>
    );
  }
);

ThemedButton.displayName = 'ThemedButton';
