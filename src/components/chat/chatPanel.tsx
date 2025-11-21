import { useCallback, useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
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
import { useThemeConfig } from "@/providers/themeProvider";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import type { StreamId } from "@convex-dev/persistent-text-streaming";
import {
  buildStructuredPrompt,
  createAssistantPlaceholder,
  createId,
  createUserMessage,
  type ChatMessage,
} from "@/lib/chat/chatUtils";
import { AssistantStreamResponse } from "@/components/chat/AssistantStreamResponse";
import { ThemeUpdateTask } from "@/components/chat/ThemeUpdateTask";
import type { ThemeUpdateSummary } from "@/lib/chat/themeUpdates";

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<Id<"threads"> | null>(null);
  const [activeAssistantId, setActiveAssistantId] = useState<string | null>(
    null,
  );
  const [themeUpdatesByMessage, setThemeUpdatesByMessage] = useState<
    Record<string, ThemeUpdateSummary[]>
  >({});
  const sendMessage = useMutation(api.messages.sendMessage);
  const history = useQuery(api.messages.getThreadMessages, threadId ? { threadId } : "skip");
  const historyMessages = useMemo(() => {
    if (!history) return null;
    return history
      .filter((message) => message.role === "user" || message.role === "assistant")
      .map((message) => ({
        id: message._id,
        role: message.role as "user" | "assistant",
        content: message.content,
        streamId: message.responseStreamId as StreamId | undefined,
      }));
  }, [history]);
  const { config } = useThemeConfig();

  const sendPrompt = useCallback(async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) return;

    const userMessage = createUserMessage(trimmedPrompt);
    const assistantId = createId();

    setMessages((current) => [
      ...current,
      userMessage,
      createAssistantPlaceholder(assistantId),
    ]);
    setPrompt("");
    setIsLoading(true);

    try {
      const structuredPrompt = buildStructuredPrompt(trimmedPrompt, config);
      const { responseStreamId, threadId: returnedThreadId } = await sendMessage(
        {
          prompt: trimmedPrompt,
          structuredPrompt,
          threadId: threadId ?? undefined,
        },
      );

      if (!threadId) {
        setThreadId(returnedThreadId);
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? { ...message, streamId: responseStreamId }
            : message,
        ),
      );
      setActiveAssistantId(assistantId);
    } catch {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
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
  }, [config, isLoading, prompt, sendMessage]);

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

  const activePlaceholder = useMemo(
    () =>
      messages.find(
        (message) => message.role === "assistant" && message.streamId !== undefined,
      ),
    [messages],
  );

  const displayMessages = historyMessages
    ? [
        ...historyMessages,
        ...(activePlaceholder &&
        !historyMessages.some(
          (message) =>
            message.streamId !== undefined &&
            activePlaceholder.streamId !== undefined &&
            message.streamId === activePlaceholder.streamId,
        )
          ? [activePlaceholder]
          : []),
      ]
    : messages;
  const hasMessages = displayMessages.length > 0;

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
                {displayMessages.map((message) => (
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
