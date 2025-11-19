import {
  internalMutation,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { v, type Validator } from "convex/values";
import { UserJSON } from "@clerk/backend";

export async function getUserByExternalId(
  ctx: QueryCtx | MutationCtx,
  externalId: string,
) {
  return await ctx.db
    .query("users")
    .withIndex("by_externalId", (q) => q.eq("externalId", externalId))
    .unique();
}

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  handler: async (ctx, { data }) => {
    const existing = await getUserByExternalId(ctx, data.id);
    if (!existing) {
      await ctx.db.insert("users", {
        externalId: data.id,
      });
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await getUserByExternalId(ctx, clerkUserId);
    if (user) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});
