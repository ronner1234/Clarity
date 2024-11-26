import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/custom-card";
import MediaBatch from "@/components/pages/fiestPage/MediaBatch.jsx";
import { Skeleton } from "@/components/ui/skeleton";

function MediaSelectionCard({ media, loading, onMediaSelectionChange }) {
  return (
    <Card>
      <CardHeader>Media</CardHeader>
      <CardContent>
        <CardDescription className="pb-8">
          You can select the images and videos you want to use for the news.
        </CardDescription>
      </CardContent>
      {loading ? (
        <div className="m-2 flex flex-col">
          <div className="flex flex-col p-0" style={{ width: "300px" }}>
            {/* Loading skeleton for media */}
            <div
              className="relative bg-gray-200 overflow-hidden rounded-t-lg"
              style={{ width: "300px", height: "300px" }}>
              <Skeleton className="absolute top-0 left-0 w-full h-full" />
            </div>
            <div className="flex flex-col p-4 flex-grow space-y-2">
              {/* Caption placeholder */}
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
              <div className="flex items-center justify-between mt-4">
                {/* Action label placeholder */}
                <Skeleton className="h-4 w-[100px]" />
                {/* Checkbox placeholder */}
                <Skeleton className="h-5 w-5 rounded" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={"flex flex-wrap"}>
          {media.map((media_element, index) => (
            <MediaBatch
              key={index}
              media={media_element}
              onMediaSelectionChange={onMediaSelectionChange}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

export default MediaSelectionCard;
