import json
import os
import time
import requests
import openai
from models.articles import *
from models.facts import *
from models.images import *
from models.topics import *


def topics_enhanced_cached() -> TopicListEnhancedArticle:
    if os.path.exists("enhanced_topics.json"):
        with open("enhanced_topics.json", "r", encoding="utf-8") as f:
            topics = json.load(f)
            t = [TopicEnhancedArticle(**topic) for topic in topics]
    else:
        t = []

    return t


with open("api.key", "r") as f:
    keys = json.load(f)

PERPLEXITY_KEY = keys.get("perplexity")
OPENAI_KEY = keys.get("openAI")
PERPLEXITY_BASE_URL = "https://api.perplexity.ai"
OPENAI_BASE_URL = (
    "https://hackatum-2024.openai.azure.com/"  # update depending on Azure environment
)

# Endpoint for chat completions
endpoint = f"{PERPLEXITY_BASE_URL}/chat/completions"


def fact_check_perplexity(topics: TopicListEnhancedArticle):
    fact_checks = {}
    for topic in topics:
        facts = [
            (fact.key, fact.description)
            for article in topic.article_list
            for fact in article.facts
        ]
        print(f"current facts: {facts}")

        # Headers including the API key for authentication
        headers = {
            "Authorization": f"Bearer {PERPLEXITY_KEY}",
            "Content-Type": "application/json",
        }

        # Payload for the request
        payload = {
            "model": "llama-3.1-sonar-small-128k-online",  # Specify the model you want to use
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful assistant who fact checks the stated facts with sources.",
                },
                {"role": "user", "content": json.dumps(facts)},
            ],
            "max_tokens": 5000,
            "temperature": 0.2,
            "top_p": 0.9,
        }
        result = ""
        try:
            # Send the POST request
            response = requests.post(endpoint, headers=headers, json=payload)
            response.raise_for_status()  # Raise an exception for HTTP errors

            # Parse the response JSON
            result = response.json()
            print("Response from Perplexity AI:")
            print(result)
            client = openai.AzureOpenAI(
                api_key=OPENAI_KEY,
                api_version="2024-08-01-preview",
                azure_endpoint=OPENAI_BASE_URL,
            )
            citations = result["citations"]
            system_message = {
                "role": "system",
                "content": "You extract the verdict from a result string and match it to the related fact. Then you add the citations which are the numbers in [] brackets as citation indexes.",
            }
            user_message = {
                "role": "user",
                "content": f"result string with verdict: {result['choices'][0]['message']['content']} facts: {facts}",
            }

            response = client.beta.chat.completions.parse(
                model="gpt-4o",
                messages=[system_message, user_message],
                response_format=AssessedFactOutputList,
            )

            print(response.choices[0])
            fact_checks[topic.name] = (response.choices[0].message.parsed, citations)
            print("Waiting 3 seconds")
            time.sleep(3)

        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")

    final_topics_all = []
    for topic in topics:
        # Unpack the tuple directly
        parsed_message, citations = fact_checks[topic.name]
        assessed_facts_list = (
            parsed_message.assessed_facts
        )  # This is a list of AssessedFactOutput objects
        list_assesed_facts = []
        for fact in assessed_facts_list:
            list_articles_ids = []
            for article in topic.article_list:
                # Compare fact keys to find matching articles
                for fact_article in article.facts:
                    if fact_article.key == fact.key:
                        list_articles_ids.append(article.id)
            assessedFact = AssessedFact(
                key=fact.key,
                description=fact.description,
                article_ids=list_articles_ids,
                perplexity_links=[
                    citations[index - 1] for index in fact.citation_indexes
                ],
                perplexity_assessment=fact.perplexity_assessment,
                correct_flag=fact.correct_flag,
            )

            list_assesed_facts.append(assessedFact)

        final_topics_all.append(
            FinalTopic(
                name=topic.name,
                description=topic.description,
                categories=topic.categories,
                fact_summary=list_assesed_facts,
                article_list=topic.article_list,
            )
        )

    with open("final_topic.json", "w", encoding="utf-8") as f:
        json.dump(
            [ft.model_dump() for ft in final_topics_all],
            f,
            ensure_ascii=False,
            indent=4,
        )
    print(final_topics_all)
    return final_topics_all


# fact_check_perplexity(topics_enhanced_cached())
