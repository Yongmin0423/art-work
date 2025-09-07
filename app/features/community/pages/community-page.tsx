import { Hero } from "~/components/hero";
import { Form, Link, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { PERIOD_OPTIONS, SORT_OPTIONS } from "../constants";
import { Input } from "~/components/ui/input";
import { PostCard } from "../components/post-card";
import { getPosts, getTopics } from "../queries";
import type { Route } from "./+types/community-page";
import { makeSSRClient } from "~/supa-client";

export const meta = () => {
  return [{ title: "Community | wemake" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const posts = await getPosts(client);
  const topics = await getTopics(client);
  return { posts, topics };
};

export default function CommunityPage({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sorting = searchParams.get("sorting") || "newest";
  const period = searchParams.get("period") || "all";
  return (
    <div className="px-10 pb-10 md:px-0 md:pb-0 space-y-20">
      <Hero
        title="커뮤니티"
        subtitle="다른 사람들과 소통하고, 받은 작품을 공유해보세요."
      />
      <div className="grid grid-cols-1 lg:grid-cols-6 items-start gap-10 lg:gap-40">
        <div className="col-span-1 lg:col-span-4 space-y-10">
          <div className="flex flex-col sm:flex-row justify-between gap-5">
            <div className="space-y-5 w-full">
              <div className="flex flex-wrap items-center gap-5">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <span className="text-sm capitalize">{sorting}</span>
                    <ChevronDownIcon className="size-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {SORT_OPTIONS.map((option) => (
                      <DropdownMenuCheckboxItem
                        className="capitalize cursor-pointer"
                        key={option}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            searchParams.set("sorting", option);
                            setSearchParams(searchParams);
                          }
                        }}
                      >
                        {option}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {sorting === "popular" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      <span className="text-sm capitalize">{period}</span>
                      <ChevronDownIcon className="size-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {PERIOD_OPTIONS.map((option) => (
                        <DropdownMenuCheckboxItem
                          className="capitalize cursor-pointer"
                          key={option}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              searchParams.set("period", option);
                              setSearchParams(searchParams);
                            }
                          }}
                        >
                          {option}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <Form className="w-full sm:w-2/3">
                <Input
                  type="text"
                  name="search"
                  placeholder="Search for discussions"
                />
              </Form>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link to={`/community/create`}>새로운 글 작성하기</Link>
            </Button>
          </div>
          <div className="space-y-5">
            {loaderData.posts.map((post) => (
              <PostCard
                key={post.post_id}
                postId={post.post_id.toString()}
                title={post.title}
                author={post.author}
                authorAvatarUrl={post.author_avatar}
                category={post.topic}
                timeAgo={post.created_at}
                expanded
                votesCount={post.upvotes}
              />
            ))}
          </div>
        </div>
        <aside className="col-span-1 lg:col-span-2 space-y-5 order-first lg:order-last bg-muted/10 p-5 rounded-lg lg:bg-transparent lg:p-0">
          <span className="text-sm font-bold text-muted-foreground uppercase">
            Topics
          </span>
          <div className="flex flex-row flex-wrap lg:flex-col gap-2 items-start">
            {loaderData.topics.map((category) => (
              <Button
                asChild
                variant={"link"}
                key={category.slug}
                className="pl-0"
              >
                <Link to={`/community?topic=${category.slug}`}>
                  {category.name}
                </Link>
              </Button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
