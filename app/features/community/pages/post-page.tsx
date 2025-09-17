import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import type { Route } from "./+types/post-page";
import { Form, Link, useOutletContext } from "react-router";
import { useDebouncedFetcher } from "~/hooks/use-debounced-fetcher";
import { ChevronUpIcon, DotIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Reply } from "~/features/community/components/reply";
import { getLoggedInUser, getPostById, getReplies } from "../queries";
import { DateTime } from "luxon";
import { makeSSRClient } from "~/supa-client";
import { z } from "zod";
import { createReply } from "../mutations";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

export const meta: Route.MetaFunction = ({ params }) => {
  return [{ title: `${params.postId} | wemake` }];
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const post = await getPostById(client, { postId: params.postId });
  const replies = await getReplies(client, { postId: params.postId });

  return { post, replies };
};

const formSchema = z.object({
  reply: z.string().min(1),
  topLevelId: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .optional(),
});

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const user = await getLoggedInUser(client);
  if (!user) {
    return { error: "로그인이 필요합니다." };
  }
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return { formErrors: error?.flatten().fieldErrors };
  }
  const { reply, topLevelId } = data;
  await createReply(client, {
    postId: params.postId,
    reply,
    userId: user.profile_id,
    topLevelId: topLevelId,
  });
  return { ok: true };
};

