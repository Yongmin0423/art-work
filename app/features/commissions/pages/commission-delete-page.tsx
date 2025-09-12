import type { Route } from "./+types/commission-delete-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUser } from "~/features/community/queries";
import { deleteCommission } from "../mutations";
import { getCommissionById } from "../queries";

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  
  try {
    // 로그인 확인
    const user = await getLoggedInUser(client);
    if (!user) {
      return { error: "로그인이 필요합니다." };
    }

    // 커미션 정보 가져오기 (권한 확인용)
    const commission = await getCommissionById(client, {
      commissionId: Number(params.commissionId),
    });

    // 작성자 권한 확인
    if (commission.profile_id !== user.profile_id) {
      return { error: "삭제 권한이 없습니다." };
    }

    // 삭제 실행
    await deleteCommission(client, { 
      commissionId: Number(params.commissionId) 
    });

    return { success: true };
  } catch (error) {
    console.error("커미션 삭제 중 오류:", error);
    return { 
      error: error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다." 
    };
  }
};