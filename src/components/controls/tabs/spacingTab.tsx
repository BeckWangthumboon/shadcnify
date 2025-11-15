import { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SliderField } from "@/components/ui/slider-field";
import { useThemeConfig } from "@/providers/themeProvider";
import { debounce } from "@/lib/debounce";
import {
  clampRadius,
  clampSpacing,
  formatRem,
  radiusMax,
  radiusMin,
  radiusStep,
  spacingMax,
  spacingMin,
  spacingStep,
} from "@/lib/spacing";

export function SpacingTab() {
  const { config, mode, updateTokens } = useThemeConfig();
  const activeTokens = config[mode];
  const [spacingValue, setSpacingValue] = useState(() => {
    const parsed = Number.parseFloat(activeTokens.spacing);
    return clampSpacing(parsed);
  });
  const [radiusValue, setRadiusValue] = useState(() => {
    const parsed = Number.parseFloat(activeTokens.radius);
    return clampRadius(parsed);
  });

  const debouncedSpacingUpdate = useMemo(() => {
    const fn = debounce((value: number) => {
      updateTokens(mode, (tokens) => ({
        ...tokens,
        spacing: formatRem(value),
      }));
    }, 150);
    return fn;
  }, [mode, updateTokens]);
  const debouncedRadiusUpdate = useMemo(() => {
    const fn = debounce((value: number) => {
      updateTokens(mode, (tokens) => ({
        ...tokens,
        radius: formatRem(value),
      }));
    }, 150);
    return fn;
  }, [mode, updateTokens]);

  useEffect(() => {
    return () => {
      debouncedSpacingUpdate.cancel();
    };
  }, [debouncedSpacingUpdate]);
  useEffect(() => {
    return () => {
      debouncedRadiusUpdate.cancel();
    };
  }, [debouncedRadiusUpdate]);

  useEffect(() => {
    const parsed = Number.parseFloat(activeTokens.spacing);
    setSpacingValue(clampSpacing(parsed));
  }, [activeTokens]);
  useEffect(() => {
    const parsed = Number.parseFloat(activeTokens.radius);
    setRadiusValue(clampRadius(parsed));
  }, [activeTokens]);

  const handleSpacingChange = (nextValue: number) => {
    const normalized = clampSpacing(nextValue);
    setSpacingValue(normalized);
    debouncedSpacingUpdate(normalized);
  };
  const handleRadiusChange = (nextValue: number) => {
    const normalized = clampRadius(nextValue);
    setRadiusValue(normalized);
    debouncedRadiusUpdate(normalized);
  };

  const spacingDisplay = formatRem(spacingValue);
  const radiusDisplay = formatRem(radiusValue);

  return (
    <ScrollArea className="h-[420px] px-6">
      <div className="space-y-6 pb-6">
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">
                Spacing scale (spacing)
              </CardTitle>
              <CardDescription>
                Controls the baseline rhythm for paddings, gaps, and layout
                stacks.
              </CardDescription>
            </div>
            <span className="text-sm font-medium text-foreground">
              {spacingDisplay}
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="range"
              min={spacingMin}
              max={spacingMax}
              step={spacingStep}
              value={spacingValue}
              onChange={(event) =>
                handleSpacingChange(Number.parseFloat(event.target.value))
              }
              className="accent-primary h-2 w-full rounded-full bg-muted"
              aria-label="Base spacing"
            />
            <div className="flex items-center gap-3">
              <Label className="text-xs uppercase text-muted-foreground">
                Rem value
              </Label>
              <Input
                type="number"
                step={spacingStep}
                min={spacingMin}
                max={spacingMax}
                value={spacingValue}
                onChange={(event) =>
                  handleSpacingChange(Number.parseFloat(event.target.value))
                }
                className="h-9"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Base radius</CardTitle>
            <CardDescription>
              Primary radius token applied across cards, inputs, and buttons.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SliderField
              label="Base radius"
              value={radiusDisplay}
              sliderValue={radiusValue}
              min={radiusMin}
              max={radiusMax}
              step={radiusStep}
              onChange={handleRadiusChange}
            />
            <div className="flex items-center gap-3">
              <Label className="text-xs uppercase text-muted-foreground">
                Rem value
              </Label>
              <Input
                type="number"
                step={radiusStep}
                min={radiusMin}
                max={radiusMax}
                value={radiusValue}
                onChange={(event) =>
                  handleRadiusChange(Number.parseFloat(event.target.value))
                }
                className="h-9"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
