import { httpRouter } from "convex/server";
import { streamChatHandler } from "./ai";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const withCors = (response: Response) => {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
};

http.route({
  path: "/chat-stream",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const response = await streamChatHandler(ctx, request);
    return withCors(response);
  }),
});

http.route({
  path: "/chat-stream",
  method: "OPTIONS",
  handler: httpAction(async () =>
    withCors(
      new Response(null, {
        status: 204,
      }),
    ),
  ),
});

http.route({
  path: "/chat",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { prompt } = (await request.json()) as {
      prompt?: string;
    };

    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      return withCors(
        new Response(JSON.stringify({ error: "Missing prompt value." }), {
          status: 400,
          headers: new Headers({
            "Content-Type": "application/json",
          }),
        }),
      );
    }

    const result = await ctx.runMutation(api.messages.sendMessage, {
      prompt,
    });

    return withCors(
      new Response(JSON.stringify(result), {
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      }),
    );
  }),
});

http.route({
  path: "/chat",
  method: "OPTIONS",
  handler: httpAction(async () =>
    withCors(
      new Response(null, {
        status: 204,
      }),
    ),
  ),
});

export default http;
