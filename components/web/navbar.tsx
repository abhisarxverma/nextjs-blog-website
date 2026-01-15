"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { ModeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SearchInput from "./SearchInput";
import { LogOut } from "lucide-react";

export function Navbar() {

    const { isAuthenticated, isLoading: isAuthenticating } = useConvexAuth();
    const router = useRouter();

    function signOut() {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Logged out successfully");
                    router.push("/")
                },
                onError: (error) => {
                    toast.error(error.error.message);
                }
            }
        });
    }

    return (
        <nav className="w-full py-5 flex items-center justify-between">
            <div className="flex items-center gap-8 justify-between w-full">

                <div className="flex items-center gap-8">
                    <Link href="/">
                        <h1 className="text-3xl font-bold">
                            Next <span className="text-primary">Pro</span>
                        </h1>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href="/">
                                Home
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/blog">
                                Blog
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/create">
                                Create
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden md:block">
                        <SearchInput />
                    </div>
                    {isAuthenticating ? null : isAuthenticated ? (
                        <Button onClick={signOut} size="icon" variant="outline"><LogOut /></Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild>
                                <Link href="/auth/sign-up">
                                    Sign up
                                </Link>
                            </Button>
                            <Button variant="outline">
                                <Link href="/auth/login">
                                    Login
                                </Link>
                            </Button>
                        </div>
                    )}
                    <ModeToggle />
                </div>
            </div>
        </nav>
    )
}