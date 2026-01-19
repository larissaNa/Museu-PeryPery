import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logoLaranja from "../assets/logolaranja.png";

export const HistoriaHeader: React.FC = () => {
  return (
    <header className="museum-dark-section sticky top-0 z-50 border-b border-museum-dark-soft/50 backdrop-blur-md">
      <div className="museum-container">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-3 group">
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
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full bg-museum-dark-soft border border-museum-orange/20 text-primary-foreground hover:bg-museum-dark-card transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </div>
    </header>
  );
};
