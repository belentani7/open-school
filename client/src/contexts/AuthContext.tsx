import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type AuthUser = { id: string; name: string } | null;
type Ctx = { user: AuthUser; loading: boolean; login: (name: string) => void; logout: () => void };

const AuthContext = createContext<Ctx>({ user: null, loading: false, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const login = useCallback((name: string) => setUser({ id: "local-" + Date.now(), name }), []);
  const logout = useCallback(() => setUser(null), []);
  return <AuthContext.Provider value={{ user, loading: false, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
