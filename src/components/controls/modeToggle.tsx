import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

type ModeToggleProps = {
  mode: "light" | "dark";
  onChange: (mode: "light" | "dark") => void;
};

function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const isDark = mode === "dark";
  return (
    <button
      type="button"
      aria-pressed={isDark}
      onClick={() => onChange(isDark ? "light" : "dark")}
      className={cn(
        "bg-muted relative inline-flex h-9 w-16 items-center rounded-full border border-border p-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isDark ? "border-ring bg-foreground/20" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "bg-background text-foreground flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-transform",
          isDark ? "translate-x-6" : "translate-x-0",
        )}
      >
        {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export default ModeToggle;
