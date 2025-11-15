import { useCallback, useEffect, useState, type ComponentProps, type ReactNode } from "react";
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
  type ThemeTokens,
  type ThemeVariable,
} from "@/lib/theme";
import { useThemeConfig } from "@/providers/themeProvider";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { z } from "zod";

type ButtonProps = ComponentProps<typeof Button>;
type ThemeImportDialogProps = {
  triggerLabel?: string;
  triggerIcon?: ReactNode;
  tooltip?: string;
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

const tokenValueSchema = z
  .string()
  .trim()
  .min(1, "Token values cannot be empty.");

const tokenShape = themeVariableKeys.reduce(
  (shape, key) => {
    shape[key] = tokenValueSchema;
    return shape;
  },
  {} as Record<ThemeVariable, typeof tokenValueSchema>,
);

const themeTokensValidator = z.object(tokenShape).partial();

const validateTokens = (
  tokens: Partial<ThemeTokens>,
): { tokens: Partial<ThemeTokens> } | { error: string } => {
  const parsed = themeTokensValidator.safeParse(tokens);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const tokenName =
      (issue?.path?.[0] as string | undefined) ?? "token value";
    return {
      error: issue?.message ?? `Invalid ${tokenName}.`,
    };
  }
  return { tokens: parsed.data };
};

const parseTokensFromBlock = (block?: string) => {
  const result: Partial<ThemeTokens> = {};
  if (!block) return result;
  tokenPattern.lastIndex = 0;
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

  const validatedLight = validateTokens(lightTokens);
  if ("error" in validatedLight) return validatedLight;
  const validatedDark = validateTokens(darkTokens);
  if ("error" in validatedDark) return validatedDark;

  return {
    light: {
      ...defaultThemeConfig.light,
      ...validatedLight.tokens,
    },
    dark: {
      ...defaultThemeConfig.dark,
      ...validatedDark.tokens,
    },
  };
};

export function ThemeImportDialog({
  className,
  size = "sm",
  variant = "ghost",
  triggerLabel = "Import",
  triggerIcon,
  tooltip,
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

  const triggerText = triggerLabel || tooltip || "Import theme";
  const buttonBody = (
    <Button variant={variant} size={size} className={cn("gap-2", className)}>
      {triggerIcon}
      {triggerLabel ? (
        triggerLabel
      ) : (
        <span className="sr-only">{triggerText}</span>
      )}
    </Button>
  );

  const trigger = tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <DialogTrigger asChild>{buttonBody}</DialogTrigger>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  ) : (
    <DialogTrigger asChild>{buttonBody}</DialogTrigger>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
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
