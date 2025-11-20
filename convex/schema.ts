import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  users: defineTable({
    externalId: v.string(),
    providers: v.optional(v.record(v.string(), v.string())), // TODO: upgrade to vault provider
  }).index("by_externalId", ["externalId"]),
  threads: defineTable({
    userId: v.id("users"),
  }).index("by_user", ["userId"]),
  messages: defineTable({
    threadId: v.id("threads"),
    role: v.union(
      v.literal("system"),
      v.literal("assistant"),
      v.literal("user"),
    ),
    content: v.string(),
    responseStreamId: v.optional(v.string()),
    toolCalls: v.optional(
      v.array(
        v.object({
          toolCallId: v.string(),
          toolName: v.string(),
          args: v.any(),
        }),
      ),
    ),
    toolResults: v.optional(
      v.array(
        v.object({
          toolCallId: v.string(),
          toolName: v.string(),
          output: v.any(),
          isError: v.optional(v.boolean()),
        }),
      ),
    ),
  })
    .index("by_thread", ["threadId"])
    .index("by_responseStreamId", ["responseStreamId"]),
});

export default schema;
