import openai
from pydantic import BaseModel, Field
from typing import List, Dict
from topics import AssessedFact, EnhancedArticle, FinalTopic
import json
import os
from pathlib import Path
import requests
#import moviepy
with open("api.key", "r") as f:
    keys = json.load(f)

# Access individual keys
ELEVEN = keys.get("eleven")
AZURE = keys.get("openAI")
openAI_private = keys.get("openAI_private")
OPENAI_KEY = AZURE # Open AI key here

api_base = "https://hackatum-2024.openai.azure.com/" # update Azure env
api_key = OPENAI_KEY


class ComponentParagraph(BaseModel):
    subheader: str
    text: str

class GeneratedText(BaseModel):
    title: str
    content: List[ComponentParagraph]

def generate_text(source=FinalTopic):
    client = openai.AzureOpenAI(
        api_key=api_key, api_version="2024-08-01-preview", azure_endpoint=api_base
    )

    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"You are a journalist who writes interesting, high quality news article for websites about breaking news in the field of e-mobility. You do not copy other articles directly.",  ### TODO: Add tone off voice
            },
            {
                "role": "user",
                "content": f"""Your criteria for an article are these:
                Creating helpful, reliable, people-first content
                Google's automated ranking systems are designed to present helpful, reliable information that's primarily created to benefit people, not to gain search engine rankings, in the top Search results. This page is designed to help creators evaluate if they're producing such content.
                Self-assess your content 
                Evaluating your own content against these questions can help you gauge if the content you're making is helpful and reliable. Beyond asking yourself these questions, consider having others you trust but who are unaffiliated with your site provide an honest assessment.
                Also consider an audit of the drops you may have experienced. What pages were most impacted and for what types of searches? Look closely at these to understand how they're assessed against some of the questions outlined here.
                Content and quality questions
                Does the content provide original information, reporting, research, or analysis?
                Does the content provide a substantial, complete, or comprehensive description of the topic?
                Does the content provide insightful analysis or interesting information that is beyond the obvious?
                If the content draws on other sources, does it avoid simply copying or rewriting those sources, and instead provide substantial additional value and originality?
                Does the main heading or page title provide a descriptive, helpful summary of the content?
                Does the main heading or page title avoid exaggerating or being shocking in nature?
                Is this the sort of page you'd want to bookmark, share with a friend, or recommend?
                Would you expect to see this content in or referenced by a printed magazine, encyclopedia, or book?
                Does the content provide substantial value when compared to other pages in search results?
                Does the content have any spelling or stylistic issues?
                Is the content produced well, or does it appear sloppy or hastily produced?
                Is the content mass-produced by or outsourced to a large number of creators, or spread across a large network of sites, so that individual pages or sites don't get as much attention or care?
                Expertise questions
                Does the content present information in a way that makes you want to trust it, such as clear sourcing, evidence of the expertise involved, background about the author or the site that publishes it, such as through links to an author page or a site's About page?
                If someone researched the site producing the content, would they come away with an impression that it is well-trusted or widely-recognized as an authority on its topic?
                Is this content written or reviewed by an expert or enthusiast who demonstrably knows the topic well?
                Does the content have any easily-verified factual errors?
                Provide a great page experience 
                Google's core ranking systems look to reward content that provides a good page experience. Site owners seeking to be successful with our systems should not focus on only one or two aspects of page experience. Instead, check if you're providing an overall great page experience across many aspects. For more advice, see our page, Understanding page experience in Google Search results.

                Focus on people-first content
                People-first content means content that's created primarily for people, and not to manipulate search engine rankings. How can you evaluate if you're creating people-first content? Answering yes to the questions below means you're probably on the right track with a people-first approach:

                Do you have an existing or intended audience for your business or site that would find the content useful if they came directly to you?
                Does your content clearly demonstrate first-hand expertise and a depth of knowledge (for example, expertise that comes from having actually used a product or service, or visiting a place)?
                Does your site have a primary purpose or focus?
                After reading your content, will someone leave feeling they've learned enough about a topic to help achieve their goal?
                Will someone reading your content leave feeling like they've had a satisfying experience?
                Avoid creating search engine-first content
                We recommend that you focus on creating people-first content to be successful with Google Search, rather than search engine-first content made primarily to gain search engine rankings. Answering yes to some or all of the questions below is a warning sign that you should reevaluate how you're creating content:

                Is the content primarily made to attract visits from search engines?
                Are you producing lots of content on many different topics in hopes that some of it might perform well in search results?
                Are you using extensive automation to produce content on many topics?
                Are you mainly summarizing what others have to say without adding much value?
                Are you writing about things simply because they seem trending and not because you'd write about them otherwise for your existing audience?
                Does your content leave readers feeling like they need to search again to get better information from other sources?
                Are you writing to a particular word count because you've heard or read that Google has a preferred word count? (No, we don't.)
                Did you decide to enter some niche topic area without any real expertise, but instead mainly because you thought you'd get search traffic?
                Does your content promise to answer a question that actually has no answer, such as suggesting there's a release date for a product, movie, or TV show when one isn't confirmed?
                Are you changing the date of pages to make them seem fresh when the content has not substantially changed?
                Are you adding a lot of new content or removing a lot of older content primarily because you believe it will help your search rankings overall by somehow making your site seem "fresh?" (No, it won't)""",
            },
            {
                "role": "user",
                "content": f"Please write an interesting news article on the topic of {source.name, source.description, source.categories}. The text should include relevant facts from {source.fact_summary}. Other articles wrote this about it {source.article_list}.",
            },
        ],
        response_format=GeneratedText,
    )
    return response.choices[0].message.parsed

class Tweet(BaseModel):
    tweet: str

