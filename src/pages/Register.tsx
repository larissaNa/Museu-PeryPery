import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logoLaranja from "../assets/logolaranja.png";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface RegisterProps {
  onToggleMode: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onToggleMode }) => {
  const { signUp, loading, user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signUp(email, password, name);
      if (result && !result.sessionCreated) {
        setSuccess(true);
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Um e-mail de confirmação foi enviado para " + email + ".",
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao cadastrar usuário";
      setError(errorMessage);
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive",
      });
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
          <p className="text-base text-white/95 font-medium mb-1 relative z-10 text-center">Já possui conta?</p>
          <p className="text-sm text-museum-warm-gray text-center mb-8 relative z-10">Faça login para acessar o sistema.</p>
          <button
            onClick={onToggleMode}
            className="relative z-10 border border-museum-orange/30 hover:border-museum-orange/80 px-10 py-2.5 rounded-full hover:bg-museum-orange/10 transition-all duration-300 font-medium text-sm text-white/90 hover:text-white"
          >
            ENTRAR
          </button>
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 flex flex-col justify-center px-10 py-12 bg-transparent">
          {success ? (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shadow-lg shadow-green-500/5">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l8-4.62a2 2 0 012.22 0l8 4.62A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-white">Confirme seu E-mail</h2>
              <div className="space-y-3 text-sm text-museum-warm-gray leading-relaxed">
                <p>
                  Enviamos um link de confirmação para o endereço <strong className="text-white">{email}</strong>.
                </p>
                <p>
                  Por favor, verifique sua caixa de entrada (e pasta de spam) e clique no link para ativar sua conta antes de tentar fazer login.
                </p>
              </div>
              <button
                onClick={onToggleMode}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-museum-orange to-museum-gold text-white font-semibold hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-museum-orange/15 mt-4"
              >
                IR PARA O LOGIN
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-center font-display text-xl font-semibold text-white/90 mb-8">
                Crie sua Conta
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg py-2.5 px-4 text-center">
                    {error}
                  </div>
                )}
                <div className="space-y-1.5">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-museum-dark/50 text-white placeholder:text-zinc-500 border border-white/5 focus:border-museum-orange/50 focus:ring-1 focus:ring-museum-orange/50 px-4 py-3 rounded-xl outline-none transition-all duration-300 text-sm"
                    required
                  />
                </div>
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
                    minLength={6}
                    required
                  />
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-museum-orange to-museum-gold text-white font-semibold hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-museum-orange/15 mt-2"
                >
                  {loading ? "Cadastrando..." : "CADASTRAR"}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

