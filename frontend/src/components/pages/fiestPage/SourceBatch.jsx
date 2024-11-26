import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { parse } from "date-fns";

export function getCleanDomain(url) {
  try {
    const parsedUrl = new URL(url);
    let domain = parsedUrl.hostname;

    if (domain.startsWith("www.")) {
      domain = domain.substring(4);
    }

    const parts = domain.split(".");
    if (parts.length > 2) {
      domain = parts.slice(-2).join(".");
    }

    return domain;
  } catch (error) {
    console.error("Invalid URL:", error);
    return "";
  }
}

export function getLogoUrl(url) {
  const cleanDomain = getCleanDomain(url);
  if (!cleanDomain) {
    return "";
  }
  return `https://img.logo.dev/${cleanDomain}?token=pk_ZU33xC3UQNegMiFkKGIvnw&size=69&retina=true`;
}

function SourcesBatch({ source, onSourceSelectionChange }) {
  const {
    id,
    title,
    published_at,
    link,
    author,
    full_text_cleaned,
    isSelected,
  } = source;

  function timeDifferenceFromNow(releaseTime) {
    const now = new Date();
    const dateFormat = "yyyy-MM-dd HH:mm:ss 'CET'";
    const parsedDate = parse(releaseTime, dateFormat, new Date());

    const diffInSeconds = Math.floor((now - parsedDate) / 1000);

    const units = [
      { name: "week", seconds: 604800 },
      { name: "day", seconds: 86400 },
      { name: "h", seconds: 3600 },
      { name: "min", seconds: 60 },
    ];

    for (const unit of units) {
      const value = Math.floor(diffInSeconds / unit.seconds);
      if (value >= 1) {
        return `${value} ${unit.name} ago`;
      }
    }

    return "just now";
  }

  const handleCheckboxClick = () => {
    onSourceSelectionChange(id, !isSelected);
  };

  const logoUrl = getLogoUrl(link);

  return (
    <Card className="p-1 m-5">
      <CardContent className="flex p-1">
        <a href={link}>
          <Avatar>
            <AvatarImage src={logoUrl} />
            <AvatarFallback>
              {getCleanDomain(link).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </a>
        <div className="flex flex-col pl-4 flex-grow gap-2">
          <a
            className="font-bold text-muted-foreground"
            href={link}
            target="_blank"
            rel="noopener noreferrer">
            {title}
          </a>
          <Separator />
          <p className="text-sm text-500">{full_text_cleaned}</p>
          <Separator />
          <div className="flex">
            <span className="text-sm text-gray-500">
              {timeDifferenceFromNow(published_at)}
            </span>
            <span className="text-sm text-gray-500 pl-2">
              By {author.slice(0, 8)}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="pr-2">Use source:</span>
            <Checkbox checked={isSelected} onClick={handleCheckboxClick} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SourcesBatch;
