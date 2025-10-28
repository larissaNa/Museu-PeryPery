import React from "react";
import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

interface PublicRouteProps {
  children: ReactElement; // ✅ usa tipo do React, não do JSX global
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuthContext();

  if (loading) return <div>Carregando...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};
