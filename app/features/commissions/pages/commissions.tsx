import { Link } from "react-router";
import { Hero } from "~/components/hero";
import { Button } from "~/components/ui/button";
import ArtistCard from "../components/artist-card";
import { getTopCommissionsByCategory } from "../queries";
import type { Route } from "./+types/commissions";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Leaderboard | wemake" },
    { name: "description", content: "Top products leaderboard" },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const [
    characterCommissions,
    virtual3dCommissions,
    designCommissions,
    live2dCommissions,
  ] = await Promise.all([
    getTopCommissionsByCategory(client, "character", 3),
    getTopCommissionsByCategory(client, "virtual-3d", 3),
    getTopCommissionsByCategory(client, "design", 3),
    getTopCommissionsByCategory(client, "live2d", 3),
  ]);

  return {
    characterCommissions,
    virtual3dCommissions,
    designCommissions,
    live2dCommissions,
  };
};

export default function commissions({ loaderData }: Route.ComponentProps) {
  const {
    characterCommissions,
    virtual3dCommissions,
    designCommissions,
    live2dCommissions,
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
            Character-Illustration
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
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-2xl xl:text-3xl font-bold tracking-tight font-inter">
            Virtual-3D
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
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-2xl xl:text-3xl font-bold tracking-tight font-inter">
            Design
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
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-2xl xl:text-3xl font-bold tracking-tight font-inter">
            Live2D
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
          />
        ))}
      </div>
    </div>
  );
}
