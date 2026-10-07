from app.models.optimized_resume import (
    OptimizedResume,
)


class OptimizedResumeService:

    def save(
        self,
        db,
        user_id,
        job_title,
        job_description,
        ats_score,
        resume,
    ):

        record = OptimizedResume(
            user_id=user_id,

            job_title=job_title,

            job_description=job_description,

            ats_score=ats_score,

            resume_json=resume.model_dump(),
        )

        db.add(record)

        db.commit()

        db.refresh(record)

        return record


optimized_resume_service = (
    OptimizedResumeService()
)