"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { THEMES, type Theme } from "@/lib/utils";

type Ctx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeCtx = createContext<Ctx>({ theme: "pink", setTheme: () => {} });

const STORAGE_KEY = "diarinho.theme";

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "pink";
  const attr = document.documentElement.getAttribute("data-theme") as
    | Theme
    | null;
  if (attr && THEMES.includes(attr)) return attr;
  return "pink";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);

/**
 * Inline script — runs before React hydrates so the chosen theme is applied
 * immediately and we avoid flash-of-default-theme.
 */
export const themeBootScript = `
(function(){
  try {
    var t = localStorage.getItem('${STORAGE_KEY}');
    var allowed = ${JSON.stringify(THEMES)};
    if (!t || allowed.indexOf(t) === -1) t = 'pink';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'pink');
  }
})();
`;
