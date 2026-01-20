'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Sun, Moon, Leaf, Waves, Sunset } from 'lucide-react';
import { useParentTheme, parentThemes, ParentThemeId } from '@/lib/parent-theme-context';

const themeIcons: Record<ParentThemeId, React.ReactNode> = {
  default: <Sun className="w-5 h-5" />,
  dark: <Moon className="w-5 h-5" />,
  nature: <Leaf className="w-5 h-5" />,
  ocean: <Waves className="w-5 h-5" />,
  sunset: <Sunset className="w-5 h-5" />,
};

const themePreviewColors: Record<ParentThemeId, { bg: string; accent: string }> = {
  default: { bg: 'bg-slate-100', accent: 'bg-blue-500' },
  dark: { bg: 'bg-slate-800', accent: 'bg-purple-500' },
  nature: { bg: 'bg-stone-100', accent: 'bg-emerald-500' },
  ocean: { bg: 'bg-cyan-100', accent: 'bg-cyan-500' },
  sunset: { bg: 'bg-orange-100', accent: 'bg-orange-500' },
};

interface ParentThemePickerProps {
  variant?: 'dropdown' | 'inline';
  showLabel?: boolean;
}

export default function ParentThemePicker({
  variant = 'dropdown',
  showLabel = true
}: ParentThemePickerProps) {
  const { currentTheme, themeId, setTheme } = useParentTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'inline') {
    return (
      <div className="space-y-3">
        {showLabel && (
          <label className={`block text-sm font-medium ${currentTheme.colors.textSecondary}`}>
            Dashboard Theme
          </label>
        )}
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(parentThemes).map(([id, theme]) => {
            const isSelected = id === themeId;
            const preview = themePreviewColors[id as ParentThemeId];

            return (
              <button
                key={id}
                onClick={() => setTheme(id as ParentThemeId)}
                className={`
                  relative p-3 rounded-xl border-2 transition-all duration-200
                  ${isSelected
                    ? `border-blue-500 ring-2 ring-blue-500/20`
                    : `${currentTheme.colors.borderLight} hover:border-blue-300`
                  }
                  ${currentTheme.colors.bgCard}
                `}
                title={theme.name}
              >
                <div className="flex flex-col items-center gap-2">
                  {/* Preview */}
                  <div className={`w-10 h-10 rounded-lg ${preview.bg} flex items-center justify-center`}>
                    <div className={`w-4 h-4 rounded ${preview.accent}`} />
                  </div>
                  <span className={`text-xs font-medium ${currentTheme.colors.textSecondary}`}>
                    {theme.name}
                  </span>
                </div>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors
          ${currentTheme.colors.bgCard} ${currentTheme.colors.borderLight}
          hover:border-blue-300
        `}
      >
        <Palette className={`w-4 h-4 ${currentTheme.colors.accentPrimary}`} />
        {showLabel && (
          <span className={`text-sm ${currentTheme.colors.textSecondary}`}>
            {currentTheme.name}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`
                absolute right-0 mt-2 w-64 rounded-xl shadow-lg border z-50
                ${currentTheme.colors.bgCard} ${currentTheme.colors.borderLight}
              `}
            >
              <div className="p-2">
                <p className={`px-3 py-2 text-xs font-medium ${currentTheme.colors.textMuted} uppercase tracking-wide`}>
                  Choose Theme
                </p>
                {Object.entries(parentThemes).map(([id, theme]) => {
                  const isSelected = id === themeId;
                  const preview = themePreviewColors[id as ParentThemeId];
                  const Icon = () => themeIcons[id as ParentThemeId];

                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setTheme(id as ParentThemeId);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                        ${isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : currentTheme.colors.bgCardHover
                        }
                      `}
                    >
                      {/* Theme preview circle */}
                      <div className={`w-8 h-8 rounded-lg ${preview.bg} flex items-center justify-center`}>
                        <div className={`w-3 h-3 rounded ${preview.accent}`} />
                      </div>

                      <div className="flex-1 text-left">
                        <p className={`text-sm font-medium ${currentTheme.colors.textPrimary}`}>
                          {theme.name}
                        </p>
                        <p className={`text-xs ${currentTheme.colors.textMuted}`}>
                          {theme.description}
                        </p>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
