import type { Route } from "./+types/liked-commissions-page";
import { makeSSRClient } from "~/supa-client";
import { getUserLikedCommissions } from "~/features/commissions/queries";
import { getLoggedInUser } from "~/features/community/queries";
import ArtistCard from "~/features/commissions/components/artist-card";
import { toggleCommissionLike } from "~/features/commissions/mutations";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  
  const user = await getLoggedInUser(client);
  if (!user) {
    throw new Response("로그인이 필요합니다.", { status: 401 });
  }

  const likedCommissions = await getUserLikedCommissions(client, {
    userId: user.profile_id,
    limit: 50,
  });

  return { likedCommissions, user };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  
  const user = await getLoggedInUser(client);
  if (!user) {
    throw new Response("로그인이 필요합니다.", { status: 401 });
  }
  
  const formData = await request.formData();
  const actionType = formData.get("action") as string;
  const commissionId = parseInt(formData.get("commissionId") as string);

  if (actionType === "like") {
    try {
      const result = await toggleCommissionLike(client, {
        commissionId,
        userId: user.profile_id,
      });
      return { liked: result.liked };
    } catch (error) {
      return { error: "좋아요 처리 중 오류가 발생했습니다." };
    }
  }

  return {};
};

export default function LikedCommissionsPage({ 
  loaderData 
}: Route.ComponentProps) {
  const { likedCommissions, user } = loaderData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">좋아요한 커미션</h1>
        <p className="text-muted-foreground">
          내가 좋아요한 커미션들을 확인하고 관리할 수 있습니다.
        </p>
      </div>

      {likedCommissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            아직 좋아요한 커미션이 없습니다.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            마음에 드는 커미션을 찾아 좋아요를 눌러보세요!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {likedCommissions.map((commission) => (
            <ArtistCard
              key={commission.commission_id}
              id={commission.commission_id}
              title={commission.title}
              artistName={commission.artist_name || ""}
              images={commission.images}
              rating={commission.artist_avg_rating || 0}
              likes={commission.likes_count || 0}
              tags={commission.tags}
              priceStart={commission.price_start}
              isLiked={commission.isLiked}
              isLoggedIn={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}