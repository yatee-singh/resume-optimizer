from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import (
    get_current_user,
)
from app.services.embedding_service import embedding_service
from app.models.user import User
from app.database import get_db
from app.models.user import User
from app.models.resume_profile import ResumeProfile
from app.models.skill import Skill
from app.models.experience import Experience
from app.models.project import Project
from app.models.achievement import Achievement

from app.schema.resume import (
    ResumeUpdate,
    ResumeResponse,
    SkillCreate,
    SkillUpdate,
    SkillResponse,
    ExperienceCreate,
    ExperienceUpdate,
    ExperienceResponse,
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    AchievementCreate,
    AchievementUpdate,
    AchievementResponse,
)


router = APIRouter(
    prefix="/users/{user_id}/resume",
    tags=["Resume"],
)


# =========================================================
# Helper
# =========================================================

def get_profile(
    user_id: UUID,
    db: Session,
) -> ResumeProfile:

    profile = (
        db.query(ResumeProfile)
        .filter(ResumeProfile.user_id == user_id)
        .first()
    )

    if not profile:
        print('hey')
        profile = ResumeProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    return profile


# =========================================================
# Resume Profile
# =========================================================

@router.get(
    "",
    response_model=ResumeResponse,
)
def get_resume(
    user_id: UUID,
    db: Session = Depends(get_db),
):
    profile = get_profile(user_id, db)

    return profile
        


@router.patch(
    "",
    response_model=ResumeResponse,
)
def update_resume(
    user_id: UUID,
    data: ResumeUpdate,
    db: Session = Depends(get_db),
):
    profile = get_profile(user_id, db)

    if profile is None:
        profile = Profile(user_id=user_id)
        db.add(profile)

    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return profile


# =========================================================
# SKILLS
# =========================================================

@router.post(
    "/skills",
    response_model=SkillResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_skill(
    user_id: UUID,
    data: SkillCreate,
    db: Session = Depends(get_db),
):
    profile = get_profile(user_id, db)

    existing_skill = (
        db.query(Skill)
        .filter(
            Skill.profile_id == profile.id,
            Skill.name == data.name,
        )
        .first()
    )

    if existing_skill:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Skill already exists",
        )

    skill = Skill(
        profile_id=profile.id,
        **data.model_dump(),
    )

    skill.embedding = embedding_service.embed(
        skill.name
    )

    db.add(skill)
    db.commit()
    db.refresh(skill)

    return skill


@router.patch(
    "/skills/{skill_id}",
    response_model=SkillResponse,
)
def update_skill(
    user_id: UUID,
    skill_id: UUID,
    data: SkillUpdate,
    db: Session = Depends(get_db),
):
    profile = get_profile(user_id, db)

    skill = (
        db.query(Skill)
        .filter(
            Skill.id == skill_id,
            Skill.profile_id == profile.id,
        )
        .first()
    )

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )

    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(skill, field, value)

    if "name" in update_data:
        skill.embedding = embedding_service.embed(
            skill.name
        )

    db.commit()
    db.refresh(skill)

    return skill


@router.delete(
    "/skills/{skill_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_skill(
    user_id: UUID,
    skill_id: UUID,
    db: Session = Depends(get_db),
):
    profile = get_profile(user_id, db)

    skill = (
        db.query(Skill)
        .filter(
            Skill.id == skill_id,
            Skill.profile_id == profile.id,
        )
        .first()
    )

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )

    db.delete(skill)
    db.commit()

    return None


# =========================================================
# EXPERIENCES
# =========================================================

