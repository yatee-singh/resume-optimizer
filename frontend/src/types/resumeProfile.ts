// types/resumeProfile.ts

export interface Skill {
  id: string;
  name: string;
  category: string;
  display_order: number;
}
export interface ProfileCardProps {
  profile: ResumeProfile;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  display_order: number;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  achievement_date?: string | null;
  display_order: number;
}

export interface ResumeProfile {
  id: string;
  user_id: string;
  headline: string | null;
  summary: string | null;
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  achievements: Achievement[];
}

export interface Experience {
  id: string;
  company: string;
  description: string;
  role: string;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current: boolean;
  display_order: number;
}

export interface ExperienceCreate {
  role: string;
  company: string;
  description:string;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
  display_order?: number;
}

export interface ExperienceUpdate {
  role?: string;
  company?: string;
  description:string;
  start_date?: string;
  end_date?: string | null;
  location?: string | null;
  bullets?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  display_order: number;
}

export interface SkillCreate {
  name: string;
  category: string;
  display_order?: number;
}

export interface SkillUpdate {
  name?: string | null;
  category?: string | null;
  display_order?: number | null;
}


export interface AchievementCreate {
  title: string;
  description?: string | null;
  type?: string | null;
  achievement_date?: string | null;
  display_order?: number;
}

export interface AchievementUpdate {
  title?: string;
  description?: string | null;
  type?: string | null;
  achievement_date?: string | null;
  display_order?: number;
}