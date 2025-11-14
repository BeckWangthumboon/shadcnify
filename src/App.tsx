import { useState } from "react";
import { ChatPanel, type ChatMessage } from "@/components/chat/chatPanel";
import {
  ManualControlsPanel,
  type ManualField,
} from "@/components/controls/controlPanel";
import { PreviewPlayground } from "@/components/playground/previewPlayground";

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "Give me a cozy palette with softer borders.",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "Try a warm neutral background, muted secondary, and increase radius for cards.",
  },
  {
    id: "3",
    role: "user",
    content: "Make the primary pop a bit more while keeping text legible.",
  },
  {
    id: "4",
    role: "assistant",
    content:
      "Boost the primary saturation slightly and tighten foreground contrast to 8:1.",
  },
];

const manualFields: ManualField[] = [
  { id: "background", label: "Background", value: "#ffffff" },
  { id: "foreground", label: "Foreground", value: "#0f172a" },
  { id: "primary", label: "Primary", value: "#0f172a" },
  { id: "radius", label: "Radius", value: "10" },
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
    }, 600);
    setPrompt("");
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <ChatPanel
            messages={mockMessages}
            prompt={prompt}
            isLoading={isLoading}
            onPromptChange={setPrompt}
            onSubmit={handleSubmit}
          />

          <ManualControlsPanel fields={manualFields} />
        </section>

        <section>
          <PreviewPlayground />
        </section>
      </div>
    </main>
  );
}
