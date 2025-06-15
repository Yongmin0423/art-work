import ArtistCard from "../components/artist-card";
import CommissionsPagination from "../components/commissions-pagination";
import { getCommissionsByCategory } from "../queries";
import type { Route } from "./+types/category";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Character Commission" }];
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const category = params.category;
  const { client, headers } = makeSSRClient(request);
  const commissions = await getCommissionsByCategory(client, category);
  return { commissions };
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
      <div className="flex justify-center mt-8 md:mt-10">
        <CommissionsPagination totalPages={10} />
      </div>
    </div>
  );
}
