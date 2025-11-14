import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatPanelProps = {
  messages: ChatMessage[];
  prompt: string;
  isLoading: boolean;
  onPromptChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function ChatPanel({ messages, prompt, isLoading, onPromptChange, onSubmit }: ChatPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Theme Chat</CardTitle>
        <CardDescription>
          Send quick prompts to nudge the palette, spacing, or typography. Responses are mocked for now.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-lg border p-3 text-sm transition-colors ${message.role === "assistant" ? "bg-muted/60" : "bg-card"}`}
              >
                <p className="text-xs font-medium text-muted-foreground">
                  {message.role === "user" ? "You" : "Assistant"}
                </p>
                <p className="mt-1 leading-relaxed">{message.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <Separator className="mt-2" />
      <CardFooter>
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
          <Textarea
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            placeholder="Describe the vibe you're going for..."
            className="min-h-12 flex-1"
          />
          <Button type="submit" className="sm:w-40" disabled={isLoading || !prompt.trim()}>
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
