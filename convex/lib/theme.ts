import { z } from "zod";
import { tool } from "ai";
import { type ThemeMode, type ThemeVariable } from "../../src/lib/theme";

const themeModeSchema = z.enum(["light", "dark"]) as z.ZodType<ThemeMode>;

const editableThemeVariables = [
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
  "font-sans",
  "font-serif",
  "font-mono",
  "radius",
  "shadow-x",
  "shadow-y",
  "shadow-blur",
  "shadow-spread",
  "shadow-opacity",
  "shadow-color",
  "tracking-normal",
  "spacing",
] as const;

// Base hex color schema (6-digit format like #123456)
const hexColorSchema = z
  .string()
  .regex(
    /^#([0-9a-fA-F]{6})$/,
    "Invalid hex color format. Use 6-digit format like #123456 (e.g., #ffffff for white, #000000 for black).",
  )
  .describe("Hex color string (6-digit format, e.g., #123456).");

// Color schemas with specific descriptions
const backgroundColorSchema = hexColorSchema.describe(
  "Hex color string for background (e.g., #ffffff).",
);
const foregroundColorSchema = hexColorSchema.describe(
  "Hex color string for foreground text (e.g., #000000).",
);
const cardColorSchema = hexColorSchema.describe(
  "Hex color string for card backgrounds (e.g., #f8fafc).",
);
const cardForegroundColorSchema = hexColorSchema.describe(
  "Hex color string for card text (e.g., #1e293b).",
);
const popoverColorSchema = hexColorSchema.describe(
  "Hex color string for popover backgrounds (e.g., #ffffff).",
);
const popoverForegroundColorSchema = hexColorSchema.describe(
  "Hex color string for popover text (e.g., #000000).",
);
const primaryColorSchema = hexColorSchema.describe(
  "Hex color string for primary elements (e.g., #3b82f6).",
);
const primaryForegroundColorSchema = hexColorSchema.describe(
  "Hex color string for primary text (e.g., #ffffff).",
);
const secondaryColorSchema = hexColorSchema.describe(
  "Hex color string for secondary elements (e.g., #f1f5f9).",
);
const secondaryForegroundColorSchema = hexColorSchema.describe(
  "Hex color string for secondary text (e.g., #0f172a).",
);
const mutedColorSchema = hexColorSchema.describe(
  "Hex color string for muted elements (e.g., #f1f5f9).",
);
const mutedForegroundColorSchema = hexColorSchema.describe(
  "Hex color string for muted text (e.g., #64748b).",
);
const accentColorSchema = hexColorSchema.describe(
  "Hex color string for accent elements (e.g., #f1f5f9).",
);
const accentForegroundColorSchema = hexColorSchema.describe(
  "Hex color string for accent text (e.g., #0f172a).",
);
const destructiveColorSchema = hexColorSchema.describe(
  "Hex color string for destructive elements (e.g., #ef4444).",
);
const destructiveForegroundColorSchema = hexColorSchema.describe(
  "Hex color string for destructive text (e.g., #ffffff).",
);
const borderColorSchema = hexColorSchema.describe(
  "Hex color string for borders (e.g., #e2e8f0).",
);
const inputColorSchema = hexColorSchema.describe(
  "Hex color string for input backgrounds (e.g., #ffffff).",
);
const ringColorSchema = hexColorSchema.describe(
  "Hex color string for focus rings (e.g., #3b82f6).",
);
const chart1ColorSchema = hexColorSchema.describe(
  "Hex color string for chart series 1 (e.g., #3b82f6).",
);
const chart2ColorSchema = hexColorSchema.describe(
  "Hex color string for chart series 2 (e.g., #10b981).",
);
const chart3ColorSchema = hexColorSchema.describe(
  "Hex color string for chart series 3 (e.g., #f59e0b).",
);
const chart4ColorSchema = hexColorSchema.describe(
  "Hex color string for chart series 4 (e.g., #ef4444).",
);
const chart5ColorSchema = hexColorSchema.describe(
  "Hex color string for chart series 5 (e.g., #8b5cf6).",
);
const sidebarColorSchema = hexColorSchema.describe(
  "Hex color string for sidebar backgrounds (e.g., #f8fafc).",
);
const sidebarForegroundColorSchema = hexColorSchema.describe(
  "Hex color string for sidebar text (e.g., #1e293b).",
);
const sidebarPrimaryColorSchema = hexColorSchema.describe(
  "Hex color string for sidebar primary elements (e.g., #3b82f6).",
);
const sidebarPrimaryForegroundColorSchema = hexColorSchema.describe(
  "Hex color string for sidebar primary text (e.g., #ffffff).",
);
const sidebarAccentColorSchema = hexColorSchema.describe(
  "Hex color string for sidebar accent elements (e.g., #f1f5f9).",
);
const sidebarAccentForegroundColorSchema = hexColorSchema.describe(
  "Hex color string for sidebar accent text (e.g., #0f172a).",
);
const sidebarBorderColorSchema = hexColorSchema.describe(
  "Hex color string for sidebar borders (e.g., #e2e8f0).",
);
const sidebarRingColorSchema = hexColorSchema.describe(
  "Hex color string for sidebar focus rings (e.g., #3b82f6).",
);

