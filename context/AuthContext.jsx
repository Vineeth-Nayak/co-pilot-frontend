"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/test-auth`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
        localStorage.removeItem("authToken");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const resp = await response.json();
        const data = resp.data;

        if (data.token) {
          localStorage.setItem("authToken", data.token);
          setUser(data.user);
          router.push("/cms/articles");
          return { success: true };
        }
      }

      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  };

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
