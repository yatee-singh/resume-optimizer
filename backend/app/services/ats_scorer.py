import json
import numpy as np

from app.services.embedding_service import (
    embedding_service,
)


class ATSScorer:

    def score(
        self,
        optimized_resume,
        job_analysis,
    ):

        jd_text = " ".join(
            job_analysis.required_skills
            + job_analysis.keywords
        )

        resume_text = json.dumps(
            optimized_resume.model_dump()
        )

        jd_embedding = (
            embedding_service.embed(
                jd_text
            )
        )

        resume_embedding = (
            embedding_service.embed(
                resume_text
            )
        )

        score = (
            np.dot(
                jd_embedding,
                resume_embedding,
            )
            * 100
        )

        return round(score, 2)


ats_scorer = ATSScorer()