// Extract all font stacks from typography options
const sansSerifFontStacks = [
  '"Inter", "Plus Jakarta Sans", "IBM Plex Sans", system-ui, -apple-system, sans-serif',
  '"Plus Jakarta Sans", "Inter", "Manrope", sans-serif',
  '"IBM Plex Sans", "Inter", "Roboto", sans-serif',
  '"Manrope", "Inter", "Mulish", sans-serif',
  '"Work Sans", "Inter", "Source Sans Pro", sans-serif',
  '"Nunito", "Poppins", "Inter", sans-serif',
  '"Poppins", "Montserrat", "Inter", sans-serif',
  '"Montserrat", "Poppins", "Inter", sans-serif',
  '"Roboto", "Inter", "Open Sans", sans-serif',
  '"Open Sans", "Roboto", "Inter", sans-serif',
  '"Source Sans Pro", "Inter", "Roboto", sans-serif',
  '"Mulish", "Manrope", "Inter", sans-serif',
] as const;

const serifFontStacks = [
  '"Playfair Display", "Lora", "Merriweather", serif',
  '"Merriweather", "Source Serif 4", "Lora", serif',
  '"Lora", "Merriweather", "Libre Baskerville", serif',
  '"Libre Baskerville", "Lora", "Merriweather", serif',
  '"Source Serif 4", "Merriweather", "Lora", serif',
  '"Spectral", "Source Serif 4", "Merriweather", serif',
  '"Cormorant Garamond", "EB Garamond", "Lora", serif',
  '"Bitter", "Merriweather", "Lora", serif',
  '"Crimson Text", "Libre Baskerville", "Lora", serif',
  '"PT Serif", "Merriweather", "Source Serif 4", serif',
  '"EB Garamond", "Cormorant Garamond", "Lora", serif',
  '"DM Serif Display", "Playfair Display", "Spectral", serif',
  '"Vollkorn", "Merriweather", "Bitter", serif',
  '"Literata", "Merriweather", "Lora", serif',
] as const;

const monoFontStacks = [
  '"JetBrains Mono", "Fira Code", "Menlo", "Source Code Pro", monospace',
  '"Fira Code", "JetBrains Mono", "Menlo", "Source Code Pro", monospace',
  '"IBM Plex Mono", "JetBrains Mono", "Fira Code", "Menlo", monospace',
  '"Source Code Pro", "JetBrains Mono", "Fira Code", monospace',
  '"Inconsolata", "JetBrains Mono", "Fira Code", monospace',
  '"Menlo", "JetBrains Mono", "Fira Code", "Consolas", monospace',
  '"Consolas", "Menlo", "JetBrains Mono", monospace',
  '"Courier Prime", "Inconsolata", "Roboto Mono", monospace',
  '"Ubuntu Mono", "JetBrains Mono", "Fira Code", monospace',
  '"Space Mono", "IBM Plex Mono", "JetBrains Mono", monospace',
  '"Cascadia Code", "Fira Code", "JetBrains Mono", monospace',
  '"Roboto Mono", "Source Code Pro", "JetBrains Mono", monospace',
  '"PT Mono", "IBM Plex Mono", "JetBrains Mono", monospace',
  '"Noto Mono", "Roboto Mono", "Source Code Pro", monospace',
] as const;

