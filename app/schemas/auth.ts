import { z } from "zod"

export const signUpSchema = z.object({
    name: z.string().min(3, { error: "Name must be atleast 8 characters" }).max(30, { error: "Name must be atmost 30 characters" }),
    email: z.email({ error: "Please enter a valid email" }),
    password: z.string().min(8, { error: "Password must be atleast 8 characters" }).max(30, "Password can be atmost 30 characters"),
});

export const loginSchema = z.object({
    email: z.email({ error: "Please enter a valid email" }),
    password: z.string().min(8, { error: "Password must be atleast 8 characters" }).max(30, "Password can be atmost 30 characters"),
})