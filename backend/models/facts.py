from typing import List
from pydantic import BaseModel


class Fact(BaseModel):
    key: str
    description: str


class AssessedFactOutput(BaseModel):
    key: str
    description: str
    citation_indexes: List[int]
    perplexity_assessment: str
    correct_flag: bool


class AssessedFactOutputList(BaseModel):
    assessed_facts: List[AssessedFactOutput]


class AssessedFact(BaseModel):
    key: str
    description: str
    article_ids: List[str]
    perplexity_links: List[str]
    perplexity_assessment: str
    correct_flag: bool
