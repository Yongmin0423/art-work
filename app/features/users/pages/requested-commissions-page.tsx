import { getLoggedInUser } from "~/features/community/queries";
import { getRequestedOrders } from "~/features/commissions/queries";
import { cancelOrder } from "~/features/commissions/mutations";
import { makeSSRClient } from "~/supa-client";
import { redirect } from "react-router";
import type { Route } from "./+types/requested-commissions-page";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Form } from "react-router";
import { MoreVertical } from "lucide-react";

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

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const user = await getLoggedInUser(client);

  if (!user) {
    throw new Response("로그인이 필요합니다.", { status: 401 });
  }

  const formData = await request.formData();
  const orderId = formData.get("orderId");
  const actionType = formData.get("action");

  if (actionType === "cancel" && orderId) {
    try {
      await cancelOrder(client, {
        orderId: Number(orderId),
        userId: user.profile_id,
      });

      return redirect("/my/commissions/requested?success=cancelled");
    } catch (error) {
      console.error("주문 취소 중 오류:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "주문 취소 중 오류가 발생했습니다";
      return redirect(
        `/my/commissions/requested?error=${encodeURIComponent(errorMessage)}`
      );
    }
  }

  return redirect("/my/commissions/requested");
};

const getOrderStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline">대기 중</Badge>;
    case "accepted":
      return <Badge variant="default">승인됨</Badge>;
    case "in_progress":
      return <Badge variant="secondary">진행 중</Badge>;
    case "revision_requested":
      return <Badge variant="outline">수정 요청</Badge>;
    case "completed":
      return <Badge variant="default">완료</Badge>;
    case "cancelled":
      return <Badge variant="destructive">취소됨</Badge>;
    case "refunded":
      return <Badge variant="destructive">환불됨</Badge>;
    case "disputed":
      return <Badge variant="destructive">분쟁 중</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
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
        {orders.map((order) => {
          const canCancel = ["pending", "accepted"].includes(order.status);

          return (
            <div key={order.order_id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{order.commission?.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    아티스트: {order.artist?.name} (@{order.artist?.username})
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {getOrderStatusBadge(order.status)}
                    <span className="text-sm">
                      ₩{order.total_price?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    주문일:{" "}
                    {new Date(order.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">주문 관리</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>주문 상세보기</DropdownMenuItem>
                    {canCancel && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Form
                            method="post"
                            onSubmit={(e) => {
                              if (
                                !confirm("정말로 이 주문을 취소하시겠습니까?")
                              ) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="action" value="cancel" />
                            <input
                              type="hidden"
                              name="orderId"
                              value={order.order_id}
                            />
                            <button type="submit" className="w-full text-left">
                              주문 취소
                            </button>
                          </Form>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
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
