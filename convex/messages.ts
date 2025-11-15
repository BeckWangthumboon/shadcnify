import { v } from "convex/values";
import { mutation } from "./_generated/server";
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
