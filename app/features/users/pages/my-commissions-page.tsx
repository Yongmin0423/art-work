import { makeSSRClient } from "~/supa-client";
import { getCommissionsByArtist } from "~/features/commissions/queries";
import { getLoggedInUser } from "~/features/community/queries";
import { DataTable } from "../components/commissions-table/data-table";
import type { Route } from "./+types/my-commissions-page";
import {
  columns,
  type Commission,
} from "../components/commissions-table/columns";

export const meta: Route.MetaFunction = () => {
  return [{ title: " My Commissions | wemake" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);

  // 관리자 권한 확인
  const user = await getLoggedInUser(client);
  if (!user) {
    throw new Response("로그인이 필요합니다.", { status: 401 });
  }

  // 커미션 정보 가져오기
  const myCommissions = await getCommissionsByArtist(client, user.profile_id);
  return { myCommissions };
};

export default function AdminCommissionsPage({
  loaderData,
}: Route.ComponentProps) {
  const { myCommissions } = loaderData;

  // 데이터를 columns 타입에 맞게 변환
  const formattedData: Commission[] = myCommissions.map((commission: any) => ({
    commission_id: commission.commission_id,
    title: commission.title,
    status: commission.status as "pending_approval" | "available" | "rejected",
    profile_id: commission.profile_id,
    username: commission.artist_username || commission.artist_name,
    category: commission.category,
    price_start: commission.price_start,
    created_at: commission.created_at,
  }));

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">커미션 관리</h1>
          <p className="text-muted-foreground">
            내가 등록한 커미션 (총 {formattedData.length}개)
          </p>
        </div>

        {formattedData.length > 0 ? (
          <DataTable columns={columns} data={formattedData} />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">등록된 커미션이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
