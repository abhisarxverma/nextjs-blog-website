import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc} from "./_generated/dataModel";
import { authComponent } from "./auth";

export type COMMENT = Doc<"comments"> & {
  comments: COMMENT[]
};

export const getCommentsByPostId = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .order("desc")
      .collect();

    const map: Record<string, COMMENT> = {};
    comments.forEach((c) => {
      map[c._id] = { ...c, comments: [] }
    });

    const roots: COMMENT[] = [];
    comments.forEach((c) => {
      if (c.parentCommentId) {
        map[c.parentCommentId].comments.push(map[c._id]);
      } else {
        roots.push(map[c._id]);
      }
    });

    return roots;
  },
});

export const createComment = mutation({
    args: {
        body: v.string(),
        postId: v.id("posts"),
        parentCommentId: v.optional(v.id("comments"))
    },
    handler: async (ctx, args) => {

        const user = await authComponent.safeGetAuthUser(ctx);

        if (!user) throw new ConvexError("User not authenticated");

        return await ctx.db.insert("comments", {
            postId: args.postId,
            body: args.body,
            authorId: user._id,
            parentCommentId: args.parentCommentId,
            authorName: user.name
        })
    }
})
