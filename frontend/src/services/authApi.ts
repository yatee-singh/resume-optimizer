import axios from "axios";
import { LoginResponse, User } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_URL,
});

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const token = localStorage.getItem("token");

  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function register(
  name: string,
  email: string,
  password: string
) {
  const response = await api.post(
    "/auth/register",
    {
      name,
      email,
      password,
    }
  );

  return response.data;
}

