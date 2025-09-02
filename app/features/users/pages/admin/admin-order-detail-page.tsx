import { data } from "react-router";
import { makeSSRClient } from "app/supa-client";
import { getOrderById } from "app/features/commissions/queries";
import { updateOrderStatus } from "app/features/commissions/mutations";
import { Button } from "app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "app/components/ui/card";
import { Badge } from "app/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "app/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "app/components/ui/select";
import { useState } from "react";
import type { Route } from "./+types/admin-order-detail-page";

export async function loader({ params, request }: Route.LoaderArgs) {
  const orderId = params.orderId;

  if (!orderId) {
    throw data("주문 ID가 필요합니다.", { status: 400 });
  }

  const { client: supabase } = makeSSRClient(request);

  try {
    const order = await getOrderById(supabase, { orderId: parseInt(orderId) });

    return {
      order,
    };
  } catch (error) {
    console.error("주문 로드 오류:", error);
    throw data("주문을 불러오는데 실패했습니다.", { status: 500 });
  }
}

export async function action({ params, request }: Route.ActionArgs) {
  const orderId = params.orderId;

  if (!orderId) {
    throw data("주문 ID가 필요합니다.", { status: 400 });
  }

  const formData = await request.formData();
  const status = formData.get("status") as string;

  if (!status) {
    throw data("상태가 필요합니다.", { status: 400 });
  }

  const { client: supabase } = makeSSRClient(request);

  try {
    await updateOrderStatus(supabase, {
      orderId: parseInt(orderId),
      status: status as any,
    });

    return data({ success: true }, { status: 200 });
  } catch (error) {
    console.error("주문 상태 업데이트 오류:", error);
    throw data("주문 상태 업데이트에 실패했습니다.", { status: 500 });
  }
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `주문 상세 - 관리자` },
    { name: "description", content: "관리자 주문 상세 페이지" },
  ];
}

const statusMap = {
  pending: { label: "대기 중", color: "bg-yellow-500" },
  accepted: { label: "수락됨", color: "bg-blue-500" },
  in_progress: { label: "진행 중", color: "bg-purple-500" },
  revision_requested: { label: "수정 요청", color: "bg-orange-500" },
  completed: { label: "완료", color: "bg-green-500" },
  cancelled: { label: "취소됨", color: "bg-gray-500" },
  refunded: { label: "환불됨", color: "bg-red-500" },
  disputed: { label: "분쟁", color: "bg-pink-500" },
};

type OrderStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "revision_requested"
  | "completed"
  | "cancelled"
  | "refunded"
  | "disputed";

export default function AdminOrderDetailPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { order } = loaderData;
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status as OrderStatus
  );

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus as OrderStatus);

    const form = new FormData();
    form.append("status", newStatus);

    // Form submit trigger
    const formElement = document.createElement("form");
    formElement.method = "POST";
    formElement.style.display = "none";

    const statusInput = document.createElement("input");
    statusInput.name = "status";
    statusInput.value = newStatus;

    formElement.appendChild(statusInput);
    document.body.appendChild(formElement);
    formElement.submit();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">주문 상세</h1>
        <Badge
          className={statusMap[order.status as keyof typeof statusMap].color}
        >
          {statusMap[order.status as keyof typeof statusMap].label}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 주문 개요 */}
        <Card>
          <CardHeader>
            <CardTitle>주문 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">주문 ID</p>
              <p className="font-medium">#{order.order_id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">총 가격</p>
              <p className="font-medium text-lg">
                ₩{order.total_price?.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">주문 날짜</p>
              <p className="font-medium">
                {new Date(order.created_at).toLocaleString("ko-KR")}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">상태 변경</p>
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusMap).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 커미션 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>커미션 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">제목</p>
              <p className="font-medium">{order.commission?.title}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">카테고리</p>
              <p className="font-medium">{order.commission?.category}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">시작 가격</p>
              <p className="font-medium">
                ₩{order.commission?.price_start?.toLocaleString()}
              </p>
            </div>

            {order.commission?.images &&
              Array.isArray(order.commission.images) &&
              order.commission.images.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">미리보기</p>
                  <img
                    src={(order.commission.images as string[])[0]}
                    alt={order.commission.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}
          </CardContent>
        </Card>

        {/* 클라이언트 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>클라이언트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={order.client?.avatar_url || undefined} />
                <AvatarFallback>
                  {order.client?.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{order.client?.name}</p>
                <p className="text-sm text-gray-500">
                  @{order.client?.username}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 아티스트 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>아티스트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={order.artist?.avatar_url || undefined} />
                <AvatarFallback>
                  {order.artist?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{order.artist?.name}</p>
                <p className="text-sm text-gray-500">
                  @{order.artist?.username}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 선택된 옵션 */}
      {order.selected_options &&
        Array.isArray(order.selected_options) &&
        order.selected_options.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>선택된 옵션</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(order.selected_options as any[]).map(
                  (option: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {option.type}: {option.choice}
                      </span>
                      <span className="font-medium">
                        ₩{option.price?.toLocaleString()}
                      </span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* 요구사항 */}
      {order.requirements && (
        <Card>
          <CardHeader>
            <CardTitle>요구사항</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{order.requirements}</p>
          </CardContent>
        </Card>
      )}

      {actionData?.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          상태가 성공적으로 업데이트되었습니다.
        </div>
      )}
    </div>
  );
}
