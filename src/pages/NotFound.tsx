import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Compass } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-museum-dark relative overflow-hidden p-4">
      {/* Decorative Glowing Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-museum-orange/10 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-museum-gold/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-museum-dark-soft/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-8 sm:p-10 relative z-10 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-museum-orange/10 flex items-center justify-center border border-museum-orange/20 relative">
          {/* Subtle spinning outer circle */}
          <div className="absolute inset-0 rounded-full border border-dashed border-museum-orange/30 animate-spin" style={{ animationDuration: '8s' }} />
          <Compass className="w-10 h-10 text-museum-orange filter drop-shadow-[0_0_8px_rgba(233,163,84,0.4)] animate-pulse" />
        </div>

        <h1 className="text-6xl sm:text-7xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-museum-orange to-museum-gold leading-none mb-3">
          404
        </h1>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white mb-3">
          Página não encontrada
        </h2>
        <p className="text-sm text-museum-warm-gray mb-8 leading-relaxed max-w-xs mx-auto">
          O documento ou acervo que você está procurando parece não existir em nossos arquivos históricos.
        </p>

        <Link
          to="/"
          className="inline-flex w-full items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-museum-orange to-museum-gold text-white font-semibold hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-museum-orange/20"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

