import { Form, Link, NavLink, Outlet, useOutletContext } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/profile-layout";
import { makeSSRClient } from "~/supa-client";
import { getUserProfile } from "../queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  try {
    const user = await getUserProfile(client, {
      username: params.username as string,
    });
    return { user };
  } catch (error) {
    throw new Response("User not found", { status: 404 });
  }
};

export default function ProfileLayout({
  loaderData,
  params,
}: Route.ComponentProps & { params: { username: string } }) {
  const { isLoggedIn, username } = useOutletContext<{
    isLoggedIn: boolean;
    username: string;
  }>();

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-10">
      {/* Profile Header */}
      <div className="flex items-start gap-6">
        <Avatar className="size-32">
          <AvatarImage
            src={loaderData.user.avatar_url || ""}
            alt={loaderData.user.name}
          />
          <AvatarFallback>{loaderData.user.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{loaderData.user.name}</h1>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>@{loaderData.user.username}</span>
            {loaderData.user.job_title && (
              <>
                <span>•</span>
                <span>{loaderData.user.job_title}</span>
              </>
            )}
            {loaderData.user.location && (
              <>
                <span>•</span>
                <span>{loaderData.user.location}</span>
              </>
            )}
          </div>

          {loaderData.user.bio && (
            <p className="text-foreground max-w-2xl">{loaderData.user.bio}</p>
          )}

          {loaderData.user.website && (
            <a
              href={loaderData.user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {loaderData.user.website}
            </a>
          )}

          <div className="flex items-center gap-4 text-sm">
            <span>
              <strong>{formatNumber(loaderData.user.stats.followers)}</strong>{" "}
              followers
            </span>
            <span>
              <strong>{formatNumber(loaderData.user.stats.following)}</strong>{" "}
              following
            </span>
            {/*나중에 기능 구현 예정 */}
            {/* <span>
              <strong>{formatNumber(loaderData.user.stats.views)}</strong>{" "}
              profile views
            </span> */}
          </div>

          <div className="flex gap-3">
            {isLoggedIn && username === params.username ? (
              <Button variant="outline" asChild>
                <Link to="/my/settings">Edit profile</Link>
              </Button>
            ) : null}
            {!isLoggedIn ? (
              <>
                <Button
                  variant={loaderData.user.isFollowing ? "outline" : "default"}
                >
                  {loaderData.user.isFollowing ? "Following" : "Follow"}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Message</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Message</DialogTitle>
                      <DialogDescription>
                        Send a message to {loaderData.user.name}
                      </DialogDescription>
                    </DialogHeader>
                    <Form className="space-y-4">
                      <Textarea
                        placeholder="Write your message..."
                        className="resize-none"
                        rows={4}
                        name="message"
                        required
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                        <Button type="submit">Send Message</Button>
                      </div>
                    </Form>
                  </DialogContent>
                </Dialog>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="flex gap-1">
          {[
            { label: "About", to: `/users/${loaderData.user.username}` },
            {
              label: "Commissions",
              to: `/users/${loaderData.user.username}/commissions`,
            },
            {
              label: "Portfolio",
              to: `/users/${loaderData.user.username}/portfolio`,
            },
            { label: "Posts", to: `/users/${loaderData.user.username}/posts` },
            {
              label: "Reviews",
              to: `/users/${loaderData.user.username}/reviews`,
            },
          ].map((item) => (
            <NavLink
              end
              key={item.label}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-border transition-colors",
                  isActive && "border-primary text-primary"
                )
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl">
        <Outlet context={{ isLoggedIn, username }} />
      </div>
    </div>
  );
}
