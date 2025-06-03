import { Hero } from "~/components/hero";
import { ReviewCard } from "../components/review-card";
import type { Route } from "./+types/reviews";
import { getReviews } from "../queries";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "후기 | artwork" },
    {
      name: "description",
      content: "작가님의 작품 후기를 확인하세요.",
    },
  ];
};

export const loader = async () => {
  const reviews = await getReviews();
  return { reviews };
};

export default function IdeasPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-20">
      <Hero title="후기" subtitle="작가님의 작품 후기를 확인하세요." />
      <div className="grid grid-cols-4 gap-4">
        {loaderData.reviews.map((review) => (
          <ReviewCard
            key={review.review_id}
            reviewId={review.review_id}
            title={review.title}
            artist={review.artist_profile.name}
            views={review.views_count}
            timeAgo={review.created_at}
            rating={review.rating}
            image={review.image_url}
            description={review.description}
            writer={review.reviewer_profile.name}
          />
        ))}
      </div>
    </div>
  );
}
