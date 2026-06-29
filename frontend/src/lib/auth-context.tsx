"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { clearTokens, getAccessToken, setTokens } from "./api-client";
import * as services from "./services";
import { Profile } from "./types";

interface AuthContextValue {
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: {
    email: string;
    password: string;
    full_name: string;
    department?: string;
  }) => Promise<{ hasSession: boolean }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  setProfile: (profile: Profile) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const token = getAccessToken();
    if (!token) {
      queueMicrotask(() => {
        if (isMounted) setIsLoading(false);
      });
      return () => {
        isMounted = false;
      };
    }
    services
      .getProfile()
      .then((fetched) => {
        if (isMounted) setProfile(fetched);
      })
      .catch(() => {
        clearTokens();
        if (isMounted) setProfile(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await services.login({ email, password });
      if (result.session) {
        setTokens(result.session.access_token, result.session.refresh_token);
      }
      setProfile(result.profile);
    },
    []
  );

  const signup = useCallback(
    async (payload: {
      email: string;
      password: string;
      full_name: string;
      department?: string;
    }) => {
      const result = await services.signup(payload);
      if (result.session) {
        setTokens(result.session.access_token, result.session.refresh_token);
        setProfile(result.profile);
        return { hasSession: true };
      }
      return { hasSession: false };
    },
    []
  );

  const logout = useCallback(() => {
    clearTokens();
    setProfile(null);
    router.push("/login");
  }, [router]);

  const refreshProfile = useCallback(async () => {
    const fetched = await services.getProfile();
    setProfile(fetched);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        profile,
        isLoading,
        isAuthenticated: !!profile,
        login,
        signup,
        logout,
        refreshProfile,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
