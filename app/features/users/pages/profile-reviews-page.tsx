// import { ProductCard } from '~/features/products/components/product-card';
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/profile-reviews-page";
import { getReviewsByUsername } from "~/features/reviews/queries";
import { ReviewCard } from "~/features/reviews/components/review-card";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Reviews | wemake" }];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const reviews = await getReviewsByUsername(client, {
    username: params.username as string,
  });
  return { reviews };
};
export default function ProfileReviewsPage({
  loaderData,
}: Route.ComponentProps) {
  if (!loaderData.reviews || loaderData.reviews.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="space-y-4">
          <div className="text-4xl">📝</div>
          <h3 className="text-xl font-semibold">리뷰가 존재하지 않습니다</h3>
          <p className="text-muted-foreground">아직 작성한 리뷰가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {loaderData.reviews.map((review) => (
        <ReviewCard
          key={review.review_id}
          reviewId={review.review_id}
          title={review.title}
          artist={review.artist.name}
          views={review.views_count}
          timeAgo={review.created_at}
          rating={review.rating}
          image={review.image_url}
          description={review.description}
          writer={review.reviewer.name}
        />
      ))}
    </div>
  );
}
