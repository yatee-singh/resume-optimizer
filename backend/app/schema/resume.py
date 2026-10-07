from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# -------------------------
# Skill
# -------------------------

class SkillCreate(BaseModel):
    name: str
    category: str
    display_order: int = 0


class SkillUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    display_order: int | None = None


class SkillResponse(SkillCreate):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


# -------------------------
# Experience
# -------------------------

class ExperienceCreate(BaseModel):
    company: str
    role: str
    location: str | None = None
    description: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool = False
    display_order: int = 0


class ExperienceUpdate(BaseModel):
    company: str | None = None
    role: str | None = None
    location: str | None = None
    description: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool | None = None
    display_order: int | None = None


class ExperienceResponse(ExperienceCreate):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


# -------------------------
# Project
# -------------------------

class ProjectCreate(BaseModel):
    name: str
    description: str
    url: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    display_order: int = 0


class ProjectUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    url: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    display_order: int | None = None


class ProjectResponse(ProjectCreate):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


# -------------------------
# Achievement
# -------------------------

class AchievementCreate(BaseModel):
    title: str
    description: str | None = None
    type: str | None = None
    achievement_date: date | None = None
    display_order: int = 0


class AchievementUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    type: str | None = None
    achievement_date: date | None = None
    display_order: int | None = None


class AchievementResponse(AchievementCreate):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


# -------------------------
# Resume Profile
# -------------------------

class ResumeUpdate(BaseModel):
    headline: str | None = None
    summary: str | None = None


class ResumeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    headline: str | None
    summary: str | None
    skills: list[SkillResponse] = Field(default_factory=list)
    experiences: list[ExperienceResponse] = Field(default_factory=list)
    projects: list[ProjectResponse] = Field(default_factory=list)
    achievements: list[AchievementResponse] = Field(default_factory=list)