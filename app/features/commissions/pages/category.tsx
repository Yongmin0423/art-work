import ArtistCard from "../components/artist-card";
import CommissionsPagination from "../components/commissions-pagination";
import { getCommissionsByCategory, getUserLikeStatus } from "../queries";
import { toggleCommissionLike } from "../mutations";
import type { Route } from "./+types/category";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUser } from "~/features/community/queries";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Character Commission" }];
};

// 커미션 타장하여 is_liked 속성 추가
type CommissionWithLikeStatus = Awaited<
  ReturnType<typeof getCommissionsByCategory>
>[0] & {
  is_liked?: boolean;
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const { category } = params;

  if (!category) {
    throw new Response("카테고리가 필요합니다.", { status: 400 });
  }

  // 로그인한 사용자 정보 가져오기 (없으면 null)
  let user = null;
  try {
    user = await getLoggedInUser(client);
  } catch (error) {
    // 로그인하지 않은 경우 에러가 발생하므로 무시
    console.log("User not logged in");
  }

  // 카테고리별 커미션 가져오기 (사용자별 좋아요 상태 포함)
  const commissions = await getCommissionsByCategory(
    client,
    category,
    user?.profile_id
  );

  return {
    commissions,
    category,
    isLoggedIn: !!user, // 로그인 상태 추가
  };
};

// 좋아요 액션 처리
export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "like") {
    const commissionId = Number(formData.get("commissionId"));
    const { client } = makeSSRClient(request);

    // 로그인 확인
    let user;
    try {
      user = await getLoggedInUser(client);
    } catch (error) {
      return { error: "로그인이 필요합니다." };
    }

    if (!commissionId) {
      return { error: "커미션 ID가 필요합니다." };
    }

    try {
      // 좋아요 토글
      const result = await toggleCommissionLike(client, {
        commissionId,
        userId: user.profile_id,
      });

      return result;
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
      return { error: "좋아요 처리 중 오류가 발생했습니다." };
    }
  }

  return null;
};

export default function Category({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-8 md:space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
        {loaderData.commissions.map((commission) => (
          <ArtistCard
            key={commission.commission_id}
            id={commission.commission_id}
            title={commission.title}
            artistName={commission.artist_name}
            images={commission.images}
            rating={commission.artist_avg_rating}
            likes={commission.likes_count}
            tags={commission.tags}
            priceStart={commission.price_start}
            isLiked={commission.isLiked || false}
            isLoggedIn={loaderData.isLoggedIn}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8 md:mt-10">
        <CommissionsPagination totalPages={10} />
      </div>
    </div>
  );
}
