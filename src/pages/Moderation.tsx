import React from "react";
import { ModerationPanel } from "@/components/ModerationPanel";
import { AdminRoute } from "@/routes/AdminRoute";

const Moderation: React.FC = () => (
  <AdminRoute>
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <ModerationPanel />
    </div>
  </AdminRoute>
);

export default Moderation;

