'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';

interface ThemedCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export const ThemedCard = forwardRef<HTMLDivElement, ThemedCardProps>(
  ({ className, glow = false, children, ...props }, ref) => {
    const { currentTheme } = useTheme();

    const cardStyle = currentTheme.style.cardStyle;
    const borderStyle = currentTheme.style.borderStyle;

    const borderClass = {
      solid: 'border-2',
      glow: 'border-2 shadow-lg',
      textured: 'border-4 border-double',
      pixel: 'border-4',
      tactical: 'border-2',
      none: 'border-0',
    }[borderStyle] || 'border-2';

    const isBattle = currentTheme.id === 'battle';

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          !isBattle && currentTheme.cardClass,
          isBattle && 'bg-gradient-to-br from-slate-800/95 via-stone-900/95 to-zinc-900/95 backdrop-blur-sm border-2 border-red-500/40',
          borderClass,
          glow && 'shadow-2xl',
          className
        )}
        style={{
          borderColor: !isBattle ? `${currentTheme.colors.primary}40` : undefined,
          clipPath: isBattle ? 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' : undefined,
          boxShadow: isBattle ? '0 0 20px rgba(239, 68, 68, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.6)' : undefined,
        }}
        {...props}
      >
        {isBattle && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-amber-500/5 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/60" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/60" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500/60" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500/60" />
          </>
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

ThemedCard.displayName = 'ThemedCard';
