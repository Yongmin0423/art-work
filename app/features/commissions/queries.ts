import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

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

export const getCommissions = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from("commission_with_artist").select(`
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
    `);

  if (error) {
    throw new Error(error.message);
  }

  // tags가 jsonb이므로 string[]로 안전하게 변환하고, category도 포함
  return (
    data?.map((commission) => ({
      ...commission,
      tags: [commission.category, ...toStringArray(commission.tags)],
      images: toStringArray(commission.images), // jsonb 배열을 string[]로 안전하게 변환
    })) || []
  );
};

// 특정 commission 조회 (artist 정보 포함)
export const getCommissionById = async (
  client: SupabaseClient<Database>,
  {
    commissionId,
  }: {
    commissionId: number;
  }
) => {
  const { data, error } = await client
    .from("commission_with_artist")
    .select("*")
    .eq("commission_id", commissionId)
    .single();

  if (error) {
    throw new Error(error.message);
  }
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
