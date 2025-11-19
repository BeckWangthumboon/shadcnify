import { hexToOklch, hexToHsl } from "@/lib/color";
import type { ThemeTokens } from "@/lib/theme";

type OklchTuple = [number, number, number];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const OKLCH_REGEX = /oklch\(([^)]+)\)/i;

const parseOklch = (value: string): OklchTuple | null => {
  const match = OKLCH_REGEX.exec(value);
  if (match) {
    const parts = match[1]
      .split(/[,\s/]+/)
      .filter(Boolean)
      .slice(0, 3);

    if (parts.length !== 3) return null;

    const nums = parts.map((p) => Number(p.replace(/[^0-9.+-eE]/g, "")));

    if (nums.some(Number.isNaN)) return null;

    return nums as OklchTuple;
  }

  if (/^#([0-9a-f]{3,8})$/i.test(value)) {
    const hexResult = hexToOklch(value);
    if (!hexResult) return null;

    const hexMatch = OKLCH_REGEX.exec(hexResult);
    if (!hexMatch) return null;

    const hexParts = hexMatch[1].split(" ").map(Number);
    if (hexParts.length !== 3 || hexParts.some(Number.isNaN)) return null;

    return hexParts as OklchTuple;
  }

  return null;
};

const formatOklch = ([L, C, h]: OklchTuple) =>
  `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${h.toFixed(1)})`;

const transformLightness = (L: number, mode: "light" | "dark") => {
  L = clamp01(L);

  if (mode === "dark") {
    const inverted = 1 - L;
    const mapped = 0.18 + inverted * 0.7;
    return clamp01(mapped);
  }

  const mapped = 0.96 - (1 - L) * 0.6;
  return clamp01(mapped);
};

const transformChroma = (L: number, C: number, mode: "light" | "dark") => {
  L = clamp01(L);
  C = clamp01(C);

  if (mode === "dark") {
    const factor = 0.75 - 0.25 * (1 - L);
    const mapped = C * factor;
    return Math.min(mapped, 0.33);
  }

  const midBoost = 0.1 * (1 - Math.abs(L - 0.5) * 2);
  const factor = 1.0 + midBoost;
  const mapped = C * factor;
  return Math.min(mapped, 0.4);
};

const colorTokenIds: Array<keyof ThemeTokens> = [
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

export const convertTokensForMode = (
  tokens: ThemeTokens,
  mode: "light" | "dark",
): ThemeTokens => {
  const nextTokens: ThemeTokens = { ...tokens };

  colorTokenIds.forEach((tokenId) => {
    const parsed = parseOklch(tokens[tokenId]);
    if (!parsed) return;

    const [L, C, h] = parsed;

    const L2 = transformLightness(L, mode);
    const C2 = transformChroma(L, C, mode);

    nextTokens[tokenId] = formatOklch([L2, C2, h]);
  });

  return nextTokens;
};

const COLOR_TOKEN_SET = new Set(colorTokenIds);

export function convertSingleTokenValue(
  tokenId: string,
  value: string | number,
) {
  const stringValue = String(value).trim();

  if (COLOR_TOKEN_SET.has(tokenId as any)) {
    return hexToOklch(stringValue) ?? null;
  }

  if (tokenId === "shadow-color") {
    // We need to import hexToHsl or move it here.
    // For now, let's assume the input is already valid or use a simple pass-through if it's not hex.
    // But wait, the template has hex values.
    // Let's import hexToHsl from ./color
    return hexToHsl(stringValue);
  }

  if (tokenId === "tracking-normal") {
    const parsed = Number.parseFloat(stringValue);
    if (!Number.isFinite(parsed)) {
      console.warn(`Invalid tracking value: ${value}`);
      return null;
    }
    const clamped = Math.max(-0.05, Math.min(parsed, 0.1));
    return `${clamped}em`;
  }

  // Handle numeric tokens that need proper units
  if (typeof value === "number" || !isNaN(Number(value))) {
    const numValue = Number(value);

    // Validate the numeric value is within reasonable bounds
    if (!isFinite(numValue)) {
      console.warn(`Invalid numeric value for ${tokenId}:`, value);
      return null;
    }

    // Spacing and radius use rem units
    if (tokenId === "spacing" || tokenId === "radius") {
      // Clamp values to reasonable ranges
      const clampedValue = Math.max(0, Math.min(numValue, 10)); // 0-10rem max
      return `${clampedValue}rem`;
    }

    // Shadow positioning and blur use px units
    if (tokenId.startsWith("shadow-")) {
      if (tokenId === "shadow-opacity") {
        // Clamp opacity between 0 and 1
        const clampedOpacity = Math.max(0, Math.min(numValue, 1));
        return String(clampedOpacity);
      }
      // For shadow positions and blur, allow reasonable ranges
      const clampedValue = Math.max(-100, Math.min(numValue, 100)); // -100px to 100px
      return `${clampedValue}px`;
    }
  }

  return stringValue;
}
