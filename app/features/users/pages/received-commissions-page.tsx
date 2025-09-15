import { getLoggedInUser } from "~/features/community/queries";
import type { Route } from "./+types/received-commissions-page";
import { makeSSRClient } from "~/supa-client";
import { getReceivedOrders } from "~/features/commissions/queries";
import { Link } from "react-router";

export const meta: Route.MetaFunction = () => {
  return [{ title: "받은 주문 - Artwork" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  const user = await getLoggedInUser(client);
  if (!user) {
    throw new Response("로그인이 필요합니다.", { status: 401 });
  }

  const orders = await getReceivedOrders(client, {
    profileId: user.profile_id,
  });

  return { orders };
};

export default function ReceivedCommissionsPage({
  loaderData,
}: Route.ComponentProps) {
  const { orders } = loaderData;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">받은 주문</h1>
      <p className="mt-4 text-muted-foreground">
        총 {orders.length}개의 주문이 있습니다.
      </p>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <Link
            key={order.order_id}
            to={`/my/commissions/received/${order.order_id}`}
            className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold">{order.commission?.title}</h3>
            <p className="text-sm text-muted-foreground">
              주문자: {order.client.name} (@{order.client.username})
            </p>
            <p className="text-sm">
              상태: {order.status} | 가격: ₩
              {order.total_price?.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              주문일: {new Date(order.created_at).toLocaleDateString("ko-KR")}
            </p>
          </Link>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">아직 받은 주문이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
