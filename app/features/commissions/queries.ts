import client from "~/supa-client";

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
export const getCommissionById = async (commissionId: number) => {
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
export const getCommissionsByCategory = async (category: string) => {
  const { data, error } = await client
    .from("commission_with_artist")
    .select("*")
    .eq("category", category);

  if (error) {
    throw new Error(error.message);
  }
  return data;
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
