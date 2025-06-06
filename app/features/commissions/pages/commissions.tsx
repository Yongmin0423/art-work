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
    <div className="space-y-20">
      <Hero
        title="Leaderboards"
        subtitle="The most popular Artist on artwork"
      />
      <div className="grid grid-cols-4 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Character-Illustration
          </h2>
          <p className="text-xl font-light text-foreground">
            The most popular Character-Illustrator on artwork.
          </p>
          <Button variant="link" asChild className="text-3xl mt-5">
            <Link to="/commissions/character">Explore all products &rarr;</Link>
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
      <div className="grid grid-cols-4 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Virtual-3D
          </h2>
          <p className="text-xl font-light text-foreground">
            The most popular Virtual-3D Artist on artwork.
          </p>

          <Button variant="link" asChild className="text-3xl mt-5">
            <Link to="/commissions/virtual-3d">
              Explore all products &rarr;
            </Link>
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
      <div className="grid grid-cols-4 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Design
          </h2>
          <p className="text-xl font-light text-foreground">
            The most popular Designer on artwork.
          </p>

          <Button variant="link" asChild className="text-3xl mt-5">
            <Link to="/commissions/design">Explore all products &rarr;</Link>
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
      <div className="grid grid-cols-4 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Live2D
          </h2>
          <p className="text-xl font-light text-foreground">
            The most popular Live2D Artist on artwork.
          </p>

          <Button variant="link" asChild className="text-3xl mt-5">
            <Link to="/commissions/live2d">Explore all products &rarr;</Link>
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
