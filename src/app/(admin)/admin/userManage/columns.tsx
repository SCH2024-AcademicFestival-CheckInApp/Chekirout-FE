"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

export const departmentMapping: { [key: string]: string } = {
  CSE: "컴퓨터소프트웨어공학과",
  MEDIT: "의료IT공학과",
  IoT: "사물인터넷학과",
  IP: "정보보호학과",
  AI_BIGDATA: "AI빅데이터공학과",
  METABUS: "메타버스게임학과",
};

export type User = {
  id: string;
  username: string;
  department: string;
  name: string;
  role: "STUDENT" | "ADMIN" | "MASTER";
  isNotificationEnabled: boolean;
  phoneNumber: string;
  email: string;
};

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          학번
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return (
        <Button
          variant="ghost"
          onClick={() => navigator.clipboard.writeText(id)}>
          {id}
        </Button>
      );
    },
  },

  {
    accessorKey: "name",
    header: "이름",
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          학과
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const department = row.getValue("department") as string;
      return departmentMapping[department] || department;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          역할
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "isNotificationEnabled",
    header: "알림 허용",
    cell: ({ row }) => (
      <span>{row.getValue("isNotificationEnabled") ? "예" : "아니오"}</span>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "전화번호",
  },
  {
    accessorKey: "email",
    header: "이메일",
  },
];
