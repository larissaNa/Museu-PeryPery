import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logoLaranja from "../assets/logolaranja.png";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface LoginProps {
  onToggleMode: () => void;
}

export const Login: React.FC<LoginProps> = ({ onToggleMode }) => {
  const { signIn, loading, user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }
    try {
      await signIn(email, password);
    } catch (err: any) {
      const msg = err?.message || "Email ou senha inválidos";
      setError(msg);
      toast({ title: "Erro no login", description: msg, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-museum-dark relative overflow-hidden p-4 sm:p-6">
      {/* Decorative Glowing Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-museum-orange/10 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-museum-gold/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-[900px] min-h-[520px] bg-museum-dark-soft/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 animate-fade-in">
        {/* Left Banner */}
        <div className="md:w-1/2 bg-gradient-to-b from-museum-dark-soft/80 to-museum-dark/95 text-white flex flex-col items-center justify-center px-10 py-12 relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
          {/* Subtle light glow on the banner side */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-museum-orange/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-24 h-24 mb-6 flex items-center justify-center relative z-10 transition-transform duration-500 hover:scale-105">
            <img 
              src={logoLaranja} 
              alt="Logo Museu Pery Pery" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(233,163,84,0.3)]" 
            />
          </div>
          <h1 className="text-2xl font-display font-bold mb-4 text-center tracking-wider relative z-10">
            MUSEU <span className="text-gradient">PERY PERY</span>
          </h1>
          <p className="text-base text-white/95 font-medium mb-1 relative z-10 text-center">Bem-vindo de volta!</p>
          <p className="text-sm text-museum-warm-gray text-center mb-8 relative z-10">Acesse sua conta agora mesmo.</p>
          <button
            onClick={onToggleMode}
            className="relative z-10 border border-museum-orange/30 hover:border-museum-orange/80 px-10 py-2.5 rounded-full hover:bg-museum-orange/10 transition-all duration-300 font-medium text-sm text-white/90 hover:text-white"
          >
            CADASTRAR
          </button>
          <Link 
            to="/forgot-password" 
            className="text-xs mt-6 opacity-85 hover:opacity-100 text-museum-warm-gray hover:text-museum-orange transition-colors underline relative z-10"
          >
            Esqueci minha senha
          </Link>
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 flex flex-col justify-center px-10 py-12 bg-transparent">
          <h2 className="text-center font-display text-xl font-semibold text-white/90 mb-8">
            Faça seu Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg py-2.5 px-4 text-center">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-museum-dark/50 text-white placeholder:text-zinc-500 border border-white/5 focus:border-museum-orange/50 focus:ring-1 focus:ring-museum-orange/50 px-4 py-3 rounded-xl outline-none transition-all duration-300 text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-museum-dark/50 text-white placeholder:text-zinc-500 border border-white/5 focus:border-museum-orange/50 focus:ring-1 focus:ring-museum-orange/50 px-4 py-3 rounded-xl outline-none transition-all duration-300 text-sm"
                required
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-museum-orange to-museum-gold text-white font-semibold hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-museum-orange/15 disabled:opacity-60 disabled:pointer-events-none mt-2"
            >
              {loading ? "Entrando..." : "ENTRAR"}
            </button>
          </form>
          <div className="mt-6 flex justify-center">
            <Link 
              to="/" 
              className="text-xs text-museum-warm-gray hover:text-museum-orange transition-colors flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para a Página Inicial</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

