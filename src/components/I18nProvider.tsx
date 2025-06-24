'use client';

import { I18nextProvider } from 'react-i18next';
import { useEffect } from 'react';
import i18n from '../i18n/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Set language from localStorage after mount to prevent hydration mismatches
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
