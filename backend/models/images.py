from pydantic import BaseModel


class Image(BaseModel):
    id: str
    article_id: str
    url: str
    backend_url: str
