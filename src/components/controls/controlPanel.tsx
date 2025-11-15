import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from "react";
import { useThemeConfig } from "@/providers/themeProvider";
import { ColorsTab } from "./tabs/colorsTab";
import { TypographyTab } from "./tabs/typographyTab";
import { ShadowsTab } from "./tabs/shadowsTab";
import { SpacingTab } from "./tabs/spacingTab";
import { ChartsTab } from "./tabs/chartsTab";
import ModeToggle from "./modeToggle";
import { convertTokensForMode } from "@/lib/conversion";

export function ManualControlsPanel() {
  const { mode, setMode, resetConfig, updateTokens } = useThemeConfig();
  const convertTarget = useMemo(
    () => (mode === "light" ? "dark" : "light"),
    [mode],
  );

  const handleConvert = () => {
    updateTokens(mode, (tokens) => convertTokensForMode(tokens, convertTarget));
    setMode(convertTarget);
  };
  const convertLabel =
    mode === "light" ? "Convert to dark" : "Convert to light";
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-full flex-1">
            <CardTitle>Manual Theme Controls</CardTitle>
            <CardDescription>
              Adjust tokens per category. Values are read-only until wiring is
              complete.
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-3">
            <ModeToggle mode={mode} onChange={setMode} />
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-4"
                onClick={handleConvert}
              >
                {convertLabel}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-4"
                onClick={resetConfig}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden px-0 pb-0">
        <Tabs defaultValue="colors" className="flex h-full flex-col">
          <div className="px-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="shadows">Shadows</TabsTrigger>
              <TabsTrigger value="spacing">Spacing</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
            </TabsList>
          </div>
          <div className="mt-4 flex-1">
            <TabsContent value="colors" className="h-full">
              <ColorsTab />
            </TabsContent>
            <TabsContent value="typography" className="h-full">
              <TypographyTab />
            </TabsContent>
            <TabsContent value="shadows" className="h-full">
              <ShadowsTab />
            </TabsContent>
            <TabsContent value="spacing" className="h-full">
              <SpacingTab />
            </TabsContent>
            <TabsContent value="charts" className="h-full">
              <ChartsTab />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
