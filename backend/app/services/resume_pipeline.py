import logging

from app.models.resume_profile import (
    ResumeProfile,
)

from app.services.job_parser import (
    job_parser,
)

from app.services.embedding_service import (
    embedding_service,
)

from app.services.experience_ranker import (
    experience_ranker,
)

from app.services.project_ranker import (
    project_ranker,
)

from app.services.skill_matcher import (
    skill_matcher,
)

from app.services.context_builder import (
    context_builder,
)

from app.services.resume_optimizer import (
    resume_optimizer,
)

from app.services.ats_scorer import (
    ats_scorer,
)

from app.services.optimized_resume_service import (
    optimized_resume_service,
)


logger = logging.getLogger(__name__)


class ResumePipeline:

    async def run(
        self,
        db,
        user,
        job_description,
    ):

        logger.info(
            "Starting resume optimization pipeline for user_id=%s",
            user.id,
        )

        profile = (
            db.query(ResumeProfile)
            .filter(
                ResumeProfile.user_id
                == user.id
            )
            .first()
        )

        if not profile:
            logger.error(
                "Resume profile not found for user_id=%s",
                user.id,
            )
            raise ValueError("Resume profile not found")

        logger.info(
            "Resume profile loaded: user_id=%s, experiences=%d, projects=%d, skills=%d",
            user.id,
            len(profile.experiences),
            len(profile.projects),
            len(profile.skills),
        )

        logger.info("Analyzing job description")

        analysis = (
            await job_parser.analyze(
                job_description
            )
        )

        logger.info(
            "Job analysis completed: required_skills=%d, keywords=%d, responsibilities=%d, role=%s",
            len(analysis.required_skills),
            len(analysis.keywords),
            len(analysis.responsibilities),
            analysis.role,
        )

        job_text = " ".join(
            analysis.required_skills
            + analysis.keywords
            + analysis.responsibilities
        )

        logger.info("Generating job embedding")

        job_embedding = (
            embedding_service.embed(
                job_text
            )
        )

        logger.info("Job embedding generated")

        logger.info("Ranking experiences")

        top_experiences = (
            experience_ranker.rank(
                profile.experiences,
                job_embedding,
            )[:3]
        )

        logger.info(
            "Top experiences selected: count=%d",
            len(top_experiences),
        )

        logger.info("Ranking projects")

        top_projects = (
            project_ranker.rank(
                profile.projects,
                job_embedding,
            )[:3]
        )

        logger.info(
            "Top projects selected: count=%d",
            len(top_projects),
        )

        logger.info("Matching skills")

        top_skills = (
            skill_matcher.match(
                analysis.required_skills,
                profile.skills,
            )
        )

        logger.info(
            "Skill matching completed: matched_skills=%d",
            len(top_skills),
        )

        logger.info("Building resume optimization context")

        context = (
            context_builder.build(
                profile,
                top_experiences,
                top_projects,
                top_skills,
            )
        )

        logger.info("Resume optimization context built")

        logger.info("Optimizing resume with AI")

        optimized_resume = (
            await resume_optimizer.optimize(
                analysis,
                context,
            )
        )

        logger.info("Resume optimization completed")

        logger.info("Calculating ATS score")

        ats_score = (
            ats_scorer.score(
                optimized_resume,
                analysis,
            )
        )

        logger.info(
            "ATS score calculated: score=%s",
            ats_score,
        )

        logger.info("Saving optimized resume")

        saved = (
            optimized_resume_service.save(
                db=db,
                user_id=user.id,
                job_title=analysis.role,
                job_description=job_description,
                ats_score=ats_score,
                resume=optimized_resume,
            )
        )

        logger.info(
            "Optimized resume saved successfully: resume_id=%s, user_id=%s",
            saved.id,
            user.id,
        )

        logger.info(
            "Resume optimization pipeline completed successfully: user_id=%s, resume_id=%s",
            user.id,
            saved.id,
        )

        return {
            "resume_id": str(saved.id),
            "ats_score": ats_score,
            "resume": optimized_resume,
        }


resume_pipeline = ResumePipeline()