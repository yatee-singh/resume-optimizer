export interface OptimizeRequest {
  job_description: string;
}

export interface JobAnalysis {
  role: string;
  required_skills: string[];
  preferred_skills: string[];
  keywords: string[];
  responsibilities: string[];
}

export interface TailoredExperience {
  company: string;
  role: string;
  bullets: string[];
}

export interface TailoredProject {
  name: string;
  bullets: string[];
}

export interface TailoredResume {
  summary: string;
  skills: string[];
  experiences: TailoredExperience[];
  projects: TailoredProject[];
}

export interface ATSReport {
  score: number;
  matched_keywords: string[];
  missing_keywords: string[];
}

export interface OptimizeResult {
  job_analysis?: JobAnalysis;
  tailored_resume: TailoredResume;
  ats_report: ATSReport;
}