import { useEffect, useMemo, useState, type FormEvent } from "react";
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
import { Loader2, Sparkles } from "lucide-react";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { api } from "../../../convex/_generated/api";
import { useStream } from "@convex-dev/persistent-text-streaming/react";
import type { StreamId } from "@convex-dev/persistent-text-streaming";
import { getConvexSiteUrl } from "@/lib/utils";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content?: string;
  streamId?: StreamId;
};

const createId = () => crypto.randomUUID?.() ?? `chat-${Date.now()}`;

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAssistantId, setActiveAssistantId] = useState<string | null>(
    null,
  );
  const sendMessage = useMutation(api.messages.sendMessage);
  const hasMessages = messages.length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) return;

    console.log("[chat] submitting prompt", trimmedPrompt);
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
      const { responseStreamId } = await sendMessage({
        prompt: trimmedPrompt,
      });

      console.log("[chat] got stream id", responseStreamId);
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessageId
            ? { ...message, streamId: responseStreamId as StreamId }
            : message,
        ),
      );
      setActiveAssistantId(assistantMessageId);
    } catch (error) {
      console.error("Chat request failed", error);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Theme Chat</CardTitle>
        <CardDescription>
          Send quick prompts to nudge the palette, spacing, or typography.
          Responses are mocked for now.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 pr-4">
          {hasMessages ? (
            <div className="flex flex-col gap-6">
              {messages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent className="max-w-full">
                    {message.role === "assistant" ? (
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
                      />
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
      </CardContent>
      <Separator className="mt-2" />
      <CardFooter>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-3 sm:flex-row"
        >
          <Textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe the vibe you're going for..."
            className="min-h-12 flex-1"
          />
          <Button
            type="submit"
            className="sm:w-40"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Thinking...
              </>
            ) : (
              "Suggest tweaks"
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
};

function AssistantStreamResponse({
  streamId,
  driven,
  fallbackText,
  onFinish,
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

  return <Response>{text}</Response>;
}
