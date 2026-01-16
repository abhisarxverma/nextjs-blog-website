"use client";

import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"
import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";
import { useConvexAuth } from "convex/react";

interface iAppProps {
    roomId: Id<"posts">;
    userId: string
}

export function PostPresence({ roomId, userId } : iAppProps) {
    
    const { isAuthenticated, isLoading } = useConvexAuth();

    const presenceState = usePresence(
        api.presence, 
        roomId, 
        (isLoading || !isAuthenticated) ? "loading" : userId 
    );

    if (isLoading || !isAuthenticated || !presenceState) {
        return null;
    }

    return (
        <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                READERS
            </p>
            
            <main className="text-black">
                <FacePile presenceState={presenceState ?? []} />
            </main>
        </div>
    );
}