export default function PostPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const fetcher = useDebouncedFetcher(300);
  const [optimisticUpvotesCount, setOptimisticUpvotesCount] = useState(loaderData.post.upvotes_count || 0);
  const [optimisticIsUpvoted, setOptimisticIsUpvoted] = useState(loaderData.post.is_upvoted);
  
  // 원본 상태 보관 (실패시 롤백용)
  const [originalUpvotesCount] = useState(loaderData.post.upvotes_count || 0);
  const [originalIsUpvoted] = useState(loaderData.post.is_upvoted);

  // API 요청 실패시 상태 롤백
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.error) {
      setOptimisticUpvotesCount(originalUpvotesCount);
      setOptimisticIsUpvoted(originalIsUpvoted);
    }
  }, [fetcher.state, fetcher.data, originalUpvotesCount, originalIsUpvoted]);
  const { isLoggedIn, name, username, avatarUrl } = useOutletContext<{
    isLoggedIn: boolean;
    name: string;
    username: string;
    avatarUrl: string;
  }>();
  const formRef = useRef<HTMLFormElement>(null);
  
  const handleUpvoteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newIsUpvoted = !optimisticIsUpvoted;
    const newUpvotesCount = newIsUpvoted ? optimisticUpvotesCount + 1 : optimisticUpvotesCount - 1;
    
    setOptimisticIsUpvoted(newIsUpvoted);
    setOptimisticUpvotesCount(newUpvotesCount);
    
    fetcher.debouncedSubmit(null, {
      method: "post",
      action: `/community/${loaderData.post.post_id}/upvote`,
    });
  };

  useEffect(() => {
    if (actionData?.ok) {
      formRef.current?.reset();
    }
  }, [actionData?.ok]);

  return (
    <div className="space-y-10">
      <Breadcrumb>
        <BreadcrumbList className="flex-wrap">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/community">Community</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/community?topic=${loaderData.post.topic_slug}`}>
                {loaderData.post.topic_slug}
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
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 lg:gap-40 items-start">
        <div className="col-span-1 lg:col-span-4 space-y-10">
          <div className="flex w-full items-start gap-4 sm:gap-10">
            <Button
              onClick={handleUpvoteClick}
              variant={optimisticIsUpvoted ? "default" : "outline"}
              className={cn(
                "flex flex-col h-14",
                optimisticIsUpvoted
                  ? "border-primary bg-primary text-primary-foreground"
                  : ""
              )}
            >
              <ChevronUpIcon className="size-4 shrink-0" />
              <span>{optimisticUpvotesCount}</span>
            </Button>
            <div className="w-full space-y-10 sm:space-y-20">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {loaderData.post.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{loaderData.post.author_name}</span>
                  <DotIcon className="size-5" />
                  <span>
                    {(() => {
                      const postTime = DateTime.fromISO(
                        loaderData.post.created_at!,
                        { zone: "utc" }
                      );
                      const now = DateTime.now();
                      const diff = now.diff(postTime);

                      if (diff.as("minutes") < 60) {
                        return postTime.toRelative({ unit: "minutes" });
                      } else if (diff.as("hours") < 24) {
                        return postTime.toRelative({ unit: "hours" });
                      } else if (diff.as("days") < 30) {
                        return postTime.toRelative({ unit: "days" });
                      } else if (diff.as("months") < 12) {
                        return postTime.toRelative({ unit: "months" });
                      } else {
                        return postTime.toRelative({ unit: "years" });
                      }
                    })()}
                  </span>
                  <DotIcon className="size-5" />
                  <span>{loaderData.post.replies_count} replies</span>
                </div>
                <p className="text-muted-foreground w-full sm:w-3/4">
                  {loaderData.post.content}
                </p>
              </div>
              {isLoggedIn ? (
                <Form
                  ref={formRef}
                  className="flex flex-col sm:flex-row items-start gap-5 w-full sm:w-3/4"
                  method="post"
                >
                  <Avatar className="size-10 sm:size-14">
                    <AvatarFallback>{name?.[0]}</AvatarFallback>
                    <AvatarImage src={avatarUrl} />
                  </Avatar>
                  <div className="flex flex-col gap-5 items-end w-full">
                    <Textarea
                      name="reply"
                      placeholder="Write a reply"
                      className="w-full resize-none"
                      rows={5}
                    />
                    <Button>Reply</Button>
                  </div>
                </Form>
              ) : null}
              <div className="space-y-10">
                <h4 className="font-semibold">
                  {loaderData.post.replies_count} Replies
                </h4>
                {loaderData.replies.map((reply) => (
                  <Reply
                    key={reply.post_reply_id}
                    name={reply.user.name}
                    username={reply.user.username}
                    avatarUrl={reply.user.avatar_url}
                    content={reply.reply}
                    timestamp={reply.created_at}
                    topLevel={true}
                    topLevelId={reply.post_reply_id}
                    replies={reply.post_replies}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <aside className="col-span-1 lg:col-span-2 space-y-5 order-first lg:order-last bg-muted/10 p-5 rounded-lg lg:bg-transparent lg:p-0">
          <div className="flex gap-5">
            <Avatar className="size-10 sm:size-14">
              <AvatarFallback>
                {loaderData.post.author_name?.[0] || "U"}
              </AvatarFallback>
              {loaderData.post.author_avatar && (
                <AvatarImage src={loaderData.post.author_avatar} />
              )}
            </Avatar>
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-bold">
                {loaderData.post.author_name}
              </h4>
              <Badge variant="secondary">{loaderData.post.topic_name}</Badge>
              <div className="flex items-center gap-4 text-sm">
                <span>👥 {loaderData.post.followers_count || 0}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            {loaderData.post.job_title && (
              <div className="flex items-center gap-2">
                <span>💼</span>
                <span>{loaderData.post.job_title}</span>
              </div>
            )}
            {loaderData.post.location && (
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{loaderData.post.location}</span>
              </div>
            )}
            {loaderData.post.website && (
              <div className="flex items-center gap-2">
                <span>🌐</span>
                <a
                  href={loaderData.post.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {loaderData.post.website}
                </a>
              </div>
            )}
          </div>
          {loaderData.post.bio && (
            <div className="text-sm text-muted-foreground">
              <p>{loaderData.post.bio}</p>
            </div>
          )}
          <Button variant="outline" className="w-full">
            Follow
          </Button>
        </aside>
      </div>
    </div>
  );
}
