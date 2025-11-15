import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { streamingComponent } from "./streaming";

export const sendMessage = mutation({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const responseStreamId = await streamingComponent.createStream(ctx);
    const chatId = await ctx.db.insert("userMessages", {
      prompt: args.prompt,
      responseStreamId,
    });
    return {
      chatId,
      responseStreamId,
    };
  },
});

export const getMessages = query({
  args: {
    streamId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("userMessages")
      .filter((q) => q.eq(q.field("responseStreamId"), args.streamId))
      .collect();
    return messages;
  },
});
