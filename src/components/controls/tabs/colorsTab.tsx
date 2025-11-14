import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ColorField } from "../controlFields";

const colorGroups = [
  {
    title: "Interactive",
    tokens: [
      {
        id: "primary",
        label: "Primary",
        value: "oklch(0.7686 0.1647 70.0804)",
      },
      {
        id: "primary-foreground",
        label: "Primary Foreground",
        value: "oklch(0 0 0)",
      },
      {
        id: "secondary",
        label: "Secondary",
        value: "oklch(0.9670 0.0029 264.5419)",
      },
      {
        id: "secondary-foreground",
        label: "Secondary Foreground",
        value: "oklch(0.4461 0.0263 256.8018)",
      },
      { id: "accent", label: "Accent", value: "oklch(0.9869 0.0214 95.2774)" },
      {
        id: "accent-foreground",
        label: "Accent Foreground",
        value: "oklch(0.4732 0.1247 46.2007)",
      },
      {
        id: "destructive",
        label: "Destructive",
        value: "oklch(0.6368 0.2078 25.3313)",
      },
      {
        id: "destructive-foreground",
        label: "Destructive Foreground",
        value: "oklch(1.0000 0 0)",
      },
    ],
  },
  {
    title: "Base",
    tokens: [
      { id: "background", label: "Background", value: "oklch(1.0000 0 0)" },
      { id: "foreground", label: "Foreground", value: "oklch(0.2686 0 0)" },
      { id: "muted", label: "Muted", value: "oklch(0.9846 0.0017 247.8389)" },
      {
        id: "muted-foreground",
        label: "Muted Foreground",
        value: "oklch(0.5510 0.0234 264.3637)",
      },
      { id: "border", label: "Border", value: "oklch(0.9276 0.0058 264.5313)" },
      { id: "input", label: "Input", value: "oklch(0.9276 0.0058 264.5313)" },
      { id: "ring", label: "Ring", value: "oklch(0.7686 0.1647 70.0804)" },
    ],
  },
  {
    title: "Components",
    tokens: [
      { id: "card", label: "Card", value: "oklch(1.0000 0 0)" },
      {
        id: "card-foreground",
        label: "Card Foreground",
        value: "oklch(0.2686 0 0)",
      },
      { id: "popover", label: "Popover", value: "oklch(1.0000 0 0)" },
      {
        id: "popover-foreground",
        label: "Popover Foreground",
        value: "oklch(0.2686 0 0)",
      },
      {
        id: "sidebar",
        label: "Sidebar",
        value: "oklch(0.9846 0.0017 247.8389)",
      },
      {
        id: "sidebar-foreground",
        label: "Sidebar Foreground",
        value: "oklch(0.2686 0 0)",
      },
      {
        id: "sidebar-primary",
        label: "Sidebar Primary",
        value: "oklch(0.7686 0.1647 70.0804)",
      },
      {
        id: "sidebar-primary-foreground",
        label: "Sidebar Primary Foreground",
        value: "oklch(1.0000 0 0)",
      },
      {
        id: "sidebar-accent",
        label: "Sidebar Accent",
        value: "oklch(0.9869 0.0214 95.2774)",
      },
      {
        id: "sidebar-accent-foreground",
        label: "Sidebar Accent Foreground",
        value: "oklch(0.4732 0.1247 46.2007)",
      },
      {
        id: "sidebar-border",
        label: "Sidebar Border",
        value: "oklch(0.9276 0.0058 264.5313)",
      },
      {
        id: "sidebar-ring",
        label: "Sidebar Ring",
        value: "oklch(0.7686 0.1647 70.0804)",
      },
    ],
  },
];

export function ColorsTab() {
  return (
    <ScrollArea className="h-[420px] px-6">
      <div className="space-y-6 pb-6">
        {colorGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{group.title}</h4>
            </div>
            <div className="grid gap-4">
              {group.tokens.map((token) => (
                <ColorField
                  key={token.id}
                  label={token.label}
                  value={token.value}
                />
              ))}
            </div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
