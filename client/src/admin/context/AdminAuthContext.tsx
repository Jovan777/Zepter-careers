import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AdminUser } from "../types/admin";
import { getCurrentAdmin, loginAdmin as loginAdminRequest } from "../api/adminAuthApi";

type LoginPayload = {
  email: string;
  password: string;
};

type AdminAuthContextValue = {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

const ADMIN_TOKEN_KEY = "zepter_admin_token";
const ADMIN_USER_KEY = "zepter_admin_user";

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getCurrentAdmin(token);
        setAdmin(data.admin);
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.admin));
      } catch {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
        setToken(null);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  const login = useCallback(async ({ email, password }: LoginPayload) => {
    const data = await loginAdminRequest({ email, password });
    setToken(data.token);
    setAdmin(data.admin);
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.admin));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      token,
      isLoading,
      isAuthenticated: Boolean(token && admin),
      login,
      logout,
    }),
    [admin, token, isLoading, login, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};