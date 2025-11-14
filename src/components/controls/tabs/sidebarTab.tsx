import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorField } from "../controlFields";

const sidebarFields = [
  { id: "sidebar", label: "Sidebar", value: "oklch(0.9846 0.0017 247.8389)" },
  { id: "sidebar-foreground", label: "Sidebar FG", value: "oklch(0.2686 0 0)" },
  { id: "sidebar-primary", label: "Sidebar Primary", value: "oklch(0.7686 0.1647 70.0804)" },
  { id: "sidebar-primary-foreground", label: "Sidebar Primary FG", value: "oklch(1.0000 0 0)" },
  { id: "sidebar-accent", label: "Sidebar Accent", value: "oklch(0.9869 0.0214 95.2774)" },
  { id: "sidebar-accent-foreground", label: "Sidebar Accent FG", value: "oklch(0.4732 0.1247 46.2007)" },
];

export function SidebarTab() {
  return (
    <ScrollArea className="h-[420px] px-6">
      <div className="space-y-6 pb-6">
        <div className="grid gap-4">
          {sidebarFields.map((field) => (
            <ColorField key={field.id} label={field.label} value={field.value} />
          ))}
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">Chart palette</p>
          <div className="mt-3 flex gap-2">
            {["#F97316", "#34D399", "#0EA5E9", "#FACC15", "#F472B6"].map((color) => (
              <div key={color} className="h-10 w-10 rounded-md border" style={{ background: color }} />
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
