"use server";

import z from "zod";
import { blogPostSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { updateTag } from "next/cache";

type serverActionResponse = {
    success: boolean,
    message: string
}

export async function createBlogAction(values: z.infer<typeof blogPostSchema>): Promise<serverActionResponse> {
    
    const parsed = blogPostSchema.safeParse(values);

    if (!parsed.success) {
        throw new Error("Form validation failed");
    }

    const token = await getToken();

    try {
        const imageUrl = await fetchMutation(api.posts.generatedImageUploadUrl, {}, { token })
        const uploadResult = await fetch(imageUrl, {
            method: "POST",
            headers: {
                "Content-Type" : parsed.data.image.type,
            },
            body: parsed.data.image,
        })

        if (!uploadResult.ok) {
            return {
                success: false,
                message: "Failed to upload image"
            }
        }

        const { storageId } = await uploadResult.json();
        
        await fetchMutation(
            api.posts.createBlogPost,
            {
                body: parsed.data.body,
                title: parsed.data.title,
                imageStorageId: storageId
            },
            { token }
        )
        updateTag("blog");
        return { success: true, message: "Blog created successfully"}
    } catch (error) {
        console.error("Error in create blog server action : ", error);
        return { success: false, message: "Unexpected error occured"}
    }
}