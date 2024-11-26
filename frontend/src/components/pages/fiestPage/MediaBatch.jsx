import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

function MediaBatch({ media, onMediaSelectionChange }) {
  const { id, article_id, url, backend_url, source, isSelected } = media;

  const final_url = "http://localhost:8000" + backend_url;

  const handleCheckboxClick = () => {
    onMediaSelectionChange(url, !isSelected);
  };

  // Unified media component
  const mediaContent = (
    <div className="absolute inset-0 w-full h-full">
      {final_url.endsWith(".jpg") || final_url.endsWith(".png") ? (
        <img
          src={final_url}
          alt={"caption"}
          className="w-full h-full object-cover"
        />
      ) : final_url.endsWith(".mp4") ? (
        <video className="w-full h-full object-cover" controls loop muted>
          <source src={final_url} type="video/mp4" />
        </video>
      ) : (
        <p className="text-center text-sm text-gray-500">
          Unsupported media type
        </p>
      )}
    </div>
  );

  return (
    <Card className="m-2 flex flex-col">
      <CardContent className="flex flex-col p-0">
        {/* Fixed square container for media */}
        <div
          className={`relative bg-gray-200 overflow-hidden rounded-t-lg ${
            !isSelected ? "opacity-50" : ""
          }`}
          style={{ width: "250px", height: "250px" }}>
          {mediaContent}
        </div>
        <div className="flex flex-col p-4 flex-grow">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Source: {source}</span>
            <Checkbox checked={isSelected} onClick={handleCheckboxClick} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MediaBatch;
