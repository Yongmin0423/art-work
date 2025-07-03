import { columns } from "../components/orders-table/columns";
import { DataTable } from "../components/orders-table/data-table";
import type { Route } from "./+types/admin-orders-page";
import { makeSSRClient } from "~/supa-client";
import { getAllOrders } from "~/features/commissions/queries";
import { getLoggedInUser } from "~/features/community/queries";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Admin - Orders | artwork" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);

  // 관리자 권한 확인
  const user = await getLoggedInUser(client);
  if (!user || user.role !== "admin") {
    throw new Response("관리자 권한이 필요합니다.", { status: 403 });
  }

  // 모든 orders 가져오기
  const orders = await getAllOrders(client);

  return { orders };
};

export default function AdminOrdersPage({ loaderData }: Route.ComponentProps) {
  const { orders } = loaderData;

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">
            모든 주문들을 관리하세요. (총 {orders.length}개)
          </p>
        </div>

        {orders.length > 0 ? (
          <DataTable columns={columns} data={orders} />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">등록된 주문이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
