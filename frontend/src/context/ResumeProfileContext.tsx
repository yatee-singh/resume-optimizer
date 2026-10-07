import React, { createContext, useContext, useEffect, useState } from "react";

import {
  Project,
  ResumeProfile,
  Skill,
  SkillCreate,
  SkillUpdate,
  Achievement,
  AchievementCreate,
  AchievementUpdate,
} from "../types/resumeProfile";

import { useAuth } from "./AuthContext";
import { Experience } from "../components/resume/types";

export interface ProjectCreate {
  name: string;
  description: string;
  url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  display_order: number;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  display_order?: number;
}

interface ExperienceCreate {
  role: string;
  company: string;
  start_date: string;
  end_date?: string | null;
  location?: string | null;
  bullets: string[];
}

interface ExperienceUpdate {
  role?: string;
  company?: string;
  start_date?: string;
  end_date?: string | null;
  location?: string | null;
  bullets?: string[];
}

interface ResumeProfileContextValue {
  profile: ResumeProfile | null;
  loading: boolean;
  error: string | null;

  refreshProfile: () => Promise<void>;

  updateProfile: (
    data: Partial<Pick<ResumeProfile, "headline" | "summary">>,
  ) => Promise<void>;

  addProject: (data: ProjectCreate) => Promise<Project>;

  updateProject: (projectId: string, data: ProjectUpdate) => Promise<Project>;

  deleteProject: (projectId: string) => Promise<void>;

  addExperience: (data: ExperienceCreate) => Promise<Experience>;

  updateExperience: (
    experienceId: string,
    data: ExperienceUpdate,
  ) => Promise<Experience>;

  deleteExperience: (experienceId: string) => Promise<void>;

  addSkill: (data: SkillCreate) => Promise<Skill>;

  updateSkill: (skillId: string, data: SkillUpdate) => Promise<Skill>;

  deleteSkill: (skillId: string) => Promise<void>;

  addAchievement: (data: AchievementCreate) => Promise<Achievement>;

  updateAchievement: (
    achievementId: string,
    data: AchievementUpdate,
  ) => Promise<Achievement>;

  deleteAchievement: (achievementId: string) => Promise<void>;
}

const ResumeProfileContext = createContext<
  ResumeProfileContextValue | undefined
>(undefined);

