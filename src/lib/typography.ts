import type { ThemeVariable } from "./theme";

type FontTokenId = Extract<
  ThemeVariable,
  "font-sans" | "font-serif" | "font-mono"
>;

export type FontOption = {
  name: string;
  stack: string;
  example?: string;
};

export type FontGroup = {
  token: FontTokenId;
  label: string;
  description: string;
  options: FontOption[];
};

type NumericTypographyToken = Extract<
  ThemeVariable,
  "tracking-normal" | "spacing"
>;

export const fontGroups: FontGroup[] = [
  {
    token: "font-sans",
    label: "Sans Serif",
    description: "Used for most UI copy like body text, buttons, and inputs.",
    options: [
      {
        name: "Inter",
        stack:
          '"Inter", "Plus Jakarta Sans", "IBM Plex Sans", system-ui, -apple-system, sans-serif',
        example: "Modern, neutral sans great for dense UIs.",
      },
      {
        name: "Plus Jakarta Sans",
        stack: '"Plus Jakarta Sans", "Inter", "Manrope", sans-serif',
        example: "Figma-style geometric sans with strong clarity.",
      },
      {
        name: "IBM Plex Sans",
        stack: '"IBM Plex Sans", "Inter", "Roboto", sans-serif',
        example: "Slightly wider sans with strong numerals.",
      },
      {
        name: "Manrope",
        stack: '"Manrope", "Inter", "Mulish", sans-serif',
        example: "Clean, rounded geometric sans with excellent legibility.",
      },
      {
        name: "Work Sans",
        stack: '"Work Sans", "Inter", "Source Sans Pro", sans-serif',
        example: "Modern grotesk optimized for on-screen text.",
      },
      {
        name: "Nunito",
        stack: '"Nunito", "Poppins", "Inter", sans-serif',
        example: "Friendly rounded sans for playful brands.",
      },
      {
        name: "Poppins",
        stack: '"Poppins", "Montserrat", "Inter", sans-serif',
        example: "Geometric sans with strong personality and curves.",
      },
      {
        name: "Montserrat",
        stack: '"Montserrat", "Poppins", "Inter", sans-serif',
        example: "Bold, contemporary sans great for headings.",
      },
      {
        name: "Roboto",
        stack: '"Roboto", "Inter", "Open Sans", sans-serif',
        example: "Google’s UI default, highly versatile.",
      },
      {
        name: "Open Sans",
        stack: '"Open Sans", "Roboto", "Inter", sans-serif',
        example: "Neutral, dependable sans for general UI.",
      },
      {
        name: "Source Sans Pro",
        stack: '"Source Sans Pro", "Inter", "Roboto", sans-serif',
        example: "Adobe’s clean sans for modern dashboards.",
      },
      {
        name: "Mulish",
        stack: '"Mulish", "Manrope", "Inter", sans-serif',
        example: "Sleek minimal sans suited for clean interfaces.",
      },
    ],
  },

  {
    token: "font-serif",
    label: "Serif",
    description: "Great for headings, hero text, or editorial layouts.",
    options: [
      {
        name: "Playfair Display",
        stack: '"Playfair Display", "Lora", "Merriweather", serif',
        example: "Classic magazine-style display serif.",
      },
      {
        name: "Merriweather",
        stack: '"Merriweather", "Source Serif 4", "Lora", serif',
        example: "Workhorse serif optimized for screens.",
      },
      {
        name: "Lora",
        stack: '"Lora", "Merriweather", "Libre Baskerville", serif',
        example: "Warm, balanced serif ideal for reading.",
      },
      {
        name: "Libre Baskerville",
        stack: '"Libre Baskerville", "Lora", "Merriweather", serif',
        example: "Traditional book-style serif with clean lines.",
      },
      {
        name: "Source Serif 4",
        stack: '"Source Serif 4", "Merriweather", "Lora", serif',
        example: "Clean serif with excellent readability.",
      },
      {
        name: "Spectral",
        stack: '"Spectral", "Source Serif 4", "Merriweather", serif',
        example: "Elegant serif with high-contrast strokes.",
      },
      {
        name: "Cormorant Garamond",
        stack: '"Cormorant Garamond", "EB Garamond", "Lora", serif',
        example: "Expressive serif with dramatic contrast.",
      },
      {
        name: "Bitter",
        stack: '"Bitter", "Merriweather", "Lora", serif',
        example: "Robust serif designed for screen clarity.",
      },
      {
        name: "Crimson Text",
        stack: '"Crimson Text", "Libre Baskerville", "Lora", serif',
        example: "Book-like serif inspired by classical typefaces.",
      },
      {
        name: "PT Serif",
        stack: '"PT Serif", "Merriweather", "Source Serif 4", serif',
        example: "Readable serif with contemporary accents.",
      },
      {
        name: "EB Garamond",
        stack: '"EB Garamond", "Cormorant Garamond", "Lora", serif',
        example: "Elegant old-style serif with delicate curves.",
      },
      {
        name: "DM Serif Display",
        stack: '"DM Serif Display", "Playfair Display", "Spectral", serif',
        example: "High-contrast display serif for bold headings.",
      },
      {
        name: "Vollkorn",
        stack: '"Vollkorn", "Merriweather", "Bitter", serif',
        example: "Sturdy serif with a traditional feel.",
      },
      {
        name: "Spectral",
        stack: '"Spectral", "Source Serif 4", "Lora", serif',
        example: "Elegant serif with sharp contrast and serious tone.",
      },
      {
        name: "Literata",
        stack: '"Literata", "Merriweather", "Lora", serif',
        example: "Google Play Books’ serif — comfortable for long reading.",
      },
    ],
  },

  {
    token: "font-mono",
    label: "Monospace",
    description: "Used in code blocks or data-heavy UI surfaces.",
    options: [
      {
        name: "JetBrains Mono",
        stack:
          '"JetBrains Mono", "Fira Code", "Menlo", "Source Code Pro", monospace',
        example: "Compact mono with ligature support.",
      },
      {
        name: "Fira Code",
        stack:
          '"Fira Code", "JetBrains Mono", "Menlo", "Source Code Pro", monospace',
        example: "Popular mono with programming ligatures.",
      },
      {
        name: "IBM Plex Mono",
        stack:
          '"IBM Plex Mono", "JetBrains Mono", "Fira Code", "Menlo", monospace',
        example: "Balanced mono with generous counters.",
      },
      {
        name: "Source Code Pro",
        stack: '"Source Code Pro", "JetBrains Mono", "Fira Code", monospace',
        example: "Adobe’s versatile mono for dense code.",
      },
      {
        name: "Inconsolata",
        stack: '"Inconsolata", "JetBrains Mono", "Fira Code", monospace',
        example: "Clean, friendly mono ideal for code blocks.",
      },
      {
        name: "Menlo",
        stack: '"Menlo", "JetBrains Mono", "Fira Code", "Consolas", monospace',
        example: "macOS system monospace with excellent clarity.",
      },
      {
        name: "Consolas",
        stack: '"Consolas", "Menlo", "JetBrains Mono", monospace',
        example: "Windows-native monospace great for dense text.",
      },
      {
        name: "Courier Prime",
        stack: '"Courier Prime", "Inconsolata", "Roboto Mono", monospace',
        example: "Modern take on Courier with improved readability.",
      },
      {
        name: "Ubuntu Mono",
        stack: '"Ubuntu Mono", "JetBrains Mono", "Fira Code", monospace',
        example: "Humanist mono with warm visual tone.",
      },
      {
        name: "Space Mono",
        stack: '"Space Mono", "IBM Plex Mono", "JetBrains Mono", monospace',
        example: "Retro mono with geometric feel.",
      },
      {
        name: "Cascadia Code",
        stack: '"Cascadia Code", "Fira Code", "JetBrains Mono", monospace',
        example: "Microsoft’s modern ligature-enabled monospace.",
      },
      {
        name: "Roboto Mono",
        stack: '"Roboto Mono", "Source Code Pro", "JetBrains Mono", monospace',
        example: "Friendly, neutral monospace for balanced UIs.",
      },
      {
        name: "PT Mono",
        stack: '"PT Mono", "IBM Plex Mono", "JetBrains Mono", monospace',
        example: "Clean professional mono for data tables.",
      },
      {
        name: "Noto Mono",
        stack: '"Noto Mono", "Roboto Mono", "Source Code Pro", monospace',
        example: "Google’s wide-coverage mono with full Unicode.",
      },
    ],
  },
] as const;

export type TypographyRangeControl = {
  token: NumericTypographyToken;
  label: string;
  description: string;
  unit: "em" | "rem";
  min: number;
  max: number;
  step: number;
  defaultValue: string;
};

export const typographyRangeControls: TypographyRangeControl[] = [
  {
    token: "tracking-normal",
    label: "Tracking",
    description:
      "Letter-spacing applied to body copy; negative values tighten text.",
    unit: "em",
    min: -0.05,
    max: 0.1,
    step: 0.025,
    defaultValue: "0em",
  },
  {
    token: "spacing",
    label: "Base Spacing",
    description: "Baseline spacing scale multiplier used by layout controls.",
    unit: "rem",
    min: 0.125,
    max: 1,
    step: 0.025,
    defaultValue: "0.25rem",
  },
] as const;
