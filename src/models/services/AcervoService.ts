import { supabase } from "@/infra/supabaseClient";

export interface AcervoItem {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  dating: string | null;
  image_path: string | null;
  status: "active" | "archived";
  created_at: string;
  updated_at: string;
}

export interface AcervoInput {
  title: string;
  description?: string | null;
  category?: string | null;
  dating?: string | null;
  image_path?: string | null;
  status?: "active" | "archived";
}

const BUCKET = "museum-images";

export const AcervoService = {
  async list(): Promise<AcervoItem[]> {
    const { data, error } = await supabase
      .from("acervo_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as AcervoItem[];
  },

  async create(input: AcervoInput, userId: string): Promise<AcervoItem> {
    const { data, error } = await supabase
      .from("acervo_items")
      .insert([{ ...input, created_by: userId, updated_by: userId }])
      .select("*")
      .single();
    if (error) throw error;
    return data as AcervoItem;
  },

  async update(id: string, input: Partial<AcervoInput>, userId: string): Promise<AcervoItem> {
    const { data, error } = await supabase
      .from("acervo_items")
      .update({ ...input, updated_by: userId })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data as AcervoItem;
  },

  async archive(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("acervo_items")
      .update({ status: "archived", updated_by: userId })
      .eq("id", id);
    if (error) throw error;
  },

  async restore(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("acervo_items")
      .update({ status: "active", updated_by: userId })
      .eq("id", id);
    if (error) throw error;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("acervo_items").delete().eq("id", id);
    if (error) throw error;
  },

  async uploadCover(file: File): Promise<string> {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `acervo/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (error) throw error;
    return path;
  },

  async getSignedUrl(path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 60);
    if (error) throw error;
    return data.signedUrl;
  },
};
