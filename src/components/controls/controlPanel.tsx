import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ManualField = {
  id: string;
  label: string;
  value: string;
};

type ManualControlsPanelProps = {
  fields: ManualField[];
};

export function ManualControlsPanel({ fields }: ManualControlsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Theme Controls</CardTitle>
        <CardDescription>
          Wire these inputs to your theme state so edits instantly update the preview.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input id={field.id} value={field.value} readOnly aria-readonly placeholder="(coming soon)" />
          </div>
        ))}
        <p className="text-sm text-muted-foreground">
          Hook these up to actual tokens later to keep manual + AI edits in sync.
        </p>
      </CardContent>
    </Card>
  );
}
