import { query } from "./_generated/server";
import { THEME_TEMPLATES } from "./lib/themeTemplates";

export const getTemplates = query({
  args: {},
  handler: async () => {
    return THEME_TEMPLATES;
  },
});
