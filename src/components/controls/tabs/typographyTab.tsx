import { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeConfig } from "@/providers/themeProvider";
import { fontGroups } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { debounce } from "@/lib/debounce";
import { Input } from "@/components/ui/input";

type FontTokenId = (typeof fontGroups)[number]["token"];
type FontOptionValue = string;
const letterSpacingMin = -0.05;
const letterSpacingMax = 0.35;
const letterSpacingStep = 0.025;

function resolveSelectedValue(
  tokenId: FontTokenId,
  tokenValue: string,
): FontOptionValue {
  const group = fontGroups.find((entry) => entry.token === tokenId);
  if (!group) return "";

  const firstFont = tokenValue
    ?.split(",")[0]
    ?.replace(/['"]/g, "")
    .trim()
    .toLowerCase();

  if (!firstFont) return group.options[0]?.name ?? "";

  const matched = group.options.find(
    (option) => option.name.toLowerCase() === firstFont,
  );

  return matched?.name ?? group.options[0]?.name ?? "";
}

export function TypographyTab() {
  const { config, mode, updateTokens } = useThemeConfig();
  const activeTokens = config[mode];
  const [trackingValue, setTrackingValue] = useState(() => {
    const parsed = Number.parseFloat(activeTokens["tracking-normal"]);
    return Number.isFinite(parsed) ? parsed : letterSpacingMin;
  });
  const debouncedTrackingUpdate = useMemo(() => {
    const fn = debounce((value: number) => {
      updateTokens(mode, (tokens) => ({
        ...tokens,
        "tracking-normal": `${value}em`,
      }));
    }, 150);
    return fn;
  }, [mode, updateTokens]);

  useEffect(() => {
    return () => {
      debouncedTrackingUpdate.cancel();
    };
  }, [debouncedTrackingUpdate]);

  useEffect(() => {
    const parsed = Number.parseFloat(activeTokens["tracking-normal"]);
    setTrackingValue(Number.isFinite(parsed) ? parsed : letterSpacingMin);
  }, [activeTokens["tracking-normal"]]);

  const handleFontChange = (tokenId: FontTokenId, optionName: string) => {
    const group = fontGroups.find((entry) => entry.token === tokenId);
    if (!group) return;

    const selectedOption = group.options.find(
      (option) => option.name === optionName,
    );
    if (!selectedOption) return;

    updateTokens(mode, (tokens) => ({
      ...tokens,
      [tokenId]: selectedOption.stack,
    }));
  };

  const handleTrackingChange = (nextValue: number) => {
    const normalized = Math.min(
      letterSpacingMax,
      Math.max(
        letterSpacingMin,
        Number.isFinite(nextValue) ? nextValue : letterSpacingMin,
      ),
    );

    setTrackingValue(normalized);
    debouncedTrackingUpdate(normalized);
  };

  const trackingDisplay = trackingValue.toFixed(3).replace(/\.?0+$/, "");

  return (
    <ScrollArea className="h-[420px] px-6">
      <div className="space-y-6 pb-6">
        {fontGroups.map((group) => {
          const currentValue = activeTokens[group.token];
          const selectedValue = resolveSelectedValue(group.token, currentValue);
          const selectedOption =
            group.options.find((option) => option.name === selectedValue) ??
            null;

          return (
            <Card key={group.token}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">
                    {group.label + " (" + group.token + ")"}
                  </CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div
                  className={cn(
                    "rounded-lg border bg-muted/40 px-3 py-2 text-sm",
                    group.token,
                  )}
                >
                  The quick brown fox jumps over the lazy dog.
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Font family
                  </Label>
                  <Select
                    value={selectedValue}
                    onValueChange={(value) =>
                      handleFontChange(group.token, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {group.options.map((option) => (
                        <SelectItem key={option.name} value={option.name}>
                          <span
                            className="text-sm"
                            style={{ fontFamily: option.stack }}
                          >
                            {option.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {selectedOption?.example ??
                      "Using the preset stack shown below."}
                  </p>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    {currentValue}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        <div className="rounded-2xl border p-4">
          <div className="flex items-center justify-between text-sm font-medium">
            <div>
              <p>Letter spacing (tracking-normal)</p>
              <p className="text-xs text-muted-foreground">
                Adjust the space between characters for body text.
              </p>
            </div>
            <span>{trackingDisplay}em</span>
          </div>
          <input
            type="range"
            min={letterSpacingMin}
            max={letterSpacingMax}
            step={letterSpacingStep}
            value={trackingValue}
            onChange={(event) =>
              handleTrackingChange(Number.parseFloat(event.target.value))
            }
            className="accent-primary mt-4 h-2 w-full rounded-full bg-muted"
            aria-label="Letter spacing"
          />
          <div className="mt-4 flex items-center gap-3">
            <Label className="text-xs uppercase text-muted-foreground">
              Precise value
            </Label>
            <Input
              type="number"
              step={letterSpacingStep}
              min={letterSpacingMin}
              max={letterSpacingMax}
              value={trackingValue}
              onChange={(event) =>
                handleTrackingChange(Number.parseFloat(event.target.value))
              }
              className="h-9"
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
