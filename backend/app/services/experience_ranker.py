import numpy as np


class ExperienceRanker:

    def rank(
        self,
        experiences,
        job_embedding,
    ):

        scored = []

        for exp in experiences:

            if not exp.embedding:
                continue

            score = np.dot(
                job_embedding,
                exp.embedding
            )

            scored.append(
                (
                    score,
                    exp,
                )
            )

        scored.sort(
            reverse=True,
            key=lambda x: x[0]
        )

        return [x[1] for x in scored]


experience_ranker = ExperienceRanker()