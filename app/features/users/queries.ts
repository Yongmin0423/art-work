import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getUserProfile = async (
  cleint: SupabaseClient<Database>,
  { username }: { username: string }
) => {
  const { data, error } = await cleint
    .from("profiles")
    .select("profile_id,username,avatar_url,name,bio,created_at")
    .eq("username", username)
    .single();
  if (error) throw error;
  return data;
};

export const getUserById = async (
  client: SupabaseClient<Database>,
  { id }: { id: string }
) => {
  const { data, error } = await client
    .from("profiles")
    .select("profile_id,username,avatar_url, name")
    .eq("profile_id", id)
    .single();
  if (error) throw error;
  return data;
};
