import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const current: SupportedLanguage = i18n.resolvedLanguage === 'es' ? 'es' : 'en';

  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-surface p-0.5 text-xs font-semibold">
      {SUPPORTED_LANGUAGES.map(lng => (
        <button
          key={lng}
          onClick={() => i18n.changeLanguage(lng)}
          aria-pressed={current === lng}
          className={`px-2.5 py-1 rounded-full transition-all duration-150
            ${current === lng
              ? 'bg-violet-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-300'}`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
