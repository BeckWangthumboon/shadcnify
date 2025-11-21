import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { streamingComponent } from "./streaming";
import type { Doc, Id } from "./_generated/dataModel";

type CommonCtx = MutationCtx | QueryCtx;

const MESSAGE_ROLES = ["system", "assistant", "user"] as const;

// Ensure the caller is authenticated and return the user doc.
async function assertUserAuthenticated(ctx: CommonCtx): Promise<Doc<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("User not authenticated");
  }

  // Prefer subject (Clerk user id) to match existing rows.
  const userRecord = await ctx.db
    .query("users")
    .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
    .unique();

  if (!userRecord) {
    throw new Error("User not found");
  }

  return userRecord;
}

// Verify a thread belongs to the given user.
async function assertThreadBelongsToUser(
  ctx: CommonCtx,
  threadId: Id<"threads">,
  userId: Id<"users">,
) {
  const thread = await ctx.db.get(threadId);
  if (!thread) {
    throw new Error("Thread not found");
  }
  if (thread.userId !== userId) {
    throw new Error("Thread does not belong to the user");
  }
  return thread;
}

type SaveMessageInput = {
  threadId: Id<"threads">;
  role: (typeof MESSAGE_ROLES)[number];
  content: string;
  responseStreamId?: string;
  toolCalls?: Doc<"messages">["toolCalls"];
  toolResults?: Doc<"messages">["toolResults"];
};

export async function saveMessage(
  ctx: MutationCtx,
  input: SaveMessageInput,
): Promise<Id<"messages">> {
  return await ctx.db.insert("messages", {
    threadId: input.threadId,
    role: input.role,
    content: input.content,
    responseStreamId: input.responseStreamId,
    toolCalls: input.toolCalls,
    toolResults: input.toolResults,
  });
}

export async function saveAssistantMessage(
  ctx: MutationCtx,
  threadId: Id<"threads">,
  content: string,
  extras?: Pick<
    SaveMessageInput,
    "toolCalls" | "toolResults" | "responseStreamId"
  >,
) {
  return await saveMessage(ctx, {
    threadId,
    role: "assistant",
    content,
    responseStreamId: extras?.responseStreamId,
    toolCalls: extras?.toolCalls,
    toolResults: extras?.toolResults,
  });
}

// Internal mutation to record an assistant reply after streaming completes.
export const recordAssistantMessage = internalMutation({
  args: {
    threadId: v.id("threads"),
    content: v.string(),
    responseStreamId: v.optional(v.string()),
    toolCalls: v.optional(v.any()),
    toolResults: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await saveAssistantMessage(ctx, args.threadId, args.content, {
      responseStreamId: args.responseStreamId,
      toolCalls: args.toolCalls as SaveMessageInput["toolCalls"],
      toolResults: args.toolResults as SaveMessageInput["toolResults"],
    });
  },
});

// Public mutation to post a user message and start streaming.
export const sendMessage = mutation({
  args: {
    prompt: v.string(),
    threadId: v.optional(v.id("threads")),
  },
  handler: async (ctx, args) => {
    const user = await assertUserAuthenticated(ctx);

    let threadId = args.threadId;
    if (threadId) {
      await assertThreadBelongsToUser(ctx, threadId, user._id);
    } else {
      threadId = await ctx.db.insert("threads", { userId: user._id });
    }

    const responseStreamId = await streamingComponent.createStream(ctx);
    const messageId = await saveMessage(ctx, {
      threadId,
      role: "user",
      content: args.prompt,
      responseStreamId,
    });

    return { threadId, messageId, responseStreamId };
  },
});

// Internal query: ordered messages for a thread.
export const getThreadMessages = internalQuery({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const user = await assertUserAuthenticated(ctx);
    await assertThreadBelongsToUser(ctx, args.threadId, user._id);

    return await ctx.db
      .query("messages")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .collect();
  },
});

// Internal query: resolve a stream id to a message (and enforce ownership).
export const getMessageByStreamId = internalQuery({
  args: {
    streamId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await assertUserAuthenticated(ctx);

    const message = await ctx.db
      .query("messages")
      .withIndex("by_responseStreamId", (q) =>
        q.eq("responseStreamId", args.streamId),
      )
      .unique();

    if (!message) {
      return null;
    }

    await assertThreadBelongsToUser(ctx, message.threadId, user._id);
    return message;
  },
});
