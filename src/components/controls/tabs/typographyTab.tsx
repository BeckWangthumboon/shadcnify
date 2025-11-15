import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeConfig } from "@/providers/themeProvider";
import { fontGroups } from "@/lib/typography";
import { cn } from "@/lib/utils";

type FontTokenId = (typeof fontGroups)[number]["token"];
type FontOptionValue = string;

function resolveSelectedValue(
  tokenId: FontTokenId,
  tokenValue: string,
): FontOptionValue {
  const group = fontGroups.find((entry) => entry.token === tokenId);
  if (!group) return "";

  const firstFont = tokenValue
    ?.split(",")[0]
    ?.replace(/['"]/g, "")
    .trim()
    .toLowerCase();

  if (!firstFont) return group.options[0]?.name ?? "";

  const matched = group.options.find(
    (option) => option.name.toLowerCase() === firstFont,
  );

  return matched?.name ?? group.options[0]?.name ?? "";
}

export function TypographyTab() {
  const { config, mode, updateTokens } = useThemeConfig();
  const activeTokens = config[mode];

  const handleFontChange = (tokenId: FontTokenId, optionName: string) => {
    const group = fontGroups.find((entry) => entry.token === tokenId);
    if (!group) return;

    const selectedOption = group.options.find(
      (option) => option.name === optionName,
    );
    if (!selectedOption) return;

    updateTokens(mode, (tokens) => ({
      ...tokens,
      [tokenId]: selectedOption.stack,
    }));
  };

  return (
    <ScrollArea className="h-[420px] px-6">
      <div className="space-y-6 pb-6">
        {fontGroups.map((group) => {
          const currentValue = activeTokens[group.token];
          const selectedValue = resolveSelectedValue(group.token, currentValue);
          const selectedOption =
            group.options.find((option) => option.name === selectedValue) ??
            null;

          return (
            <Card key={group.token}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">{group.label}</CardTitle>
                  <CardDescription>
                    {group.description} : {group.token}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={cn(
                    "rounded-lg border bg-muted/40 px-3 py-2 text-sm",
                    group.token,
                  )}
                >
                  The quick brown fox jumps over the lazy dog.
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Font family
                  </Label>
                  <Select
                    value={selectedValue}
                    onValueChange={(value) =>
                      handleFontChange(group.token, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {group.options.map((option) => (
                        <SelectItem key={option.name} value={option.name}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {selectedOption?.example ??
                      "Using the preset stack shown below."}
                  </p>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    {currentValue}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
