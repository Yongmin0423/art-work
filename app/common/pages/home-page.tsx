import CategoryCard from "~/components/category-card";
import { Hero } from "~/components/hero";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import ArtistCard from "~/features/commissions/components/artist-card";
import { BentoDemo } from "../components/bento-grid";
import type { Route } from "./+types/home-page";
import { getCommissions } from "~/features/commissions/queries";
import { getActiveLogo, getCategoryShowcase } from "~/common/queries";

export const meta = () => {
  return [
    {
      title: "Home | artwork",
    },
    {
      name: "description",
      content: "Home Page of artwork",
    },
  ];
};

export const loader = async () => {
  const [commissions, logo, categoryShowcase] = await Promise.all([
    getCommissions(),
    getActiveLogo(),
    getCategoryShowcase(),
  ]);

  return { commissions, logo, categoryShowcase };
};

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { commissions, logo, categoryShowcase } = loaderData;

  return (
    <div>
      <div className="grid grid-cols-6 h-full">
        <div className="flex flex-col  h-full col-span-4">
          <Hero
            title="Make a your own art with the best Artist"
            subtitle="find your favorite artist and make a your own art"
          />
        </div>
        <div className="col-span-2">
          <img
            src={
              logo?.image_url ||
              "https://cdn.gameinsight.co.kr/news/photo/202211/25171_64125_5958.jpg"
            }
            alt={logo?.alt_text || "home page img"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="col-span-6">
          <BentoDemo categoryShowcase={categoryShowcase} />
        </div>
      </div>
      {/* <div className="mb-10">
        <h1 className="font-bold text-3xl">Category</h1>
        <div className="grid grid-cols-4 gap-10 ">
          {Array.from({ length: 4 }).map((_, index) => (
            <CategoryCard
              key={index}
              title="charater"
              imageUrl="https://i.namu.wiki/i/R-92H0KLN-wen6aNLzERBpLNtAU6o8QTzwjI0cbKGVpyrIWart56j-NhtiOwtDd1EIRy-hQg0jLgbSRIZ_CJoQ.webp"
            />
          ))}
        </div>
      </div> */}
      <div>
        <h1 className="font-bold text-3xl mb-5">Famous Artist</h1>
        <div className="grid grid-cols-4 gap-10 ">
          {commissions.map((commission) => (
            <ArtistCard
              key={commission.commission_id}
              id={commission.commission_id}
              title={commission.title}
              artistName={commission.artist_name}
              images={commission.images || []}
              rating={commission.artist_avg_rating}
              likes={commission.likes_count}
              tags={commission.tags}
              commissionStatus={
                commission.status === "available"
                  ? "가능"
                  : commission.status === "pending"
                  ? "대기 중"
                  : "불가"
              }
              priceStart={commission.price_start}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
