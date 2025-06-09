import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const updateUser = async (
  client: SupabaseClient<Database>,
  {
    id,
    name,
    username,
    job_title,
    bio,
    work_status,
    location,
    website,
    avatar_url,
    commission_status,
  }: {
    id: string;
    name?: string;
    username?: string;
    job_title?: string;
    bio?: string;
    work_status?: string;
    location?: string;
    website?: string;
    avatar_url?: string;
    commission_status?: "available" | "pending" | "unavailable" | "paused";
  }
) => {
  const updateData = {
    name,
    username,
    job_title,
    bio,
    work_status,
    location,
    website,
    avatar_url,
    commission_status,
  };

  const { data, error } = await client
    .from("profiles")
    .update(updateData)
    .eq("profile_id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePortfolio = async (
  client: SupabaseClient<Database>,
  {
    portfolioId,
    ...portfolioData
  }: {
    portfolioId: string;
    title?: string;
    description?: string;
    images?: string[];
    category?: string;
    tags?: string[];
  }
) => {
  const { data, error } = await client
    .from("artist_portfolio")
    .update(portfolioData)
    .eq("artist_id", portfolioId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePortfolio = async (
  client: SupabaseClient<Database>,
  { portfolioId }: { portfolioId: string }
) => {
  const { error } = await client
    .from("artist_portfolio")
    .delete()
    .eq("artist_id", portfolioId);

  if (error) throw error;
};

export const updateUserAvatar = async (
  client: SupabaseClient<Database>,
  { id, avatarUrl }: { id: string; avatarUrl: string }
) => {
  const { error } = await client
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("profile_id", id);
  if (error) {
    throw error;
  }
};
