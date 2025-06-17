import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";
import type { CommissionCategory } from "../../common/category-enums";

export const getCommissionImages = async (
  client: SupabaseClient<Database>,
  { commissionId }: { commissionId: number }
) => {
  const { data, error } = await client
    .from("commission_images")
    .select("*")
    .eq("commission_id", commissionId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
};

type CategoryType = Database["public"]["Enums"]["commission_category"];

// 타입 가드 함수들
const isStringArray = (value: unknown): value is string[] => {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
};

const toStringArray = (jsonValue: unknown): string[] => {
  if (isStringArray(jsonValue)) {
    return jsonValue;
  }
  return [];
};

export const getCommissions = async (
  client: SupabaseClient<Database>,
  {
    category,
    limit = 10,
    offset = 0,
    orderBy = "created_at",
    ascending = false,
  }: {
    category?: CommissionCategory;
    limit?: number;
    offset?: number;
    orderBy?: string;
    ascending?: boolean;
  } = {}
) => {
  let query = client
    .from("commission_with_artist")
    .select("*")
    .order(orderBy, { ascending })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// 특정 commission 조회 (artist 정보 포함)
export const getCommissionById = async (
  client: SupabaseClient<Database>,
  { commissionId }: { commissionId: number }
) => {
  const { data, error } = await client
    .from("commission_with_artist")
    .select("*")
    .eq("commission_id", commissionId)
    .single();

  if (error) throw error;
  return data;
};

// 특정 artist의 commission들 조회
export const getCommissionsByArtist = async (
  client: SupabaseClient<Database>,
  artistId: string
) => {
  const { data, error } = await client
    .from("commission_with_artist")
    .select("*")
    .eq("profile_id", artistId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// 카테고리별 commission 조회
export const getCommissionsByCategory = async (
  client: SupabaseClient<Database>,
  category: CategoryType | string
) => {
  const { data, error } = await client
    .from("commission_with_artist")
    .select(
      `
      commission_id,
      title,
      category,
      tags,
      images,
      price_start,
      likes_count,
      status,
      artist_name,
      artist_username,
      artist_avatar_url,
      artist_avg_rating
    `
    )
    .eq("category", category as CategoryType);

  if (error) {
    throw new Error(error.message);
  }

  return (
    data?.map((commission) => ({
      ...commission,
      tags: [commission.category, ...toStringArray(commission.tags)],
      images: toStringArray(commission.images),
    })) || []
  );
};

// commission 검색 (제목, 설명, artist 이름으로)
export const searchCommissions = async (
  client: SupabaseClient<Database>,
  searchTerm: string
) => {
  const { data, error } = await client
    .from("commission_with_artist")
    .select("*")
    .or(
      `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,artist_name.ilike.%${searchTerm}%`
    );

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// 카테고리별 인기 commission 조회 (리더보드용)
export const getTopCommissionsByCategory = async (
  client: SupabaseClient<Database>,
  category: CategoryType | string,
  limit: number = 3
) => {
  const { data, error } = await client
    .from("commission_with_artist")
    .select(
      `
      commission_id,
      title,
      category,
      tags,
      images,
      price_start,
      likes_count,
      status,
      artist_name,
      artist_username,
      artist_avatar_url,
      artist_avg_rating
    `
    )
    .eq("category", category as CategoryType)
    .eq("status", "available")
    .order("likes_count", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (
    data?.map((commission) => ({
      ...commission,
      tags: [commission.category, ...toStringArray(commission.tags)],
      images: toStringArray(commission.images),
    })) || []
  );
};

// 주간 추천 아티스트 가져오기 (임시로 랜덤 8개 선택)
export const getFeaturedWeeklyCommissions = async (
  client: SupabaseClient<Database>
) => {
  const { data, error } = await client
    .from("commission_with_artist")
    .select(
      `
      commission_id,
      title,
      category,
      tags,
      images,
      price_start,
      likes_count,
      status,
      artist_name,
      artist_username,
      artist_avatar_url,
      artist_avg_rating
    `
    )
    .eq("is_featured_weekly", true)
    .eq("status", "available")
    .limit(8);

  if (error) {
    throw new Error(error.message);
  }

  return (
    data?.map((commission) => ({
      ...commission,
      tags: [commission.category, ...toStringArray(commission.tags)],
      images: toStringArray(commission.images),
    })) || []
  );
};

export const getImagesByCategory = async (
  client: SupabaseClient<Database>,
  {
    category,
  }: {
    category: CategoryType;
  }
) => {
  const { data, error } = await client
    .from("commission_with_artist")
    .select("images")
    .eq("category", category as CategoryType)
    .not("images", "is", null)
    .limit(10);

  if (error) {
    throw new Error(error.message);
  }

  // 모든 이미지 배열들을 하나로 flatten
  const allImages: string[] =
    data?.reduce((acc: string[], commission) => {
      const commissionImages = toStringArray(commission.images);
      return [...acc, ...commissionImages];
    }, []) || [];

  return allImages.slice(0, 20); // Marquee용으로 20개 정도만
};

// 마켓플레이스 메인 페이지용 이미지 가져오기
export const getMarketplaceImages = async (
  client: SupabaseClient<Database>
) => {
  const { data: commissions, error } = await client
    .from("commission_with_artist")
    .select("images")
    .limit(20);

  if (error) throw error;

  // 모든 이미지 URL을 하나의 배열로 합치기
  const allImages = commissions.flatMap(
    (commission) => (commission.images as string[]) || []
  );

  return allImages;
};

export const getCommissionLikesCount = async (
  client: SupabaseClient<Database>,
  { commissionId }: { commissionId: number }
) => {
  const { count, error } = await client
    .from("commission_likes")
    .select("*", { count: "exact", head: true })
    .eq("commission_id", commissionId);

  if (error) throw error;
  return count || 0;
};

export const getUserLikeStatus = async (
  client: SupabaseClient<Database>,
  { commissionId, userId }: { commissionId: number; userId: string }
) => {
  const { data, error } = await client
    .from("commission_likes")
    .select("*")
    .eq("commission_id", commissionId)
    .eq("liker_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116는 결과가 없을 때의 에러
  return !!data;
};

export const getCommissionLikes = async (
  client: SupabaseClient<Database>,
  { commissionId }: { commissionId: number }
) => {
  const { data, error } = await client
    .from("commission_likes")
    .select("liker_id, created_at")
    .eq("commission_id", commissionId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};
