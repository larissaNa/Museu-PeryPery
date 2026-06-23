import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoLaranja from "../assets/logolaranja.png";
import { useAuthContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const { resetPasswordForEmail } = useAuthContext();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await resetPasswordForEmail(email);
      setSent(true);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir a senha.",
      });
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err?.message || "Não foi possível enviar o email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-museum-dark relative overflow-hidden p-4">
      {/* Decorative Glowing Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-museum-orange/10 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-museum-gold/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-museum-dark-soft/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-8 relative z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 mb-3 flex items-center justify-center transition-transform duration-500 hover:scale-105">
            <img 
              src={logoLaranja} 
              alt="Museu Pery Pery" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(233,163,84,0.3)]" 
            />
          </div>
          <h1 className="text-2xl font-display font-bold text-center tracking-wider text-white">
            Redefinir <span className="text-gradient">Senha</span>
          </h1>
          <p className="text-sm text-museum-warm-gray mt-2 text-center">
            Informe seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-green-400 text-sm font-medium">Link enviado! Verifique seu email.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
              <Link 
                to="/login" 
                className="text-sm text-museum-orange hover:text-museum-orange-light underline transition-colors font-medium"
              >
                Voltar ao login
              </Link>
              <Link 
                to="/" 
                className="text-sm text-museum-warm-gray hover:text-museum-orange transition-colors flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Página Inicial</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-museum-dark/50 text-white placeholder:text-zinc-500 border border-white/5 focus:border-museum-orange/50 focus:ring-1 focus:ring-museum-orange/50 px-4 py-3 rounded-xl outline-none transition-all duration-300 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-museum-orange to-museum-gold text-white font-semibold hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-museum-orange/15 disabled:opacity-60 disabled:pointer-events-none mt-2"
            >
              {loading ? "Enviando..." : "ENVIAR LINK"}
            </button>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-white/5">
              <Link 
                to="/login" 
                className="text-xs text-museum-warm-gray hover:text-museum-orange transition-colors"
              >
                Voltar ao login
              </Link>
              <Link 
                to="/" 
                className="text-xs text-museum-warm-gray hover:text-museum-orange transition-colors flex items-center gap-1.5 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Página Inicial</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;


