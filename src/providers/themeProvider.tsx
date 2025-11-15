import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  type ThemeConfig,
  type ThemeMode,
  type ThemeTokens,
  defaultThemeConfig,
  themeVariableKeys,
} from "@/lib/theme";
import {
  clearStoredThemeConfig,
  loadStoredThemeConfig,
  persistThemeConfig,
} from "@/lib/persistence";

type ThemeContextValue = {
  config: ThemeConfig;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resetConfig: () => void;
  updateTokens: (
    mode: ThemeMode,
    updater: (tokens: ThemeTokens) => ThemeTokens,
  ) => void;
  syncTokenAcrossModes: (tokenId: keyof ThemeTokens, value: string) => void;
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
  const [config, setConfig] = useState<ThemeConfig>(() => {
    if (typeof window === "undefined") return initialConfig;
    return loadStoredThemeConfig(initialConfig);
  });
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

  useEffect(() => {
    persistThemeConfig(config);
  }, [config]);

  const updateTokens = useCallback(
    (targetMode: ThemeMode, updater: (tokens: ThemeTokens) => ThemeTokens) => {
      setConfig((previous) => ({
        ...previous,
        [targetMode]: updater(previous[targetMode]),
      }));
    },
    [],
  );
  const syncTokenAcrossModes = useCallback(
    (tokenId: keyof ThemeTokens, value: string) => {
      setConfig((previous) => ({
        light: {
          ...previous.light,
          [tokenId]: value,
        },
        dark: {
          ...previous.dark,
          [tokenId]: value,
        },
      }));
    },
    [],
  );
  const resetConfig = useCallback(() => {
    clearStoredThemeConfig();
    setConfig(defaultThemeConfig);
    setMode("light");
  }, []);

  const value = useMemo(
    () => ({
      config,
      mode,
      syncTokenAcrossModes,
      resetConfig,
      setMode,
      updateTokens,
    }),
    [config, mode, resetConfig, setMode, syncTokenAcrossModes, updateTokens],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeConfig() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeConfig must be used within a ThemeProvider");
  }
  return context;
}
