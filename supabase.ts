import { createClient } from "@supabase/supabase-js";

// Service role key dipakai di server saja (API routes), tidak pernah dikirim ke browser.
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) {
    throw new Error("Supabase env vars belum diisi di Vercel (Settings > Environment Variables).");
  }
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export type BotSettings = {
  id: number;
  bot_token: string | null;
  openai_api_key: string | null;
  admin_chat_id: string | null;
  is_active: boolean;
  updated_at: string;
};

export type UserSession = {
  chat_id: number;
  username: string | null;
  has_started: boolean;
  current_menu: string | null;
  pending_images: string[];
  updated_at: string;
};

export async function getSettings(): Promise<BotSettings> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("bot_settings").select("*").eq("id", 1).single();
  if (error) throw error;
  return data as BotSettings;
}

export async function saveSettings(partial: Partial<BotSettings>) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("bot_settings")
    .update({ ...partial, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw error;
}

export async function getSession(chatId: number): Promise<UserSession | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("user_sessions").select("*").eq("chat_id", chatId).maybeSingle();
  return (data as UserSession) ?? null;
}

export async function upsertSession(chatId: number, partial: Partial<UserSession>) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("user_sessions")
    .upsert({ chat_id: chatId, ...partial, updated_at: new Date().toISOString() }, { onConflict: "chat_id" });
  if (error) throw error;
}
