import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logoLaranja from "../assets/logolaranja.png";

export const Header: React.FC = () => {
  const { user, signOut, loading } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <header className="museum-dark-section sticky top-0 z-50 border-b border-museum-dark-soft/50 backdrop-blur-md">
      <div className="museum-container">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img 
                src={logoLaranja} 
                alt="Logo Museu Pery Pery" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-lg font-semibold text-primary-foreground tracking-wide">
                Museu Pery Pery
              </h1>
              <p className="text-xs text-museum-warm-gray font-light tracking-widest uppercase">
                Patrimônio Cultural
              </p>
            </div>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {["Início", "Museu Virtual", "Sobre", "Contato", "Galeria"].map((item) => {
              if (item === "Galeria") {
                return (
                  <Link
                    key={item}
                    to="/galeria"
                    className="relative text-sm font-medium text-museum-warm-gray hover:text-primary-foreground transition-colors duration-300 group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-museum-orange to-museum-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                );
              }
              return (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="relative text-sm font-medium text-museum-warm-gray hover:text-primary-foreground transition-colors duration-300 group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-museum-orange to-museum-gold transition-all duration-300 group-hover:w-full" />
                </a>
              );
            })}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="relative text-sm font-medium text-museum-warm-gray hover:text-primary-foreground transition-colors duration-300 group"
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-museum-orange to-museum-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            )}
          </nav>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary-foreground">
                      {user.displayName || user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium rounded-full bg-gradient-to-r from-museum-orange to-museum-gold text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saindo..." : "Sair"}
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 text-sm font-medium rounded-full bg-gradient-to-r from-museum-orange to-museum-gold text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
