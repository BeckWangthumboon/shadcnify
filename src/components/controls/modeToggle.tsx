import { cn } from "@/lib/utils";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Moon, Sun } from "lucide-react";

type ModeToggleProps = {
  mode: "light" | "dark";
  onChange: (mode: "light" | "dark") => void;
};

function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const isDark = mode === "dark";
  return (
    <SwitchPrimitive.Root
      aria-label="Toggle theme"
      checked={isDark}
      onCheckedChange={(checked) => onChange(checked ? "dark" : "light")}
      className={cn(
        "peer group inline-flex h-9 w-16 items-center rounded-full border border-border bg-muted p-1 transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[state=checked]:border-ring data-[state=checked]:bg-foreground/20",
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "relative pointer-events-none flex size-7 items-center justify-center rounded-full bg-background text-foreground shadow-sm ring-0 transition-transform",
          "data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0",
        )}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-data-[state=checked]:opacity-100"
        >
          <Moon className="size-3.5" />
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity group-data-[state=checked]:opacity-0"
        >
          <Sun className="size-3.5" />
        </span>
        <span className="sr-only">Toggle theme</span>
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export default ModeToggle;
