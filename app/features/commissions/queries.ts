import client from "~/supa-client";
import type { Database } from "../../../database.types";

type CategoryType = Database["public"]["Enums"]["commission_category"];

export const getCommissions = async () => {
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

  // tags가 jsonb이므로 string[]로 변환하고, category도 포함
  return (
    data?.map((commission) => ({
      ...commission,
      tags: [commission.category, ...(commission.tags || [])],
      images: commission.images || [], // 이미 jsonb 배열
    })) || []
  );
};

// 특정 commission 조회 (artist 정보 포함)
export const getCommissionById = async ({
  commissionId,
}: {
  commissionId: number;
}) => {
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
export const getCommissionsByArtist = async (artistId: string) => {
  const { data, error } = await client
    .from("commission_with_artist")
    .select("*")
    .eq("artist_id", artistId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// 카테고리별 commission 조회
export const getCommissionsByCategory = async (
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
      tags: [commission.category, ...(commission.tags || [])],
      images: commission.images || [],
    })) || []
  );
};

// commission 검색 (제목, 설명, artist 이름으로)
export const searchCommissions = async (searchTerm: string) => {
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
      tags: [commission.category, ...(commission.tags || [])],
      images: commission.images || [],
    })) || []
  );
};

export const getImagesByCategory = async ({
  category,
}: {
  category: CategoryType;
}) => {
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
  const allImages =
    data?.reduce((acc: string[], commission) => {
      const commissionImages = Array.isArray(commission.images)
        ? commission.images
        : [];
      return [...acc, ...commissionImages];
    }, []) || [];

  return allImages.slice(0, 20); // Marquee용으로 20개 정도만
};
