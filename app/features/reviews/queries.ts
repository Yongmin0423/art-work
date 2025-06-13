import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getReviews = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from("reviews")
    .select(
      `
      review_id,
      title,
      views_count,
      created_at,
      rating,
      image_url,
      description,
      artist_profile:profiles!reviews_profile_id_profiles_profile_id_fk(name),
      reviewer_profile:profiles!reviews_reviewer_id_profiles_profile_id_fk(name)
    `
    )
    .limit(10);
  if (error) {
    throw error;
  }
  return data;
};

export const getReview = async (
  client: SupabaseClient<Database>,
  { reviewId }: { reviewId: number }
) => {
  const { data, error } = await client
    .from("reviews")
    .select(
      `
      review_id,
      title,
      description,
      rating,
      image_url,
      likes_count,
      views_count,
      created_at,
      profile_id,
      artist_profile:profiles!reviews_profile_id_profiles_profile_id_fk(
        name,
        avatar_url,
        bio,
        followers_count,
        views_count,
        job_title,
        location,
        website,
        work_status,
        specialties,
        commission_status
      ),
      reviewer_profile:profiles!reviews_reviewer_id_profiles_profile_id_fk(
        name,
        avatar_url
      )
    `
    )
    .eq("review_id", reviewId)
    .single();

  console.log("[getReview] data:", data);
  console.log("[getReview] error:", error);

  if (error) {
    throw error;
  }

  // artist_portfolio를 별도로 가져오기
  const { data: portfolioData, error: portfolioError } = await client
    .from("artist_portfolio")
    .select("images")
    .eq("profile_id", data.profile_id)
    .single();

  console.log("[getReview - portfolio] data:", portfolioData);
  console.log("[getReview - portfolio] error:", portfolioError);

  // 아티스트 평균 평점 가져오기
  const avgRating = await getArtistAvgRating(client, data.profile_id);

  return {
    ...data,
    artist_portfolio: portfolioData || { images: [] },
    artist_avg_rating: avgRating,
  };
};

// 아티스트 평균 평점 계산 함수
export const getArtistAvgRating = async (
  client: SupabaseClient<Database>,
  artistId: string
) => {
  const { data, error } = await client
    .from("reviews")
    .select("rating")
    .eq("profile_id", artistId);

  if (error) {
    console.error("Error fetching artist ratings:", error);
    return null;
  }

  if (!data || data.length === 0) {
    return null; // 리뷰가 없으면 null 반환
  }

  const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = totalRating / data.length;

  return avgRating;
};

export const getReviewsByUsername = async (
  client: SupabaseClient<Database>,
  { username }: { username: string }
) => {
  // 먼저 username으로 profile_id를 찾기
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("profile_id")
    .eq("username", username)
    .single();

  if (profileError) throw profileError;

  // 그 profile_id로 해당 사용자가 작성한 리뷰들 조회
  const { data, error } = await client
    .from("reviews")
    .select(
      `
      review_id,
      title,
      description,
      rating,
      image_url,
      likes_count,
      views_count,
      created_at,
      reviewer:profiles!reviews_reviewer_id_profiles_profile_id_fk(
        name,
        avatar_url,
        username
      ),
      artist:profiles!reviews_profile_id_profiles_profile_id_fk(
        name,
        avatar_url,
        username
      )
    `
    )
    .eq("reviewer_id", profile.profile_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
