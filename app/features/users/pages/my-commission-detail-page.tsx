import { getCommissionById } from "~/features/commissions/queries";
import { makeSSRClient } from "~/supa-client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

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
import { getStatusBadge } from "~/utils/commission";
import { getLoggedInUser } from "~/features/community/queries";
import type { Route } from "./+types/my-commission-detail-page";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { id } = params;
  if (!id) {
    throw new Response("ID가 필요합니다", { status: 400 });
  }

  const { client, headers } = makeSSRClient(request);

  const commission = await getCommissionById(client, {
    commissionId: Number(id),
  });

  const user = await getLoggedInUser(client);

  if (!commission) {
    throw new Response("커미션을 찾을 수 없습니다", { status: 404 });
  }

  if (commission.profile_id !== user.profile_id) {
    throw new Response("접근 권한이 없습니다", { status: 403 });
  }

  return { commission, headers };
};

export default function AdminCommissionDetailPage({
  loaderData,
}: Route.ComponentProps) {
  const { commission } = loaderData;

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
        <Link to="/my/admin/commissions">
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
        </div>
      </div>
    </div>
  );
}
