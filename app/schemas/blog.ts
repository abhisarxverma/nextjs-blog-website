import { z } from "zod";

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 100;
const CONTENT_MIN_LENGTH = 10;

export const blogPostSchema = z.object({
    title: z.string().min(TITLE_MIN_LENGTH, { error : `Title must be atleast ${TITLE_MIN_LENGTH} characters` }).max(TITLE_MAX_LENGTH, `Title can be atmost ${TITLE_MAX_LENGTH} characters` ),
    body: z.string().min(CONTENT_MIN_LENGTH, { error: `Content must be atleast ${CONTENT_MIN_LENGTH} characters`}),
    image: z.instanceof(File)
})