from typing import List
from pydantic import BaseModel, Field

from models.articles import Article, EnhancedArticle
from models.facts import AssessedFact
from models.images import Image

class Topic(BaseModel):
    name: str
    description: str = Field(
        description="Shortly describe the contents of the articles in this Topic."
    )
    categories: List[str]
    article_list: List[Article]


class TopicList(BaseModel):
    topics: List[Topic]


class TopicEnhancedArticle(BaseModel):
    name: str
    description: str = Field(
        description="Shortly describe the contents of the articles in this Topic."
    )
    categories: List[str]
    article_list: List[EnhancedArticle]


class TopicListEnhancedArticle(BaseModel):
    topics: List[TopicEnhancedArticle]


class FinalTopic(BaseModel):
    name: str
    description: str
    categories: List[str]
    fact_summary: List[AssessedFact]
    article_list: List[EnhancedArticle]

class objectToSend(BaseModel):
    final_topics: List[FinalTopic]
    images: List[Image]