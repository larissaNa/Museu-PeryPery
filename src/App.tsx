// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { PrivateRoute } from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login onToggleMode={() => (window.location.href = "/register")} />
               </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register onToggleMode={() => (window.location.href = "/login")} />
               </PublicRoute>
            }
          />

          {/* Rota protegida */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
               </PrivateRoute>
            }
          />

          {/* Redireciona raiz → dashboard/login */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
               </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
