import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await axios.get("/api/v1/auth/logout", {}, { withCredentials: true });
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    async function checkUserAuthenticated() {
      try {
        const response = await axios.get("/api/v1/auth/check-auth", {
          withCredentials: true,
        });
        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkUserAuthenticated();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
export { AuthContext };
