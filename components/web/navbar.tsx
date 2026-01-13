import Link from "next/link";
import { Button } from "../ui/button";

export function Navbar() {
    return (
        <nav className="w-full py-5 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link href="/">
                    <h1 className="text-3xl font-bold">
                        Next <span className="text-blue-500">Pro</span>
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

                <div className="flex items-center gap-2">
                    <Button asChild>
                        Sign In
                    </Button>
                    <Button variant="outline">Log In</Button>
                </div>
            </div>
        </nav>
    )
}