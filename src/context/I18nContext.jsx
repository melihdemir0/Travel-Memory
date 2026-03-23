import PropTypes from "prop-types";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  interpolate,
  isSupportedLanguage,
  resolveInitialLanguage,
  translations,
} from "./i18nCatalog";

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(resolveInitialLanguage);

  const handleSetLanguage = useCallback((nextLanguage) => {
    if (!isSupportedLanguage(nextLanguage)) {
      return;
    }

    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    setLanguage(nextLanguage);
  }, []);

  const t = useCallback(
    (key, variables) => {
      const dictionary = translations[language] || translations[DEFAULT_LANGUAGE];
      const fallbackDictionary = translations[DEFAULT_LANGUAGE];
      const template = dictionary[key] ?? fallbackDictionary[key] ?? key;
      return interpolate(template, variables);
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage: handleSetLanguage,
      t,
    }),
    [handleSetLanguage, language, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

I18nProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
