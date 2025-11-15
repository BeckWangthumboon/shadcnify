import { ChatPanel } from "@/components/chat/chatPanel";
import { ManualControlsPanel } from "@/components/controls/controlPanel";
import { PreviewPlayground } from "@/components/playground/previewPlayground";

export default function App() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <ChatPanel />
          <ManualControlsPanel />
        </section>

        <section>
          <PreviewPlayground />
        </section>
      </div>
    </main>
  );
}
