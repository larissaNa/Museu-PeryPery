import React from "react";
import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { Loading } from "../components/Loading";

interface PublicRouteProps {
  children: ReactElement;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuthContext();

  if (loading) return <Loading />;
  if (user) return <Navigate to="/" replace />;
  return children;
};

