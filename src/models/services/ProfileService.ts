import { supabase } from "@/infra/supabaseClient";

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

export const ProfileService = {
  async getMine(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,display_name,avatar_url")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return data as Profile | null;
  },

  async update(userId: string, input: { display_name?: string; avatar_url?: string | null }) {
    const { error } = await supabase.from("profiles").update(input).eq("id", userId);
    if (error) throw error;
  },
};
