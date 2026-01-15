import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CommentsOfPost from "@/components/web/CommentsOfPost"
import { DEFAULT_BLOG_IMAGE } from "@/lib/constants"
import { preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { PostPresence } from "@/components/web/PostPresence";
import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";


export async function generateMetadata({ params }: PostIdRouteProps ): Promise<Metadata> {
    const { postId } = await params;

    const post = await fetchQuery(api.posts.getBlogPostById, { id: postId });

    if (!post) {
        return {
            title: "Post not found"
        }
    }

    return {
        title: post.title,
        description: post.body,
    }
}

interface PostIdRouteProps {
    params: Promise<{
        postId: Id<"posts">;
    }>;
}

export default async function BlogDetailsPage({ params }: PostIdRouteProps) {

    const { postId } = await params;

    const token = await getToken();
    
    const [ post, comments, userId ] = await Promise.all([
        fetchQuery(api.posts.getBlogPostById, { id: postId }),
        preloadQuery(api.comments.getCommentsByPostId, { postId }),
        fetchQuery(api.presence.getUserId, {}, {token})
    ])

    if (!post) {
        return (
            <div className="">
                <h1 className="text-6xl font-extrabold text-red-500 py-20">No Post Found</h1>
            </div>
        )
    }

    if (!userId) return redirect("/auth/login")

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
            <Button variant="ghost" asChild>
                <Link href="/blog">
                    <ArrowLeft />
                </Link>
            </Button>

            <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
                <Image 
                    src={post.imageUrl ?? DEFAULT_BLOG_IMAGE}
                    alt={post.title ?? "Blog image"}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
                    priority
                    unoptimized
                />
            </div>

            <div className="space-y-4 flex flex-col">
                <h1 className="text-4xl font-bold tracking-tight text-fore">
                    {post.title}
                </h1>

                <div className="flex items-center gap-5">
                    <p className="text-sm text-muted-foreground">Posted on : {new Date(post._creationTime).toLocaleDateString("in-IN")}</p>
                    {userId && <PostPresence userId={userId} roomId={postId} />}
                </div>
            </div>

            <Separator className="my-8" />

            <div className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {post.body}
            </div>
            
            <Separator className="my-8" />

            <CommentsOfPost preloaded={comments} />
        </div>
    )
}