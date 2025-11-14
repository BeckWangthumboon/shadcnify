import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Field } from "../controlFields";

const typographyFields = [
  { id: "font-sans", label: "Sans Serif", value: "Inter, sans-serif" },
  { id: "font-serif", label: "Serif", value: "Source Serif 4, serif" },
  { id: "font-mono", label: "Monospace", value: "JetBrains Mono, monospace" },
];

export function TypographyTab() {
  return (
    <ScrollArea className="h-[420px] px-6">
      <div className="space-y-6 pb-6">
        <div className="grid gap-4">
          {typographyFields.map((field) => (
            <Field key={field.id} label={field.label} value={field.value} />
          ))}
        </div>
        <div className="space-y-3">
          <Label htmlFor="tracking">Tracking (letter-spacing)</Label>
          <input id="tracking" type="range" min="-5" max="5" defaultValue={0} className="accent-primary h-2 w-full rounded-full bg-muted" />
          <div className="text-xs text-muted-foreground">Current: 0em</div>
        </div>
      </div>
    </ScrollArea>
  );
}
