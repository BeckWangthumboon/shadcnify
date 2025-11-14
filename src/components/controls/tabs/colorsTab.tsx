import { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ColorField } from "../controlFields";
import { useThemeConfig } from "@/providers/themeProvider";
import { hexToOklch, isHexColor, oklchToHex } from "@/lib/color";
import type { ThemeVariable } from "@/lib/theme";

type ColorGroupToken = {
  id: ThemeVariable;
  label: string;
};

const colorGroups: {
  title: string;
  tokens: ColorGroupToken[];
}[] = [
  {
    title: "Interactive",
    tokens: [
      { id: "primary", label: "Primary" },
      { id: "primary-foreground", label: "Primary Foreground" },
      { id: "secondary", label: "Secondary" },
      { id: "secondary-foreground", label: "Secondary Foreground" },
      { id: "accent", label: "Accent" },
      { id: "accent-foreground", label: "Accent Foreground" },
      { id: "destructive", label: "Destructive" },
      { id: "destructive-foreground", label: "Destructive Foreground" },
    ],
  },
  {
    title: "Base",
    tokens: [
      { id: "background", label: "Background" },
      { id: "foreground", label: "Foreground" },
      { id: "muted", label: "Muted" },
      { id: "muted-foreground", label: "Muted Foreground" },
      { id: "border", label: "Border" },
      { id: "input", label: "Input" },
      { id: "ring", label: "Ring" },
    ],
  },
  {
    title: "Components",
    tokens: [
      { id: "card", label: "Card" },
      { id: "card-foreground", label: "Card Foreground" },
      { id: "popover", label: "Popover" },
      { id: "popover-foreground", label: "Popover Foreground" },
      { id: "sidebar", label: "Sidebar" },
      { id: "sidebar-foreground", label: "Sidebar Foreground" },
      { id: "sidebar-primary", label: "Sidebar Primary" },
      { id: "sidebar-primary-foreground", label: "Sidebar Primary Foreground" },
      { id: "sidebar-accent", label: "Sidebar Accent" },
      { id: "sidebar-accent-foreground", label: "Sidebar Accent Foreground" },
      { id: "sidebar-border", label: "Sidebar Border" },
      { id: "sidebar-ring", label: "Sidebar Ring" },
    ],
  },
];

export function ColorsTab() {
  const { config, mode, updateTokens } = useThemeConfig();
  const activeTokens = config[mode];

  const derivedHex = useMemo(() => {
    const entries: Record<string, string> = {};
    colorGroups.forEach((group) => {
      group.tokens.forEach((token) => {
        entries[token.id] = oklchToHex(activeTokens[token.id]);
      });
    });
    return entries;
  }, [activeTokens]);

  const [values, setValues] = useState<Record<string, string>>(derivedHex);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(derivedHex);
    setErrors({});
  }, [derivedHex]);

  const handleChange = (tokenId: ThemeVariable, nextValue: string) => {
    const normalized = nextValue.startsWith("#")
      ? nextValue
      : `#${nextValue.replace(/^#/, "")}`;
    setValues((previous) => ({
      ...previous,
      [tokenId]: normalized,
    }));

    if (!isHexColor(normalized)) {
      setErrors((prev) => ({ ...prev, [tokenId]: "Invalid hex color" }));
      return;
    }

    setErrors((prev) => ({ ...prev, [tokenId]: "" }));
    const nextOklch = hexToOklch(normalized);
    if (!nextOklch) return;

    updateTokens(mode, (tokens) => ({
      ...tokens,
      [tokenId]: nextOklch,
    }));
  };

  return (
    <ScrollArea className="h-[420px] px-6">
      <div className="space-y-6 pb-6">
        {colorGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{group.title}</h4>
            </div>
            <div className="grid gap-4">
              {group.tokens.map((token) => (
                <ColorField
                  key={token.id}
                  label={token.label}
                  value={values[token.id] ?? derivedHex[token.id]}
                  swatch={
                    isHexColor(values[token.id])
                      ? values[token.id]
                      : derivedHex[token.id]
                  }
                  error={errors[token.id]}
                  onChange={(value) => handleChange(token.id, value)}
                />
              ))}
            </div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
