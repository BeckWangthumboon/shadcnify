import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PreviewPlayground() {
  return (
    <Card className="min-h-[280px]">
      <CardHeader>
        <CardTitle>Preview Playground</CardTitle>
        <CardDescription>Drop shadcn components here to see how the live theme feels.</CardDescription>
      </CardHeader>
      <CardContent className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-sm">Component previews coming soon.</p>
      </CardContent>
    </Card>
  );
}
