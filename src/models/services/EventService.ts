import { supabase } from "@/infra/supabaseClient";

export interface MuseumEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  cover_image_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventInput {
  title: string;
  description?: string | null;
  event_date: string;
  location?: string | null;
  cover_image_path?: string | null;
}

export const EventService = {
  async listAll(): Promise<MuseumEvent[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    if (error) throw error;
    return (data ?? []) as MuseumEvent[];
  },

  async listUpcoming(): Promise<MuseumEvent[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", new Date().toISOString())
      .order("event_date", { ascending: true });
    if (error) throw error;
    return (data ?? []) as MuseumEvent[];
  },

  async create(input: EventInput, userId: string): Promise<MuseumEvent> {
    const { data, error } = await supabase
      .from("events")
      .insert([{ ...input, created_by: userId }])
      .select("*")
      .single();
    if (error) throw error;
    return data as MuseumEvent;
  },

  async update(id: string, input: Partial<EventInput>): Promise<MuseumEvent> {
    const { data, error } = await supabase
      .from("events")
      .update(input)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data as MuseumEvent;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;
  },
};
