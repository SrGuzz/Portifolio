import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as pt from '../data/content.pt';
import * as en from '../data/content.en';

// Idioma do site. Ordem de escolha: ?lang= na URL, a última escolha da
// pessoa (localStorage) e, por fim, o idioma do navegador.

const CONTENT = { pt, en };
export const LANGUAGES = [
  { code: 'pt', label: 'PT', name: 'Português' },
  { code: 'en', label: 'EN', name: 'English' },
];

const STORAGE_KEY = 'albertluis:lang';
const isSupported = (code) => code in CONTENT;

function initialLanguage() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl && isSupported(fromUrl)) return fromUrl;
  } catch {
    /* URL indisponível */
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && isSupported(saved)) return saved;
  } catch {
    /* armazenamento bloqueado */
  }
  const browser = (navigator.languages?.[0] ?? navigator.language ?? 'pt').toLowerCase();
  return browser.startsWith('pt') ? 'pt' : 'en';
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLanguage);

  const setLang = useCallback((next) => {
    if (!isSupported(next)) return;
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* segue sem lembrar a escolha */
    }
  }, []);

  // idioma do documento, título e descrição acompanham a escolha
  useEffect(() => {
    const { meta } = CONTENT[lang];
    document.documentElement.lang = meta.htmlLang;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'en' ? 'en_US' : 'pt_BR');
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, content: CONTENT[lang] }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage precisa estar dentro de <LanguageProvider>');
  return value;
}

/** Atalho para o conteúdo do idioma ativo. */
export const useContent = () => useLanguage().content;
