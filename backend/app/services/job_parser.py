from app.core.ai import gemini_client
from app.schema.optimizer import JobAnalysis


PROMPT = """
Extract:

- role
- required_skills
- preferred_skills
- keywords
- responsibilities

Return JSON only.
"""


class JobParser:

    async def analyze(
        self,
        job_description: str,
    ) -> JobAnalysis:

        return await gemini_client.generate_json(
            system_prompt=PROMPT,
            user_prompt=job_description,
            response_schema=JobAnalysis,
        )


job_parser = JobParser()