export interface Skill {
  id: string;
  name: string;
  category?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  start_date: string;
  end_date?: string;
  bullets: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  technologies?: string[];
  bullets?: string[];
  url?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
}

export interface ResumeProfile {
  id: string;
  user_id: string;
  headline?: string;
  summary?: string;
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  achievements: Achievement[];
}