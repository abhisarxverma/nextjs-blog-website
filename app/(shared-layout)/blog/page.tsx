
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { DEFAULT_BLOG_IMAGE } from "@/lib/constants";
import { cacheLife, cacheTag } from "next/cache";

export default function BlogPage() {

    return (
        <div className="py-12">
            <div className="text-center pb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Our Blog</h1>
                <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">Insights, thoughs and trends from our team</p>
            </div>
            <Suspense fallback={<BlogPostsSkeleton />}>
                {LoadBlogs()}
            </Suspense>
        </div>
    )
}

async function LoadBlogs() {
    "use cache";
    cacheLife("hours");
    cacheTag("blog");
    const data = await fetchQuery(api.posts.getBlogPosts);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((post) => {
                return (
                    <Card key={post._id} className="pt-0">
                        <div className="h-48 w-full relative">
                            <Image
                                src={post.imageUrl ?? DEFAULT_BLOG_IMAGE}
                                alt="dummy image"
                                fill
                                className="object-cover"
                                priority
                                unoptimized
                            />
                        </div>
                        <CardContent>
                            <Link href={`/blog/${post._id}`} className="hover:text-primary text-xl font-semibold">
                                {post.title}
                            </Link>
                            <p className="text-muted-foreground line-clamp-3 mt-3">{post.body}</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">
                                <Link href={`/blog/${post._id}`}>
                                    Read
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}

function BlogPostsSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-48 w-full" />
                    <div className="space-y-2 flex flex-col">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    )
}