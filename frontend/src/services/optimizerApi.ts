import type {
  OptimizeRequest,
  OptimizeResult,
} from "../types/optimizer";

const API_URL = import.meta.env.VITE_API_URL;

export async function optimizeResume(
  jobDescription: string
): Promise<OptimizeResult> {
  const token = localStorage.getItem("token");

  const request: OptimizeRequest = {
    job_description: jobDescription,
  };

  const response = await fetch(`${API_URL}/optimizer/optimize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || "Failed to optimize resume."
    );
  }

  return data;
}