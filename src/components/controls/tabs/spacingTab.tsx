import { ScrollArea } from "@/components/ui/scroll-area";
import { SliderField } from "../controlFields";

export function SpacingTab() {
  return (
    <ScrollArea className="h-[420px] px-6">
      <div className="space-y-6 pb-6">
        <SliderField label="Base radius" value="0.375rem" min={0} max={1} step={0.05} />
        <SliderField label="Base spacing" value="0.25rem" min={0} max={2} step={0.05} />
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Derived radii</p>
          <div className="mt-3 flex gap-3">
            {["sm", "md", "lg", "xl"].map((size) => (
              <div key={size} className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border text-xs">
                <span className="font-semibold">--{size}</span>
                <span className="text-muted-foreground">auto</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
