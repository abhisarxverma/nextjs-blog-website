import { COMMENT } from "@/convex/comments";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { MessageSquareReply, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import CommentCreator from "./CommentCreator";
import clsx from "clsx";

export default function CommentCard({ comment, isReply=false, depth = 0 }: { comment: COMMENT, isReply?: boolean, depth?: number }) {

    const [open, setOpen] = useState(false);

    return (
        <div className="flex gap-4" >
            <Avatar className={clsx("shrink-0", isReply ? "size-7" : "size-10")}>
                <AvatarImage
                    src={`https://avatar.vercel.sh/${comment.authorName}`}
                    alt={`${comment.authorName}'s avatar image`} />

                <AvatarFallback>
                    {comment.authorName.slice(0, 2).toUpperCase()}
                </ AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <p className={clsx("font-semibold", isReply ? "text-md" : "text-lg")}>
                        {comment.authorName}
                    </p>
                    <p className="text-sm text-muted-foreground">{new Date(comment._creationTime).toLocaleDateString("in-IN")}</p>
                </div>

                <p className="text-sm text-foreground/90 whitespace-prewrap leading-relaxed">{comment.body}</p>

                <Collapsible open={open} onOpenChange={setOpen}>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="ms-auto mt-2 flex items-center gap-2">
                            {!open ? (
                                <>
                                    <MessageSquareReply className="h-4 w-4" />
                                    {comment.comments.length ? <p>{comment.comments.length}</p> : null}
                                    {"Repl" + (comment.comments.length > 1 ? "ies" : "y")}
                                </>
                            ) : (
                                <X />
                            )}
                        </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="my-4 flex flex-col gap-4 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                        <CommentCreator placeholder={`Reply to ${comment.authorName}`} parentCommentId={comment._id} />
                        {comment.comments.length <= 0 ? (
                            <p className="text-md text-muted-foreground">No replies</p>
                        ) : (

                            <div className="flex flex-col gap-2">
                                {comment.comments.map((childComment) => (
                                    <div key={childComment._id} className="flex flex-col gap-3">
                                        <p className="text-sm font-semibold text-muted-foreground">Replied to {comment.authorName}</p>
                                        <CommentCard isReply comment={childComment} depth={depth + 1} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CollapsibleContent>
                </Collapsible>
            </div>

        </div>
    )
}