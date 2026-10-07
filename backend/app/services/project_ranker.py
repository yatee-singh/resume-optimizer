import numpy as np


class ProjectRanker:

    def rank(
        self,
        projects,
        job_embedding,
    ):

        scored = []

        for project in projects:

            if not project.embedding:
                continue

            score = np.dot(
                job_embedding,
                project.embedding
            )

            scored.append(
                (
                    score,
                    project,
                )
            )

        scored.sort(
            reverse=True,
            key=lambda x: x[0]
        )

        return [x[1] for x in scored]


project_ranker = ProjectRanker()