'use client';

import { useTheme } from './theme-context';

export function useThemedCurrency() {
  const { currentTheme } = useTheme();

  return {
    name: currentTheme.coinName,
    icon: getCurrencyIcon(currentTheme.coinName),
    shopName: currentTheme.shopName,
    formatAmount: (amount: number) => `${amount} ${currentTheme.coinName}`,
  };
}

function getCurrencyIcon(coinName: string): string {
  const iconMap: Record<string, string> = {
    'Coins': '🪙',
    'Victory Bucks': '💎',
    'Emeralds': '💎',
    'Magic Gems': '💎',
    'Power Orbs': '⚡',
    'Gold Doubloons': '💰',
    'Survival Kits': '🛡️',
    'Ninja Stars': '⭐',
    'Mech Parts': '⚙️',
    'Race Tokens': '🏁',
    'Pop Hearts': '💖',
    'Sparkles': '✨',
    'Crystals': '💎',
    'Energy': '⚡',
    'Credits': '💳',
  };

  return iconMap[coinName] || '🪙';
}

export function ThemedCurrency({ amount, size = 'md', showName = true }: { amount: number; size?: 'sm' | 'md' | 'lg'; showName?: boolean }) {
  const { currentTheme } = useTheme();
  const currency = useThemedCurrency();

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const iconSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <div className="flex items-center gap-2">
      <span className={iconSizes[size]}>{currency.icon}</span>
      <div>
        <div className={`font-black ${sizeClasses[size]}`} style={{ color: currentTheme.colors.primary }}>
          {amount.toLocaleString()}
        </div>
        {showName && (
          <div className="text-xs font-bold opacity-70" style={{ color: currentTheme.colors.textSecondary }}>
            {currency.name}
          </div>
        )}
      </div>
    </div>
  );
}
