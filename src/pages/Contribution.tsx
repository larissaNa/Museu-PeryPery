import React from "react";
import { ContributionForm } from "@/components/ContributionForm";
import { PrivateRoute } from "@/routes/PrivateRoute";

const Contribution: React.FC = () => (
  <PrivateRoute>
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <ContributionForm />
    </div>
  </PrivateRoute>
);

export default Contribution;
