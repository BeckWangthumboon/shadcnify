import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  users: defineTable({
    externalId: v.string(),
    providers: v.optional(v.record(v.string(), v.string())), // TODO: upgrade to vault provider
  }).index("by_externalId", ["externalId"]),
});

export default schema;
