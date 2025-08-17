import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type AuthContextType = {
  user: string | null;
  isSurgeryTeam: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  loginSurgeryTeam: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isSurgeryTeam, setIsSurgeryTeam] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    if (email === "user@example.com" && password === "password") {
      setUser(email);
      setIsSurgeryTeam(false);
      localStorage.setItem("user", email);
      localStorage.setItem("isSurgeryTeam", "false");
      return true;
    }
    if (email === "surgery" && password === "team") {
      setUser(email);
      setIsSurgeryTeam(true);
      localStorage.setItem("user", email);
      localStorage.setItem("isSurgeryTeam", "true");
      return true;
    }
    return false;
  };

  const loginSurgeryTeam = () => {
    setUser("surgery");
    setIsSurgeryTeam(true);
    localStorage.setItem("user", "surgery");
    localStorage.setItem("isSurgeryTeam", "true");
    console.log('loginSurgeryTeam called in AuthContext, isSurgeryTeam set to true');
  };

  const logout = () => {
    setUser(null);
    setIsSurgeryTeam(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isSurgeryTeam");
  };

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedSurgery = localStorage.getItem("isSurgeryTeam");
    if (storedUser) setUser(storedUser);
    if (storedSurgery) setIsSurgeryTeam(storedSurgery === "true");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isSurgeryTeam, login, loginSurgeryTeam, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};