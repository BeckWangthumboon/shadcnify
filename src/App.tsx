import { ChatPanel } from "@/components/chat/chatPanel";
import { ManualControlsPanel } from "@/components/controls/controlPanel";
import { PreviewPlayground } from "@/components/playground/previewPlayground";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function App() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
        <div className="flex items-center justify-end gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="relative">
            <SignedIn>
              <ChatPanel />
            </SignedIn>
            <SignedOut>
              <Card className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 border-dashed bg-muted/60 p-6 text-center backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-base font-semibold">Sign in to chat</p>
                  <p className="text-sm text-muted-foreground">
                    Unlock AI powered theme edits by signing in
                  </p>
                </div>
                <SignInButton mode="modal">
                  <Button>Sign in to continue</Button>
                </SignInButton>
              </Card>
              <ChatPanel />
            </SignedOut>
          </div>
          <ManualControlsPanel />
        </section>

        <section>
          <PreviewPlayground />
        </section>
      </div>
    </main>
  );
}
