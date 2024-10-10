"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { User, columns } from "./columns";

async function getData(): Promise<User[]> {
  // 실제 API 호출로 대체
  return [
    {
      id: "20204023",
      department: "컴퓨터소프트웨어공학과",
      name: "홍길동",
      role: "STUDENT",
      isNotificationEnabled: true,
      phoneNumber: "010-1234-5678",
      email: "hong@example.com",
    },
    {
      id: "20204022",
      department: "컴퓨터소프트웨어공학과",
      name: "홍길동",
      role: "STUDENT",
      isNotificationEnabled: true,
      phoneNumber: "010-1234-5678",
      email: "hong@example.com",
    },
    {
      id: "20204123",
      department: "컴퓨터소프트웨어공학과",
      name: "홍길동",
      role: "STUDENT",
      isNotificationEnabled: true,
      phoneNumber: "010-1234-5678",
      email: "hong@example.com",
    },
  ];
}

export default function UserManagePage() {
  const [data, setData] = useState<User[]>([]);

  useState(() => {
    getData().then(setData);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
