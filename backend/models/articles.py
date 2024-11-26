from pydantic import BaseModel
from pydantic import BaseModel, Field
from typing import List

import uuid
from datetime import datetime

from models.facts import Fact


class Article(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    published_at: str
    cover_image_url: str
    author: str
    title: str
    link: str
    description: str
    full_text: str


class EnhancedArticle(Article):
    full_text_cleaned: str = Field(
        description="Direct copy from the full_text but leave out irrelevants content not related to topic."
    )
    facts: List[Fact] = Field(
        description="Extract facts stated in the article full_text by key and description"
    )


class EnhancedArticles(BaseModel):
    enhanced_articles: List[EnhancedArticle]
