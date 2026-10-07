import os
import json
from typing import Type, TypeVar

from google import genai
from google.genai import types
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

T = TypeVar("T", bound=BaseModel)


class GeminiClient:
    def __init__(self):
        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

        self.model = os.getenv(
            "GEMINI_MODEL",
            "gemini-2.5-flash"
        )

    async def generate_text(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
    ) -> str:
        """
        Standard text generation
        """

        prompt = f"""
SYSTEM:
{system_prompt}

USER:
{user_prompt}
"""

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=temperature,
            ),
        )

        return response.text

    async def generate_json(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Type[T],
        temperature: float = 0.1,
    ) -> T:
        """
        Structured output using Pydantic schema.
        Gemini validates output against schema.
        """

        prompt = f"""
SYSTEM:
{system_prompt}

USER:
{user_prompt}
"""

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=temperature,
                response_mime_type="application/json",
                response_schema=response_schema,
            ),
        )

        return response_schema.model_validate_json(
            response.text
        )

    async def generate_resume(
        self,
        prompt: str,
    ) -> str:

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3,
            ),
        )

        return response.text


gemini_client = GeminiClient()