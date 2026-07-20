import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import es from './locales/es.json';

export const SUPPORTED_LANGUAGES = ['en', 'es'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Solo la INTERFAZ (botones, menús, instrucciones) se traduce. El contenido
// del quiz y de las actividades de práctica (lecturas, dictados, feedback de
// la IA) siempre se mantiene en inglés — es una app para aprender inglés.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    detection: {
      // localStorage primero (preferencia manual persistida), luego el
      // idioma del dispositivo (navigator.language), inglés como fallback.
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'coach_language_v1',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  });

function syncHtmlLang(lng: string) {
  document.documentElement.lang = lng.startsWith('es') ? 'es' : 'en';
}
syncHtmlLang(i18n.resolvedLanguage ?? 'en');
i18n.on('languageChanged', syncHtmlLang);

export default i18n;
