import React from "react";
import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Forbidden from "../pages/Forbidden";
import { Loading } from "../components/Loading";

interface AdminRouteProps {
  children: ReactElement;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuthContext();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "admin" && user.role !== "curator") {
    return <Forbidden />;
  }

  return children;
};


