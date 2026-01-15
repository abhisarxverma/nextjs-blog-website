import { z } from "zod";

export const commentSchema = z.object({
    body: z.string().min(10, { error: "Min 10 characters" }).max(1000, { error: "Max 200 characters" }),
})