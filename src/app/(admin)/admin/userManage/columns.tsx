"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

const departmentMapping: { [key: string]: string } = {
  CSE: "컴퓨터소프트웨어공학과",
  MEDIT: "의료IT공학과",
  IOT: "사물인터넷학과",
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

const changeUserRole = async (username: string, newRole: string) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${username}/role`,
      { role: newRole },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    alert("권한이 변경되었습니다.");
  } catch (error) {
    console.error("권한 변경 중 오류 발생:", error);
    alert("권한 변경에 실패했습니다.");
  }
};

const blockUser = async (username: string) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${username}/block`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    alert("사용자가 차단되었습니다.");
  } catch (error) {
    console.error("사용자 차단 중 오류 발생:", error);
    alert("사용자 차단에 실패했습니다.");
  }
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
    header: "역할",
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
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">메뉴 열기</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>작업</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.username)}>
              학번 복사
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => changeUserRole(user.username, "MASTER")}>
              권한 설정: Master
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeUserRole(user.username, "ADMIN")}>
              권한 설정: Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => changeUserRole(user.username, "STUDENT")}>
              권한 설정: Student
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => blockUser(user.username)}>
              차단
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
