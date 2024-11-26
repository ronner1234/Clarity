import shutil
from typing import List, Dict
import feedparser
import requests
from bs4 import BeautifulSoup
import json
import hashlib
import os
import uuid
from datetime import datetime, timezone, timedelta
from urllib.parse import urljoin
from models.images import Image
from models.articles import *
import pytz

# RSS feed URL
FEED_URLS = [
    "https://rss.app/feeds/MLuDKqkwFtd2tuMr.xml",
]
ARTICLE_FILE = "./json/articles.json"
IMAGE_FILE = "./json/article_images.json"
HASH_FILE = "./json/feed_hash.txt"
IMAGE_FOLDER = "./article_images"


def save_image_to_filesystem(url):
    """Fetch and save an image from a URL to the file system, returning the UUID."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        # Generate a unique ID for the image
        image_id = str(uuid.uuid4())
        image_path = os.path.join(IMAGE_FOLDER, f"{image_id}.jpg")

        # Save the image to the file system
        with open(image_path, "wb") as f:
            f.write(response.content)

        return image_id
    except Exception as e:
        print(f"Error fetching image {url}: {e}")
        return None


def extract_full_text_and_images(url):
    """Extract full text and images from the article page."""
    try:

        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")

        # Find the main content container while ignoring teasers
        main_content = (
            soup.find("article")
            or soup.find("div", class_="main-content")
            or soup.find("div", class_="c-article-page")
            or soup.find("div", class_="article-content")
            or soup.find("div", class_="entry-content")
            or soup.find("div", class_="post-content")
            or soup.find("div", class_="text")
            or soup.find("div", class_="article-body")
            or soup.find("div", class_="article__text")
            or soup.find("div", class_="body")
            or soup.find("div", class_="txt")
        )

        # Remove any child divs with class names containing "teaser"
        if main_content:
            for teaser_div in main_content.find_all(
                "div", class_=lambda x: x and "teaser" in x
            ):
                teaser_div.decompose()

        # Extract text and clean it
        text = (
            main_content.get_text(separator=" ").strip()
            if main_content
            else "Could not extract full text."
        )

        # Remove escape characters and newlines
        clean_text = " ".join(text.split())

        # Extract image URLs, ignoring SVGs
        images = []
        if main_content:
            for img_tag in main_content.find_all("img"):
                src = img_tag.get("src")
                if src:
                    # Convert relative URL to absolute URL
                    absolute_url = urljoin(url, src)
                    if not absolute_url.lower().endswith(".svg"):
                        image_id = save_image_to_filesystem(absolute_url)
                        if image_id:
                            images.append({"id": image_id, "url": absolute_url})

        return clean_text, images
    except Exception as e:
        return f"Error fetching article: {e}", []


def calculate_hash(feed_entries: List[Dict]) -> str:
    """Calculate a hash based on the RSS feed entries."""
    feed_content = "".join(
        entry.get("title", "") + entry.get("link", "") for entry in feed_entries
    )
    return hashlib.md5(feed_content.encode("utf-8")).hexdigest()


def fetch_and_process_feeds() -> List[Article]:
    """Fetch the RSS feed, process changes, and update storage."""

    # Parse the RSS feed
    for feed_URL in FEED_URLS:
        feed = feedparser.parse(feed_URL)

        # Calculate the current hash of the feed
        current_hash = calculate_hash(feed.entries)

        # Load the previous hash
        previous_hash = None
        if os.path.exists(HASH_FILE):
            with open(HASH_FILE, "r", encoding="utf-8") as f:
                previous_hash = f.read().strip()

        # If the feed hasn't changed, do nothing
        if current_hash == previous_hash:
            print("No changes detected in the RSS feed.")
            return

        print("Changes detected in the RSS feed. Updating storage...")

        # Process the articles
        articles = []
        all_images = []
        for entry in feed.entries:
            # Extract basic information
            title = entry.get("title", "No title")
            link = entry.get("link", "No link")
            description = entry.get("description", "No description")
            published_at = entry.get("published", entry.get("pubDate", None))
            cover_image_url = None

            if published_at:
                try:
                    published_at = datetime.strptime(
                        published_at, "%a, %d %b %Y %H:%M:%S %Z"
                    )
                    # Convert to Europe/Berlin timezone
                    berlin_tz = pytz.timezone("Europe/Berlin")
                    published_at = published_at.astimezone(berlin_tz)
                    published_at = published_at.strftime("%Y-%m-%d %H:%M:%S %Z")

                except ValueError:
                    published_at = ""

            # Extract cover image URL from media:content
            if "media_content" in entry:
                for media in entry["media_content"]:
                    if media.get("medium") == "image":
                        cover_image_url = media.get("url")
                        break

            # Fallback to extracting an image from the description
            if not cover_image_url:
                soup = BeautifulSoup(description, "html.parser")
                img_tag = soup.find("img")
                if img_tag and img_tag.get("src"):
                    cover_image_url = img_tag["src"]

            # Extract full text and images
            full_text, extracted_images = extract_full_text_and_images(link)

            # Create an Article instance
            article = Article(
                title=title,
                link=link,
                description=description,
                full_text=full_text,
                published_at=published_at,
                cover_image_url=cover_image_url,
                author=entry.get("author", "Unknown Author"),
            )

            # Process extracted images
            for image in extracted_images:
                img = Image(
                    id=image["id"],
                    article_id=article.id,
                    url=image["url"],
                    backend_url=f"/article_images/{image["id"]}.jpg",
                )
                all_images.append(img)

            articles.append(article)
            print(f"Appended a new article. Article Title: {article.title}.")

        # Write the new articles to storage
        with open(ARTICLE_FILE, "w", encoding="utf-8") as f:
            json.dump(
                [article.model_dump() for article in articles],
                f,
                ensure_ascii=False,
                indent=4,
                default=str,
            )

        # Write the new images to storage
        with open(IMAGE_FILE, "w", encoding="utf-8") as f:
            json.dump(
                [image.model_dump() for image in all_images],
                f,
                ensure_ascii=False,
                indent=4,
            )

        # Update the hash file
        with open(HASH_FILE, "w", encoding="utf-8") as f:
            f.write(current_hash)

        print(f"Storage updated. {len(articles)} articles written to {ARTICLE_FILE}.")
    print(f"articles: {len(articles)} in {len(FEED_URLS)} feeds")
    return articles
