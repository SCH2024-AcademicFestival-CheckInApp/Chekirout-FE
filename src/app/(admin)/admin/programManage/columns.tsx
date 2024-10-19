"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export type Program = {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  startTimestamp: string;
  endTimestamp: string;
  notificationYn: boolean;
  categoryName: string; // 카테고리 이름을 저장할 새로운 필드
};

export const columns: ColumnDef<Program>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="모두 선택"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="행 선택"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "categoryName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          카테고리
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "프로그램",
  },
  {
    accessorKey: "description",
    header: "설명",
  },
  {
    accessorKey: "startTimestamp",
    header: "시작시간",
  },
  {
    accessorKey: "endTimestamp",
    header: "종료시간",
  },
  {
    accessorKey: "notificationYn",
    header: "알림여부",
    cell: ({ row }) => (
      <span>{row.getValue("notificationYn") ? "예" : "아니오"}</span>
    ),
  },
];