export const ResumeProfileProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ResumeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------
  // Helpers
  // ---------------------------------------------

  const getErrorMessage = async (
    response: Response,
    fallback: string,
  ): Promise<string> => {
    try {
      const errorData = await response.json();

      if (typeof errorData.detail === "string") {
        return errorData.detail;
      }

      if (Array.isArray(errorData.detail)) {
        const message = errorData.detail
          .map((error: { msg?: string }) => error.msg)
          .filter(Boolean)
          .join(", ");

        if (message) {
          return message;
        }
      }
    } catch {
      // Ignore JSON parsing errors
    }

    return fallback;
  };

  // ---------------------------------------------
  // Fetch Profile
  // ---------------------------------------------

  const fetchProfile = async (): Promise<void> => {
    if (!user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/resume`,
        {
          credentials: "include",
        },
      );

      if (response.status === 404) {
        setProfile(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load resume profile");
      }

      const data: ResumeProfile = await response.json();

      setProfile(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load resume profile",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  // ---------------------------------------------
  // Profile
  // ---------------------------------------------

  const updateProfile = async (
    data: Partial<Pick<ResumeProfile, "headline" | "summary">>,
  ): Promise<void> => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.id}/resume`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const message = await getErrorMessage(
        response,
        "Failed to update resume profile",
      );

      throw new Error(message);
    }

    const updatedProfile: ResumeProfile = await response.json();

    setProfile(updatedProfile);
  };

  // ---------------------------------------------
  // Projects
  // ---------------------------------------------

  const addProject = async (data: ProjectCreate): Promise<Project> => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.id}/resume/projects`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const message = await getErrorMessage(
        response,
        "Failed to create project",
      );

      throw new Error(message);
    }

    const project: Project = await response.json();

    setProfile((current) => {
      if (!current) return current;

      return {
        ...current,
        projects: [...current.projects, project],
      };
    });

    return project;
  };

  const updateProject = async (
    projectId: string,
    data: ProjectUpdate,
  ): Promise<Project> => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.id}/resume/projects/${projectId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const message = await getErrorMessage(
        response,
        "Failed to update project",
      );

      throw new Error(message);
    }

    const updatedProject: Project = await response.json();

    setProfile((current) => {
      if (!current) return current;

      return {
        ...current,
        projects: current.projects.map((project) =>
          project.id === projectId ? updatedProject : project,
        ),
      };
    });

    return updatedProject;
  };

  const deleteProject = async (projectId: string): Promise<void> => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.id}/resume/projects/${projectId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (!response.ok) {
      const message = await getErrorMessage(
        response,
        "Failed to delete project",
      );

      throw new Error(message);
    }

    setProfile((current) => {
      if (!current) return current;

      return {
        ...current,
        projects: current.projects.filter(
          (project) => project.id !== projectId,
        ),
      };
    });
  };

  // ---------------------------------------------
  // Experience
  // ---------------------------------------------

  const addExperience = async (data: ExperienceCreate): Promise<Experience> => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.id}/resume/experiences`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const message = await getErrorMessage(
        response,
        "Failed to create experience",
      );

      throw new Error(message);
    }

    const experience: Experience = await response.json();

    setProfile((current) => {
      if (!current) return current;

      return {
        ...current,
        experiences: [...current.experiences, experience],
      };
    });

    return experience;
  };

  const updateExperience = async (
    experienceId: string,
    data: ExperienceUpdate,
  ): Promise<Experience> => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.id}/resume/experiences/${experienceId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const message = await getErrorMessage(
        response,
        "Failed to update experience",
      );

      throw new Error(message);
    }

    const experience: Experience = await response.json();

    setProfile((current) => {
      if (!current) return current;

      return {
        ...current,
        experiences: current.experiences.map((item) =>
          item.id === experienceId ? experience : item,
        ),
      };
    });

    return experience;
  };

  const deleteExperience = async (experienceId: string): Promise<void> => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.id}/resume/experiences/${experienceId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (!response.ok) {
      const message = await getErrorMessage(
        response,
        "Failed to delete experience",
      );

      throw new Error(message);
    }

    setProfile((current) => {
      if (!current) return current;

      return {
        ...current,
        experiences: current.experiences.filter(
          (item) => item.id !== experienceId,
        ),
      };
    });
  };

  // ---------------------------------------------
  // Skills
  // ---------------------------------------------

  const addSkill = async (data: SkillCreate): Promise<Skill> => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.id}/resume/skills`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "Failed to create skill");

      throw new Error(message);
    }

    const skill: Skill = await response.json();

    setProfile((current) => {
      if (!current) return current;

      return {
        ...current,
        skills: [...current.skills, skill],
      };
    });

    return skill;
  };

  const updateSkill = async (
    skillId: string,
    data: SkillUpdate,
  ): Promise<Skill> => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.id}/resume/skills/${skillId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "Failed to update skill");

      throw new Error(message);
    }

    const updatedSkill: Skill = await response.json();

    setProfile((current) => {
      if (!current) return current;

      return {
        ...current,
        skills: current.skills.map((skill) =>
          skill.id === skillId ? updatedSkill : skill,
        ),
      };
    });

    return updatedSkill;
  };

  const deleteSkill = async (skillId: string): Promise<void> => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.id}/resume/skills/${skillId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "Failed to delete skill");

      throw new Error(message);
    }

    setProfile((current) => {
      if (!current) return current;

      return {
        ...current,
        skills: current.skills.filter((skill) => skill.id !== skillId),
      };
    });
  };

  const addAchievement = async (
    data: AchievementCreate,
  ): Promise<Achievement> => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.id}/resume/achievements`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create achievement");
    }

    const achievement: Achievement = await response.json();

    setProfile((current) => {
      if (!current) return current;

      return {
        ...current,
        achievements: [...current.achievements, achievement],
      };
    });

    return achievement;
  };

  const updateAchievement = async (
    achievementId: string,
    data: AchievementUpdate,
  ): Promise<Achievement> => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.id}/resume/achievements/${achievementId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update achievement");
    }

    const achievement: Achievement = await response.json();

    setProfile((current) => {
      if (!current) return current;

      return {
        ...current,
        achievements: current.achievements.map((item) =>
          item.id === achievementId ? achievement : item,
        ),
      };
    });

    return achievement;
  };

  const deleteAchievement = async (achievementId: string): Promise<void> => {
    if (!user?.id) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.id}/resume/achievements/${achievementId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete achievement");
    }

    setProfile((current) => {
      if (!current) return current;

      return {
        ...current,
        achievements: current.achievements.filter(
          (item) => item.id !== achievementId,
        ),
      };
    });
  };

  // ---------------------------------------------
  // Provider
  // ---------------------------------------------

  return (
    <ResumeProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        refreshProfile: fetchProfile,
        updateProfile,
        addProject,
        updateProject,
        deleteProject,
        addExperience,
        updateExperience,
        deleteExperience,
        addSkill,
        updateSkill,
        deleteSkill,
        addAchievement,
        updateAchievement,
        deleteAchievement,
      }}
    >
      {children}
    </ResumeProfileContext.Provider>
  );
};

export const useResumeProfile = () => {
  const context = useContext(ResumeProfileContext);

  if (!context) {
    throw new Error(
      "useResumeProfile must be used inside ResumeProfileProvider",
    );
  }

  return context;
};
