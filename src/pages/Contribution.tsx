import React from "react";
import { ContributionForm } from "@/components/ContributionForm";
import { PrivateRoute } from "@/routes/PrivateRoute";
import { HistoriaHeader } from "@/components/HistoriaHeader";

const Contribution: React.FC = () => (
  <PrivateRoute>
    <div className="min-h-screen bg-museum-dark text-white">
      <HistoriaHeader />
      <div className="pt-6">
        <ContributionForm />
      </div>
    </div>
  </PrivateRoute>
);

export default Contribution;

