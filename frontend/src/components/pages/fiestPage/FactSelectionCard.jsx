import React, { useState, useRef } from "react";

import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/custom-card";
import FactBatch from "@/components/pages/fiestPage/FactBatch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

function FactSelectionCard({
  sources,
  loading,
  onFactSelectionChange,
  addFactToTopic,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const factTypeRef = useRef();
  const factInfoRef = useRef();

  if (loading) {
    return (
      <Card className="border-none">
        <CardHeader>Facts</CardHeader>
        <CardContent>
          <CardDescription>
            Here is a list of facts which might be relevant for your news
            article. Select the ones you want to include in your article.
          </CardDescription>
        </CardContent>
        <div className="p-1 m-5">
          <div className="flex p-1 items-start">
            <Skeleton className="h-7 w-7 rounded-full" />
            <div className="flex flex-col pl-4 flex-grow space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center justify-between mt-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[50px]" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-1 m-2">
          <div className="flex p-1 items-start">
            <Skeleton className="h-7 w-7 rounded-full" />
            <div className="flex flex-col pl-4 flex-grow space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center justify-between mt-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[50px]" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const { fact_summary, article_list } = sources;

  // Get selected articles for filtering
  const selectedArticles = article_list.filter((article) => article.isSelected);

  // Create a map of article ID to article details for quick lookup
  const articleMap = selectedArticles.reduce((map, article) => {
    map[article.id] = {
      id: article.id,
      title: article.title,
      link: article.link,
    };
    return map;
  }, {});

  // Filter and enhance facts
  const filteredFacts = fact_summary
    .filter(
      (fact) =>
        fact.article_ids.includes("User Fact") ||
        fact.article_ids.some((articleId) => articleMap[articleId])
    )
    .map((fact) => {
      // Add article details to the fact
      const linkedArticles = fact.article_ids
        .filter((articleId) => articleMap[articleId])
        .map((articleId) => articleMap[articleId]);
      return {
        ...fact,
        articles: fact.articles || linkedArticles,
      };
    });

  function handleAddFact() {
    const factType = factTypeRef.current.value;
    const factInfo = factInfoRef.current.value;
    const newFact = {
      key: factType,
      description: factInfo,
      article_ids: ["User Fact"],
      perplexity_links: [],
      perplexity_assessment: "High",
      correct_flag: true,
      isSelected: true,
      articles: [
        {
          id: `user_fact_${Date.now()}`,
          title: "User Fact",
          link: "https://efahrer.de",
        },
      ],
    };

    addFactToTopic(newFact);
    setDialogOpen(false); // Close the dialog
  }

  return (
    <Card className="px-2">
      <CardHeader>Facts</CardHeader>
      <CardContent>
        <CardDescription>
          Here is a list of facts which might be relevant for your news article.
          Select the ones you want to include in your article.
        </CardDescription>
      </CardContent>
      {filteredFacts.map((fact, index) => (
        <FactBatch
          style={{ marginBottom: "4px" }}
          key={fact.key + fact.fact_index}
          fact_index={fact.fact_index}
          fact={fact}
          onFactSelectionChange={onFactSelectionChange}
        />
      ))}
      <div className="flex justify-center">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="" variant="outline">
              + Add Fact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Information</DialogTitle>
              <DialogDescription>
                You can add a new fact here to include in your article.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Fact Type
                </Label>
                <Input
                  id="type"
                  ref={factTypeRef}
                  defaultValue="Background Information"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="info" className="text-right">
                  Fact Information
                </Label>
                <Input
                  id="info"
                  ref={factInfoRef}
                  defaultValue=""
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddFact}>
                Add Fact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}

export default FactSelectionCard;
