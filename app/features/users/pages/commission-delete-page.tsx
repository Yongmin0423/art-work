import { redirect } from "react-router";
import { deleteCommission } from "~/features/commissions/mutations";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUser } from "~/features/community/queries";
import { getCommissionById } from "~/features/commissions/queries";
import type { Route } from "./+types/commission-delete-page";

export const action = async ({ params, request }: Route.ActionArgs) => {
  const { id } = params;
  if (!id) {
    throw new Response("ID가 필요합니다", { status: 400 });
  }

  const { client } = makeSSRClient(request);
  const user = await getLoggedInUser(client);
  
  if (!user) {
    throw new Response("로그인이 필요합니다", { status: 401 });
  }

  // 커미션 존재 확인 및 권한 체크
  const commission = await getCommissionById(client, {
    commissionId: Number(id),
  });

  if (!commission) {
    throw new Response("커미션을 찾을 수 없습니다", { status: 404 });
  }

  if (commission.profile_id !== user.profile_id) {
    throw new Response("삭제 권한이 없습니다", { status: 403 });
  }

  try {
    await deleteCommission(client, { commissionId: Number(id) });
    
    // 성공적으로 삭제되면 목록 페이지로 리다이렉트
    return redirect("/my/commissions/my-commissions");
  } catch (error) {
    console.error("커미션 삭제 중 오류:", error);
    
    // 주문이 있어서 삭제할 수 없는 경우
    if (error instanceof Error && error.message.includes("진행 중인 주문이 있는 커미션")) {
      return redirect(`/my/commissions/my-commissions/${id}?error=${encodeURIComponent(error.message)}`);
    }
    
    // 기타 오류
    return redirect(`/my/commissions/my-commissions/${id}?error=${encodeURIComponent("커미션 삭제 중 오류가 발생했습니다")}`);
  }
};

// GET 요청은 허용하지 않음
export const loader = () => {
  throw new Response("Method not allowed", { status: 405 });
};