def generate_tweet(source: GeneratedText):
    client = openai.AzureOpenAI(
        api_key=api_key, api_version="2024-08-01-preview", azure_endpoint=api_base
    )

    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"You are a social media manager for a company that sells electric cars. You are responsible for creating engaging social media posts for the company's Twitter account. Your goal is to inform and engage the audience with the latest news in the field of e-mobility.",
            },
            {
                "role": "user",
                "content": f"Please one text for a tweet based on the article: {source.title, str([(t.subheader, t. text) for t in source.content])}. You can use hashtags for better reach.",
            },
        ],
        response_format=Tweet,
    )

    return response.choices[0].message.parsed

class Podcast_Text(BaseModel):
    podcast_text: str
    title: str

class Podcast(BaseModel):
    mp3_link: str
    title: str

import requests
import uuid

def generate_podcast(source: GeneratedText):
    print("Generating podcast")
    client = openai.AzureOpenAI(
        api_key=api_key, api_version="2024-08-01-preview", azure_endpoint=api_base
    )

    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"You are Joh, a podcast host of the Podcast 'E-Mobility whispers'. You are responsible for creating engaging podcast episodes. Your goal is to inform and engage the audience with the latest news in the field of e-mobility. And to recommend the home page efahrer.com.",
            },
            {
                "role": "user",
                "content": f"Make a short Podcast about the information in this article witch you have just found on efahrer.com: {source.title, str([(t.subheader, t.text) for t in source.content])}. Make sure you convey a good mood and keep the audience engaged. And keep the title short and catchy.",
            },
        ],
        response_format=Podcast_Text,
    )
    id = uuid.uuid4()

    podcast = response.choices[0].message.parsed
    text = podcast.podcast_text
    title = podcast.title
    print("Podcast text: ", text)
    print("Podcast title: ", title)
    # return Podcast(mp3_link='http://localhost:8000/content/1c5ed64c-b535-4b18-9823-c0fdf8b1ad4a.mp3', title=title)

    CHUNK_SIZE = 1024
    url = "https://api.elevenlabs.io/v1/text-to-speech/nPczCjzI2devNBz1zQrb"

    key = ELEVEN

    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": key
    }

    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }

    response = requests.post(url, json=data, headers=headers)
    print(response)
    with open('content/' + str(id) + '.mp3', 'wb') as f:
        for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
            if chunk:
                f.write(chunk)
    return Podcast(mp3_link='http://localhost:8000/content/' + str(id) + '.mp3', title=title)


def generate_speech(text: GeneratedText, topic: str):
    speech_file_path = os.path.join(os.path.dirname(__file__), "tts_folder", f"{topic.replace(" ","_")}.mp3")

    client = openai.OpenAI(
        api_key=openAI_private
    )
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=text.title + str([(t.subheader, t. text) for t in text.content])
    )

    response.stream_to_file(speech_file_path)

def generate_images(topic:FinalTopic):
    client = openai.OpenAI(
        api_key=openAI_private
    )
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=topic.title + str([(t.subheader, t. text) for t in text.content])
    )
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=f"create image for the topic {topic.name} with the short description {topic.description}. Do not add text to the image.",
            n=1,
            size="1024x1024"
        )
        image_url = response.data[0].url
        print(image_url)
        return image_url
    except Exception as e:
        print(f"Error generating image: {e}")
        return []


def generate_short_script(text: GeneratedText, expected_length="35 seconds"):
    client = openai.AzureOpenAI(
        api_key=api_key, api_version="2024-08-01-preview", azure_endpoint=api_base
    )

    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"You are a TikTok Script writer for e-mobility enthusiasts. For that you will summarize the text in an interesting way for the audience on TikTok. Do not use emojis in the text. It is a script for someone speaking.",
            },
            {
                "role": "user",
                "content": f"""Your main goal is to inform about the major news in the article and promote the link in the profile to the website.""",
            },
            {
                "role": "user",
                "content": f"Please write the script for a short video of about {expected_length} based on the article: {text.title, str([(t.subheader, t. text) for t in text.content])}.",
            },
        ],
    )

    print(response.choices[0].message)
    return response.choices[0].message

def generate_speech_short(script: str, file_name="short.mp3"):
    speech_file_path = os.path.join(os.path.dirname(__file__), "tts_folder", file_name)

    client = openai.OpenAI(
        api_key=openAI_private
    )
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=script
    )

    response.stream_to_file(speech_file_path)
    return speech_file_path

def final_topics_cached() -> List[FinalTopic]:
    if os.path.exists("./json/final_topics.json"):
        with open("./json/final_topics.json", "r", encoding="utf-8") as f:
            articles_data = json.load(f)
            articles = [FinalTopic(**article) for article in articles_data]
    else:
        articles = []

    return articles


def merge_video_and_audio(video_path, audio_path, output_path):
    # Load the video file
    video_clip = moviepy.editor.VideoFileClip(video_path)
    # Mute the video's original audio
    video_clip = video_clip.without_audio()
    # Load the new audio file
    audio_clip = moviepy.editor.AudioFileClip(audio_path)
    # Set the new audio to the video
    final_clip = video_clip.set_audio(audio_clip)
    # Write the final video file
    final_clip.write_videofile(output_path, codec='libx264', audio_codec='aac')


# final_topics = final_topics_cached()
# text = generate_text(final_topics[0])
# generate_speech(text=text, topic=final_topics[0].name)
# generate_images(topic=final_topics[0])

# script = generate_short_script(text, "35 seconds")
# short_path = generate_speech_short(script=script)
# video_path = "prepared_content/stock_images/intersection.mp4"
# merge_video_and_audio(video_path=video_path, audio_path=short_path, output_path="tts_folder/short_video_merged.mp4")