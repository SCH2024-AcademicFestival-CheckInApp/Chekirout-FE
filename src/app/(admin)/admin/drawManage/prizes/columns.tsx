"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

export type Prize = {
  prizeId: number;
  prizeName: string;
  prizeClaimType: string;
};

export const columns: ColumnDef<Prize>[] = [
  {
    id: "select",
    header: "선택",
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
    accessorKey: "prizeName",
    header: "경품명",
  },
  {
    accessorKey: "prizeClaimType",
    header: "수령 유형",
    cell: ({ row }) => {
      const claimType = row.getValue("prizeClaimType") as string;
      return claimType === "MULTIPLE_CLAIM" ? "다중 수령" : "단일 수령";
    },
  },
];