// Create specific validators for each font type
const fontSansSchema = z
  .enum(sansSerifFontStacks)
  .describe(
    "Font stack for sans-serif typography (e.g., 'Inter, sans-serif').",
  );

const fontSerifSchema = z
  .enum(serifFontStacks)
  .describe("Font stack for serif typography (e.g., 'Source Serif 4, serif').");

const fontMonoSchema = z
  .enum(monoFontStacks)
  .describe(
    "Font stack for monospace typography (e.g., 'JetBrains Mono, monospace').",
  );

const spacingValueSchema = z
  .number()
  .min(
    0.125,
    "Spacing value too small. Minimum allowed is 0.125rem (equivalent to 2px at 16px base).",
  )
  .max(
    1,
    "Spacing value too large. Maximum allowed is 1rem (equivalent to 16px at 16px base).",
  )
  .refine((val) => Number.isFinite(val), "Spacing must be a finite number.")
  .describe("Numeric slider value for spacing (0.125-1rem, step 0.025).");

const radiusValueSchema = z
  .number()
  .min(
    0,
    "Radius cannot be negative. Minimum allowed is 0rem (no border radius).",
  )
  .max(
    2,
    "Radius value too large. Maximum allowed is 2rem (equivalent to 32px at 16px base).",
  )
  .refine((val) => Number.isFinite(val), "Radius must be a finite number.")
  .describe("Numeric slider value for radius (0-2rem, step 0.05).");

const letterSpacingValueSchema = z
  .number()
  .min(
    -0.05,
    "Letter-spacing too tight. Minimum allowed is -0.05em for slight text tightening.",
  )
  .max(
    0.1,
    "Letter-spacing too loose. Maximum allowed is 0.1em for expanded text spacing.",
  )
  .refine(
    (val) => Number.isFinite(val),
    "Letter-spacing must be a finite number.",
  )
  .describe("Letter-spacing value in em (-0.05-0.1em, step 0.025).");

const shadowXSchema = z
  .number()
  .min(-40, "Shadow X offset too far left. Maximum left offset is -40px.")
  .max(40, "Shadow X offset too far right. Maximum right offset is 40px.")
  .refine(
    (val) => Number.isFinite(val),
    "Shadow X offset must be a finite number.",
  )
  .describe("Shadow X offset in pixels (-40 to 40px, step 1px).");

const shadowYSchema = z
  .number()
  .min(-40, "Shadow Y offset too far up. Maximum upward offset is -40px.")
  .max(40, "Shadow Y offset too far down. Maximum downward offset is 40px.")
  .refine(
    (val) => Number.isFinite(val),
    "Shadow Y offset must be a finite number.",
  )
  .describe("Shadow Y offset in pixels (-40 to 40px, step 1px).");

const shadowBlurSchema = z
  .number()
  .min(0, "Shadow blur cannot be negative. Use 0 for crisp shadows.")
  .max(
    120,
    "Shadow blur too large. Maximum blur radius is 120px for very soft shadows.",
  )
  .refine((val) => Number.isFinite(val), "Shadow blur must be a finite number.")
  .describe("Shadow blur radius in pixels (0 to 120px, step 1px).");

const shadowSpreadSchema = z
  .number()
  .min(-40, "Shadow spread too negative. Maximum contraction is -40px.")
  .max(40, "Shadow spread too large. Maximum expansion is 40px.")
  .refine(
    (val) => Number.isFinite(val),
    "Shadow spread must be a finite number.",
  )
  .describe("Shadow spread in pixels (-40 to 40px, step 1px).");

