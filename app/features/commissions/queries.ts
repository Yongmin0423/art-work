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
    .eq("status", "available")
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

// 카테고리별 commission 조회 (사용자별 좋아요 상태 포함)
export const getCommissionsByCategory = async (
  client: SupabaseClient<Database>,
  category: CategoryType | string,
  userId?: string
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
    .eq("status", "available");

  if (error) {
    throw new Error(error.message);
  }

  const commissions = data?.map((commission) => ({
    ...commission,
    tags: [commission.category, ...toStringArray(commission.tags)],
    images: toStringArray(commission.images),
  })) || [];

  // 사용자가 로그인한 경우 각 커미션에 대한 좋아요 상태 확인
  if (userId && commissions.length > 0) {
    const commissionIds = commissions.map(c => c.commission_id);
    const { data: likedCommissions, error: likeError } = await client
      .from("commission_likes")
      .select("commission_id")
      .eq("liker_id", userId)
      .in("commission_id", commissionIds);

    if (likeError) throw likeError;

    const likedCommissionIds = new Set(likedCommissions?.map(like => like.commission_id) || []);

    return commissions.map(commission => ({
      ...commission,
      isLiked: likedCommissionIds.has(commission.commission_id)
    }));
  }

  return commissions.map(commission => ({
    ...commission,
    isLiked: false
  }));
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

// 카테고리별 인기 commission 조회 (리더보드용, 사용자별 좋아요 상태 포함)
export const getTopCommissionsByCategory = async (
  client: SupabaseClient<Database>,
  category: CategoryType | string,
  limit: number = 3,
  userId?: string
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

  const commissions = data?.map((commission) => ({
    ...commission,
    tags: [commission.category, ...toStringArray(commission.tags)],
    images: toStringArray(commission.images),
  })) || [];

  // 사용자가 로그인한 경우 각 커미션에 대한 좋아요 상태 확인
  if (userId && commissions.length > 0) {
    const commissionIds = commissions.map(c => c.commission_id);
    const { data: likedCommissions, error: likeError } = await client
      .from("commission_likes")
      .select("commission_id")
      .eq("liker_id", userId)
      .in("commission_id", commissionIds);

    if (likeError) throw likeError;

    const likedCommissionIds = new Set(likedCommissions?.map(like => like.commission_id) || []);

    return commissions.map(commission => ({
      ...commission,
      isLiked: likedCommissionIds.has(commission.commission_id)
    }));
  }

  return commissions.map(commission => ({
    ...commission,
    isLiked: false
  }));
};

// 주간 추천 아티스트 가져오기 (사용자별 좋아요 상태 포함)
export const getFeaturedWeeklyCommissions = async (
  client: SupabaseClient<Database>,
  userId?: string
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

  const commissions = data?.map((commission) => ({
    ...commission,
    tags: [commission.category, ...toStringArray(commission.tags)],
    images: toStringArray(commission.images),
  })) || [];

  // 사용자가 로그인한 경우 각 커미션에 대한 좋아요 상태 확인
  if (userId && commissions.length > 0) {
    const commissionIds = commissions.map(c => c.commission_id);
    const { data: likedCommissions, error: likeError } = await client
      .from("commission_likes")
      .select("commission_id")
      .eq("liker_id", userId)
      .in("commission_id", commissionIds);

    if (likeError) throw likeError;

    const likedCommissionIds = new Set(likedCommissions?.map(like => like.commission_id) || []);

    return commissions.map(commission => ({
      ...commission,
      isLiked: likedCommissionIds.has(commission.commission_id)
    }));
  }

  return commissions.map(commission => ({
    ...commission,
    isLiked: false
  }));
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
    .eq("status", "available")
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
    .eq("status", "available")
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

// 관리자용: 승인 대기 중인 커미션들 조회
export const getPendingCommissions = async (
  client: SupabaseClient<Database>
) => {
  const { data, error } = await client
    .from("commission_with_artist")
    .select(
      `
      commission_id,
      title,
      category,
      price_start,
      status,
      created_at,
      artist_name,
      artist_username,
      profile_id
    `
    )
    .eq("status", "pending_approval")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

// 관리자용: 모든 커미션 조회 (상태별 필터링 가능)
export const getAllCommissionsForAdmin = async (
  client: SupabaseClient<Database>,
  {
    status,
    limit = 50,
    offset = 0,
  }: {
    status?: "pending_approval" | "available" | "rejected";
    limit?: number;
    offset?: number;
  } = {}
) => {
  let query = client
    .from("commission_with_artist")
    .select(
      `
      commission_id,
      title,
      category,
      price_start,
      status,
      created_at,
      approved_at,
      rejection_reason,
      artist_name,
      artist_username,
      profile_id
    `
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getAllOrders = async (
  client: SupabaseClient<Database>,
  {
    status,
    limit = 50,
    offset = 0,
  }: {
    status?: Database["public"]["Enums"]["order_status"];
    limit?: number;
    offset?: number;
  } = {}
) => {
  let query = client
    .from("commission_order")
    .select(
      `
      order_id,
      status,
      total_price,
      created_at,
      commission:commission_id (title, category),
      client:profiles!commission_order_client_id_profiles_profile_id_fk (name),
      artist:profiles!commission_order_profile_id_profiles_profile_id_fk (name)
    `
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getOrderById = async (
  client: SupabaseClient<Database>,
  { orderId }: { orderId: number }
) => {
  const { data, error } = await client
    .from("commission_order")
    .select(
      `
      *,
      commission:commission_id (
        commission_id,
        title,
        category,
        description,
        price_start,
        images,
        tags
      ),
      client:profiles!commission_order_client_id_profiles_profile_id_fk (
        profile_id,
        name,
        username,
        avatar_url
      ),
      artist:profiles!commission_order_profile_id_profiles_profile_id_fk (
        profile_id,
        name,
        username,
        avatar_url
      )
    `
    )
    .eq("order_id", orderId)
    .single();

  if (error) throw error;
  return data;
};

// 받은 주문들 조회 (아티스트 관점)
export const getReceivedOrders = async (
  client: SupabaseClient<Database>,
  {
    profileId,
    status,
    limit = 50,
    offset = 0,
  }: {
    profileId: string;
    status?: Database["public"]["Enums"]["order_status"];
    limit?: number;
    offset?: number;
  }
) => {
  let query = client
    .from("commission_order")
    .select(
      `
      order_id,
      status,
      total_price,
      created_at,
      commission:commission_id (title, category),
      client:profiles!commission_order_client_id_profiles_profile_id_fk (name, username, avatar_url)
    `
    )
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// 의뢰한 주문들 조회 (클라이언트 관점)
export const getRequestedOrders = async (
  client: SupabaseClient<Database>,
  {
    profileId,
    status,
    limit = 50,
    offset = 0,
  }: {
    profileId: string;
    status?: Database["public"]["Enums"]["order_status"];
    limit?: number;
    offset?: number;
  }
) => {
  let query = client
    .from("commission_order")
    .select(
      `
      order_id,
      status,
      total_price,
      created_at,
      commission:commission_id (title, category),
      artist:profiles!commission_order_profile_id_profiles_profile_id_fk (name, username, avatar_url)
    `
    )
    .eq("client_id", profileId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};
