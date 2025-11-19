import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useThemeConfig } from "@/providers/themeProvider";
import { convertSingleTokenValue } from "@/lib/conversion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeTemplatesSelector() {
  const templates = useQuery(api.themes.getTemplates);
  const { config, mode, updateTokens } = useThemeConfig();

  const detectedTheme = useMemo(() => {
    if (!templates) return "custom";

    const activeTokens = config[mode];

    for (const [key, template] of Object.entries(templates)) {
      let isMatch = true;
      for (const [tokenKey, tokenValue] of Object.entries(template)) {
        const convertedValue = convertSingleTokenValue(
          tokenKey,
          tokenValue as string | number,
        );

        // If conversion fails or doesn't match active token, it's not this template
        if (
          !convertedValue ||
          convertedValue !== activeTokens[tokenKey as keyof typeof activeTokens]
        ) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) return key;
    }
    return "custom";
  }, [config, mode, templates]);

  const handleSelect = (value: string) => {
    if (!templates) return;
    const template = templates[value as keyof typeof templates];
    if (!template) return;

    const convertedTemplate: any = {};
    Object.entries(template).forEach(([key, value]) => {
      const converted = convertSingleTokenValue(key, value as string | number);
      if (converted) {
        convertedTemplate[key] = converted;
      }
    });

    updateTokens("light", () => convertedTemplate);
    updateTokens("dark", () => convertedTemplate);
  };

  return (
    <Select value={detectedTheme} onValueChange={handleSelect}>
      <SelectTrigger className="h-7 w-[130px] rounded-full text-xs">
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="custom" disabled>
          Custom
        </SelectItem>
        <SelectItem value="minimalist">Minimalist</SelectItem>
        <SelectItem value="neobrutalist">Neobrutalist</SelectItem>
        <SelectItem value="playful">Playful</SelectItem>
        <SelectItem value="darkProfessional">Professional</SelectItem>
        <SelectItem value="retro">Retro</SelectItem>
        <SelectItem value="highContrast">High Contrast</SelectItem>
      </SelectContent>
    </Select>
  );
}
