import { ResumeProfile } from "../components/resume/types";

const API_URL = import.meta.env.VITE_API_URL;

export async function getResume(
  userId: string
): Promise<ResumeProfile> {
  const response = await fetch(
    `${API_URL}/users/${userId}/resume`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch resume");
  }

  return response.json();
}