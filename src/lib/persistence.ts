import type { ThemeConfig, ThemeMode, ThemeTokens } from "@/lib/theme";

const STORAGE_VERSION = 1;
const STORAGE_PREFIX = "shadcn-theme";

const storageKeys: Record<ThemeMode, string> = {
  light: `${STORAGE_PREFIX}:light`,
  dark: `${STORAGE_PREFIX}:dark`,
};

type StoredThemePayload = {
  version: number;
  tokens: ThemeTokens;
};

const isBrowser = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readTokens = (
  mode: ThemeMode,
  fallback: ThemeTokens,
): ThemeTokens => {
  if (!isBrowser()) return fallback;

  try {
    const raw = window.localStorage.getItem(storageKeys[mode]);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as StoredThemePayload | undefined;
    if (!parsed || parsed.version !== STORAGE_VERSION || !parsed.tokens) {
      return fallback;
    }

    return {
      ...fallback,
      ...parsed.tokens,
    };
  } catch {
    return fallback;
  }
};

export const loadStoredThemeConfig = (
  fallback: ThemeConfig,
): ThemeConfig => ({
  light: readTokens("light", fallback.light),
  dark: readTokens("dark", fallback.dark),
});

export const persistThemeConfig = (config: ThemeConfig) => {
  if (!isBrowser()) return;

  (Object.keys(storageKeys) as ThemeMode[]).forEach((mode) => {
    try {
      const payload: StoredThemePayload = {
        version: STORAGE_VERSION,
        tokens: config[mode],
      };
      window.localStorage.setItem(
        storageKeys[mode],
        JSON.stringify(payload),
      );
    } catch {
      // Ignore quota errors and keep runtime responsive.
    }
  });
};

export const clearStoredThemeConfig = () => {
  if (!isBrowser()) return;

  (Object.keys(storageKeys) as ThemeMode[]).forEach((mode) => {
    window.localStorage.removeItem(storageKeys[mode]);
  });
};
