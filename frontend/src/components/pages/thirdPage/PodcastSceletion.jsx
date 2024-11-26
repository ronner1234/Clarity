import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function PodcastCardSkeleton() {
    return (
        <div className="max-w-xl w-full bg-white rounded-lg shadow-lg border overflow-hidden">
            {/* Header image skeleton */}
            <Skeleton className="w-full h-64 bg-gray-200" />

            {/* Card header */}
            <div className="p-4 flex items-start space-x-4">
                {/* Podcast name and title */}
                <div className="flex flex-col space-y-2 w-full">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                </div>
            </div>

            {/* Audio player skeleton */}
            <div className="p-4">
                <Skeleton className="h-12 w-full rounded-md" />
            </div>

            <div className="border-t border-gray-200" />

            {/* Action buttons skeleton */}
            <div className="p-4 flex space-x-4">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-3/4 rounded-md" />
            </div>
        </div>
    );
}

export default PodcastCardSkeleton;
