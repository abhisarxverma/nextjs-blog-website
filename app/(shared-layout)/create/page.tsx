"use client";

import { Card, CardContent } from "@/components/ui/card";
import { blogPostSchema } from "@/app/schemas/blog"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader } from "lucide-react";
import { z } from "zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { createBlogAction } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function CreatePage() {

    const [ isPending, startTransition ] = useTransition();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(blogPostSchema),
        defaultValues: {
            title: "",
            body: "",
            image: undefined
        }
    });

    function onSubmit(data: z.infer<typeof blogPostSchema>) {
        startTransition(async () => {
            try {
                const response = await createBlogAction(data);
                if (!response.success) throw new Error(response.message);
                toast.success(response.message);
                router.push("/");
            } catch (error) {
                if (error instanceof Error){
                    toast.error(error.message);
                    console.error("Error in post creation : ", error);
                }
            }
        })
    }

    return (
        <div className="py-12 max-w-3xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Create Post</h1>
                <p className="text-xl text-muted-foreground mt-2">Create your awesome Nextpro blog post</p>
            </div>

            <Card className="bg-transparent">
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller name="title" control={form.control} render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Title</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} type="text" placeholder="What not to do to stay dead" {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Controller name="body" control={form.control} render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Content</FieldLabel>
                                    <Textarea className="min-h-100 max-h-100 overflow-y-auto" aria-invalid={fieldState.invalid} placeholder="Type your content here...." {...field} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                            <Controller name="image" control={form.control} render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Image</FieldLabel>
                                    <Input 
                                        type="file" 
                                        aria-invalid={fieldState.invalid} 
                                        accept="image/*"
                                        onChange={(event) => {
                                            const file = event.target.files?.[0];
                                            field.onChange(file);
                                        }}
                                        />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} />
                        </FieldGroup>
                        <Button disabled={isPending} className="mt-5 w-full" type="submit">
                            {"Post" + (isPending ? "ing" : "")} {isPending ? <Loader className="animate-spin" /> : <Send/>}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}