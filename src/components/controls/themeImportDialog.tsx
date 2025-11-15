import { useCallback, useEffect, useState, type ComponentProps } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  defaultThemeConfig,
  themeVariableKeys,
  type ThemeConfig,
  type ThemeTokens,
  type ThemeVariable,
} from "@/lib/theme";
import { useThemeConfig } from "@/providers/themeProvider";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<typeof Button>;
type ThemeImportDialogProps = {
  triggerLabel?: string;
} & Pick<ButtonProps, "className" | "size" | "variant">;

type ParseSuccess = {
  light: ThemeTokens;
  dark: ThemeTokens;
};

type ParseResult = ParseSuccess | { error: string };

const tokenPattern = /--([\w-]+)\s*:\s*([^;]+);?/g;
const themeVariableSet = new Set(themeVariableKeys);

const isThemeVariable = (value: string): value is ThemeVariable =>
  themeVariableSet.has(value as ThemeVariable);

const parseTokensFromBlock = (block?: string) => {
  const result: Partial<ThemeTokens> = {};
  if (!block) return result;
  let match: RegExpExecArray | null;
  while ((match = tokenPattern.exec(block)) !== null) {
    const [, rawKey, rawValue] = match;
    if (!rawKey) continue;
    const trimmedKey = rawKey.trim();
    if (!isThemeVariable(trimmedKey)) continue;
    result[trimmedKey] = rawValue.trim();
  }
  return result;
};

const parseThemeSnippet = (input: string): ParseResult => {
  if (!input.trim()) {
    return { error: "Paste CSS variables before importing." };
  }
  const rootMatch = input.match(/:root\s*\{([\s\S]*?)\}/i);
  const darkMatch =
    input.match(/\.dark\s*\{([\s\S]*?)\}/i) ??
    input.match(/\[data-theme=['"]dark['"]\]\s*\{([\s\S]*?)\}/i) ??
    input.match(/\.theme-dark\s*\{([\s\S]*?)\}/i);

  const lightTokens = parseTokensFromBlock(rootMatch?.[1] ?? input);
  const darkTokens = parseTokensFromBlock(darkMatch?.[1]);

  if (!Object.keys(lightTokens).length && !Object.keys(darkTokens).length) {
    return {
      error:
        "No CSS variables detected. Ensure entries look like `--background: value;`.",
    };
  }

  return {
    light: {
      ...defaultThemeConfig.light,
      ...lightTokens,
    },
    dark: {
      ...defaultThemeConfig.dark,
      ...(!Object.keys(darkTokens).length ? {} : darkTokens),
    },
  };
};

export function ThemeImportDialog({
  className,
  size = "sm",
  variant = "ghost",
  triggerLabel = "Import",
}: ThemeImportDialogProps) {
  const { updateTokens } = useThemeConfig();
  const [open, setOpen] = useState(false);
  const [themeText, setThemeText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setThemeText("");
    setError(null);
  }, [open]);

  const handleImport = useCallback(() => {
    const parsed = parseThemeSnippet(themeText);
    if ("error" in parsed) {
      setError(parsed.error);
      return;
    }
    updateTokens("light", () => parsed.light);
    updateTokens("dark", () => parsed.dark);
    setOpen(false);
  }, [themeText, updateTokens]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={cn(className)}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import theme</DialogTitle>
          <DialogDescription>
            Paste CSS variables. Missing tokens fall back to the default theme.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={themeText}
            onChange={(event) => setThemeText(event.target.value)}
            placeholder="Add themes in the form:

:root {
  --background: #ffffff;
  --foreground: #000000;
  --primary: #000000;
  --secondary: #f5f5f5;
  ...
}

.dark {
  --background: #000000;
  --foreground: #ffffff;
  --primary: #ffffff;
  --secondary: #262626;
  ...
}"
            className="font-mono text-sm max-h-96 resize-none"
            style={{ minHeight: "400px" }}
          />
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Tip: paste the snippet exported from another theme and adjust it
              here.
            </p>
          )}
          <DialogFooter className="sm:justify-between">
            <span className="text-sm text-muted-foreground">
              Applies to both light `:root` and `.dark` tokens.
            </span>
            <Button onClick={handleImport}>Apply theme</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
