import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoLaranja from "../assets/logolaranja.png";
import { useAuthContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/infra/supabaseClient";
import { ArrowLeft } from "lucide-react";


const ResetPassword: React.FC = () => {
  const { updatePassword } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase places the recovery session in the URL hash; the client picks it up automatically.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Erro", description: "A senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      toast({ title: "Senha atualizada", description: "Você já pode entrar com a nova senha." });
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err: any) {
      toast({ title: "Erro", description: err?.message || "Falha ao atualizar senha.", variant: "destructive" });
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
            Nova <span className="text-gradient">Senha</span>
          </h1>
          <p className="text-sm text-museum-warm-gray mt-2 text-center">
            Defina sua nova credencial de acesso.
          </p>
        </div>

        {!ready ? (
          <p className="text-center text-museum-warm-gray">Validando link de recuperação...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              required
              minLength={6}
              placeholder="Nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-museum-dark/50 text-white placeholder:text-zinc-500 border border-white/5 focus:border-museum-orange/50 focus:ring-1 focus:ring-museum-orange/50 px-4 py-3 rounded-xl outline-none transition-all duration-300 text-sm"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Confirmar nova senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-museum-dark/50 text-white placeholder:text-zinc-500 border border-white/5 focus:border-museum-orange/50 focus:ring-1 focus:ring-museum-orange/50 px-4 py-3 rounded-xl outline-none transition-all duration-300 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-museum-orange to-museum-gold text-white font-semibold hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-museum-orange/15 disabled:opacity-60 disabled:pointer-events-none mt-2"
            >
              {loading ? "Salvando..." : "ATUALIZAR SENHA"}
            </button>
            <div className="mt-6 flex justify-center border-t border-white/5 pt-4">
              <Link 
                to="/" 
                className="text-xs text-museum-warm-gray hover:text-museum-orange transition-colors flex items-center gap-1.5 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar para a Página Inicial</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

