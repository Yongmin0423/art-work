import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { Route } from "./+types/commission-success-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "커미션 등록 완료 | Arkwork" }];
};

export default function CommissionSuccessPage() {
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex flex-col items-center space-y-6">
        {/* 성공 아이콘 */}
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>

        {/* 메인 메시지 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">커미션 등록이 완료되었습니다!</h1>
          <p className="text-muted-foreground">
            제출해주신 커미션을 검토 중입니다.
          </p>
        </div>

        {/* 안내 카드 */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              승인 대기 중
            </CardTitle>
            <CardDescription>
              관리자가 커미션 내용을 검토한 후 승인 여부를 결정합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="font-medium text-blue-900">승인 안내</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 커미션은 관리자 승인 후에 공개됩니다</li>
                    <li>• 승인까지 보통 1-2일 소요됩니다</li>
                    <li>• 승인 상태는 "내 커미션 관리"에서 확인할 수 있습니다</li>
                    <li>• 거절된 경우 사유와 함께 안내드립니다</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button asChild className="w-full sm:w-auto">
            <Link to="/my/commissions/my-commissions">
              내 커미션 관리
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/commissions/create">
              새 커미션 등록
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/">
              홈으로 이동
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}