import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/custom-card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FaSyncAlt } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export function TopicsOverviewPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTopics = () => {
    setLoading(true);
    fetch("http://localhost:8000/get_content", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then(
        (data) =>
          new Promise((resolve) => setTimeout(() => resolve(data), 1000))
      )
      .then((data) => {
        setTopics(data.final_topics);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
        setLoading(false);
      });
  };

  const handleAssesTopic = (topic) => {
    navigate("/first", { state: { topic: topic } });
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <Card className="max-w-800 m-2 p-4">
      <div className="p-4 flex justify-between">
        <h1 className="text-xl font-bold">Topics Overview</h1>
        <div className="flex items-center text-sm text-gray-500 gap-4">
          <span className="ml-3">
            Last updated{" "}
            {Math.floor(
              (Date.now() -
                new Date().setMinutes(
                  new Date().getMinutes() - (new Date().getMinutes() % 10)
                )) /
                60000
            )}{" "}
            min ago.
          </span>
          <Button
            className="mr-2"
            variant="secondary"
            disabled={loading}
            onClick={fetchTopics}>
            <FaSyncAlt />
          </Button>
        </div>
      </div>

      <Separator />
      {loading ? (
        <Table>
          <TableHead className="w-[250px]">
            <Skeleton className="h-6 w-[150px]" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-6 w-40" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-6 w-40" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-6 w-20" />
          </TableHead>
          {Array.from({ length: 5 }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Skeleton className="h-6 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-100" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-40" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
            </TableRow>
          ))}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                <Skeleton className="h-6 w-[150px]" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-6 w-12" />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      ) : (
        <Table>
          <TableHead className="w-[250px]">Topic</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Categories</TableHead>
          <TableHead></TableHead>

          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.name}>
                <TableCell className="font-medium">{topic.name}</TableCell>
                <TableCell>{topic.description}</TableCell>
                <TableCell>{topic.categories.join(", ")}</TableCell>
                <TableCell>
                  <Button
                    variant="secondary"
                    onClick={() => handleAssesTopic(topic)}>
                    Create
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total Topics</TableCell>
              <TableCell className="text-right">{topics.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </Card>
  );
}

export default TopicsOverviewPage;
