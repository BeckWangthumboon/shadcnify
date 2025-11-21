import type { StreamId } from "@convex-dev/persistent-text-streaming";
import type { ThemeConfig } from "@/lib/theme";
import { oklchToHex } from "@/lib/color";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content?: string;
  streamId?: StreamId;
};

export const createId = () => crypto.randomUUID?.() ?? `chat-${Date.now()}`;

export function createUserMessage(content: string): ChatMessage {
  return {
    id: createId(),
    role: "user",
    content,
  };
}

export function createAssistantPlaceholder(id: string): ChatMessage {
  return {
    id,
    role: "assistant",
    content: "",
  };
}

export function buildStructuredPrompt(prompt: string, config: ThemeConfig) {
  const light = JSON.stringify(convertThemeToHex(config.light), null, 2);
  const dark = JSON.stringify(convertThemeToHex(config.dark), null, 2);

  return [
    "Current theme snapshot (hex):",
    "Light mode tokens:",
    light,
    "\n",
    "Dark mode tokens:",
    dark,
    "\n",
    "User prompt:",
    prompt,
  ].join("\n");
}

function convertThemeToHex(theme: ThemeConfig["light"]) {
  const entries = Object.entries(theme).map(([key, value]) => {
    if (typeof value === "string") {
      return [key, oklchToHex(value)];
    }
    return [key, value];
  });
  return Object.fromEntries(entries);
}
