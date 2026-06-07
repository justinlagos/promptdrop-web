// Cloud-synced scripts (Supabase `scripts` table, owner-only via RLS).
import { supabase } from "./supabaseClient.js";

export const scriptsService = {
  available: () => !!supabase,
  async list() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("scripts").select("id,title,body,updated_at").order("updated_at", { ascending: false });
    return error ? [] : (data || []);
  },
  async create(title = "Untitled", body = "") {
    if (!supabase) return null;
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) return null;
    const { data, error } = await supabase
      .from("scripts").insert({ user_id: u.user.id, title, body }).select().single();
    return error ? null : data;
  },
  async update(id, patch) {
    if (!supabase) return false;
    const { error } = await supabase
      .from("scripts").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
    return !error;
  },
  async remove(id) {
    if (!supabase) return;
    await supabase.from("scripts").delete().eq("id", id);
  },
};
