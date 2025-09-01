import { Link, useOutletContext } from "react-router";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";
import { makeSSRClient } from "~/supa-client";
import { getUserProfile } from "../queries";
import { getCommissionsByArtist } from "../../commissions/queries";
import ArtistCard from "../../commissions/components/artist-card";
import type { Route } from "./+types/profile-commissions-page";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);

  try {
    // 먼저 사용자 정보 가져오기
    const profile = await getUserProfile(client, {
      username: params.username as string,
    });

    // 해당 사용자의 커미션들 가져오기
    const commissions = await getCommissionsByArtist(
      client,
      profile.profile_id
    );
    return { commissions };
  } catch (error) {
    // 사용자가 존재하지 않으면 빈 배열 반환
    return { commissions: [] };
  }
};

export const meta: Route.MetaFunction = ({ params }) => {
  return [{ title: `${params.username}'s Commissions | wemake` }];
};

export default function ProfileCommissionsPage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { isLoggedIn, username } = useOutletContext<{
    isLoggedIn: boolean;
    username: string;
  }>();

  const commissions = (loaderData as any)?.commissions || [];
  const isOwner = isLoggedIn && username === params.username;

  if (!commissions || commissions.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            아직 등록한 커미션이 없습니다.
          </h3>
          <p className="text-muted-foreground">
            {isOwner
              ? "Start offering your services by creating your first commission"
              : "This artist hasn't created any commissions yet."}
          </p>
          {isOwner && (
            <Button asChild className="mt-4">
              <Link to="/commissions/create">
                <PlusIcon className="w-4 h-4 mr-2" />
                커미션 등록하기
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      {isOwner && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">내 커미션</h2>
            <p className="text-muted-foreground">
              등록한 커미션을 관리해보세요.
            </p>
          </div>
          <Button asChild>
            <Link to="/commissions/create">
              <PlusIcon className="w-4 h-4 mr-2" />
              커미션 등록하기
            </Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {commissions.map((commission: any) => (
          <ArtistCard
            key={commission.commission_id}
            id={commission.commission_id}
            title={commission.title}
            artistName={commission.artist_name}
            images={Array.isArray(commission.images) ? commission.images : []}
            rating={commission.artist_avg_rating || 0}
            likes={commission.likes_count || 0}
            tags={Array.isArray(commission.tags) ? commission.tags : []}
            priceStart={commission.price_start || 0}
            isLiked={commission.isLiked || false}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
    </div>
  );
}
