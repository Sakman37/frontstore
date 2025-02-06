import React, { createContext, useState, useEffect } from "react";
import { login, verifyToken } from "../services/authService";

interface AuthContextType {
  user: any;
  handleLogin: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const userData = await verifyToken();
      if (userData) setUser(userData);
    };
    checkToken();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const userData = await login(email, password);
    if (userData) setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
