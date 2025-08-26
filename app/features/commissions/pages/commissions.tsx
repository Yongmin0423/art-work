import { Link } from "react-router";
import { Hero } from "~/components/hero";
import { Button } from "~/components/ui/button";
import ArtistCard from "../components/artist-card";
import { getTopCommissionsByCategory, getUserLikeStatus } from "../queries";
import { toggleCommissionLike } from "../mutations";
import type { Route } from "./+types/commissions";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUser } from "~/features/community/queries";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Leaderboard | wemake" },
    { name: "description", content: "Top products leaderboard" },
  ];
};

// 커미션 타입을 확장하여 is_liked 속성 추가
type CommissionWithLikeStatus = Awaited<
  ReturnType<typeof getTopCommissionsByCategory>
>[0] & {
  is_liked?: boolean;
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);

  // 로그인한 사용자 정보 가져오기 (없으면 null)
  let user = null;
  try {
    user = await getLoggedInUser(client);
  } catch (error) {
    // 로그인하지 않은 경우 에러가 발생하므로 무시
    console.log("User not logged in");
  }

  const [
    characterCommissionsRaw,
    virtual3dCommissionsRaw,
    designCommissionsRaw,
    live2dCommissionsRaw,
  ] = await Promise.all([
    getTopCommissionsByCategory(client, "character", 3),
    getTopCommissionsByCategory(client, "virtual-3d", 3),
    getTopCommissionsByCategory(client, "design", 3),
    getTopCommissionsByCategory(client, "live2d", 3),
  ]);

  // 타입 캐스팅
  const characterCommissions =
    characterCommissionsRaw as CommissionWithLikeStatus[];
  const virtual3dCommissions =
    virtual3dCommissionsRaw as CommissionWithLikeStatus[];
  const designCommissions = designCommissionsRaw as CommissionWithLikeStatus[];
  const live2dCommissions = live2dCommissionsRaw as CommissionWithLikeStatus[];

  // 사용자가 로그인한 경우에만 좋아요 상태 확인
  if (user) {
    // 모든 커미션에 대한 좋아요 상태 확인
    const allCommissions = [
      ...characterCommissions,
      ...virtual3dCommissions,
      ...designCommissions,
      ...live2dCommissions,
    ];

    // 각 커미션에 대한 좋아요 상태 확인
    const likesPromises = allCommissions.map(async (commission) => {
      const isLiked = await getUserLikeStatus(client, {
        commissionId: commission.commission_id,
        userId: user.profile_id,
      });
      return {
        commissionId: commission.commission_id,
        isLiked,
      };
    });

    const likesResults = await Promise.all(likesPromises);

    // 좋아요 상태를 각 커미션 객체에 추가
    const likesMap = new Map(
      likesResults.map(({ commissionId, isLiked }) => [commissionId, isLiked])
    );

    characterCommissions.forEach((commission) => {
      commission.is_liked = likesMap.get(commission.commission_id) || false;
    });

    virtual3dCommissions.forEach((commission) => {
      commission.is_liked = likesMap.get(commission.commission_id) || false;
    });

    designCommissions.forEach((commission) => {
      commission.is_liked = likesMap.get(commission.commission_id) || false;
    });

    live2dCommissions.forEach((commission) => {
      commission.is_liked = likesMap.get(commission.commission_id) || false;
    });
  }

  return {
    characterCommissions,
    virtual3dCommissions,
    designCommissions,
    live2dCommissions,
    isLoggedIn: !!user,
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

export default function commissions({ loaderData }: Route.ComponentProps) {
  const {
    characterCommissions,
    virtual3dCommissions,
    designCommissions,
    live2dCommissions,
    isLoggedIn,
  } = loaderData;

  return (
    <div className="space-y-10 md:space-y-16 xl:space-y-20 font-pretendard">
      <Hero
        title="Leaderboards"
        subtitle="The most popular Artist on artwork"
        className="font-inter"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-2xl xl:text-3xl font-bold tracking-tight font-inter">
            캐릭터 일러스트레이션
          </h2>
          <p className="text-sm md:text-md text-gray-500 font-medium">
            artwork에서 가장 인기있는 캐릭터 일러스트레이터입니다.
          </p>
          <Button
            variant="link"
            asChild
            className="text-xl md:text-xl xl:text-2xl mt-3 md:mt-4 xl:mt-5 font-medium hover:text-primary/90"
          >
            <Link to="/commissions/character">전체 작품 보기 &rarr;</Link>
          </Button>
        </div>
        {characterCommissions.map((commission) => (
          <ArtistCard
            id={commission.commission_id}
            key={commission.commission_id}
            title={commission.title}
            artistName={commission.artist_name}
            images={commission.images}
            rating={commission.artist_avg_rating}
            likes={commission.likes_count}
            tags={commission.tags}
            commissionStatus="가능"
            priceStart={commission.price_start}
            isLiked={commission.is_liked}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-2xl xl:text-3xl font-bold tracking-tight font-inter">
            버츄얼-3D
          </h2>
          <p className="text-sm md:text-md text-gray-500 font-medium">
            artwork에서 가장 인기있는 버츄얼-3D 아티스트입니다.
          </p>
          <Button
            variant="link"
            asChild
            className="text-xl md:text-xl xl:text-2xl mt-3 md:mt-4 xl:mt-5 font-medium hover:text-primary/90"
          >
            <Link to="/commissions/virtual-3d">전체 작품 보기 &rarr;</Link>
          </Button>
        </div>
        {virtual3dCommissions.map((commission) => (
          <ArtistCard
            id={commission.commission_id}
            key={commission.commission_id}
            title={commission.title}
            artistName={commission.artist_name}
            images={commission.images}
            rating={commission.artist_avg_rating}
            likes={commission.likes_count}
            tags={commission.tags}
            commissionStatus="가능"
            priceStart={commission.price_start}
            isLiked={commission.is_liked}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-2xl xl:text-3xl font-bold tracking-tight font-inter">
            디자인
          </h2>
          <p className="text-sm md:text-md text-gray-500 font-medium">
            artwork에서 가장 인기있는 디자이너입니다.
          </p>
          <Button
            variant="link"
            asChild
            className="text-xl md:text-xl xl:text-2xl mt-3 md:mt-4 xl:mt-5 font-medium hover:text-primary/90"
          >
            <Link to="/commissions/design">전체 작품 보기 &rarr;</Link>
          </Button>
        </div>
        {designCommissions.map((commission) => (
          <ArtistCard
            id={commission.commission_id}
            key={commission.commission_id}
            title={commission.title}
            artistName={commission.artist_name}
            images={commission.images}
            rating={commission.artist_avg_rating}
            likes={commission.likes_count}
            tags={commission.tags}
            commissionStatus="가능"
            priceStart={commission.price_start}
            isLiked={commission.is_liked}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-2xl xl:text-3xl font-bold tracking-tight font-inter">
            라이브2D
          </h2>
          <p className="text-sm md:text-md text-gray-500 font-medium">
            artwork에서 가장 인기있는 Live2D 아티스트입니다.
          </p>
          <Button
            variant="link"
            asChild
            className="text-xl md:text-xl xl:text-2xl mt-3 md:mt-4 xl:mt-5 font-medium hover:text-primary/90"
          >
            <Link to="/commissions/live2d">전체 작품 보기 &rarr;</Link>
          </Button>
        </div>
        {live2dCommissions.map((commission) => (
          <ArtistCard
            id={commission.commission_id}
            key={commission.commission_id}
            title={commission.title}
            artistName={commission.artist_name}
            images={commission.images}
            rating={commission.artist_avg_rating}
            likes={commission.likes_count}
            tags={commission.tags}
            commissionStatus="가능"
            priceStart={commission.price_start}
            isLiked={commission.is_liked}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
    </div>
  );
}
