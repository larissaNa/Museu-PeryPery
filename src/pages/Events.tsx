import React, { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { HistoriaHeader } from "@/components/HistoriaHeader";
import { supabase } from "@/infra/supabaseClient";

interface EventItem {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  cover_image_path: string | null;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id,title,description,event_date,location,cover_image_path")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true });
      if (!error && data) setEvents(data as EventItem[]);
      setLoading(false);
    })();
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-museum-dark">
      <HistoriaHeader />
      <section className="museum-dark-section pt-12 pb-10">
        <div className="museum-container text-center">
          <h1 className="museum-heading text-primary-foreground mb-4">
            Eventos do <span className="text-gradient">Museu</span>
          </h1>
          <p className="museum-subheading text-museum-warm-gray max-w-2xl mx-auto">
            Confira nossa agenda cultural e participe das próximas atividades.
          </p>
        </div>
      </section>

      <section className="museum-light-section museum-section">
        <div className="museum-container">
          {loading ? (
            <p className="text-center text-muted-foreground">Carregando eventos...</p>
          ) : events.length === 0 ? (
            <div className="museum-card text-center">
              <p className="text-muted-foreground">Nenhum evento programado no momento.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {events.map((ev) => (
                <article key={ev.id} className="museum-card flex flex-col">
                  <div className="flex items-center gap-2 text-museum-orange mb-3">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium">{formatDate(ev.event_date)}</span>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-card-foreground mb-2">
                    {ev.title}
                  </h3>
                  {ev.location && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{ev.location}</span>
                    </div>
                  )}
                  {ev.description && (
                    <p className="text-muted-foreground leading-relaxed">{ev.description}</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
