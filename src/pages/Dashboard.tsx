// pages/Dashboard.tsx
import React from "react";
import { useAuthContext } from "../context/AuthContext";

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuthContext();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Bem-vindo, {user?.displayName || user?.email}!
      </h1>

      <p className="mb-6 text-gray-600">
        Você está logado no painel do sistema.
      </p>

      <button
        onClick={signOut}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Sair
      </button>
    </div>
  );
};
