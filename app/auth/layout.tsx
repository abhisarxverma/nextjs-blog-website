import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react"

export default function AuthLayout({ children }:{children: React.ReactNode}) {

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="absolute top-5 left-5">
                <Button variant="secondary" asChild>
                    <Link href="/">
                        <ArrowLeft className="size-4" />
                        Go Back
                    </Link>
                </Button>

            </div>
            <div className="w-full max-w-md mx-auto">
                {children}
            </div>
        </div>
    )
}