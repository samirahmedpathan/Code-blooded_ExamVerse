import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";

interface User {
  id: string;
  name: string;
  email: string;
  targetExam: string;
  language: string;
}

interface SignupInput {
  name: string;
  email: string;
  targetExam: string;
  language: string;
}

interface LoginInput {
  emailOrName: string;
  targetExam: string;
  language: string;
}

interface AuthContextType {
  user: User | null;
  login: (input: LoginInput) => void;
  signup: (input: SignupInput) => void;
  updateProfile: (updates: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = "examverse:user";
const AUTH_KEY = "examverse:authed";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const authed = localStorage.getItem(AUTH_KEY);
    if (authed === "true") {
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }
    }
  }, []);

  const persist = (next: User) => {
    setUser(next);
    localStorage.setItem(AUTH_KEY, "true");
    localStorage.setItem(USER_KEY, JSON.stringify(next));
  };

  const login = (input: LoginInput) => {
    const looksLikeEmail = input.emailOrName.includes("@");
    const next: User = {
      id: "1",
      name: looksLikeEmail
        ? input.emailOrName.split("@")[0].replace(/[._]/g, " ")
        : input.emailOrName,
      email: looksLikeEmail
        ? input.emailOrName
        : `${input.emailOrName.toLowerCase().replace(/\s+/g, ".")}@examverse.app`,
      targetExam: input.targetExam,
      language: input.language,
    };
    persist(next);
    setLocation("/app");
  };

  const signup = (input: SignupInput) => {
    const next: User = {
      id: "1",
      name: input.name,
      email: input.email,
      targetExam: input.targetExam,
      language: input.language,
    };
    persist(next);
    setLocation("/app");
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    setLocation("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
