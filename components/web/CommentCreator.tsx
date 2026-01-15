"use client";

import { Send, Loader } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError } from "@/components/ui/field";
import { commentSchema } from "@/app/schemas/comment";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { z } from "zod";

import { toast } from "sonner";
import { useTransition } from "react";

interface CommentCreatorProps {
    placeholder: string;
    parentCommentId?: Id<"comments">;
}

export default function CommentCreator({ placeholder, parentCommentId }: CommentCreatorProps) {

    const params = useParams<{ postId: Id<"posts"> }>();

    const [isPending, startTransition] = useTransition();

    const createCommentMutation = useMutation(api.comments.createComment);

    const form = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            body: "",
        }
    });

    function onSubmit(data: z.infer<typeof commentSchema>) {
        startTransition(async () => {
            try {
                await createCommentMutation({
                    body: data.body,
                    postId: params.postId,
                    parentCommentId
                })
                form.reset();
                toast.success("Comment posted successfully");
            } catch (error) {
                console.error("Error in creating comment : ", error);
                toast.error("Comment creation failed");
            }
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full w-full flex flex-col gap-4">
            <Controller name="body" control={form.control} render={({ field, fieldState }) => (
                <Field>
                    <Textarea placeholder={placeholder} className="min-h-20 max-h-100 overflow-y-auto" aria-invalid={fieldState.invalid} {...field} />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )} />
            <Button className="self-end" disabled={isPending} type="submit">
                {(parentCommentId ? "Reply" : "Comment") + (isPending ? "ing" : "")}
                {isPending ? <Loader className="animate-spin" /> : <Send />}
            </Button>
        </form>
    )
}