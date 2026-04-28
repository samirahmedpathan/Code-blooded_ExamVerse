import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";

interface User {
  id: string;
  name: string;
  email: string;
  targetExam: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const authed = localStorage.getItem("examverse:authed");
    if (authed === "true") {
      const storedUser = localStorage.getItem("examverse:user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser({
          id: "1",
          name: "Student",
          email: "student@examverse.app",
          targetExam: "JEE",
        });
      }
    }
  }, []);

  const login = (email: string) => {
    const newUser = {
      id: "1",
      name: "Student",
      email,
      targetExam: "JEE",
    };
    setUser(newUser);
    localStorage.setItem("examverse:authed", "true");
    localStorage.setItem("examverse:user", JSON.stringify(newUser));
    setLocation("/app");
  };

  const signup = (name: string, email: string) => {
    const newUser = {
      id: "1",
      name,
      email,
      targetExam: "JEE",
    };
    setUser(newUser);
    localStorage.setItem("examverse:authed", "true");
    localStorage.setItem("examverse:user", JSON.stringify(newUser));
    setLocation("/app");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("examverse:authed");
    localStorage.removeItem("examverse:user");
    setLocation("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
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
