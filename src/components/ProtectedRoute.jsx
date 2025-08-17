import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

function ProtectedRoute() {
  const context = useContext(AuthContext);

  if (!context) {
    console.error("ProtectedRoute must be used within AuthProvider");
    return <Navigate to="/" replace />;
  }

  const { isAuthenticated } = context;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;
