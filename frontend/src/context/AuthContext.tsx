import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, login as loginApi } from "../services/authApi";

import { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } catch {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await loginApi(email, password);

    localStorage.setItem("token", response.access_token);

    setUser(response.user);
  }

  function logout() {
    localStorage.removeItem("token");

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
