import type { StreamId } from "@convex-dev/persistent-text-streaming";
import type { ThemeConfig } from "@/lib/theme";

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
  const light = JSON.stringify(config.light, null, 2);
  const dark = JSON.stringify(config.dark, null, 2);

  return [
    "Current theme snapshot (JSON):",
    "Light mode tokens:",
    light,
    "",
    "Dark mode tokens:",
    dark,
    "",
    "User prompt:",
    prompt,
  ].join("\n");
}
