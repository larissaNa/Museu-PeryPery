import React from "react";
import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

interface PrivateRouteProps {
  children: ReactElement; // ✅ usa tipo do React, não do JSX global
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuthContext();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};
