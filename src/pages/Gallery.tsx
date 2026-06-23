import React from "react";
import { Gallery } from "@/components/Gallery";
import { HistoriaHeader } from "@/components/HistoriaHeader";

const GalleryPage: React.FC = () => (
  <div className="min-h-screen bg-museum-dark text-white">
    <HistoriaHeader />
    <div className="pt-6">
      <Gallery />
    </div>
  </div>
);

export default GalleryPage;

