"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DataTable } from "@/components/ui/data-table";
import axios from "axios";
import { useRouter } from "next/navigation";
import { User, columns } from "./columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ApiResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

async function getData(
  page: number,
  size: number,
  searchTerm: string,
  isCompleted: string | null
): Promise<ApiResponse> {
  try {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("인증 토큰이 없습니다.");
    }

    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/stamp-cards?page=${page}&size=${size}`;
    if (isCompleted !== null) {
      url += `&completed=${isCompleted}`;
    }
    if (searchTerm) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/stamp-cards/${searchTerm}`;
    }

    const response = await axios.get<ApiResponse>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    let content: ApiResponse["content"];
    if (searchTerm) {
      content = Array.isArray(response.data) ? response.data : [response.data];
    } else {
      content = response.data.content;
    }

    // isCompleted 필드를 기반으로 데이터 필터링
    content = content.filter((user) => {
      if (isCompleted === null) return true;
      return isCompleted
        ? user.isCompleted !== null
        : user.isCompleted === null;
    });

    return {
      content,
      totalElements: searchTerm ? content.length : response.data.totalElements,
      totalPages: searchTerm ? 1 : response.data.totalPages,
      size: searchTerm ? content.length : response.data.size,
      number: searchTerm ? 0 : response.data.number,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 0,
        number: 0,
      };
    }
    console.error("참여자 정보를 가져오는 중 오류 발생:", error);
    throw error;
  }
}

export default function ParticipationPage() {
  const [data, setData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCompleted, setIsCompleted] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const fetchData = useCallback(
    async (search: string = "") => {
      setIsLoading(true);
      try {
        const response = await getData(page, pageSize, search, isCompleted);
        setData(response.content);
        setTotalPages(response.totalPages);
        setError(null);
      } catch (err) {
        console.error("데이터 로딩 중 오류 발생:", err);
        setData([]);
        setTotalPages(0);
        setError("데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize, isCompleted]
  );

  useEffect(() => {
    fetchData(debouncedSearchTerm);
  }, [fetchData, debouncedSearchTerm, isCompleted]);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  const handleReset = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setIsCompleted(null);
    setPage(0);
  };

  if (error) {
    return <div className="container mx-auto py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">참여 관리</h1>
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
        searchInput={
          <div className="flex items-center space-x-2">
            <Input
              placeholder="학번 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <select
              value={
                isCompleted === null
                  ? "all"
                  : isCompleted
                  ? "completed"
                  : "incomplete"
              }
              onChange={(e) => {
                const value = e.target.value;
                setIsCompleted(value === "all" ? null : value === "completed");
                setPage(0);
              }}
              className="border border-gray-300 rounded-md p-2">
              <option value="all">전체</option>
              <option value="completed">완료</option>
              <option value="incomplete">미완료</option>
            </select>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        }
      />
    </div>
  );
}
