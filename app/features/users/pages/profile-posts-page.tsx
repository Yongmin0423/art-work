import type { Route } from './+types/profile-posts-page';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Posts | wemake' }];
};

export default function ProfilePostsPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* {Array.from({ length: 5 }).map((_, index) => (
        <PostCard
          key={`postId-${index}`}
          postId={`postId-${index}`}
          title="What is the best productivity tool?"
          author="Nico"
          authorAvatarUrl="https://github.com/apple.png"
          category="Productivity"
          timeAgo="12 hours ago"
          expanded
        />
      ))} */}
    </div>
  );
}
