import { isHexColor } from "./color";
import type { ThemeTokens } from "./theme";

export type ShadowBaseControlId =
  | "shadow-x"
  | "shadow-y"
  | "shadow-blur"
  | "shadow-spread"
  | "shadow-opacity";

export type ShadowBaseControl = {
  id: ShadowBaseControlId;
  label: string;
  description?: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
};

export const shadowBaseControls: ShadowBaseControl[] = [
  {
    id: "shadow-x",
    label: "Offset X",
    description: "Moves the shadow horizontally.",
    min: -40,
    max: 40,
    step: 1,
    unit: "px",
  },
  {
    id: "shadow-y",
    label: "Offset Y",
    description: "Moves the shadow vertically.",
    min: -40,
    max: 40,
    step: 1,
    unit: "px",
  },
  {
    id: "shadow-blur",
    label: "Blur radius",
    description: "Controls how soft the edges become.",
    min: 0,
    max: 120,
    step: 1,
    unit: "px",
  },
  {
    id: "shadow-spread",
    label: "Spread",
    description: "Expands or contracts the shadow size.",
    min: -40,
    max: 40,
    step: 1,
    unit: "px",
  },
  {
    id: "shadow-opacity",
    label: "Opacity",
    description: "Sets the base transparency level.",
    min: 0,
    max: 1,
    step: 0.05,
  },
];

export type ShadowPresetTokenId =
  | "shadow-2xs"
  | "shadow-xs"
  | "shadow-sm"
  | "shadow"
  | "shadow-md"
  | "shadow-lg"
  | "shadow-xl"
  | "shadow-2xl";

export type ShadowPresetToken = {
  id: ShadowPresetTokenId;
  label: string;
  description: string;
};

export const shadowPresetTokens: ShadowPresetToken[] = [
  { id: "shadow-2xs", label: "2XS", description: "Micro hairline hover." },
  { id: "shadow-xs", label: "XS", description: "Subtle cards and chips." },
  { id: "shadow-sm", label: "SM", description: "Default buttons and inputs." },
  { id: "shadow", label: "Base", description: "Same as tailwind `shadow`." },
  { id: "shadow-md", label: "MD", description: "Raised cards." },
  { id: "shadow-lg", label: "LG", description: "Panels and sheets." },
  { id: "shadow-xl", label: "XL", description: "Floating surfaces." },
  { id: "shadow-2xl", label: "2XL", description: "Modals and overlays." },
];

export type ShadowBaseValues = Record<ShadowBaseControlId, number>;
export type ShadowPresetValues = Record<ShadowPresetTokenId, string>;

const DEFAULT_FALLBACK = 0.1;

type ShadowLayerOverrides = {
  x?: (value: ShadowBaseValues) => number;
  y?: (value: ShadowBaseValues) => number;
  blur?: (value: ShadowBaseValues) => number;
  spread?: (value: ShadowBaseValues) => number;
  opacity?: (value: ShadowBaseValues) => number;
  opacityMultiplier?: number;
};

const baseLayer: ShadowLayerOverrides = {};
const zeroSpreadLayer: ShadowLayerOverrides = {
  spread: () => 0,
};

const shadowPresetRules: Record<ShadowPresetTokenId, ShadowLayerOverrides[]> = {
  "shadow-2xs": [
    {
      opacity: (base) => clampShadowValue(base["shadow-opacity"] * 0.5, 0, 1),
    },
  ],
  "shadow-xs": [
    {
      opacity: (base) => clampShadowValue(base["shadow-opacity"] * 0.5, 0, 1),
    },
  ],
  "shadow-sm": [baseLayer, zeroSpreadLayer],
  shadow: [baseLayer, zeroSpreadLayer],
  "shadow-md": [
    baseLayer,
    {
      y: (base) => base["shadow-y"] * 2,
      blur: (base) => base["shadow-blur"] * 2,
      spread: () => 0,
    },
  ],
  "shadow-lg": [
    baseLayer,
    {
      y: (base) => base["shadow-y"] * 4,
      blur: (base) => base["shadow-blur"] * 3,
      spread: () => 0,
    },
  ],
  "shadow-xl": [
    baseLayer,
    {
      y: (base) => base["shadow-y"] * 8,
      blur: (base) => base["shadow-blur"] * 5,
      spread: () => 0,
    },
  ],
  "shadow-2xl": [
    {
      opacity: (base) => clampShadowValue(base["shadow-opacity"] * 2.5, 0, 1),
    },
  ],
};

