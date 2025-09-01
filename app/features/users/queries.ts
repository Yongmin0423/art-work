import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";
import type { CommissionCategory } from "../../common/category-enums";

export const getUserProfile = async (
  client: SupabaseClient<Database>,
  { username }: { username: string }
) => {
  const { data, error } = await client
    .from("profiles")
    .select(
      `
      profile_id,
      username,
      avatar_url,
      name,
      bio,
      job_title,
      work_status,
      location,
      website,
      followers_count,
      following_count,
      views_count,
      created_at
    `
    )
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("User not found");

  // 통계 데이터를 stats 객체로 변환하고 필요한 필드들 추가
  return {
    ...data,
    stats: {
      followers: data.followers_count,
      following: data.following_count,
      views: data.views_count,
    },
    isFollowing: false, // TODO: 실제 팔로우 상태 확인 로직 추가
  };
};

export const getUserById = async (
  client: SupabaseClient<Database>,
  { id }: { id: string }
) => {
  // 임시: 전체 profiles 데이터 확인
  const { data: allProfiles, error: allError } = await client
    .from("profiles")
    .select("profile_id, username, name");

  const { data, error } = await client
    .from("profiles")
    .select(
      "profile_id,username,avatar_url,name,bio,job_title,work_status,location,website,role"
    )
    .eq("profile_id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ===== PORTFOLIO QUERIES =====
export const getUserPortfolio = async (
  client: SupabaseClient<Database>,
  { username }: { username: string }
) => {
  // 먼저 사용자 정보 가져오기
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("profile_id")
    .eq("username", username)
    .single();

  if (profileError) throw profileError;

  // 포트폴리오 목록 가져오기
  const { data, error } = await client
    .from("artist_portfolio")
    .select("*")
    .eq("profile_id", profile.profile_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getMyPortfolio = async (
  client: SupabaseClient<Database>,
  { userId }: { userId: string }
) => {
  const { data, error } = await client
    .from("artist_portfolio")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getPortfolioById = async (
  client: SupabaseClient<Database>,
  { portfolioId }: { portfolioId: string }
) => {
  const { data, error } = await client
    .from("artist_portfolio")
    .select("*")
    .eq("profile_id", portfolioId)
    .single();

  if (error) throw error;
  return data;
};

export const createPortfolio = async (
  client: SupabaseClient<Database>,
  portfolioData: {
    profile_id: string;
    title: string;
    description?: string;
    images: string[];
    category?: CommissionCategory;
    tags: string[];
  }
) => {
  const { data, error } = await client
    .from("artist_portfolio")
    .insert(portfolioData)
    .select()
    .single();

  if (error) throw error;
  return data;
};
