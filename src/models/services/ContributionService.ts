import { supabase } from "@/infra/supabaseClient";

export interface Contribution {
  id: string;
  author_user_id: string | null;
  author_name: string | null;
  author_email: string | null;
  contribution_type: "relato" | "foto" | "memoria" | "sugestao";
  title: string | null;
  content: string | null;
  image_path: string | null;
  status: "pending" | "approved" | "rejected";
  moderation_note: string | null;
  created_at: string;
}

export const ContributionService = {
  async listPending(): Promise<Contribution[]> {
    const { data, error } = await supabase
      .from("contributions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Contribution[];
  },

  async approve(id: string, moderatorId: string, note?: string): Promise<void> {
    const { error } = await supabase
      .from("contributions")
      .update({
        status: "approved",
        moderated_by: moderatorId,
        moderated_at: new Date().toISOString(),
        moderation_note: note || null,
      })
      .eq("id", id);
    if (error) throw error;
  },

  async reject(id: string, moderatorId: string, reason: string): Promise<void> {
    if (!reason || reason.trim().length < 10) {
      throw new Error("Motivo da rejeição deve ter no mínimo 10 caracteres");
    }
    const { error } = await supabase
      .from("contributions")
      .update({
        status: "rejected",
        moderated_by: moderatorId,
        moderated_at: new Date().toISOString(),
        moderation_note: reason.trim(),
      })
      .eq("id", id);
    if (error) throw error;
  },

  async submit(input: {
    author_user_id?: string | null;
    author_name?: string;
    author_email?: string;
    contribution_type: Contribution["contribution_type"];
    title?: string;
    content?: string;
  }): Promise<void> {
    const { error } = await supabase
      .from("contributions")
      .insert([{ ...input, status: "pending" }]);
    if (error) throw error;
  },
};
