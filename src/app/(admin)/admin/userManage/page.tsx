"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { User, columns } from "./columns";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ApiResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

async function getData(page: number, size: number): Promise<ApiResponse> {
  try {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await axios.get<ApiResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("사용자 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
}

export default function UserManagePage() {
  const [data, setData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getData(page, pageSize);
      setData(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("데이터 로딩 중 오류 발생:", err);
      setError("데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, router]);

  if (error) {
    return <div className="container mx-auto py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data}
        pagination={{
          pageIndex: page,
          pageSize: pageSize,
          pageCount: totalPages,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
      />
    </div>
  );
}
