import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  credits_used_today: number;
  credits_remaining: number;
  credit_limit: number;
  is_google_auth: boolean;
  last_reset_date?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, username: string, password: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = "http://localhost:8000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token invalid, clear it
        localStorage.removeItem("auth_token");
        setToken(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem("auth_token");
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }

      const data = await response.json();
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem("auth_token", data.access_token);
      toast.success("Welcome back!");
      navigate("/workspace");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const signup = async (name: string, email: string, username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Signup failed");
      }

      // Signup now only sends verification email, no token returned
      toast.success("Verification code sent! Please check your email.");
      // Do not navigate or set token yet
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      toast.error(message);
      throw error;
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Verification failed");
      }

      const data = await response.json();
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem("auth_token", data.access_token);
      toast.success("Email verified successfully!");
      navigate("/workspace");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification failed";
      toast.error(message);
      throw error;
    }
  };

  const googleLogin = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Google login failed");
      }

      const data = await response.json();
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem("auth_token", data.access_token);
      toast.success("Successfully signed in with Google!");
      navigate("/workspace");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google login failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUser(token);
    }
  };

  const updateName = async (name: string) => {
    if (!token) throw new Error("Not authenticated");
    const response = await fetch(`${API_BASE_URL}/auth/update-name`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to update name");
    }
    // Update local user state immediately
    setUser((prev) => prev ? { ...prev, name } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, verifyEmail, googleLogin, logout, refreshUser, updateName }}>
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