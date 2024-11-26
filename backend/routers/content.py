import json
from typing import Union, List, Dict
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from research import fact_check_perplexity
from models.articles import Article
from topics import (
    get_topic_from_openAI,
    get_topic_enhanced_articles_from_openAI,
)
from feed_reader import fetch_and_process_feeds
from models.topics import FinalTopic, TopicList, objectToSend
from generate_article import GeneratedText, generate_text, generate_tweet, Tweet, Podcast, generate_podcast
from models.images import Image
import os
import requests

router = APIRouter(
    tags=["content"],
)


def fetch_and_process_feeds_cached() -> List[Article]:
    if os.path.exists("./json/articles.json"):
        with open("./json/articles.json", "r", encoding="utf-8") as f:
            articles_data = json.load(f)
            articles = [Article(**article) for article in articles_data]
    else:
        articles = []

    return articles


@router.get("/refresh")
async def refresh_content():
    articles = fetch_and_process_feeds()

    topicList = get_topic_from_openAI(articles)

    with open("./json/topics.json", "w", encoding="utf-8") as f:
        json.dump(
            [t.model_dump() for t in topicList.topics],
            f,
            ensure_ascii=False,
            indent=4,
        )

    # relevant_topics = []
    # for topic in topicList.topics:
    #     if "irrelevant" not in topic.categories:
    #         relevant_topics.append(topic)
    #     else:
    #         print(f"topic {topic.name} is considered irrelevant. {topic.categories}")

    topics_enhanced = get_topic_enhanced_articles_from_openAI(topicList)

    with open("./json/enhanced_topics.json", "w", encoding="utf-8") as f:
        json.dump(
            [te.model_dump() for te in topics_enhanced],
            f,
            ensure_ascii=False,
            indent=4,
        )

    final_topics = fact_check_perplexity(topics_enhanced)
    with open("./json/final_topics.json", "w", encoding="utf-8") as f:
        json.dump(
            [ft.model_dump() for ft in final_topics],
            f,
            ensure_ascii=False,
            indent=4,
        )

    return final_topics


def final_topics_cached() -> List[FinalTopic]:
    if os.path.exists("./json/final_topics.json"):
        with open("./json/final_topics.json", "r", encoding="utf-8") as f:
            articles_data = json.load(f)
            articles = [FinalTopic(**article) for article in articles_data]
    else:
        articles = []

    return articles


def images_cached() -> List[Image]:
    if os.path.exists("./json/article_images.json"):
        with open("./json/article_images.json", "r", encoding="utf-8") as f:
            articles_data = json.load(f)
            articles = [Image(**article) for article in articles_data]
    else:
        articles = []

    return articles


@router.get("/get_content")
async def get_content() -> objectToSend:
    return objectToSend(final_topics=final_topics_cached(), images=images_cached())


@router.post("/get_text")
async def get_text(src: FinalTopic) -> GeneratedText:
    return generate_text(source=src)

@router.post("/get_tweet")
async def get_tweet(src: GeneratedText) -> Tweet:
    return generate_tweet(source=src)

@router.post("/get_podcast")
async def get_podcast(src: GeneratedText) -> Podcast:
    print("Received payload for podcast generation:", src.dict())  # Log the data
    return generate_podcast(source=src)

pixabay_key = "" # Not working to frontend, used to scrape stock images -> Pixabay key here


def get_pixabay_images(
    search_string="Tesla",
    k=10,
    api_key=pixabay_key,
    folder_path="prepared_content/stock_images/",
):
    """
    Fetch the first k images from Pixabay for a given search string.

    Parameters:
        api_key (str): Your Pixabay API key.
        search_string (str): The search term for the images.
        k (int): The number of images to retrieve.

    Returns:
        list: A list of image URLs.
    """
    base_url = "https://pixabay.com/api/"
    params = {
        "key": api_key,
        "q": search_string,
        "image_type": "photo",
    }
    folder_path = folder_path + search_string
    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        data = response.json()
        image_urls = [hit["largeImageURL"] for hit in data["hits"]]

        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            print(f"Created folder: {folder_path}")

        for idx, url in enumerate(image_urls, 1):
            try:
                img_response = requests.get(url, stream=True)
                if img_response.status_code == 200:
                    image_path = os.path.join(
                        folder_path, f"{search_string.replace(' ', '')}{idx}.jpg"
                    )
                    with open(image_path, "wb") as file:
                        for chunk in img_response.iter_content(1024):
                            file.write(chunk)
                    print(f"Saved Image {idx}: {image_path}")
                else:
                    print(f"Failed to download image {idx}: {url}")
            except Exception as e:
                print(f"Error downloading image {idx}: {e}")

        return image_urls
    else:
        print(response.text)
        print(f"Error: Unable to fetch images (Status Code: {response.status_code})")
        return []


@router.get("/stock/")
async def get_stock(categories: List[int] = Query(None)) -> objectToSend:  #
    for category in categories:
        # Replace spaces and special characters in folder names if necessary
        cat = category.replace(" ", "").replace("/", "")
        folder_path = "prepared_content/stock_images/" + cat

        get_pixabay_images(cat, 1)
