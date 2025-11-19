import { httpRouter } from "convex/server";
import { streamChatHandler } from "./ai";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

const http = httpRouter();

// chat endpoints

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

// webhooks for clerk

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
      return new Response("Error occured", { status: 400 });
    }
    switch (event.type) {
      case "user.created": // intentional fallthrough
      case "user.updated":
        await ctx.runMutation(internal.users.upsertFromClerk, {
          data: event.data,
        });
        break;

      case "user.deleted": {
        const clerkUserId = event.data.id!;
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
        break;
      }
      default:
        console.log("Ignored Clerk webhook event", event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

export default http;
