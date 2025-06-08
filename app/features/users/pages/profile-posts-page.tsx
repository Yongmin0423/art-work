import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/profile-posts-page";
import { getPostsByUsername } from "~/features/community/queries";
import { PostCard } from "~/features/community/components/post-card";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Posts | wemake" }];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const posts = await getPostsByUsername(client, {
    username: params.username as string,
  });
  return { posts };
};

export default function ProfilePostsPage({ loaderData }: Route.ComponentProps) {
  if (!loaderData.posts || loaderData.posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="space-y-4">
          <div className="text-4xl">💬</div>
          <h3 className="text-xl font-semibold">포스트가 존재하지 않습니다</h3>
          <p className="text-muted-foreground">
            아직 작성한 게시글이 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {loaderData.posts.map((post) => (
        <PostCard
          key={post.post_id}
          postId={post.post_id.toString()}
          title={post.title}
          author={post.profiles.name}
          authorAvatarUrl={post.profiles.avatar_url}
          category={post.topics.name}
          timeAgo={post.created_at}
          expanded
        />
      ))}
    </div>
  );
}
