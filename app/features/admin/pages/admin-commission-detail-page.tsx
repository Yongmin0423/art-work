import { getCommissionById } from "~/features/commissions/queries";
import type { Route } from "./+types/admin-commission-detail-page";
import { makeSSRClient } from "~/supa-client";
import { requireAdmin } from "~/common/queries";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Eye,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";
import { Link, Form } from "react-router";
import { useState } from "react";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { id } = params;
  if (!id) {
    throw new Response("ID가 필요합니다", { status: 400 });
  }

  const { client, headers } = makeSSRClient(request);

  // 관리자 권한 체크
  await requireAdmin(client, request);

  const commission = await getCommissionById(client, {
    commissionId: Number(id),
  });

  if (!commission) {
    throw new Response("커미션을 찾을 수 없습니다", { status: 404 });
  }

  return { commission, headers };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { id } = params;
  const { client } = makeSSRClient(request);

  // 관리자 권한 체크
  const admin = await requireAdmin(client, request);

  const formData = await request.formData();
  const actionType = formData.get("action");
  const rejectionReason = formData.get("rejectionReason");

  if (actionType === "approve") {
    // 커미션 승인
    const { error } = await client
      .from("commission")
      .update({
        status: "available",
        approved_by: admin.profile_id,
        approved_at: new Date().toISOString(),
        rejection_reason: null, // 승인 시 거절 사유 초기화
      })
      .eq("commission_id", Number(id));

    if (error) {
      throw new Response("승인 처리 중 오류가 발생했습니다", { status: 500 });
    }
  } else if (actionType === "reject") {
    // 커미션 거절
    const { error } = await client
      .from("commission")
      .update({
        status: "rejected",
        approved_by: admin.profile_id,
        approved_at: new Date().toISOString(),
        rejection_reason: rejectionReason?.toString() || "",
      })
      .eq("commission_id", Number(id));

    if (error) {
      throw new Response("거절 처리 중 오류가 발생했습니다", { status: 500 });
    }
  } else if (actionType === "update_rejection") {
    // 거절 사유 수정
    const { error } = await client
      .from("commission")
      .update({
        rejection_reason: rejectionReason?.toString() || "",
        approved_by: admin.profile_id,
        approved_at: new Date().toISOString(),
      })
      .eq("commission_id", Number(id));

    if (error) {
      throw new Response("거절 사유 수정 중 오류가 발생했습니다", {
        status: 500,
      });
    }
  }

  return { success: true };
};

export default function AdminCommissionDetailPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { commission } = loaderData;
  const [showRejectForm, setShowRejectForm] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_approval":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            승인 대기
          </Badge>
        );
      case "available":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            승인됨
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            거절됨
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/commissions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">커미션 상세 검토</h1>
          <p className="text-muted-foreground">
            ID: {commission.commission_id}
          </p>
        </div>
        {getStatusBadge(commission.status)}
      </div>

      {/* 성공 메시지 */}
      {actionData?.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">처리가 완료되었습니다.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽: 기본 정보 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{commission.title}</h3>
                <p className="text-muted-foreground mt-2">
                  {commission.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    작가: {commission.artist_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    카테고리: {commission.category}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">
                    시작 가격: {formatPrice(commission.price_start)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  작업 기간: {commission.turnaround_days}일 | 수정 횟수:{" "}
                  {commission.revision_count}회
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">
                    {commission.views_count}
                  </div>
                  <div className="text-xs text-muted-foreground">조회수</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">
                    {commission.likes_count}
                  </div>
                  <div className="text-xs text-muted-foreground">좋아요</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">
                    {commission.order_count}
                  </div>
                  <div className="text-xs text-muted-foreground">주문수</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>등록 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">등록일:</span>{" "}
                {formatDate(commission.created_at)}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">수정일:</span>{" "}
                {formatDate(commission.updated_at)}
              </div>
              {commission.approved_at && (
                <div className="text-sm">
                  <span className="text-muted-foreground">처리일:</span>{" "}
                  {formatDate(commission.approved_at)}
                </div>
              )}
              {commission.rejection_reason && (
                <div className="text-sm">
                  <span className="text-muted-foreground">거절 사유:</span>
                  <p className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-red-800">
                    {commission.rejection_reason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 이미지 및 액션 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>포트폴리오 이미지</CardTitle>
            </CardHeader>
            <CardContent>
              {commission.images &&
              Array.isArray(commission.images) &&
              commission.images.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {commission.images.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`포트폴리오 이미지 ${index + 1}`}
                      className="w-full h-auto rounded-lg border"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  등록된 이미지가 없습니다.
                </p>
              )}
            </CardContent>
          </Card>

          {/* 관리자 액션 */}
          <Card>
            <CardHeader>
              <CardTitle>관리자 액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 모든 상태에서 승인/거절 가능 */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Form method="post" className="flex-1">
                    <input type="hidden" name="action" value="approve" />
                    <Button
                      type="submit"
                      className="w-full"
                      variant={
                        commission.status === "available"
                          ? "outline"
                          : "default"
                      }
                      disabled={commission.status === "available"}
                    >
                      {commission.status === "available"
                        ? "승인됨"
                        : "승인하기"}
                    </Button>
                  </Form>
                  <Button
                    variant={
                      commission.status === "rejected"
                        ? "outline"
                        : "destructive"
                    }
                    className="flex-1"
                    onClick={() => setShowRejectForm(!showRejectForm)}
                  >
                    {commission.status === "rejected"
                      ? "거절 사유 수정"
                      : "거절하기"}
                  </Button>
                </div>

                {showRejectForm && (
                  <Form method="post" className="space-y-4 pt-4 border-t">
                    <input
                      type="hidden"
                      name="action"
                      value={
                        commission.status === "rejected"
                          ? "update_rejection"
                          : "reject"
                      }
                    />
                    <div>
                      <Label htmlFor="rejectionReason">
                        {commission.status === "rejected"
                          ? "거절 사유 수정"
                          : "거절 사유 (필수)"}
                      </Label>
                      <Textarea
                        id="rejectionReason"
                        name="rejectionReason"
                        placeholder="거절 사유를 상세히 입력해주세요..."
                        defaultValue={
                          commission.status === "rejected"
                            ? commission.rejection_reason || ""
                            : ""
                        }
                        required
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        variant="destructive"
                        className="flex-1"
                      >
                        {commission.status === "rejected"
                          ? "사유 수정"
                          : "거절 확정"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => setShowRejectForm(false)}
                      >
                        취소
                      </Button>
                    </div>
                  </Form>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
