import { useEffect, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { debounce } from "@/lib/debounce";

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

type ColorFieldProps = BaseFieldProps & {
  onChange?: (value: string) => void;
  swatch?: string;
  error?: string;
};

export function ColorField({
  label,
  value,
  swatch,
  error,
  onChange,
}: ColorFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const debouncedOnChange = useMemo(() => {
    if (!onChange) return undefined;
    const fn = debounce(onChange, 120);
    return fn;
  }, [onChange]);

  useEffect(() => {
    return () => {
      debouncedOnChange?.cancel();
    };
  }, [debouncedOnChange]);

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-3">
      <Label className="text-xs uppercase text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-4">
        <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-12 w-12 rounded-md border"
              style={{ background: swatch ?? value }}
              aria-label={`Open color picker for ${label}`}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto border-none bg-transparent p-0 shadow-none">
            <div className="rounded-xl border bg-background p-3 shadow-lg">
              <HexColorPicker
                color={swatch ?? value}
                onChange={(color) => {
                  debouncedOnChange?.(color);
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex-1">
          <Input
            value={value}
            onChange={(event) =>
              debouncedOnChange?.(event.target.value)
            }
            className="uppercase"
            spellCheck={false}
            aria-invalid={Boolean(error)}
          />
          {error ? (
            <p className="text-destructive mt-1 text-xs">{error}</p>
          ) : null}
        </div>
      </div>
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
