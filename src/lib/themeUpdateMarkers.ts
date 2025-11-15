import type { ThemeMode } from "@/lib/theme";

export const THEME_UPDATE_MARKER_PREFIX = "[[THEME_UPDATE::";
export const THEME_UPDATE_MARKER_SUFFIX = "]]";
export const THEME_UPDATE_MARKER_PATTERN =
  /\[\[THEME_UPDATE::([A-Za-z0-9+/=]+)]]/g;

export type ThemeUpdateMarkerPayload = {
  toolCallId: string;
  targetMode: ThemeMode;
  updates: Record<string, string | undefined>;
};

type BufferLike = {
  from: (input: string, encoding: string) => {
    toString: (encoding: string) => string;
  };
};

function getBufferCtor(): BufferLike | null {
  if (typeof globalThis === "undefined") return null;
  const candidate = (globalThis as { Buffer?: BufferLike }).Buffer;
  return typeof candidate === "undefined" ? null : candidate;
}

export function encodeThemeUpdateMarkerPayload(
  payload: ThemeUpdateMarkerPayload,
) {
  const json = JSON.stringify(payload);
  const bufferCtor = getBufferCtor();

  if (bufferCtor) {
    return bufferCtor.from(json, "utf-8").toString("base64");
  }

  if (typeof btoa === "function") {
    return btoa(json);
  }

  throw new Error("Base64 encoding is not supported in this environment.");
}

export function decodeThemeUpdateMarkerPayload(
  encoded: string,
): ThemeUpdateMarkerPayload | null {
  try {
    const bufferCtor = getBufferCtor();

    if (bufferCtor) {
      const buffer = bufferCtor.from(encoded, "base64");
      return JSON.parse(buffer.toString("utf-8")) as ThemeUpdateMarkerPayload;
    }

    if (typeof atob === "function") {
      const decoded = atob(encoded);
      return JSON.parse(decoded) as ThemeUpdateMarkerPayload;
    }
  } catch {
    return null;
  }

  return null;
}
