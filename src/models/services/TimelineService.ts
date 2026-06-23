import { supabase } from "@/infra/supabaseClient";

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  created_at: string;
}

export interface TimelineInput {
  year: number;
  title: string;
  description?: string | null;
  icon?: string | null;
  display_order?: number;
}

export const TimelineService = {
  async list(): Promise<TimelineEvent[]> {
    const { data, error } = await supabase
      .from("timeline_events")
      .select("*")
      .order("year", { ascending: true })
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as TimelineEvent[];
  },

  async create(input: TimelineInput): Promise<TimelineEvent> {
    const { data, error } = await supabase
      .from("timeline_events")
      .insert([{ display_order: 0, ...input }])
      .select("*")
      .single();
    if (error) throw error;
    return data as TimelineEvent;
  },

  async update(id: string, input: Partial<TimelineInput>): Promise<TimelineEvent> {
    const { data, error } = await supabase
      .from("timeline_events")
      .update(input)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data as TimelineEvent;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("timeline_events").delete().eq("id", id);
    if (error) throw error;
  },
};
