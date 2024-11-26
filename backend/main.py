from fastapi import Depends, FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import json

from fastapi.staticfiles import StaticFiles

from dependencies import get_query_token, get_token_header
from internal import admin
from routers import content, media


@asynccontextmanager
async def lifespan(app: FastAPI):

    openapi_schema = app.openapi()
    with open("openapi.json", "w") as f:
        json.dump(openapi_schema, f, indent=2)
    print("OpenAPI schema has been saved to 'openapi.json'.")

    yield


# FastAPI with Token Authentication``
# app = FastAPI(dependencies=[Depends(get_query_token)])

# FastAPI without Token Authentication
app = FastAPI(
    title="RTS Hubert Burda Media",
    lifespan=lifespan,
    servers=[
        {"url": "http://localhost:8000", "description": "Dev"},
    ],
)

# Add CORS middleware to your app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


app.include_router(content.router)
app.include_router(media.router)
app.mount(
    "/article_images", StaticFiles(directory="article_images"), name="Article Images"
)
app.mount("/content", StaticFiles(directory="content"), name="content")


app.mount(
    "/prepared_content", StaticFiles(directory="prepared_content"), name="Stocks Images"
)


@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}
