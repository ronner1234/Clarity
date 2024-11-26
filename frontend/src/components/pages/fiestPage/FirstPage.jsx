import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SelectSourcesCard from "@/components/pages/fiestPage/SelectSourcesCard";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/custom-card";
import MediaSelectionCard from "@/components/pages/fiestPage/MediaSelectionCard";
import FactSelectionCard from "@/components/pages/fiestPage/FactSelectionCard";
import { Button } from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";

function FirstPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(location.state?.topic || {});
  const [mediaData, setMediaData] = useState({});
  const [mediaLoading, setMediaLoading] = useState(true);

  useEffect(() => {
    if (location.state?.topic) {
      setTopic(addIsSelectedFieldTopics(location.state.topic));
    }
  }, [location.state?.topic]);

  if (!topic) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex flex-row h-full overflow-hidden">
          <div className="flex flex-col items-center justify-center flex-grow">
            <h1 className="text-3xl">No topic data found!</h1>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="default">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const addIsSelectedFieldMedia = (data) => {
    return {
      ...data,
      media: data.media.map((media) => ({
        ...media,
        isSelected: media.isSelected !== undefined ? media.isSelected : true,
      })),
    };
  };

  const addIsSelectedFieldTopics = (data) => {
    return {
      ...data,
      article_list: data.article_list.map((article) => ({
        ...article,
        isSelected:
          article.isSelected !== undefined ? article.isSelected : true,
      })),
      fact_summary: data.fact_summary.map((fact) => ({
        ...fact,
        isSelected: fact.isSelected !== undefined ? fact.isSelected : true,
      })),
    };
  };

  const handleSourceSelectionChange = (id, isSelected) => {
    setTopic((prevTopic) => ({
      ...prevTopic,
      article_list: prevTopic.article_list.map((source) =>
        source.id === id ? { ...source, isSelected } : source
      ),
    }));
  };

  const handleFactSelectionChange = (fact_key, isSelected) => {
    setTopic((prevTopic) => ({
      ...prevTopic,
      fact_summary: prevTopic.fact_summary.map((source) =>
        source.key === fact_key ? { ...source, isSelected } : source
      ),
    }));
  };

  const handleMediaSelectionChange = (media_url, isSelected) => {
    setMediaData((prevData) => ({
      ...prevData,
      media: prevData.media.map((media) =>
        media.url === media_url ? { ...media, isSelected } : media
      ),
    }));
  };

  const handleAddFact = (fact) => {
    setTopic((prevTopic) => ({
      ...prevTopic,
      fact_summary: prevTopic.fact_summary.concat(fact),
    }));
  };

  const handleGenerateNews = () => {
    const mediaDataFiltered = mediaData.media.filter(
      (media) => media.isSelected
    );

    const { fact_summary, article_list } = topic;

    // Get selected articles for filtering
    const selectedArticles = article_list.filter(
      (article) => article.isSelected
    );

    // Create a map of article ID to article details for quick lookup
    const articleMap = selectedArticles.reduce((map, article) => {
      map[article.id] = {
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
      .filter((fact) => fact.isSelected);
    const filteredTopicData = {
      ...topic,
      article_list: selectedArticles,
      fact_summary: filteredFacts,
    };

    navigate("/second", {
      state: { topicData: filteredTopicData, media: mediaDataFiltered },
    });
  };

  const handleTopicSelection = () => {
    navigate("/");
  }

  useEffect(() => {
    const fetchSources = async () => {
      setMediaLoading(true); // Set loading state before fetching
      try {
        const response = await fetch(
          `http://localhost:8000/article_images?topic=${topic.name}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        // Add isSelected field to each object
        const updatedData = data.map((item) => ({
          ...item,
          isSelected: true,
        }));
        setMediaData({ media: updatedData });
      } catch (error) {
        console.error("Error fetching media data:", error);
        // Optionally handle errors, e.g., set an error state
      } finally {
        setMediaLoading(false); // Ensure loading state is reset regardless of success or failure
      }
    };

    fetchSources();
  }, []);

  return (
    <div className="pb-20">
      <div className="p-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{topic.name}</CardTitle>
            <CardDescription>{topic.description}</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <Separator />
      <div className="flex flex-row gap-0">
        <div className="p-2 w-1/4">
          <SelectSourcesCard
            loading={!(topic && topic.article_list.length > 0)}
            sources={
              topic && topic.article_list.length > 0 ? topic.article_list : []
            }
            onSourceSelectionChange={handleSourceSelectionChange}
          />
        </div>
        <div className="p-2 w-1/4">
          <FactSelectionCard
            sources={topic && topic.article_list.length > 0 ? topic : []}
            loading={!(topic && topic.article_list.length > 0)}
            onFactSelectionChange={handleFactSelectionChange}
            addFactToTopic={handleAddFact}
          />
        </div>
        <div className="p-2 w-1/2">
          <MediaSelectionCard
            media={
              mediaData.media && mediaData.media.length > 0
                ? mediaData.media
                : []
            }
            loading={mediaLoading}
            onMediaSelectionChange={handleMediaSelectionChange}
          />
        </div>
      </div>
      <div className="flex justify-between p-2 fixed bottom-0 right-0 w-full ">
        <Button
          variant="secondary"
          className="bg-slate-300"
          onClick={handleTopicSelection}
          disabled={mediaLoading}>
          {"<  Topic Selection"}
        </Button>
        <Button
          className="bg-orange"
          onClick={handleGenerateNews}
          disabled={mediaLoading}>
          {"Generate News   >"}
        </Button>
      </div>
    </div>
  );
}

export default FirstPage;
