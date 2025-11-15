import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useThemeConfig } from "@/providers/themeProvider";
import { ColorField } from "../controlFields";
import { colorStringToHex, hexToHsl, isHexColor } from "@/lib/color";
import {
  type ShadowBaseControl,
  type ShadowBaseValues,
  shadowBaseControls,
  buildShadowPresets,
  clampShadowValue,
  deriveShadowBaseValues,
  normalizeShadowHex,
} from "@/lib/shadows";
import { Label } from "@/components/ui/label";

export function ShadowsTab() {
  const { config, mode, updateTokens } = useThemeConfig();
  const activeTokens = config[mode];

  const [baseValues, setBaseValues] = useState<ShadowBaseValues>(() =>
    deriveShadowBaseValues(activeTokens),
  );
  const [shadowColor, setShadowColor] = useState(() =>
    colorStringToHex(activeTokens["shadow-color"]),
  );
  const [colorError, setColorError] = useState<string>("");

  useEffect(() => {
    setBaseValues(deriveShadowBaseValues(activeTokens));
  }, [activeTokens]);

  useEffect(() => {
    setShadowColor(colorStringToHex(activeTokens["shadow-color"]));
  }, [activeTokens]);

  const handleBaseChange = (control: ShadowBaseControl, nextValue: number) => {
    const numeric = Number.isFinite(nextValue) ? nextValue : control.min;
    const value = clampShadowValue(numeric, control.min, control.max);
    const nextBaseValues = { ...baseValues, [control.id]: value };
    setBaseValues(nextBaseValues);

    const formatted =
      control.id === "shadow-opacity"
        ? `${value}`
        : `${value}${control.unit ?? ""}`;

    const derivedPresets = buildShadowPresets(nextBaseValues, shadowColor);

    updateTokens(mode, (tokens) => ({
      ...tokens,
      [control.id]: formatted,
      ...derivedPresets,
    }));
  };

  const handleColorChange = (nextHex: string) => {
    const normalized = normalizeShadowHex(nextHex);
    setShadowColor(normalized);

    if (!isHexColor(normalized)) {
      setColorError("Invalid hex color");
      return;
    }

    setColorError("");
    const nextHsl = hexToHsl(normalized);
    if (!nextHsl) return;

    const derivedPresets = buildShadowPresets(baseValues, normalized);

    updateTokens(mode, (tokens) => ({
      ...tokens,
      "shadow-color": nextHsl,
      ...derivedPresets,
    }));
  };

  return (
    <ScrollArea className="h-[420px] px-6">
      <div className="space-y-6 pb-6">
        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Base recipe
            </p>
            <p className="text-sm text-muted-foreground">
              Tune the primitive shadow variables that power every preset.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {shadowBaseControls.map((control) => (
              <BaseSlider
                key={control.id}
                control={control}
                value={baseValues[control.id]}
                onChange={(value) => handleBaseChange(control, value)}
              />
            ))}
          </div>
          <ColorField
            label="Shadow color"
            value={shadowColor}
            swatch={shadowColor}
            error={colorError}
            onChange={handleColorChange}
          />
        </section>
      </div>
    </ScrollArea>
  );
}

type BaseSliderProps = {
  control: ShadowBaseControl;
  value: number;
  onChange: (value: number) => void;
};

function BaseSlider({ control, value, onChange }: BaseSliderProps) {
  const displayValue = control.unit
    ? `${value}${control.unit}`
    : value.toFixed(2).replace(/\.00$/, "");

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{control.label}</p>
          {control.description ? (
            <p className="text-xs text-muted-foreground">
              {control.description}
            </p>
          ) : null}
        </div>
        <span className="text-xs text-muted-foreground">{displayValue}</span>
      </div>
      <input
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-primary h-2 w-full rounded-full bg-muted"
      />
      <div className="flex items-center gap-2">
        <Label className="text-xs uppercase text-muted-foreground">Value</Label>
        <Input
          type="number"
          value={value}
          step={control.step}
          min={control.min}
          max={control.max}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-9"
        />
      </div>
    </div>
  );
}