export function deriveShadowBaseValues(tokens: ThemeTokens): ShadowBaseValues {
  return {
    "shadow-x": parseNumber(tokens["shadow-x"]),
    "shadow-y": parseNumber(tokens["shadow-y"]),
    "shadow-blur": parseNumber(tokens["shadow-blur"]),
    "shadow-spread": parseNumber(tokens["shadow-spread"]),
    "shadow-opacity": parseNumber(tokens["shadow-opacity"], DEFAULT_FALLBACK),
  };
}

export function deriveShadowPresetValues(
  tokens: ThemeTokens,
): ShadowPresetValues {
  return {
    "shadow-2xs": tokens["shadow-2xs"],
    "shadow-xs": tokens["shadow-xs"],
    "shadow-sm": tokens["shadow-sm"],
    shadow: tokens.shadow,
    "shadow-md": tokens["shadow-md"],
    "shadow-lg": tokens["shadow-lg"],
    "shadow-xl": tokens["shadow-xl"],
    "shadow-2xl": tokens["shadow-2xl"],
  };
}

export function isShadowPresetTokenId(
  value: string,
): value is ShadowPresetTokenId {
  return shadowPresetTokens.some((preset) => preset.id === value);
}

export function clampShadowValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeShadowHex(value: string) {
  const normalized = value.startsWith("#") ? value : `#${value.replace(/^#/, "")}`;
  return normalized.toLowerCase();
}

export function buildShadowFromBase(
  hexColor: string,
  values: ShadowBaseValues,
) {
  const color = hexToRgba(hexColor, values["shadow-opacity"]);
  return `${values["shadow-x"]}px ${values["shadow-y"]}px ${values["shadow-blur"]}px ${values["shadow-spread"]}px ${color}`;
}

export function buildShadowPresets(
  baseValues: ShadowBaseValues,
  hexColor: string,
): ShadowPresetValues {
  const entries = {} as ShadowPresetValues;

  (Object.keys(shadowPresetRules) as ShadowPresetTokenId[]).forEach((presetId) => {
    const layers = shadowPresetRules[presetId].map((rule) =>
      formatLayer(baseValues, hexColor, rule),
    );
    entries[presetId] = layers.join(", ");
  });

  return entries;
}

function parseNumber(value: string, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function hexToRgba(hex: string, alpha: number) {
  if (!isHexColor(hex)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  const stripped = hex.replace("#", "");
  const normalized =
    stripped.length === 3
      ? stripped
          .split("")
          .map((char) => char + char)
          .join("")
      : stripped;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  const clampedAlpha = clampShadowValue(alpha, 0, 1);
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
}

function formatLayer(
  base: ShadowBaseValues,
  hexColor: string,
  overrides: ShadowLayerOverrides,
) {
  const x = overrides.x ? overrides.x(base) : base["shadow-x"];
  const y = overrides.y ? overrides.y(base) : base["shadow-y"];
  const blur = overrides.blur ? overrides.blur(base) : base["shadow-blur"];
  const spread = overrides.spread
    ? overrides.spread(base)
    : base["shadow-spread"];
  const opacity = overrides.opacity
    ? overrides.opacity(base)
    : clampShadowValue(
        (overrides.opacityMultiplier ?? 1) * base["shadow-opacity"],
        0,
        1,
      );
  const color = hexToRgba(hexColor, opacity);

  return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
}
