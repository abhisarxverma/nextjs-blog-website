import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";
import { Doc } from "./_generated/dataModel";

export const createBlogPost = mutation({
  args: { title: v.string(), body: v.string(), imageStorageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) throw new ConvexError("User not authenticated for creating blog post.")

    const newBlogPostId = await ctx.db.insert("posts", {
      title: args.title,
      body: args.body,
      authorId: user._id,
      imageStorageId: args.imageStorageId
    });

    return newBlogPostId;
  },
});


export const getBlogPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    return await Promise.all(
      posts.map(async (post) => {
        const resolvedImageUrl = post.imageStorageId !== undefined ? await ctx.storage.getUrl(post.imageStorageId) : null;
        return {
          ...post,
          imageUrl: resolvedImageUrl
        }
      })
    )
  }
})

export const generatedImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) throw new ConvexError("Not authenticated");

    return await ctx.storage.generateUploadUrl();
  }
})

export const getBlogPostById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);

    if (!post) return null;

    const resolvedImageUrl = post?.imageStorageId ? await ctx.storage.getUrl(post.imageStorageId) : null;

    return {
      ...post,
      imageUrl: resolvedImageUrl
    }
  }
})

interface searchResultType {
  _id: string;
  title: string;
  body: string
}

export const searchPosts = query({
  args: {
    term: v.string(),
    limit: v.number()
  },
  handler: async (ctx, args) => {
    const limit = args.limit;

    const results: Array<searchResultType> = [];

    const seen = new Set();

    const pushDocs = async (docs: Array<Doc<"posts">>) => {
      for (const doc of docs) {
        if (seen.has(doc._id)) continue;

        seen.add(doc._id);
        results.push({
          _id: doc._id,
          title: doc.title,
          body: doc.body
        })

        if (results.length >= limit) break;
      }
    }

    const titleMatches = await ctx.db.query("posts")
      .withSearchIndex("search_title", (q) => q.search("title", args.term)).take(limit);

    await pushDocs(titleMatches);

    if (results.length < limit) {
      const bodyMatches = await ctx.db.query("posts").withSearchIndex("search_body", (q) => q.search("body", args.term)).take(limit);

      await pushDocs(bodyMatches);
    }
    
    return results;
  }
})