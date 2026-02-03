import testSupabaseStorageConnection from "@/scripts/testSupabaseStorage";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import { Auth } from "./pages/Auth";
import NotFound from "./pages/NotFound";

import { PublicRoute } from "./routes/PublicRoute";
import Historia from "./pages/Historia";
import Cultura from "./pages/Culture";
import Admin from "./pages/Admin";
import { AdminRoute } from "./routes/AdminRoute";
import Contribution from "./pages/Contribution";
import Moderation from "./pages/Moderation";
import GalleryPage from "./pages/Gallery";

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
            <Route path="/historia" element={<Historia />} />
            <Route path="/cultura" element={<Cultura />} />
            <Route path="/contribua" element={<Contribution />} />
            <Route path="/moderacao" element={<Moderation />} />
            <Route path="/galeria" element={<GalleryPage />} />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
