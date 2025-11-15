import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useMutation } from "convex/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Send, Sparkles } from "lucide-react";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import {
  Task,
  TaskContent,
  TaskItem,
  TaskItemFile,
  TaskTrigger,
} from "@/components/ai-elements/task";
import { api } from "../../../convex/_generated/api";
import { useStream } from "@convex-dev/persistent-text-streaming/react";
import type { StreamId } from "@convex-dev/persistent-text-streaming";
import { getConvexSiteUrl } from "@/lib/utils";
import { useThemeConfig } from "@/providers/themeProvider";
import { hexToHsl, hexToOklch } from "@/lib/color";
import type {
  ThemeConfig,
  ThemeMode,
  ThemeTokens,
  ThemeVariable,
} from "@/lib/theme";
import {
  decodeThemeUpdateMarkerPayload,
  type ThemeUpdateMarkerPayload,
} from "@/lib/themeUpdateMarkers";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content?: string;
  streamId?: StreamId;
};

const createId = () => crypto.randomUUID?.() ?? `chat-${Date.now()}`;

type ThemeUpdateSummary = {
  toolCallId: string;
  targetMode: ThemeMode;
  tokens: ThemeVariable[];
};

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAssistantId, setActiveAssistantId] = useState<string | null>(
    null,
  );
  const [themeUpdatesByMessage, setThemeUpdatesByMessage] = useState<
    Record<string, ThemeUpdateSummary[]>
  >({});
  const sendMessage = useMutation(api.messages.sendMessage);
  const hasMessages = messages.length > 0;
  const { config } = useThemeConfig();

  const sendPrompt = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) return;

    const newMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmedPrompt,
    };

    const assistantMessageId = createId();
    const assistantPlaceholder: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
    };

    setMessages((current) => [...current, newMessage, assistantPlaceholder]);
    setPrompt("");
    setIsLoading(true);

    try {
      const themeSnapshot = formatThemeSnapshot(config);
      const structuredPrompt = [
        "Current theme snapshot (JSON):",
        themeSnapshot,
        "",
        "User prompt:",
        trimmedPrompt,
      ].join("\n");

      const { responseStreamId } = await sendMessage({
        prompt: structuredPrompt,
      });

      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessageId
            ? { ...message, streamId: responseStreamId }
            : message,
        ),
      );
      setActiveAssistantId(assistantMessageId);
    } catch {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content:
                  "We couldn't reach the AI service. Try again in a moment.",
              }
            : message,
        ),
      );
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendPrompt();
  };

  const handleThemeUpdate = useCallback(
    (messageId: string, summary: ThemeUpdateSummary) => {
      setThemeUpdatesByMessage((previous) => {
        const existing = previous[messageId] ?? [];
        if (existing.some((item) => item.toolCallId === summary.toolCallId)) {
          return previous;
        }

        return {
          ...previous,
          [messageId]: [...existing, summary],
        };
      });
    },
    [],
  );

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>AI Theme Chat</CardTitle>
        <CardDescription>
          Send quick prompts to nudge the palette, spacing, or typography.
          Responses are mocked for now.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden max-h-[22rem]">
        <div className="flex-1 h-full">
          <ScrollArea className="h-full pr-4">
            {hasMessages ? (
              <div className="flex flex-col gap-6 pb-4">
                {messages.map((message) => (
                  <Message key={message.id} from={message.role}>
                    <MessageContent className="max-w-full">
                      {message.role === "assistant" ? (
                        <>
                          <AssistantStreamResponse
                            driven={activeAssistantId === message.id}
                            streamId={message.streamId}
                            fallbackText={message.content}
                            onFinish={() => {
                              if (activeAssistantId === message.id) {
                                setActiveAssistantId(null);
                                setIsLoading(false);
                              }
                            }}
                            onThemeUpdate={(summary) =>
                              handleThemeUpdate(message.id, summary)
                            }
                          />
                          <ThemeUpdateTask
                            updates={themeUpdatesByMessage[message.id] ?? []}
                          />
                        </>
                      ) : (
                        <p className="text-sm leading-relaxed text-foreground">
                          {message.content}
                        </p>
                      )}
                    </MessageContent>
                  </Message>
                ))}
              </div>
            ) : (
              <div className="flex h-60 flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <Sparkles className="mb-2 size-5 text-primary" />
                <p>
                  Describe the mood, palette, or spacing tweaks you are after.
                </p>
                <p>Responses will render with the AI Elements layout.</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
      <Separator className="mt-2" />
      <CardFooter>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-3 sm:flex-row sm:items-start"
        >
          <Textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe the vibe you're going for..."
            className="min-h-24 max-h-48 flex-1 resize-none overflow-y-auto"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void sendPrompt();
              }
            }}
          />
          <Button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            size="icon"
            className="self-start"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Send className="size-4" />
                <span className="sr-only">Send message</span>
              </>
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

