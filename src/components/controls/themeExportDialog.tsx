import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { themeVariableKeys, type ThemeTokens } from "@/lib/theme";
import { useThemeConfig } from "@/providers/themeProvider";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";

type ButtonProps = ComponentProps<typeof Button>;
type ThemeExportDialogProps = {
  triggerLabel?: string;
} & Pick<ButtonProps, "className" | "size" | "variant">;

export function ThemeExportDialog({
  className,
  size = "sm",
  variant = "ghost",
  triggerLabel = "Export",
}: ThemeExportDialogProps) {
  const { config } = useThemeConfig();
  const [copied, setCopied] = useState(false);

  const cssSnippet = useMemo(() => {
    const formatTokens = (tokens: ThemeTokens) =>
      themeVariableKeys.map((key) => `  --${key}: ${tokens[key]};`).join("\n");
    const lightBlock = `:root {\n${formatTokens(config.light)}\n}`;
    const darkBlock = `.dark {\n${formatTokens(config.dark)}\n}`;
    return `${lightBlock}\n\n${darkBlock}`;
  }, [config]);

  const handleCopy = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator?.clipboard) return;
    try {
      await navigator.clipboard.writeText(cssSnippet);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy theme snippet", error);
    }
  }, [cssSnippet]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={cn(className)}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export theme</DialogTitle>
          <DialogDescription>
            Copy CSS variables for light and dark modes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="w-full rounded-lg border bg-muted/30">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <span className="text-sm font-medium text-muted-foreground">
                CSS variables
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                onClick={handleCopy}
              >
                {copied ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
                <span className="sr-only">Copy</span>
              </Button>
            </div>
            <div className="h-72 w-full overflow-auto rounded-b-lg bg-background p-4 text-sm leading-relaxed">
              <code className="block whitespace-pre font-mono max-w-50">
                {cssSnippet}
              </code>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
