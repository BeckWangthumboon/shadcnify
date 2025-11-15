import { httpAction } from "./_generated/server";
import { StreamId } from "@convex-dev/persistent-text-streaming";
import { streamingComponent } from "./streaming";
import { streamText, type SystemModelMessage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { GenericActionCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";
import { api } from "./_generated/api";
import { updateThemeTokensTool } from "./lib/theme";

const OPENROUTER_MODEL = "z-ai/glm-4.5-air:free";

const SYSTEM_MESSAGE: SystemModelMessage = {
  role: "system",
  content: `You are a helpful assistant that can answer questions and help with tasks.
Please provide your response in markdown format.

You are continuing a conversation. The conversation so far is found in the following JSON-formatted value:
If it is empty, this conversation is new`,
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

      for await (const delta of result.textStream) {
        if (delta.length === 0) continue;
        await append(delta);
      }

      await result.response;
    },
  );

  return response;
};

export const streamChat = httpAction(streamChatHandler);
