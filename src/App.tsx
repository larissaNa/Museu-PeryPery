import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import { Auth } from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { PublicRoute } from "./routes/PublicRoute";
import Historia from "./pages/Historia";
import Cultura from "./pages/Culture";
import Admin from "./pages/Admin";
import { AdminRoute } from "./routes/AdminRoute";

import Moderation from "./pages/Moderation";
import GalleryPage from "./pages/Gallery";
import EventsPage from "./pages/Events";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Auth />
                </PublicRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/cultura" element={<Cultura />} />
            <Route path="/contribua" element={<Navigate to="/galeria?tab=contribuir" replace />} />
            <Route path="/moderacao" element={<Moderation />} />
            <Route path="/galeria" element={<GalleryPage />} />
            <Route path="/eventos" element={<EventsPage />} />
            <Route path="/perfil" element={<Profile />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
