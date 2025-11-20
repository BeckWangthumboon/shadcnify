import { useEffect, useMemo, useRef } from "react";
import { useStream } from "@convex-dev/persistent-text-streaming/react";
import type { StreamId } from "@convex-dev/persistent-text-streaming";
import { Loader2 } from "lucide-react";
import { getConvexSiteUrl } from "@/lib/utils";
import { useThemeConfig } from "@/providers/themeProvider";
import { Response } from "@/components/ai-elements/response";
import { api } from "../../../convex/_generated/api";
import {
  convertThemeTokenUpdates,
  extractThemeUpdatePayloads,
  type ThemeUpdateSummary,
} from "@/lib/chat/themeUpdates";

type AssistantStreamResponseProps = {
  streamId?: StreamId;
  driven: boolean;
  fallbackText?: string;
  onFinish?: () => void;
  onThemeUpdate?: (summary: ThemeUpdateSummary) => void;
};

export function AssistantStreamResponse({
  streamId,
  driven,
  fallbackText,
  onFinish,
  onThemeUpdate,
}: AssistantStreamResponseProps) {
  const convexSiteUrl = getConvexSiteUrl();
  const streamUrl = useMemo(
    () => new URL(`${convexSiteUrl}/chat-stream`),
    [convexSiteUrl],
  );
  const { text, status } = useStream(
    api.streaming.getStreamBody,
    streamUrl,
    driven,
    streamId,
  );
  const { updateTokens } = useThemeConfig();
  const appliedToolCallIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    appliedToolCallIds.current.clear();
  }, [streamId]);

  const { cleanText, payloads } = useMemo(
    () => extractThemeUpdatePayloads(text ?? ""),
    [text],
  );

  useEffect(() => {
    payloads.forEach((payload) => {
      if (appliedToolCallIds.current.has(payload.toolCallId)) {
        return;
      }

      const { convertedTokens, tokenNames } = convertThemeTokenUpdates(
        payload.updates,
      );
      if (tokenNames.length === 0) {
        appliedToolCallIds.current.add(payload.toolCallId);
        return;
      }

      updateTokens(payload.targetMode, (tokens) => ({
        ...tokens,
        ...convertedTokens,
      }));

      appliedToolCallIds.current.add(payload.toolCallId);
      onThemeUpdate?.({
        toolCallId: payload.toolCallId,
        targetMode: payload.targetMode,
        tokens: tokenNames,
      });
    });
  }, [payloads, onThemeUpdate, updateTokens]);

  useEffect(() => {
    if (!onFinish) return;
    if (status === "done" || status === "error") {
      onFinish();
    }
  }, [status, onFinish]);

  if (!streamId) {
    if (fallbackText) {
      return <p className="text-sm text-destructive">{fallbackText}</p>;
    }
    return (
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Drafting a suggestion...
      </span>
    );
  }

  if (status === "error") {
    return (
      <p className="text-sm text-destructive">
        {fallbackText ?? "We hit an issue streaming the response. Try again."}
      </p>
    );
  }

  if (!text || status === "pending") {
    return (
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Drafting a suggestion...
      </span>
    );
  }

  return <Response>{cleanText}</Response>;
}
