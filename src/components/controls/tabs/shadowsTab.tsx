import { ScrollArea } from "@/components/ui/scroll-area";
import { TextareaField, SliderField } from "../controlFields";

const shadowFields = [
  { id: "shadow", label: "Shadow", value: "0px 4px 8px -1px hsl(0 0% 0% / 0.10)" },
  { id: "shadow-md", label: "Shadow Md", value: "0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 2px 4px -2px hsl(0 0% 0% / 0.10)" },
  { id: "shadow-lg", label: "Shadow Lg", value: "0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 4px 6px -2px hsl(0 0% 0% / 0.10)" },
];

export function ShadowsTab() {
  return (
    <ScrollArea className="h-[420px] px-6">
      <div className="space-y-6 pb-6">
        <div className="grid gap-4">
          {shadowFields.map((field) => (
            <TextareaField key={field.id} label={field.label} value={field.value} />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <SliderField label="Shadow offset X" value="0px" />
          <SliderField label="Shadow offset Y" value="4px" />
          <SliderField label="Blur radius" value="8px" />
          <SliderField label="Spread" value="-1px" />
          <SliderField label="Opacity" value="0.1" min={0} max={1} step={0.05} />
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">Preview</p>
          <div className="mt-4 h-24 rounded-xl bg-card shadow-md" />
        </div>
      </div>
    </ScrollArea>
  );
}
