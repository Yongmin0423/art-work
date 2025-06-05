import supabase from "~/supa-client";

/**
 * 조회수를 증가시키는 유틸리티 함수
 * @param tableName 테이블 이름 ('reviews', 'commission', 'posts', 'profiles', 'artist_portfolio')
 * @param id 레코드 ID
 * @param idColumn ID 컬럼명 (기본값: 'id')
 */
export async function incrementViewCount(
  tableName: string,
  id: number | string,
  idColumn: string = "id"
): Promise<{ success: boolean; error?: string }> {
  try {
    // TypeScript 타입 우회를 위해 any 사용
    const { error } = await (supabase as any)
      .from(tableName)
      .update({ views_count: (supabase as any).sql`views_count + 1` })
      .eq(idColumn, id);

    if (error) {
      console.error(`View count update failed for ${tableName}:`, error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error(`View count update failed for ${tableName}:`, error);
    return { success: false, error: String(error) };
  }
}

/**
 * 리뷰 조회수 증가
 */
export async function incrementReviewViewCount(
  reviewId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc("increment_view_count", {
      table_name: "reviews",
      record_id: reviewId,
      id_column: "review_id",
    });

    if (error) {
      console.error("Review view count update failed:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Review view count update failed:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * 커미션 조회수 증가
 */
export async function incrementCommissionViewCount(
  commissionId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc("increment_view_count", {
      table_name: "commission",
      record_id: commissionId,
      id_column: "commission_id",
    });

    if (error) {
      console.error("Commission view count update failed:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Commission view count update failed:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * 포스트 조회수 증가
 */
export async function incrementPostViewCount(
  postId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc("increment_view_count", {
      table_name: "posts",
      record_id: postId,
      id_column: "post_id",
    });

    if (error) {
      console.error("Post view count update failed:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Post view count update failed:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * 프로필 조회수 증가 (UUID이므로 별도 RPC 사용)
 */
export async function incrementProfileViewCount(
  profileId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc("increment_profile_view_count", {
      profile_id_param: profileId,
    });

    if (error) {
      console.error("Profile view count update failed:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Profile view count update failed:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * 아티스트 포트폴리오 조회수 증가 (UUID이므로 별도 RPC 사용)
 */
export async function incrementPortfolioViewCount(
  artistId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc("increment_profile_view_count", {
      profile_id_param: artistId, // artist_portfolio의 artist_id는 profile_id와 같음
    });

    if (error) {
      console.error("Portfolio view count update failed:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Portfolio view count update failed:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * 비동기로 조회수 증가 함수들 (에러 무시)
 */
export function incrementReviewViewCountAsync(reviewId: number): void {
  incrementReviewViewCount(reviewId).catch((error) => {
    console.error("Async review view count update failed:", error);
  });
}

export function incrementCommissionViewCountAsync(commissionId: number): void {
  incrementCommissionViewCount(commissionId).catch((error) => {
    console.error("Async commission view count update failed:", error);
  });
}

export function incrementPostViewCountAsync(postId: number): void {
  incrementPostViewCount(postId).catch((error) => {
    console.error("Async post view count update failed:", error);
  });
}

export function incrementProfileViewCountAsync(profileId: string): void {
  incrementProfileViewCount(profileId).catch((error) => {
    console.error("Async profile view count update failed:", error);
  });
}

export function incrementPortfolioViewCountAsync(artistId: string): void {
  incrementPortfolioViewCount(artistId).catch((error) => {
    console.error("Async portfolio view count update failed:", error);
  });
}

// 사용 예시 (주석)
/*
// loader에서 사용 예시:
export const loader = async ({ params }: Route.LoaderArgs) => {
  const reviewId = Number(params.reviewId);
  
  // 조회수 증가 (비동기, 에러 무시)
  incrementReviewViewCountAsync(reviewId);
  
  // 또는 에러 처리하고 싶다면:
  // const result = await incrementReviewViewCount(reviewId);
  // if (!result.success) console.error('View count failed:', result.error);
  
  const review = await getReview({ reviewId });
  return { review };
};
*/
