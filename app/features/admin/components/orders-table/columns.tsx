"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { Badge } from "~/components/ui/badge";

// 주문 데이터 타입 정의
export type Order = {
  order_id: number;
  status:
    | "pending"
    | "accepted"
    | "in_progress"
    | "revision_requested"
    | "completed"
    | "cancelled"
    | "refunded"
    | "disputed";
  total_price: number;
  created_at: string;
  commission: {
    title: string;
    category: string;
  } | null;
  client: {
    name: string;
  } | null;
  artist: {
    name: string;
  } | null;
};

// 상태별 색상 매핑
const getStatusVariant = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return "secondary";
    case "accepted":
      return "default";
    case "in_progress":
      return "default";
    case "completed":
      return "default";
    case "cancelled":
      return "destructive";
    case "refunded":
      return "destructive";
    default:
      return "secondary";
  }
};

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "order_id",
    header: "주문 ID",
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => {
      const status = row.getValue("status") as Order["status"];
      return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "commission.title",
    header: "커미션",
    cell: ({ row }) => {
      const commission = row.original.commission;
      if (!commission) return "-";
      return (
        <div>
          <div className="font-medium">{commission.title}</div>
          <div className="text-sm text-muted-foreground">
            {commission.category}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "client.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          클라이언트
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.client?.name || "-",
  },
  {
    accessorKey: "artist.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          아티스트
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.artist?.name || "-",
  },
  {
    accessorKey: "total_price",
    header: () => <div className="text-right">총 가격</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("total_price"));
      const formatted = new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
      }).format(price);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          주문일시
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return date.toLocaleDateString("ko-KR");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(order.order_id.toString())
              }
            >
              주문 ID 복사
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/admin/orders/${order.order_id}`}>상세보기</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
