import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  getLogoUrl,
  getCleanDomain,
} from "@/components/pages/fiestPage/SourceBatch";

function FactBatch({ fact, onFactSelectionChange }) {
  const {
    articles,
    key,
    description,
    perplexity_links,
    correct_flag,
    isSelected,
  } = fact;

  const handleCheckboxClick = () => {
    onFactSelectionChange(key, !isSelected);
  };

  return (
    <Card className="p-1 mb-5">
      <CardContent className="flex p-1">
        <a
          href={
            articles && articles[0] && articles[0].link ? articles[0].link : ""
          }
          target="_blank"
          rel="noopener noreferrer">
          <Avatar className="w-6 h-6">
            <AvatarImage
              src={
                articles && articles[0] && articles[0].link
                  ? getLogoUrl(articles[0].link)
                  : ""
              }
            />
            <AvatarFallback>
              <span className="text-sm">
                {articles && articles[0] && articles[0].link
                  ? getLogoUrl(articles[0].link).slice(0, 2).toUpperCase()
                  : "?"}
              </span>
            </AvatarFallback>
          </Avatar>
        </a>
        <div className="flex flex-col pl-4 flex-grow gap-2">
          <a
            href={
              articles && articles[0] && articles[0].link
                ? articles[0].link
                : ""
            }
            target="_blank"
            rel="noopener noreferrer">
            <span className="font-bold text-muted-foreground">{key}:</span>
            <p className="text-sm text-500">{description}</p>
          </a>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="pr-1 text-sm">Backing sources:</span>
            <div className="flex space-x-2">
              {perplexity_links.map((link, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        <div
                          className="w-3 h-3 rounded-full text-[8px] text-500 text-white align-center justify-center flex items-center"
                          style={{
                            backgroundColor: "hsl(var(--primary))",
                          }}>
                          {index + 1}
                        </div>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
          {!correct_flag && (
            <>
              <Separator />
              <TooltipProvider key="correct_check">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 m-1">
                      <Badge variant="destructive" className="text-xs">
                        Need's Checking
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      This fact might be incorrect. Please verify before using
                      it.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}

          <Separator />
          <div className="flex items-center justify-between">
            <span className="pr-2">Use this Fact:</span>
            <Checkbox checked={isSelected} onClick={handleCheckboxClick} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FactBatch;
