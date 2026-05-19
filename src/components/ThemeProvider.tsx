"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DAISY_THEMES,
  THEME_STORAGE_KEY,
  type DaisyTheme,
} from "@/lib/themes";

type ThemeContextValue = {
  theme: DaisyTheme;
  setTheme: (theme: DaisyTheme) => void;
  ready: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: DaisyTheme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<DaisyTheme>("corporate");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as DaisyTheme | null;
    const initial =
      stored && DAISY_THEMES.includes(stored) ? stored : "corporate";
    setThemeState(initial);
    applyTheme(initial);
    setReady(true);
  }, []);

  const setTheme = useCallback((next: DaisyTheme) => {
    setThemeState(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, ready }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
