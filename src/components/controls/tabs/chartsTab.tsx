import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorField } from "../controlFields";
import { useThemeConfig } from "@/providers/themeProvider";
import { debounce } from "@/lib/debounce";
import { hexToOklch, isHexColor, oklchToHex } from "@/lib/color";
import type { ThemeVariable } from "@/lib/theme";

const chartTokens: { id: ThemeVariable; label: string }[] = [
  { id: "chart-1", label: "Chart 01" },
  { id: "chart-2", label: "Chart 02" },
  { id: "chart-3", label: "Chart 03" },
  { id: "chart-4", label: "Chart 04" },
  { id: "chart-5", label: "Chart 05" },
];

export function ChartsTab() {
  const { config, mode, updateTokens } = useThemeConfig();
  const activeTokens = config[mode];

  const derivedHex = useMemo(() => {
    const entries: Record<string, string> = {};
    chartTokens.forEach((token) => {
      entries[token.id] = oklchToHex(activeTokens[token.id]);
    });
    return entries;
  }, [activeTokens]);

  const [values, setValues] = useState<Record<string, string>>(derivedHex);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const debouncers = useRef<Record<string, ReturnType<typeof debounce>>>({});

  useEffect(() => {
    setValues(derivedHex);
    setErrors({});
    Object.values(debouncers.current).forEach((fn) => fn.cancel());
    debouncers.current = {};
  }, [derivedHex]);

  useEffect(() => {
    return () => {
      Object.values(debouncers.current).forEach((fn) => fn.cancel());
    };
  }, []);

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
      debouncers.current[tokenId]?.cancel();
      delete debouncers.current[tokenId];
      return;
    }

    setErrors((prev) => ({ ...prev, [tokenId]: "" }));

    if (!debouncers.current[tokenId]) {
      debouncers.current[tokenId] = debounce((hexValue: string) => {
        const nextOklch = hexToOklch(hexValue);
        if (!nextOklch) return;

        updateTokens(mode, (tokens) => ({
          ...tokens,
          [tokenId]: nextOklch,
        }));
      }, 150);
    }

    debouncers.current[tokenId](normalized);
  };

  return (
    <ScrollArea className="h-[420px] px-6">
      <div className="space-y-4 pb-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Chart palette</h4>
            <p className="text-xs text-muted-foreground">
              Updates data-series colors independently.
            </p>
          </div>
          <div className="grid gap-4">
            {chartTokens.map((token) => (
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
        </div>
      </div>
    </ScrollArea>
  );
}
