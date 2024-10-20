"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";

export interface Winner {
  PrizeWinnerId: number;
  winnerName: string;
  studentId: string;
  prizeId: number;
  prizeName: string;
  prizeClaimedAt: string | null;
}

export const columns: ColumnDef<Winner>[] = [
  {
    accessorKey: "prizeName",
    header: "당첨 경품명",
  },
  {
    accessorKey: "studentId",
    header: "당첨자 학번",
  },
  {
    accessorKey: "winnerName",
    header: "당첨자 이름",
  },
  {
    id: "prizeClaimedAt",
    header: "경품 수령 여부",
    cell: ({ row }) => (
      <Switch
        checked={!!row.original.prizeClaimedAt}
        onCheckedChange={() => {}}
      />
    ),
  },
];
