import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  type ThemeConfig,
  type ThemeMode,
  type ThemeTokens,
  defaultThemeConfig,
  themeVariableKeys,
} from "@/lib/theme";

type ThemeContextValue = {
  config: ThemeConfig;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  updateTokens: (mode: ThemeMode, updater: (tokens: ThemeTokens) => ThemeTokens) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
  initialConfig?: ThemeConfig;
  initialMode?: ThemeMode;
};

export function ThemeProvider({
  children,
  initialConfig = defaultThemeConfig,
  initialMode = "light",
}: ThemeProviderProps) {
  const [config, setConfig] = useState<ThemeConfig>(initialConfig);
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const activeTokens = config[mode];

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");

    themeVariableKeys.forEach((key) => {
      root.style.setProperty(`--${key}`, activeTokens[key]);
    });
  }, [activeTokens, mode]);

  const updateTokens = (targetMode: ThemeMode, updater: (tokens: ThemeTokens) => ThemeTokens) => {
    setConfig((previous) => ({
      ...previous,
      [targetMode]: updater(previous[targetMode]),
    }));
  };

  const value = useMemo(
    () => ({
      config,
      mode,
      setMode,
      updateTokens,
    }),
    [config, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeConfig() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeConfig must be used within a ThemeProvider");
  }
  return context;
}
