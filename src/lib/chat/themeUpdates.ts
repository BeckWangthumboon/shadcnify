import { hexToHsl, hexToOklch } from "@/lib/color";
import type { ThemeTokens, ThemeVariable, ThemeMode } from "@/lib/theme";
import {
  decodeThemeUpdateMarkerPayload,
  type ThemeUpdateMarkerPayload,
} from "@/lib/themeUpdateMarkers";

export type ThemeUpdateSummary = {
  toolCallId: string;
  targetMode: ThemeMode;
  tokens: ThemeVariable[];
};

export const COLOR_TOKEN_IDS: ThemeVariable[] = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
];

const COLOR_TOKEN_SET = new Set<ThemeVariable>(COLOR_TOKEN_IDS);

export function extractThemeUpdatePayloads(text: string): {
  cleanText: string;
  payloads: ThemeUpdateMarkerPayload[];
} {
  if (!text) {
    return { cleanText: "", payloads: [] };
  }

  const payloads: ThemeUpdateMarkerPayload[] = [];
  const regex = /\[\[THEME_UPDATE::([A-Za-z0-9+/=]+)]]/g;
  const cleanText = text.replace(regex, (_match, encoded: string) => {
    const payload = decodeThemeUpdateMarkerPayload(encoded);
    if (payload) {
      payloads.push(payload);
    }
    return "";
  });

  return { cleanText, payloads };
}

export function convertThemeTokenUpdates(
  updates: ThemeUpdateMarkerPayload["updates"],
): {
  convertedTokens: Partial<ThemeTokens>;
  tokenNames: ThemeVariable[];
} {
  const convertedTokens: Partial<ThemeTokens> = {};
  const tokenNames: ThemeVariable[] = [];

  Object.entries(updates).forEach(([tokenId, value]) => {
    if (!value) return;
    const id = tokenId as ThemeVariable;
    const convertedValue = convertSingleTokenValue(id, value);
    if (!convertedValue) return;

    convertedTokens[id] = convertedValue;
    tokenNames.push(id);
  });

  return { convertedTokens, tokenNames };
}

export function convertSingleTokenValue(tokenId: ThemeVariable, value: string) {
  if (COLOR_TOKEN_SET.has(tokenId)) {
    return hexToOklch(value.trim()) ?? null;
  }

  if (tokenId === "shadow-color") {
    return hexToHsl(value.trim());
  }

  return value;
}
