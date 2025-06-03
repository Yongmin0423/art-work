import { DotIcon, HeartIcon } from "lucide-react";
import { EyeIcon } from "lucide-react";
import { Hero } from "~/components/hero";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import type { Route } from "./+types/review-page";
import { getReview } from "../queries";
import { DateTime } from "luxon";

export const meta = () => {
  return [
    { title: `IdeasGPT | wemake` },
    {
      name: "description",
      content: "Find ideas for your next project",
    },
  ];
};

export const loader = async ({ params }: Route.LoaderArgs) => {
  const review = await getReview({ reviewId: Number(params.reviewId) });
  console.log(review);
  return { review };
};

export default function ReviewPage({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <Hero title={loaderData.review.title} />
      <div className="flex items-center gap-10">
        <div className="flex flex-col items-center">
          <img
            className="rounded-2xl w-2/3"
            src={loaderData.review.image_url}
          />
          <div className="border-2 border-gray-200 rounded-lg p-5 mt-5">
            <Link
              to={`/commissions/artist/${loaderData.review.artist_profile.name}`}
            >
              <div className="flex gap-5">
                <Avatar className="size-14">
                  <AvatarFallback>
                    {loaderData.review.artist_profile.name[0]}
                  </AvatarFallback>
                  {loaderData.review.artist_profile.avatar_url && (
                    <AvatarImage
                      src={loaderData.review.artist_profile.avatar_url}
                    />
                  )}
                </Avatar>
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-bold">
                    {loaderData.review.artist_profile.name}
                  </h4>
                  <div className="flex gap-5">
                    {loaderData.review.artist_profile.specialties &&
                      loaderData.review.artist_profile.specialties.map(
                        (tag: string) => (
                          <Badge key={tag} variant={"secondary"}>
                            #{tag}
                          </Badge>
                        )
                      )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>⭐ {loaderData.review.artist_avg_rating}</span>
                    <span>❤️ {loaderData.review.likes_count}</span>
                  </div>
                  <p
                    className={`font-semibold ${
                      loaderData.review.artist_profile.commission_status ===
                      "available"
                        ? "text-green-600 border border-green-600 text-center rounded-full px-2"
                        : loaderData.review.artist_profile.commission_status ===
                          "pending"
                        ? "text-yellow-600 border border-yellow-600 text-center rounded-full px-2"
                        : "text-red-600 border border-red-600 text-center rounded-full px-2"
                    }`}
                  >
                    커미션 {loaderData.review.artist_profile.commission_status}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="max-w-screen-sm mx-auto flex flex-col items-center gap-10">
          <p className="italic text-center">{loaderData.review.description}</p>
          <p>{loaderData.review.reviewer_profile.name}</p>
          <div className="flex items-center text-sm">
            <div className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              <span>{loaderData.review.views_count}</span>
            </div>
            <DotIcon className="w-4 h-4" />
            <span>
              {DateTime.fromISO(loaderData.review.created_at).toRelative()}
            </span>
            <DotIcon className="w-4 h-4" />
            <Button variant="outline">
              <HeartIcon className="w-4 h-4" />
              <span>12</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
