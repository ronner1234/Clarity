# Clarity - The Copilot for Journalists

This project was created during the HackaTUM 2024 by Simon, Theo and Ron.

Link to [DEVPOST](https://devpost.com/software/clarity-t8dvrp)!

## Requirements

- [NodeJS LTS](https://nodejs.org/en): React Frontend
- [UV](https://docs.astral.sh/uv): Python Package Manager
- [OpenAI API Key](https://platform.openai.com/docs/overview): Using GPT 4o and Dall-E 3
- [ElevenLabs API Key](https://elevenlabs.io/api): For Text-To-Speech
- [Perplexity API Key](https://docs.perplexity.ai/home): For Internet Fact Checking

## Getting Started Backend

1. **Install `uv`:**  
   Follow the instructions in the [uv documentation](https://docs.astral.sh/uv/#getting-started) to install `uv`.

2. **Sync Dependencies:**  
   Navigate to the Backend Folder. Run the following command to install the required dependencies:

   ```bash
   cd backend
   uv sync
   ```

3. **Add API Keys:**
   In order to run this project, please have a look at the `api.key.example` file in the backend folder. Duplicate this file and rename it `api.key`. Then add key to the `api.key`file for [OpenAI](https://platform.openai.com/docs/overview), ElevenLabs to create the podcast, and Perplexity for fact checking.

4. **Run the Application Locally:**  
   Use this command to start the FastAPI application with Uvicorn:

   ```bash
   uv run uvicorn main:app --reload
   ```

5. **See the Docs:**  
   Visits [localhost:8000/docs](http://localhost:8000/docs) for the Swagger UI.

6. **FastAPI Documentation:**  
   Learn more about FastAPI by visiting the [official FastAPI documentation](https://fastapi.tiangolo.com/).

## Getting Started Frontend

1. **Install Node JS:**
   Download from [nodejs.org](https://nodejs.org/en).

2. **Install Dependencies:**  
    Navigate to the Frontend Folder. Run the following command to install all required dependencies:

   ```bash
   cd frontend
   npm install
   ```

3. **Run the Development Server:**  
   Start the development server using:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Using the App.

Scraping and processing is performed on request. Use the endpoint `/refresh` to run a full processing. The app will use this output.

## Inspiration

Journalism in the age of social media and digital news is challenging. Balancing speed, accuracy, and delivering original value to readers requires immense effort. Human oversight remains essential to ensure ethical standards and to verify the accuracy of facts and news. To support journalists in this mission, we built Clarity—a tool designed to empower them in navigating these complexities with confidence and efficiency.

## What it does

Clarity streamlines the journalism process by aggregating current news from a wide range of sources. It identifies common topics, allowing writers to select their area of focus. Once a topic is chosen, Clarity presents a curated list of related articles and relevant facts for consideration. These facts are rigorously verified using our AI-powered fact-checking algorithms, which browse the internet for reliable sources to ensure accuracy. After confirmation, Clarity combines the chosen information and image to suggest an initial draft of the text, which can be easily edited and refined by the writer.

## How we built it

We developed Clarity with a React TypeScript frontend connected to a Python backend via OpenAPI. The backend is responsible for parsing RSS feeds and leveraging OpenAI along with other large language models (LLMs) to deliver key functionalities, such as text generation and fact-checking. This seamless integration ensures a robust and efficient system that empowers journalists with reliable tools for their workflow.

## Challenges we ran into

One major challenge was scaling the system to handle large amounts of data with limited compute resources. To overcome this, we implemented a solution that involves splitting requests into smaller batches by grouping articles based on topics at the initial stage. This approach reduced the computational load and improved the efficiency of our processing pipeline.

## Accomplishments that we're proud of

We take pride in creating an intuitive user experience that simplifies the journalism process while maintaining high standards of accuracy. Our AI-powered fact-checking system stands out as a significant achievement, ensuring the reliability and credibility of the information presented to users.

## What we learned

Throughout this project, we gained experience with new frameworks for the frontend, enhancing our development skills. We also learned how to balance code quality—prioritizing readability through refactoring—while managing time pressure during an intensive development weekend.

## What's next for Clarity

The next steps for Clarity include expanding support for additional media outputs and integrating a wider range of news sources. We also aim to decrease latency and improve performance through further optimization of the system

## License

This project is licensed under the terms of the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).
