import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './translations/en.json';
import frTranslations from './translations/fr.json';

// Initialize i18n with SSR-safe configuration
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      fr: {
        translation: frTranslations,
      },
    },
    lng: 'en', // Default language for SSR
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // This is important for SSR
    },
  });

// Don't set language here to avoid hydration mismatches
// Language will be set in the I18nProvider component after mount

export default i18n;
