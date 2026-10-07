import numpy as np

from app.services.embedding_service import (
    embedding_service,
)


class SkillMatcher:

    def match(
        self,
        required_skills,
        user_skills,
    ):

        selected = []

        for required in required_skills:

            req_embedding = (
                embedding_service.embed(
                    required
                )
            )

            best_score = 0

            best_skill = None

            for skill in user_skills:

                if not skill.embedding:
                    continue

                score = np.dot(
                    req_embedding,
                    skill.embedding,
                )

                if score > best_score:
                    best_score = score
                    best_skill = skill

            if best_skill:
                selected.append(
                    best_skill
                )

        return selected


skill_matcher = SkillMatcher()