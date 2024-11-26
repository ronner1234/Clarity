import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function TwitterCardSkeleton() {
    return (
        <div className="max-w-xl w-full bg-white rounded-lg shadow-lg border">
            {/* Header */}
            <div className="p-4 flex items-start">
                <div className="flex flex-row">
                    {/* Avatar Skeleton */}
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="pl-2 flex flex-col space-y-2">
                        {/* User and handle placeholders */}
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="px-4 pb-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                {/* Timestamp and link placeholders */}
                <div className="mt-2 flex items-center space-x-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Actions Skeleton */}
            <div className="flex justify-between px-6 py-3 text-gray-500">
                <div className="flex space-x-8">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-5 w-5" />
            </div>

            <div className="border-t border-gray-200 p-4 flex justify-between">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-2/3" />
            </div>
        </div>
    );
}

export default TwitterCardSkeleton;