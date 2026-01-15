import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function SearchInput() {
    const [term, setTerm] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTerm(e.target.value);
        setOpen(true);
    }

    const results = useQuery(api.posts.searchPosts, term.length >= 2 ? {
        term: term,
        limit: 5
    } : "skip");

    return (
        <div className="relative w-full max-w-sm z-10">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input value={term} onChange={handleChange} type="search" placeholder="Search blog" className="w-full pl-8 bg-background" />
            </div>

            {open && term.length > 2 && (
                <div className="absolute top-full mt-2 border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
                    {results === undefined ? (
                        <div className="flex items-center gap-3 p-4 text-sm text-shadow-muted-foreground">
                            <Loader2 className="animate-spin size-5" />
                            Searching....
                        </div>
                    ) : results.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground text-center">
                            No results found
                        </p>
                    ) : (
                        <div className="py-1">
                            {results.map((post) => (
                                <Link onClick={() => {
                                    setOpen(false)
                                    setTerm("");
                                }} className="flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer" key={post._id} href={`/blog/${post._id}`}>
                                    <p className="font-medium truncate">{post.title}</p>
                                    <p className="text-sm text-muted-foreground pt-1 line-clamp-2">
                                        {post.body}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}