import CategoryCard from "~/components/category-card";
import { Hero } from "~/components/hero";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import ArtistCard from "~/features/commissions/components/artist-card";
import { BentoDemo } from "../components/bento-grid";
import type { Route } from "./+types/home-page";
import { getFeaturedWeeklyCommissions } from "~/features/commissions/queries";
import { getActiveLogo, getCategoryShowcase } from "~/common/queries";
import { makeSSRClient } from "~/supa-client";
import { BlurFade } from "components/magicui/blur-fade";

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

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const [featuredCommissions, logo, categoryShowcase] = await Promise.all([
    getFeaturedWeeklyCommissions(client),
    getActiveLogo(client),
    getCategoryShowcase(client),
  ]);

  return { featuredCommissions, logo, categoryShowcase };
};

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { featuredCommissions, logo, categoryShowcase } = loaderData;

  const images = Array.from({ length: 6 }, (_, i) => {
    const isLandscape = i % 2 === 0;
    const width = isLandscape ? 800 : 600;
    const height = isLandscape ? 600 : 800;
    return `https://picsum.photos/seed/${i + 1}/${width}/${height}`;
  });

  return (
    <div>
      <div className="grid grid-cols-6 h-full">
        <div className="flex flex-col  h-full col-span-6">
          <Hero
            title="최고의 아티스트와 함께 나만의 작품을 만들어보세요"
            subtitle="마음에 드는 아티스트를 찾아 당신만의 특별한 작품을 제작하세요"
          />
        </div>
        <section id="photos" className="col-span-6">
          <div className="columns-2 gap-4 sm:columns-3">
            {images.map((imageUrl, idx) => (
              <BlurFade key={imageUrl} delay={0.25 + idx * 0.05} inView>
                <img
                  className="mb-4 size-full rounded-lg object-contain"
                  src={imageUrl}
                  alt={`Random stock image ${idx + 1}`}
                />
              </BlurFade>
            ))}
          </div>
        </section>

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
      {/* <div>
        <h1 className="font-bold text-3xl my-5">Artist of the Week</h1>
        <div className="grid grid-cols-4 gap-10 ">
          {featuredCommissions.map((commission) => (
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
      </div> */}
    </div>
  );
}
