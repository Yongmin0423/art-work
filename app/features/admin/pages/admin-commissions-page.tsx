import {
  columns,
  type Commission,
} from "../components/commissions-table/columns";
import { DataTable } from "../components/commissions-table/data-table";
import { DataTableDemo } from "../components/demo";
import type { Route } from "./+types/admin-commissions-page";

async function getData(): Promise<Commission[]> {
  // Fetch data from your API here.
  return [
    {
      commission_id: 1,
      title: "캐릭터 일러스트 의뢰",
      status: "pending_approval",
      profile_id: "728ed52f-c7a9-4c3e-8f97-123456789abc",
      username: "지쿠악스",
      category: "character",
      price_start: 50000,
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      commission_id: 2,
      title: "배경 일러스트 작업",
      status: "pending_approval",
      profile_id: "728ed52f-c7a9-4c3e-8f97-123456789def",
      username: "아티스트123",
      category: "background",
      price_start: 100000,
      created_at: "2024-01-14T14:20:00Z",
    },
    {
      commission_id: 3,
      title: "로고 디자인",
      status: "pending_approval",
      profile_id: "728ed52f-c7a9-4c3e-8f97-123456789ghi",
      username: "디자이너김",
      category: "logo",
      price_start: 80000,
      created_at: "2024-01-13T09:15:00Z",
    },
  ];
}

export default async function AdminCommissionsPage({}: Route.ComponentProps) {
  const data = await getData();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
      {/* <DataTableDemo /> */}
    </div>
  );
}
