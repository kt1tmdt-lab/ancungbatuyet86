"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "AUTHOR" | "MARKETING" | "SUPPORT" | "USER";
}

interface AuthContext {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = window.localStorage.getItem("auth_token");

      try {
        const res = await fetch("/api/auth/me", {
          headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.token) {
            setUser(data.user);
            setToken(data.token);
            window.localStorage.setItem("auth_token", data.token);
          } else {
            window.localStorage.removeItem("auth_token");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user session", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      if (res.status === 429) {
        const retryAfter = Number(data?.retryAfter);
        const waitMessage = Number.isFinite(retryAfter)
          ? ` Vui lòng thử lại sau ${Math.ceil(retryAfter / 60)} phút.`
          : " Vui lòng thử lại sau.";
        throw new Error(`Bạn đã đăng nhập quá nhiều lần.${waitMessage}`);
      }
      if (res.status === 401) {
        throw new Error("Email hoặc mật khẩu không đúng.");
      }
      throw new Error(data?.error || "Đăng nhập thất bại.");
    }
    const data = await res.json();
    setUser(data.user);
    setToken(data.token ?? null);
    if (data.token) {
      window.localStorage.setItem("auth_token", data.token);
    } else {
      window.localStorage.removeItem("auth_token");
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
    setToken(null);
    window.localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
}
