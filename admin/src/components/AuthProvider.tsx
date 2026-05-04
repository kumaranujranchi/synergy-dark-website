"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load token from localStorage on mount
    const storedToken = localStorage.getItem("admin_session_token");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsInitializing(false);
  }, []);

  const isValidSession = useQuery(api.auth.verifySession, { token: token || undefined });
  const loginMutation = useMutation(api.auth.login);
  const logoutMutation = useMutation(api.auth.logout);

  const isAuthenticated = token !== null && isValidSession === true;
  const isLoading = isInitializing || (token !== null && isValidSession === undefined);

  const login = async (password: string) => {
    try {
      const newToken = await loginMutation({ password });
      localStorage.setItem("admin_session_token", newToken);
      setToken(newToken);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (token) {
      await logoutMutation({ token });
    }
    localStorage.removeItem("admin_session_token");
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
