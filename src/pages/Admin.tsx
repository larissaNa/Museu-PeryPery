
import React from "react";
import { HistoriaHeader } from "@/components/HistoriaHeader";
import { ModerationPanel } from "@/components/ModerationPanel";

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-museum-dark">
      <HistoriaHeader />
      <section className="museum-dark-section museum-section">
        <div className="museum-container">
          <div className="text-center mb-12">
            <h2 className="museum-heading text-primary-foreground mb-4">
              Área <span className="text-gradient">Administrativa</span>
            </h2>
            <p className="museum-subheading text-museum-warm-gray max-w-xl mx-auto">
              Conteúdo reservado a usuários com permissão de administrador.
            </p>
          </div>
          <div className="museum-card">
            <ModerationPanel />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;

