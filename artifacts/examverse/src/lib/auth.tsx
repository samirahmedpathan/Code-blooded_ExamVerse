import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { authApi, getToken, setToken, type AuthUser, ApiError } from "./api";
import { promptGoogleSignIn } from "./google-signin";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  targetExam: string;
  language: string;
}

interface LoginInput {
  emailOrName: string;
  password: string;
  targetExam?: string;
  language?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  loginWithGoogle: (input?: {
    targetExam?: string;
    language?: string;
  }) => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = "examverse:user";
const REMEMBER_KEY = "examverse:remembered";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      const cached = (() => {
        try {
          const raw = localStorage.getItem(USER_KEY);
          return raw ? (JSON.parse(raw) as AuthUser) : null;
        } catch {
          return null;
        }
      })();
      if (cached) setUser(cached);

      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await authApi.me();
        if (cancelled) return;
        setUser(me.user);
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(me.user));
        } catch {
          // ignore
        }
      } catch (e) {
        if (e instanceof ApiError && (e.status === 401 || e.status === 404)) {
          setToken(null);
          try {
            localStorage.removeItem(USER_KEY);
          } catch {
            // ignore
          }
          if (!cancelled) setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = (next: AuthUser, token: string) => {
    setUser(next);
    setToken(token);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const login = async (input: LoginInput) => {
    const res = await authApi.login({
      emailOrName: input.emailOrName,
      password: input.password,
    });
    persist(res.user, res.token);
    setLocation("/app");
  };

  const signup = async (input: SignupInput) => {
    const res = await authApi.signup(input);
    persist(res.user, res.token);
    setLocation("/app");
  };

  const loginWithGoogle = async (
    input: { targetExam?: string; language?: string } = {},
  ) => {
    const cfg = await authApi.googleConfig();
    if (!cfg.enabled || !cfg.clientId) {
      throw new Error(
        "Google sign-in is not configured yet. Ask the admin to add the Google Client ID.",
      );
    }
    const idToken = await promptGoogleSignIn(cfg.clientId);
    const res = await authApi.google({
      idToken,
      targetExam: input.targetExam,
      language: input.language,
    });
    persist(res.user, res.token);
    setLocation("/app");
  };

  const updateProfile = (updates: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(REMEMBER_KEY);
    } catch {
      // ignore
    }
    setLocation("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, loginWithGoogle, updateProfile, logout }}
    >
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
