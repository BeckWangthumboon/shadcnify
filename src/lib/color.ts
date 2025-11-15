import Color from "colorjs.io";

const HEX_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function oklchToHex(value: string): string {
  try {
    const color = new Color(value);
    return color.to("srgb").toString({ format: "hex" });
  } catch {
    return "#000000";
  }
}

export function hexToOklch(hex: string): string | null {
  if (!isHexColor(hex)) {
    return null;
  }

  try {
    const color = new Color(hex);
    const { l, c, h } = color.to("oklch");
    return `oklch(${round(l)} ${round(c)} ${round(h)})`;
  } catch {
    return null;
  }
}

export function isHexColor(value: string) {
  return HEX_REGEX.test(value.trim());
}

export function colorStringToHex(value: string) {
  try {
    const color = new Color(value);
    return color.to("srgb").toString({ format: "hex" });
  } catch {
    return "#000000";
  }
}

export function hexToHsl(hex: string): string | null {
  if (!isHexColor(hex)) {
    return null;
  }

  try {
    const color = new Color(hex);
    const { h, s, l } = color.to("hsl");
    const hue = Number.isFinite(h) ? round(h, 2) : 0;
    const sat = Number.isFinite(s) ? round(s * 100, 2) : 0;
    const light = Number.isFinite(l) ? round(l * 100, 2) : 0;
    return `hsl(${hue} ${sat}% ${light}%)`;
  } catch {
    return null;
  }
}

function round(value: number, precision = 4) {
  return Number(value.toFixed(precision));
}
