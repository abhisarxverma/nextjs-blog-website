"use client";

import { MessageSquare, Loader } from "lucide-react";
import CommentCreator from "./CommentCreator";
import { api } from "@/convex/_generated/api";
import CommentCard from "./CommentCard";
import { Separator } from "../ui/separator";
import { Preloaded, usePreloadedQuery } from "convex/react";

export default function CommentsOfPost(props: {
  preloaded: Preloaded<typeof api.comments.getCommentsByPostId>;
}) {

    const comments = usePreloadedQuery(props.preloaded);

    if (!comments) {
        return (
            <div className="h-20 flex items-center gap-2 text-primary">
                <Loader className="animate-spin" />
                <span>Loading comments</span>
            </div>
        )
    }

    return (
        <section className="flex flex-col gap-2">
            <CommentCreator placeholder="Comment on this blog post...." />
            {comments.length > 0 ? (
                <>
                    <Separator className="my-8" />

                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold flex items-center gap-3"><MessageSquare /> {comments?.length} {"Comment" + (comments.length > 1 ? "s" : "")}</h2>

                        <div className="flex flex-col gap-5 my-4">
                            {comments.map((comment) => (
                                <CommentCard key={comment._id} comment={comment} />
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-lg text-muted-foregound">No comments yet, be teh first to comment.</p>
            )}
        </section>
    )
}