@router.post(
    "/experiences",
    response_model=ExperienceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_experience(
    user_id: UUID,
    data: ExperienceCreate,
    db: Session = Depends(get_db),
):
    profile = get_profile(user_id, db)

    experience = Experience(
        profile_id=profile.id,
        **data.model_dump(),
    )
    embedding_text = f"""
    Role: {experience.role}
    Company: {experience.company}
    Location: {experience.location or ""}
    Description: {experience.description or ""}
    """

    experience.embedding = embedding_service.embed(
        embedding_text
    )

    db.add(experience)
    db.commit()
    db.refresh(experience)

    return experience


@router.patch(
    "/experiences/{experience_id}",
    response_model=ExperienceResponse,
)
def update_experience(
    user_id: UUID,
    experience_id: UUID,
    data: ExperienceUpdate,
    db: Session = Depends(get_db),
):
    profile = get_profile(user_id, db)

    experience = (
        db.query(Experience)
        .filter(
            Experience.id == experience_id,
            Experience.profile_id == profile.id,
        )
        .first()
    )

    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found",
        )

    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(experience, field, value)

    embedding_text = f"""
    Role: {experience.role}
    Company: {experience.company}
    Location: {experience.location or ""}
    Description: {experience.description or ""}
    """

    experience.embedding = embedding_service.embed(
        embedding_text
    )

    db.commit()
    db.refresh(experience)

    return experience


@router.delete(
    "/experiences/{experience_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_experience(
    user_id: UUID,
    experience_id: UUID,
    db: Session = Depends(get_db),
):
    profile = get_profile(user_id, db)

    experience = (
        db.query(Experience)
        .filter(
            Experience.id == experience_id,
            Experience.profile_id == profile.id,
        )
        .first()
    )

    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found",
        )

    db.delete(experience)
    db.commit()

    return None


# =========================================================
# PROJECTS
# =========================================================

@router.post(
    "/projects",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    user_id: UUID,
    data: ProjectCreate,
    db: Session = Depends(get_db),
):
    profile = get_profile(user_id, db)

    project = Project(
        profile_id=profile.id,
        **data.model_dump(),
    )

    embedding_text = f"""
    Project: {project.name}
    Description: {project.description or ""}
    """

    project.embedding = embedding_service.embed(
        embedding_text
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


@router.patch(
    "/projects/{project_id}",
    response_model=ProjectResponse,
)
def update_project(
    user_id: UUID,
    project_id: UUID,
    data: ProjectUpdate,
    db: Session = Depends(get_db),
):
    profile = get_profile(user_id, db)

    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.profile_id == profile.id,
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(project, field, value)

    embedding_text = f"""
    Project: {project.name}
    Description: {project.description or ""}
    """

    project.embedding = embedding_service.embed(
        embedding_text
    )

    db.commit()
    db.refresh(project)

    return project


@router.delete(
    "/projects/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project(
    user_id: UUID,
    project_id: UUID,
    db: Session = Depends(get_db),
):
    profile = get_profile(user_id, db)

    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.profile_id == profile.id,
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    db.delete(project)
    db.commit()

    return None


# =========================================================
# ACHIEVEMENTS
# =========================================================

@router.post(
    "/achievements",
    response_model=AchievementResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_achievement(
    user_id: UUID,
    data: AchievementCreate,
    db: Session = Depends(get_db),
):
    profile = get_profile(user_id, db)

    achievement = Achievement(
        profile_id=profile.id,
        **data.model_dump(),
    )

    db.add(achievement)
    db.commit()
    db.refresh(achievement)

    return achievement


@router.patch(
    "/achievements/{achievement_id}",
    response_model=AchievementResponse,
)
def update_achievement(
    user_id: UUID,
    achievement_id: UUID,
    data: AchievementUpdate,
    db: Session = Depends(get_db),
):
    profile = get_profile(user_id, db)

    achievement = (
        db.query(Achievement)
        .filter(
            Achievement.id == achievement_id,
            Achievement.profile_id == profile.id,
        )
        .first()
    )

    if not achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Achievement not found",
        )

    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(achievement, field, value)

    db.commit()
    db.refresh(achievement)

    return achievement


@router.delete(
    "/achievements/{achievement_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_achievement(
    user_id: UUID,
    achievement_id: UUID,
    db: Session = Depends(get_db),
):
    profile = get_profile(user_id, db)

    achievement = (
        db.query(Achievement)
        .filter(
            Achievement.id == achievement_id,
            Achievement.profile_id == profile.id,
        )
        .first()
    )

    if not achievement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Achievement not found",
        )

    db.delete(achievement)
    db.commit()

    return None