type AssistantStreamResponseProps = {
  streamId?: StreamId;
  driven: boolean;
  fallbackText?: string;
  onFinish?: () => void;
  onThemeUpdate?: (summary: ThemeUpdateSummary) => void;
};

function AssistantStreamResponse({
  streamId,
  driven,
  fallbackText,
  onFinish,
  onThemeUpdate,
}: AssistantStreamResponseProps) {
  const convexSiteUrl = getConvexSiteUrl();
  const streamUrl = useMemo(
    () => new URL(`${convexSiteUrl}/chat-stream`),
    [convexSiteUrl],
  );
  const { text, status } = useStream(
    api.streaming.getStreamBody,
    streamUrl,
    driven,
    streamId,
  );
  const { updateTokens } = useThemeConfig();
  const appliedToolCallIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    appliedToolCallIds.current.clear();
  }, [streamId]);

  const { cleanText, payloads } = useMemo(
    () => extractThemeUpdatePayloads(text ?? ""),
    [text],
  );

  useEffect(() => {
    payloads.forEach((payload) => {
      if (appliedToolCallIds.current.has(payload.toolCallId)) {
        return;
      }

      const { convertedTokens, tokenNames } = convertThemeTokenUpdates(
        payload.updates,
      );
      if (tokenNames.length === 0) {
        appliedToolCallIds.current.add(payload.toolCallId);
        return;
      }

      updateTokens(payload.targetMode, (tokens) => ({
        ...tokens,
        ...convertedTokens,
      }));

      appliedToolCallIds.current.add(payload.toolCallId);
      onThemeUpdate?.({
        toolCallId: payload.toolCallId,
        targetMode: payload.targetMode,
        tokens: tokenNames,
      });
    });
  }, [payloads, onThemeUpdate, updateTokens]);

  useEffect(() => {
    if (!onFinish) return;
    if (status === "done" || status === "error") {
      onFinish();
    }
  }, [status, onFinish]);

  if (!streamId) {
    if (fallbackText) {
      return <p className="text-sm text-destructive">{fallbackText}</p>;
    }
    return (
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Drafting a suggestion...
      </span>
    );
  }

  if (status === "error") {
    return (
      <p className="text-sm text-destructive">
        {fallbackText ?? "We hit an issue streaming the response. Try again."}
      </p>
    );
  }

  if (!text || status === "pending") {
    return (
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Drafting a suggestion...
      </span>
    );
  }

  return <Response>{cleanText}</Response>;
}

function ThemeUpdateTask({ updates }: { updates: ThemeUpdateSummary[] }) {
  if (!updates.length) {
    return null;
  }

  return (
    <Task defaultOpen className="mt-3">
      <TaskTrigger title="Theme tokens updated" />
      <TaskContent>
        {updates.map((update) => (
          <TaskItem key={update.toolCallId}>
            <p className="text-xs font-medium text-foreground">
              Applied to {update.targetMode} mode
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {update.tokens.map((token) => (
                <TaskItemFile key={`${update.toolCallId}-${token}`}>
                  {token}
                </TaskItemFile>
              ))}
            </div>
          </TaskItem>
        ))}
      </TaskContent>
    </Task>
  );
}

const COLOR_TOKEN_IDS: ThemeVariable[] = [
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

function extractThemeUpdatePayloads(text: string): {
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

function convertThemeTokenUpdates(
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

function convertSingleTokenValue(tokenId: ThemeVariable, value: string) {
  if (COLOR_TOKEN_SET.has(tokenId)) {
    return hexToOklch(value.trim()) ?? null;
  }

  if (tokenId === "shadow-color") {
    return hexToHsl(value.trim());
  }

  return value;
}

function formatThemeSnapshot(config: ThemeConfig) {
  const light = JSON.stringify(config.light, null, 2);
  const dark = JSON.stringify(config.dark, null, 2);

  return ["Light mode tokens:", light, "", "Dark mode tokens:", dark].join(
    "\n",
  );
}
