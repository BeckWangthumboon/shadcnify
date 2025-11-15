import { Label } from "@/components/ui/label";

type SliderFieldProps = {
  label: string;
  value: string;
  sliderValue: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
};

export function SliderField({
  label,
  value,
  sliderValue,
  min = 0,
  max = 10,
  step = 0.5,
  onChange,
}: SliderFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <Label className="text-xs uppercase text-muted-foreground">
          {label}
        </Label>
        <span className="text-muted-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={(event) =>
          onChange?.(Number.parseFloat(event.target.value))
        }
        className="accent-primary h-2 w-full rounded-full bg-muted"
      />
    </div>
  );
}
