import { getLoggedInUser } from "~/features/community/queries";
import { getRequestedOrders } from "~/features/commissions/queries";
import { makeSSRClient } from "~/supa-client";
import type { Route } from "./+types/requested-commissions-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "의뢰한 커미션 - Artwork" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const user = await getLoggedInUser(client);
  if (!user) {
    throw new Response("로그인이 필요합니다.", { status: 401 });
  }

  const orders = await getRequestedOrders(client, {
    profileId: user.profile_id,
  });

  return { orders, user };
};

export default function RequestedCommissionsPage({
  loaderData,
}: Route.ComponentProps) {
  const { orders, user } = loaderData;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">의뢰한 커미션</h1>
      <p className="mt-4 text-muted-foreground">
        총 {orders.length}개의 주문이 있습니다.
      </p>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order.order_id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{order.commission?.title}</h3>
            <p className="text-sm text-muted-foreground">
              아티스트: {order.artist?.name} (@{order.artist?.username})
            </p>
            <p className="text-sm">
              상태: {order.status} | 가격: ₩
              {order.total_price?.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              주문일: {new Date(order.created_at).toLocaleDateString("ko-KR")}
            </p>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            아직 의뢰한 커미션이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