const shadowOpacitySchema = z
  .number()
  .min(0, "Shadow opacity cannot be negative. Use 0 for transparent shadows.")
  .max(1, "Shadow opacity cannot exceed 1. Use 1 for fully opaque shadows.")
  .refine(
    (val) => Number.isFinite(val),
    "Shadow opacity must be a finite number.",
  )
  .describe("Shadow opacity (0 to 1, step 0.05).");

const shadowColorSchema = hexColorSchema.describe(
  "Hex color string for shadows (e.g., #000000).",
);

type EditableThemeVariable = (typeof editableThemeVariables)[number];

// Create a schema where each editable theme variable maps to its specific validation schema
const themeUpdatesSchema = z.object({
  background: backgroundColorSchema.optional(),
  foreground: foregroundColorSchema.optional(),
  card: cardColorSchema.optional(),
  "card-foreground": cardForegroundColorSchema.optional(),
  popover: popoverColorSchema.optional(),
  "popover-foreground": popoverForegroundColorSchema.optional(),
  primary: primaryColorSchema.optional(),
  "primary-foreground": primaryForegroundColorSchema.optional(),
  secondary: secondaryColorSchema.optional(),
  "secondary-foreground": secondaryForegroundColorSchema.optional(),
  muted: mutedColorSchema.optional(),
  "muted-foreground": mutedForegroundColorSchema.optional(),
  accent: accentColorSchema.optional(),
  "accent-foreground": accentForegroundColorSchema.optional(),
  destructive: destructiveColorSchema.optional(),
  "destructive-foreground": destructiveForegroundColorSchema.optional(),
  border: borderColorSchema.optional(),
  input: inputColorSchema.optional(),
  ring: ringColorSchema.optional(),
  "chart-1": chart1ColorSchema.optional(),
  "chart-2": chart2ColorSchema.optional(),
  "chart-3": chart3ColorSchema.optional(),
  "chart-4": chart4ColorSchema.optional(),
  "chart-5": chart5ColorSchema.optional(),
  sidebar: sidebarColorSchema.optional(),
  "sidebar-foreground": sidebarForegroundColorSchema.optional(),
  "sidebar-primary": sidebarPrimaryColorSchema.optional(),
  "sidebar-primary-foreground": sidebarPrimaryForegroundColorSchema.optional(),
  "sidebar-accent": sidebarAccentColorSchema.optional(),
  "sidebar-accent-foreground": sidebarAccentForegroundColorSchema.optional(),
  "sidebar-border": sidebarBorderColorSchema.optional(),
  "sidebar-ring": sidebarRingColorSchema.optional(),
  "font-sans": fontSansSchema.optional(),
  "font-serif": fontSerifSchema.optional(),
  "font-mono": fontMonoSchema.optional(),
  radius: radiusValueSchema.optional(),
  "shadow-x": shadowXSchema.optional(),
  "shadow-y": shadowYSchema.optional(),
  "shadow-blur": shadowBlurSchema.optional(),
  "shadow-spread": shadowSpreadSchema.optional(),
  "shadow-opacity": shadowOpacitySchema.optional(),
  "shadow-color": shadowColorSchema.optional(),
  "tracking-normal": letterSpacingValueSchema.optional(),
  spacing: spacingValueSchema.optional(),
});

export const updateThemeTokensTool = tool({
  name: "updateThemeTokens",
  description:
    "Validate theme token updates for the specified light or dark palette. Provide token updates as key-value pairs where each token is optional.",
  inputSchema: z.object({
    targetMode: themeModeSchema,
    updates: themeUpdatesSchema,
  }),
  execute: ({ targetMode, updates }) => {
    const updateCount = Object.keys(updates).filter(
      (key) => updates[key as keyof typeof updates] !== undefined,
    ).length;
    return `Validated ${updateCount} theme token update(s) for the ${targetMode} palette.`;
  },
});

export type { ThemeMode, ThemeVariable, EditableThemeVariable };
export { themeModeSchema, themeUpdatesSchema };
