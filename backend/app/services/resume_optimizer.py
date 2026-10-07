import json

from app.core.ai import gemini_client

from app.schema.optimizer import (
    TailoredResume,
)


PROMPT = """
You are an expert ATS resume writer.

Rules:

1. Never invent experience.
2. Never invent metrics.
3. Never invent technologies.
4. Rewrite professionally.
5. Naturally include keywords.
6. Keep bullets concise.
"""


class ResumeOptimizer:

    async def optimize(
        self,
        job_analysis,
        context,
    ):

        payload = {
            "job": job_analysis.model_dump(),
            "resume": context,
        }

        return await gemini_client.generate_json(
            system_prompt=PROMPT,
            user_prompt=json.dumps(payload),
            response_schema=TailoredResume,
        )


resume_optimizer = ResumeOptimizer()