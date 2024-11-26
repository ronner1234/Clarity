import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/custom-card";
import SourcesBatch from "@/components/pages/fiestPage/SourceBatch.jsx";
import { Skeleton } from "@/components/ui/skeleton";

function SelectSourcesCard({ loading, sources, onSourceSelectionChange }) {
  return (
    <Card className="px-2">
      <CardHeader>Sources</CardHeader>
      <CardContent>
        <CardDescription>
          You can select the sources you want to use for the news articles.
        </CardDescription>
      </CardContent>
      {loading ? (
        <>
          <div className="p-1 m-5">
            <div className="flex p-1 items-start">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex flex-col pl-4 flex-grow space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[100px]" />
                <div className="flex items-center justify-between mt-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[50px]" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-1 m-2">
            <div className="flex p-1 items-start">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex flex-col pl-4 flex-grow space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[100px]" />
                <div className="flex items-center justify-between mt-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[50px]" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        sources.map((source, index) => (
          <SourcesBatch
            key={index}
            source={source}
            onSourceSelectionChange={onSourceSelectionChange}
          />
        ))
      )}
    </Card>
  );
}

export default SelectSourcesCard;
