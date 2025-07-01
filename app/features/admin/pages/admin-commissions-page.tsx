import {
  columns,
  type Commission,
} from "../components/commissions-table/columns";
import { DataTable } from "../components/commissions-table/data-table";
import type { Route } from "./+types/admin-commissions-page";
import { makeSSRClient } from "~/supa-client";
import { getAllCommissionsForAdmin } from "~/features/commissions/queries";
import { getLoggedInUser } from "~/features/community/queries";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Admin - Commissions | wemake" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);

  // 관리자 권한 확인
  const user = await getLoggedInUser(client);
  if (!user || user.role !== "admin") {
    throw new Response("관리자 권한이 필요합니다.", { status: 403 });
  }

  // 모든 커미션들 가져오기 (상태 무관)
  const allCommissions = await getAllCommissionsForAdmin(client);

  return { allCommissions };
};

export default function AdminCommissionsPage({
  loaderData,
}: Route.ComponentProps) {
  const { allCommissions } = loaderData;

  // 데이터를 columns 타입에 맞게 변환
  const formattedData: Commission[] = allCommissions.map((commission: any) => ({
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
          <h1 className="text-3xl font-bold">Commission Management</h1>
          <p className="text-muted-foreground">
            모든 커미션들을 관리하세요. (총 {formattedData.length}개)
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
