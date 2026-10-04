import type { Locale } from "@shared/dictCatalog";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type LanguageContextValue = { locale: Locale; setLocale: (locale: Locale) => void };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem("dict-locale") as Locale) || "es");
  useEffect(() => { localStorage.setItem("dict-locale", locale); document.documentElement.lang = locale; }, [locale]);
  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
