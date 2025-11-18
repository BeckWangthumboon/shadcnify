import { httpAction } from "./_generated/server";
import { StreamId } from "@convex-dev/persistent-text-streaming";
import { streamingComponent } from "./streaming";
import { streamText, type SystemModelMessage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { GenericActionCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";
import { api } from "./_generated/api";
import { updateThemeTokensTool } from "./lib/theme";
import {
  THEME_UPDATE_MARKER_PREFIX,
  THEME_UPDATE_MARKER_SUFFIX,
  encodeThemeUpdateMarkerPayload,
  type ThemeUpdateMarkerPayload,
} from "../src/lib/themeUpdateMarkers";

const OPENROUTER_MODEL = "z-ai/glm-4.5-air:free";

const SYSTEM_MESSAGE: SystemModelMessage = {
  role: "system",
  content: `You are the AI shadcn theme generator that powers Tweakcn-style workflows.

Always respond in markdown with concise, UI-focused guidance.

When making concrete palette or spacing changes, call the \`updateThemeTokens\` tool. It accepts only the tokens defined in the schema:
- **Colors**: background/foreground pairs, surface tokens (card, popover, sidebar), interactive sets (primary, secondary, accent, destructive), chart colors, borders, inputs, ring.
- **Typography**: font stacks for \`font-sans\`, \`font-serif\`, \`font-mono\`, and \`tracking-normal\`.
- **Layout primitives**: \`spacing\` (global 8px-based rhythm), \`radius\` (component rounding), and the shadow primitives (\`shadow-x\`, \`shadow-y\`, \`shadow-blur\`, \`shadow-spread\`, \`shadow-opacity\`, \`shadow-color\`).

Best practices:
1. **Colors** — return 6-digit hex (e.g., #0f172a). Maintain WCAG-friendly contrast for foreground/background pairs, and keep secondary/muted surfaces close to background to preserve shadcn balance.
2. **Spacing** — keep the \`spacing\` token strictly between **0.2rem and 0.3rem** (prefer 0.25rem). Stick to quarter-rem-like increments even if the user asks for more/less; otherwise explain the constraint.
3. **Radius** — limit between 0.25rem (subtle rounding) and 1.5rem (fully pill). Mention when you aim for “soft” vs “sharp” corners.
4. **Shadows** — use px units. Keep opacity between 0 and 0.35. Positive blur/spread values only; negative spread means inset-like compression. Default direction is subtle vertical offset (\`shadow-x\` ~0–2px, \`shadow-y\` 2–8px).
5. **Units** — colors in hex; spacing/radius in rem; shadows in px; letter-spacing in em. No other formats.
6. If the user does **not** specify a mode, update both light and dark palettes so they stay in sync. Issue two tool calls (one per mode) with mirrored values unless the prompt requires divergence.
7. Only modify the tokens that are necessary for the requested vibe—avoid broad changes when a minimal tweak will do.
8. Explain why each change supports the described vibe, referencing shadcn/ui components (cards, sidebar, inputs) when helpful.
9. **Multi-primary color themes** — For designs requiring multiple bright colors (neobrutalism, rainbow, retro palettes), create a black/white foundation and provide custom CSS tokens in OKLCH format for manual color application. Explain that theme tokens work best for harmonious color systems, not competing bright colors.
Do not invent new tokens—if something isn't part of the tool schema, describe it conceptually instead.`,
};

const openrouterProvider =
  process.env.OPENROUTER_API_KEY !== undefined
    ? createOpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY,
      })
    : null;

const resolveChatModel = () => {
  if (openrouterProvider) {
    return openrouterProvider(OPENROUTER_MODEL);
  }

  throw new Error(
    "Missing language model credentials. Set OPENROUTER_API_KEY.",
  );
};

export const streamChatHandler = async (
  ctx: GenericActionCtx<DataModel>,
  request: Request,
) => {
  const body = (await request.json()) as {
    streamId: string;
  };

  const streamId = body.streamId as StreamId;

  const [messageRecord] = await ctx.runQuery(api.messages.getMessages, {
    streamId,
  });

  if (!messageRecord) {
    return new Response("Unknown stream id", {
      status: 404,
    });
  }

  const response = await streamingComponent.stream(
    ctx,
    request,
    streamId,
    async (_ctx, _request, _streamId, append) => {
      const result = streamText({
        model: resolveChatModel(),
        messages: [
          SYSTEM_MESSAGE,
          {
            role: "user",
            content: messageRecord.prompt,
          },
        ],
        tools: {
          updateThemeTokens: updateThemeTokensTool,
        },
      });

      for await (const part of result.fullStream) {
        if (part.type === "text-delta") {
          if (part.text.length === 0) continue;
          await append(part.text);
          continue;
        }

        if (
          part.type === "tool-call" &&
          part.toolName === "updateThemeTokens"
        ) {
          const { targetMode, updates } =
            part.input as ThemeUpdateMarkerPayload;
          const markerPayload: ThemeUpdateMarkerPayload = {
            toolCallId: part.toolCallId,
            targetMode,
            updates,
          };
          const encoded = encodeThemeUpdateMarkerPayload(markerPayload);
          await append(
            `${THEME_UPDATE_MARKER_PREFIX}${encoded}${THEME_UPDATE_MARKER_SUFFIX}`,
          );
        }
      }

      await result.response;
    },
  );

  return response;
};

export const streamChat = httpAction(streamChatHandler);
