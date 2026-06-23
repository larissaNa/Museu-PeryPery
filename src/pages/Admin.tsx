import React from "react";
import { HistoriaHeader } from "@/components/HistoriaHeader";
import { ModerationPanel } from "@/components/ModerationPanel";
import { ContributionsManager } from "@/components/admin/ContributionsManager";
import { AcervoManager } from "@/components/admin/AcervoManager";
import { TimelineManager } from "@/components/admin/TimelineManager";
import { EventsManager } from "@/components/admin/EventsManager";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-museum-dark">
      <HistoriaHeader />
      <section className="museum-dark-section museum-section">
        <div className="museum-container">
          <div className="text-center mb-10">
            <h2 className="museum-heading text-primary-foreground mb-3">
              Área <span className="text-gradient">Administrativa</span>
            </h2>
            <p className="museum-subheading text-museum-warm-gray max-w-xl mx-auto">
              Gerencie acervo, contribuições, linha do tempo e eventos do museu.
            </p>
          </div>

          <div className="bg-background rounded-lg p-4 sm:p-6">
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="flex flex-wrap gap-1 mb-6">
                <TabsTrigger value="images">Imagens</TabsTrigger>
                <TabsTrigger value="contributions">Contribuições</TabsTrigger>
                <TabsTrigger value="acervo">Acervo</TabsTrigger>
                <TabsTrigger value="timeline">Linha do tempo</TabsTrigger>
                <TabsTrigger value="events">Eventos</TabsTrigger>
              </TabsList>
              <TabsContent value="images"><ModerationPanel /></TabsContent>
              <TabsContent value="contributions"><ContributionsManager /></TabsContent>
              <TabsContent value="acervo"><AcervoManager /></TabsContent>
              <TabsContent value="timeline"><TimelineManager /></TabsContent>
              <TabsContent value="events"><EventsManager /></TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;
