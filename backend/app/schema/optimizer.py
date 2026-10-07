from pydantic import BaseModel

class OptimizeRequest(BaseModel):
    job_description: str
    
class JobAnalysis(BaseModel):
    role: str
    required_skills: list[str]
    preferred_skills: list[str]
    keywords: list[str]
    responsibilities: list[str]


class TailoredExperience(BaseModel):
    company: str
    role: str
    bullets: list[str]


class TailoredProject(BaseModel):
    name: str
    bullets: list[str]


class TailoredResume(BaseModel):
    summary: str

    skills: list[str]

    experiences: list[TailoredExperience]

    projects: list[TailoredProject]


class ATSReport(BaseModel):
    score: float
    matched_keywords: list[str]
    missing_keywords: list[str]