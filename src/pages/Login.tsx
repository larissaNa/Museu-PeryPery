import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logoPreta from "../assets/logopreta.png";

interface LoginProps {
  onToggleMode: () => void;
}

export const Login: React.FC<LoginProps> = ({ onToggleMode }) => {
  const { signIn, loading } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    try {
      await signIn(email, password);
      navigate("/");
    } catch (err: any) {
      console.error("Erro no login:", err);
      const errorMessage = err?.message || "Email ou senha inválidos";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D8B48A]">
      <div className="w-[900px] h-[520px] bg-[#F9F1DE] rounded-xl shadow-lg flex overflow-hidden">

        {/* LADO ESQUERDO */}
        <div className="w-1/2 bg-[#E9A354] text-white flex flex-col items-center justify-center px-10">
          <div className="w-32 h-32 mb-4 flex items-center justify-center">
            <img 
              src={logoPreta} 
              alt="Logo Museu Pery Pery" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold mb-6 text-center">
            MUSEU PERY PERY
          </h1>

          <p className="text-lg font-semibold mb-2">
            Bem-vindo de volta!
          </p>

          <p className="text-sm text-center mb-8">
            Acesse sua conta agora mesmo.
          </p>

          <button
            onClick={onToggleMode}
            className="border border-white px-10 py-2 rounded-full hover:bg-white hover:text-[#E9A354] transition"
          >
            CADASTRAR
          </button>

          <span className="text-xs mt-6 opacity-80 cursor-pointer">
            Esqueci minha senha
          </span>
        </div>

        {/* LADO DIREITO */}
        <div className="w-1/2 flex flex-col justify-center px-12">
          <h2 className="text-center text-gray-400 mb-8">
            Preencha seus dados
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F3E6CC] px-4 py-3 rounded outline-none"
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F3E6CC] px-4 py-3 rounded outline-none"
              required
            />

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#E9A354] hover:bg-[#D9913A] text-white py-3 rounded-full mt-6 transition"
            >
              {loading ? "Entrando..." : "ENTRAR"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
