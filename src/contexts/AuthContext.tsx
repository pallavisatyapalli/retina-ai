import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("dr_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("dr_users") || "[]");
    if (users.find((u: { email: string }) => u.email === email)) return false;
    users.push({ name, email, password });
    localStorage.setItem("dr_users", JSON.stringify(users));
    const u = { name, email };
    localStorage.setItem("dr_user", JSON.stringify(u));
    setUser(u);
    return true;
  }, []);

  const login = useCallback((email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("dr_users") || "[]");
    const found = users.find((u: { email: string; password: string }) => u.email === email && u.password === password);
    if (!found) return false;
    const u = { name: found.name, email: found.email };
    localStorage.setItem("dr_user", JSON.stringify(u));
    setUser(u);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("dr_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
