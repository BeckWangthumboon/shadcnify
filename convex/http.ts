import { httpRouter } from "convex/server";
import { streamChat } from "./ai";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/chat-stream",
  method: "POST",
  handler: streamChat,
});

http.route({
  path: "/chat-stream",
  method: "OPTIONS",
  handler: httpAction(async () => new Response()),
});

http.route({
  path: "/chat",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { prompt } = (await request.json()) as {
      prompt?: string;
    };

    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Missing prompt value." }), {
        status: 400,
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
    }

    const result = await ctx.runMutation(api.messages.sendMessage, {
      prompt,
    });

    return new Response(JSON.stringify(result), {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
  }),
});

http.route({
  path: "/chat",
  method: "OPTIONS",
  handler: httpAction(async () => new Response()),
});

export default http;
