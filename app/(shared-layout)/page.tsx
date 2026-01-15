import { Button } from "@/components/ui/button"
import { MoveRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

const learnt = [
    "Server Actions",
    "Caching Components",
    "Rendering Strategies",
    "Streaming using Suspense",
    "Convex database service and realtime",
    "Professional form validation using zod",
    "Clean form management using react-hook-forms",
]

export default function Page() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">
            
            <section className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                    <Sparkles size={14} />
                    <span>Project Showcase</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                    Welcome to <span className="text-primary">NextPro</span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    A production-grade blog website built to learn the latest Next.js patterns 
                    including 2026&apos;s caching strategies and server-side excellence.
                </p>

                <div className="flex justify-center pt-4">
                    <Button asChild size="lg" className="px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                        <Link href="/blog" className="gap-2">
                            Explore the Blog <MoveRight size={18} />
                        </Link>
                    </Button>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <div className="lg:col-span-5 bg-secondary/30 p-8 border border-border/50">
                    <h3 className="text-2xl font-bold mb-6">Concepts I learnt</h3>
                    <ul className="space-y-4">
                        {learnt.map((item, index) => (
                            <li key={index} className="flex items-start gap-4 group">
                                <div className="mt-1 bg-primary/10 p-1 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Check size={16} strokeWidth={3} />
                                </div>
                                <span className="text-base font-medium text-foreground/80">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="lg:col-span-7 overflow-hidden roundedborder border-border/50 bg-black shadow-2xl group">
                    <div className="aspect-video relative">
                        <iframe
                            className="absolute top-0 left-0 w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                            src="https://www.youtube.com/embed/MZbwu3-uz3Y"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
