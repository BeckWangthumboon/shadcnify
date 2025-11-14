import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BaseFieldProps = {
  label: string;
  value: string;
};

export function Field({ label, value }: BaseFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase text-muted-foreground">{label}</Label>
      <Input value={value} readOnly />
    </div>
  );
}

export function ColorField({ label, value }: BaseFieldProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-3">
      <div className="h-12 w-12 rounded-md border" style={{ background: value }} />
      <div className="flex-1">
        <Label className="text-xs uppercase text-muted-foreground">{label}</Label>
        <Input value={value} readOnly className="mt-1" />
      </div>
      <Button variant="ghost" size="sm">
        Link
      </Button>
    </div>
  );
}

export function TextareaField({ label, value }: BaseFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase text-muted-foreground">{label}</Label>
      <Textarea value={value} readOnly className="min-h-[88px]" />
    </div>
  );
}

type SliderFieldProps = {
  label: string;
  value: string;
  min?: number;
  max?: number;
  step?: number;
};

export function SliderField({ label, value, min = 0, max = 10, step = 0.5 }: SliderFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <Label className="text-xs uppercase text-muted-foreground">{label}</Label>
        <span className="text-muted-foreground">{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} defaultValue={min} className="accent-primary h-2 w-full rounded-full bg-muted" />
    </div>
  );
}
