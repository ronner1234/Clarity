import json
from typing import Union, List, Dict
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from research import fact_check_perplexity
from models.articles import Article
from topics import (
    get_topic_from_openAI,
    get_topic_enhanced_articles_from_openAI,
)
from feed_reader import fetch_and_process_feeds
from models.topics import FinalTopic, TopicList, objectToSend
from models.images import Image
import os
import requests

router = APIRouter(
    tags=["media"],
)

def content_cached() -> List[Dict]:
    content_folder = "./content"
    if os.path.exists(content_folder):
        content_files = []
        for filename in os.listdir(content_folder):
            file_path = os.path.join(content_folder, filename)
            if os.path.isfile(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    content_files.append({"filename": filename, "content": f.read()})
    else:
        content_files = []

    return content_files
@router.get("/content")
async def get_content():
    content_files = content_cached()
    if not content_files:
        raise HTTPException(status_code=404, detail="No content found")
    return content_files


def final_topics_cached() -> List[FinalTopic]:
    if os.path.exists("./json/final_topics.json"):
        with open("./json/final_topics.json", "r", encoding="utf-8") as f:
            articles_data = json.load(f)
            articles = [FinalTopic(**article) for article in articles_data]
    else:
        articles = []

    return articles


def article_images_cached() -> List[Image]:
    if os.path.exists("./json/article_images.json"):
        with open("./json/article_images.json", "r", encoding="utf-8") as f:
            image_data = json.load(f)
            images = [Image(**image) for image in image_data]
    else:
        images = []

    return images


@router.get("/article_images")
async def get_article_image_by_topic(topic: str):

    relevant_article_ids = []

    for final_topic in final_topics_cached():
        if final_topic.name == topic:
            for article in final_topic.article_list:
                relevant_article_ids.append(
                    {"id": article.id, "source": article.author}
                )

    relevent_images = []

    for image in article_images_cached():
        for ids in relevant_article_ids:
            if image.article_id == ids["id"]:
                relevent_images.append({**image.model_dump(), "source": ids["source"]})

    print(relevent_images)
    return relevent_images


@router.get("/stock_images")
async def get_article_image_by_topic(topic: str):
    url = f"https://api.unsplash.com/search/photos?page=1&query={topic}"

    payload = ""
    headers = {"Authorization": "Client-ID ..."} # unsplash client id instead of ...

    response = requests.request("GET", url, headers=headers, data=payload)

    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(
            status_code=response.status_code, detail="Error fetching stock images"
        )
