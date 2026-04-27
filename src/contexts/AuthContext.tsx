import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getApiBaseUrl } from "@/lib/api";

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
  googleLogin: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to format error messages
function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) {
    // Network errors
    if (error.message === "Failed to fetch") {
      return `Connection error: Check your backend URL and ensure ${getApiBaseUrl()} is accessible`;
    }
    return error.message;
  }
  return defaultMessage;
}

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
      const apiUrl = getApiBaseUrl();
      const response = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "ngrok-skip-browser-warning": "true",
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
      const apiUrl = getApiBaseUrl();
      const response = await fetch(`${apiUrl}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
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
      const message = getErrorMessage(error, "Login failed");
      toast.error(message);
      throw error;
    }
  };

  const signup = async (name: string, email: string, username: string, password: string) => {
    try {
      const apiUrl = getApiBaseUrl();
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ name, email, username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Signup failed");
      }

      const data = await response.json();
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem("auth_token", data.access_token);
      toast.success("Account created! Welcome to PHI.ai 🎉");
      navigate("/workspace");
    } catch (error) {
      const message = getErrorMessage(error, "Signup failed");
      toast.error(message);
      throw error;
    }
  };

  const googleLogin = async (token: string) => {
    try {
      const apiUrl = getApiBaseUrl();
      const response = await fetch(`${apiUrl}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
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
      const message = getErrorMessage(error, "Google login failed");
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
    const apiUrl = getApiBaseUrl();
    const response = await fetch(`${apiUrl}/auth/update-name`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
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
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, googleLogin, logout, refreshUser, updateName }}>
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