import { Link, useOutletContext } from "react-router";
import { Button } from "~/components/ui/button";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { makeSSRClient } from "~/supa-client";
import { getUserPortfolio } from "../queries";
import type { Route } from "./+types/profile-portfolio-page";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const portfolio = await getUserPortfolio(client, {
    username: params.username as string,
  });
  return { portfolio };
};

export const meta: Route.MetaFunction = ({ params }) => {
  return [{ title: `${params.username}'s Portfolio | wemake` }];
};

export default function ProfilePortfolioPage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { isLoggedIn, username } = useOutletContext<{
    isLoggedIn: boolean;
    username: string;
  }>();

  const portfolio = (loaderData as any)?.portfolio || [];
  const isOwner = isLoggedIn && username === params.username;

  if (!portfolio || portfolio.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="space-y-4">
          <div className="text-4xl">🎨</div>
          <h3 className="text-xl font-semibold">No portfolio items yet</h3>
          <p className="text-muted-foreground">
            {isOwner
              ? "Start building your portfolio by adding your first project"
              : "This artist hasn't uploaded any portfolio items yet."}
          </p>
          {isOwner && (
            <Button asChild className="mt-4">
              <Link to="/my/portfolio/new">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Your First Project
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      {isOwner && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">My Portfolio</h2>
            <p className="text-muted-foreground">Showcase your best work</p>
          </div>
          <Button asChild>
            <Link to="/my/portfolio/new">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Project
            </Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item: any) => (
          <div
            key={item.artist_id}
            className="group cursor-pointer rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-square relative overflow-hidden">
              {item.images &&
              Array.isArray(item.images) &&
              item.images.length > 0 ? (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">🖼️</span>
                </div>
              )}
              {item.category && (
                <div className="absolute top-2 left-2">
                  <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {item.category}
                  </span>
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold line-clamp-1 flex-1">
                  {item.title}
                </h3>
                {isOwner && (
                  <div className="flex items-center gap-1 ml-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/my/portfolio/${item.artist_id}/edit`}>
                        <EditIcon className="w-3 h-3" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              )}
              {item.tags &&
                Array.isArray(item.tags) &&
                item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{item.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                <span>{item.views_count} views</span>
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
