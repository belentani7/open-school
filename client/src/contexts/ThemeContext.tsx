import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";
type Ctx = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void };

const ThemeContext = createContext<Ctx>({ theme: "dark", setTheme: () => {}, toggle: () => {} });

export function ThemeProvider({ defaultTheme = "dark", children }: { defaultTheme?: Theme; children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme ]);
  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggle = useCallback(() => setThemeState((t) => (t === "dark" ? "light" : "dark")), []);
  return <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
