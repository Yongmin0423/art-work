import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/dashboard-recieved-commissions";
import { getLoggedInUser } from "~/features/community/queries";
import { getRequestedOrders } from "~/features/commissions/queries";

export const meta: Route.MetaFunction = () => {
  return [{ title: "My Commissions | wemake" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const user = await getLoggedInUser(client);
  if (!user) {
    throw new Response("로그인이 필요합니다.", { status: 401 });
  }
  const commissions = await getRequestedOrders(client, {
    profileId: user.profile_id,
  });
  return { user, commissions };
};

export default function DashboardIdeasPage({
  loaderData,
}: Route.ComponentProps) {
  const { user, commissions } = loaderData;
  return (
    <div className="space-y-5 h-full">
      <h1 className="text-2xl font-semibold mb-6">Claimed Commissions</h1>
      <div className="grid grid-cols-4 gap-6"></div>
    </div>
  );
}
