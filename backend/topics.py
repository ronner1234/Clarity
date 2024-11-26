import time
from feed_reader import fetch_and_process_feeds
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pydantic import BaseModel, Field
from typing import List, Dict, Optional

import feedparser
import requests
from bs4 import BeautifulSoup
import json
import hashlib
import os
import openai
import uuid
import base64
from io import BytesIO
from models.articles import *
from models.facts import *
from models.images import *
from models.topics import *

with open("api.key", "r") as f:
    keys = json.load(f)

AZURE = keys.get("openAI")
# RSS feed URLs
FEED_URLS = ["https://rss.app/feeds/MLuDKqkwFtd2tuMr.xml"]
STORAGE_FILE = "articles.json"
HASH_FILE = "feed_hash.txt"
OPENAI_KEY = AZURE # open AI API key here
api_base = "https://hackatum-2024.openai.azure.com/" # update Azure environment 
api_key = OPENAI_KEY


def topics_cached() -> TopicList:
    if os.path.exists("topics.json"):
        with open("topics.json", "r", encoding="utf-8") as f:
            topics = json.load(f)
            t = [Topic(**topic) for topic in topics["topics"]]
    else:
        t = []

    return t


def get_topic_from_openAI(articles: List[Article]) -> TopicList:

    client = openai.AzureOpenAI(
        api_key=api_key, api_version="2024-08-01-preview", azure_endpoint=api_base
    )

    # client = openai.OpenAI(
    #     api_key=api_key,
    # )

    system_message = {
        "role": "system",
        "content": """Please group the articles by common topics. Each article should be in one topic.""",
    }
    user_message = {
        "role": "user",
        "content": json.dumps([article.model_dump() for article in articles]),
    }

    print(f"Sending to OpenAI for Topics.")

    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[system_message, user_message],
        response_format=TopicList,
    )

    print(f"Got response.")

    print(response.choices[0])

    print(f"Waiting 3 seconds!")
    time.sleep(3)
    return response.choices[0].message.parsed


def get_topic_enhanced_articles_from_openAI(
    topic_list: TopicList,
) -> TopicListEnhancedArticle:
    client = openai.AzureOpenAI(
        api_key=api_key, api_version="2024-08-01-preview", azure_endpoint=api_base
    )

    # client = openai.OpenAI(
    #     api_key=api_key,
    # )

    enhanced_topics = []

    for topic in topic_list.topics:
        # Prepare system and user messages for OpenAI request
        system_message = {
            "role": "system",
            "content": f"Remove irrelevant parts from articles in order depending on topic: {topic.name}, {topic.description}, {topic.categories}",
        }
        user_message = {
            "role": "user",
            "content": json.dumps([article.dict() for article in topic.article_list]),
        }

        print(f"Sending to OpenAI for Topics.")

        # Get enhanced articles from OpenAI
        response = client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[system_message, user_message],
            response_format=EnhancedArticles,
        )

        print(f"Got response.")

        enhanced_articles = response.choices[0].message.parsed.enhanced_articles

        print(enhanced_articles)

        enhanced_topics.append(
            TopicEnhancedArticle(
                name=topic.name,
                description=topic.description,
                categories=topic.categories,
                article_list=enhanced_articles,
            )
        )
        print(f"Waiting 3 seconds!")
        time.sleep(3)

    return enhanced_topics
