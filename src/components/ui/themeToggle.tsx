'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme, useToast } from '@/context/index';

export const ThemeToggle: React.FC = () => {
  const { themeName, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const handleThemeToggle = () => {
    toggleTheme();
    const newMode = themeName === 'light' ? t('theme.dark') : t('theme.light');
    showToast(
      t('theme.modeEnabled', { mode: newMode }),
      themeName === 'light' ? '🌙' : '☀️'
    );
  };

  return (
    <button
      className="theme-toggle"
      onClick={handleThemeToggle}
      aria-label={t('theme.switchTo', {
        mode: themeName === 'light' ? t('theme.dark') : t('theme.light'),
      })}
    >
      {themeName === 'light' ? '☀️' : '🌙'}
    </button>
  );
};
