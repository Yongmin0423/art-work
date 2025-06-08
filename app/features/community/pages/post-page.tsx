import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import type { Route } from "./+types/post-page";
import { Form, Link } from "react-router";
import { ChevronUpIcon, DotIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Reply } from "~/features/community/components/reply";
import { getPost } from "../queries";
import { DateTime } from "luxon";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = ({ params }) => {
  return [{ title: `${params.postId} | wemake` }];
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const post = await getPost(client, { postId: params.postId });

  return { post };
};

export default function PostPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/community">Community</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/community?topic=${loaderData.post.topics.slug}`}>
                {loaderData.post.topics.slug}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/community/${loaderData.post.post_id}`}>
                {loaderData.post.title}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-6 gap-40 items-start">
        <div className="col-span-4 space-y-10">
          <div className="flex w-full items-start gap-10">
            <Button variant="outline" className="flex flex-col h-14">
              <ChevronUpIcon className="size-4 shrink-0" />
              <span>10</span>
            </Button>
            <div className="space-y-20">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">{loaderData.post.title}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{loaderData.post.profiles.name}</span>
                  <DotIcon className="size-5" />
                  <span>
                    {DateTime.fromISO(loaderData.post.created_at, {
                      zone: "utc",
                    }).toRelative({ unit: "hours" })}
                  </span>
                  <DotIcon className="size-5" />
                  <span>{loaderData.post.replies_count} replies</span>
                </div>
                <p className="text-muted-foreground w-3/4">
                  {loaderData.post.content}
                </p>
              </div>
              <Form className="flex items-start gap-5 w-3/4">
                <Avatar className="size-14">
                  <AvatarFallback>N</AvatarFallback>
                  <AvatarImage src="https://github.com/serranoarevalo.png" />
                </Avatar>
                <div className="flex flex-col gap-5 items-end w-full">
                  <Textarea
                    placeholder="Write a reply"
                    className="w-full resize-none"
                    rows={5}
                  />
                  <Button>Reply</Button>
                </div>
              </Form>
              <div className="space-y-10">
                <h4 className="font-semibold">10 Replies</h4>
                <div className="flex flex-col gap-5">
                  <Reply
                    username="Nicolas"
                    avatarUrl="https://github.com/serranoarevalo.png"
                    content="I've been using Todoist for a while now, and it's really great. It's simple, easy to use, and has a lot of features."
                    timestamp="12 hours ago"
                    topLevel
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <aside className="col-span-2 space-y-5 border rounded-lg p-6 shadow-sm">
          <div className="flex gap-5">
            <Avatar className="size-14">
              <AvatarFallback>
                {loaderData.post.profiles.name?.[0] || "U"}
              </AvatarFallback>
              {loaderData.post.profiles.avatar_url && (
                <AvatarImage src={loaderData.post.profiles.avatar_url} />
              )}
            </Avatar>
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-bold">
                {loaderData.post.profiles.name}
              </h4>
              <Badge variant="secondary">{loaderData.post.topics.name}</Badge>
              <div className="flex items-center gap-4 text-sm">
                <span>👥 {loaderData.post.profiles.followers_count || 0}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            {loaderData.post.profiles.job_title && (
              <div className="flex items-center gap-2">
                <span>💼</span>
                <span>{loaderData.post.profiles.job_title}</span>
              </div>
            )}
            {loaderData.post.profiles.location && (
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{loaderData.post.profiles.location}</span>
              </div>
            )}
            {loaderData.post.profiles.website && (
              <div className="flex items-center gap-2">
                <span>🌐</span>
                <a
                  href={loaderData.post.profiles.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {loaderData.post.profiles.website}
                </a>
              </div>
            )}
          </div>
          {loaderData.post.profiles.bio && (
            <div className="text-sm text-muted-foreground">
              <p>{loaderData.post.profiles.bio}</p>
            </div>
          )}
          <Button variant="outline" className="w-full">
            Follow
          </Button>
        </aside>
      </div>
      <aside className="col-span-2"></aside>
    </div>
  );
}
