"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/app/schemas/auth"
import { Button } from "@/components/ui/button";
import { Signature, Loader } from "lucide-react";
import { authClient } from "@/lib/auth-client"
import { useTransition } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupPage() {

    const [ isPending, startTransition ] = useTransition();

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    function onSubmit(data: z.infer<typeof loginSchema>) {
        startTransition(async () => {

            await authClient.signIn.email({
                email: data.email,
                password: data.password
            }, {
                onSuccess: () => {
                    toast.success("Logged in successfully");
                    router.push("/")
                },
                onError: (error) => {
                    toast.error(error.error.message);
                }
            })
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Log In</CardTitle>
                <CardDescription>Welcome back to NextPro</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller name="email" control={form.control} render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Email</FieldLabel>
                                <Input aria-invalid={fieldState.invalid} type="email" placeholder="johndoe@email.com" {...field} />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )} />
                        <Controller name="password" control={form.control} render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Password</FieldLabel>
                                <Input aria-invalid={fieldState.invalid} type="password" placeholder="******" {...field} />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )} />
                        <Button disabled={isPending} type="submit">
                            {"Log" + (isPending ? "ing" : "")} In
                            {isPending ? <Loader className="animate-spin" /> : <Signature />}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}