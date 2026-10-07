import numpy as np

from app.core.embeddings import (
    embedding_client
)

class ResumeRanker:

    def similarity(
        self,
        a,
        b,
    ):
        return float(
            np.dot(a, b)
        )

    def rank_experiences(
        self,
        job_analysis,
        experiences,
    ):

        query_text = " ".join([
            *job_analysis.required_skills,
            *job_analysis.keywords,
            *job_analysis.responsibilities
        ])

        query_embedding = (
            embedding_client.embed(
                query_text
            )
        )

        ranked = []

        for exp in experiences:

            score = self.similarity(
                query_embedding,
                exp.embedding
            )

            ranked.append({
                "experience": exp,
                "score": score
            })

        ranked.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return ranked