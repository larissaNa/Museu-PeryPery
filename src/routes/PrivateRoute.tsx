import React from "react";
import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { Loading } from "../components/Loading";

interface PrivateRouteProps {
  children: ReactElement; // ✅ usa tipo do React, não do JSX global
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuthContext();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

