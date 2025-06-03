import client from "~/supa-client";

export const getReviews = async () => {
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
      artist_profile:profiles!reviews_artist_id_profiles_profile_id_fk(name),
      reviewer_profile:profiles!reviews_reviewer_id_profiles_profile_id_fk(name)
    `
    )
    .limit(10);
  if (error) {
    throw error;
  }
  return data;
};

export const getReview = async ({ reviewId }: { reviewId: number }) => {
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
      artist_id,
      artist_profile:profiles!reviews_artist_id_profiles_profile_id_fk(
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
  if (error) {
    throw error;
  }

  // artist_portfolio를 별도로 가져오기
  const { data: portfolioData, error: portfolioError } = await client
    .from("artist_portfolio")
    .select("images")
    .eq("artist_id", data.artist_id)
    .single();

  // 아티스트 평균 평점 가져오기
  const avgRating = await getArtistAvgRating(data.artist_id);

  return {
    ...data,
    artist_portfolio: portfolioData || { images: [] },
    artist_avg_rating: avgRating,
  };
};

// 아티스트 평균 평점 계산 함수
export const getArtistAvgRating = async (artistId: string) => {
  const { data, error } = await client
    .from("reviews")
    .select("rating")
    .eq("artist_id", artistId);

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
