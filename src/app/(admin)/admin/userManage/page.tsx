"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import { User, columns } from "./columns";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  searchTerm: string
): Promise<ApiResponse> {
  try {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("인증 토큰이 없습니다.");
    }

    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users?page=${page}&size=${size}`;
    if (searchTerm) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${searchTerm}`;
    }

    const response = await axios.get<ApiResponse>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 응답 데이터를 변환하여 'id' 필드 추가
    const transformedData = response.data.content.map((user) => ({
      ...user,
      id: user.username, // 'username'을 'id'로 사용
    }));

    return {
      ...response.data,
      content: transformedData,
    };
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const router = useRouter();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getData(page, pageSize, searchTerm);
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

  const handleSearch = () => {
    fetchData();
  };

  const handleRoleChange = async (role: string) => {
    for (const username of selectedUsers) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${username}/role`,
          { role },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error(`사용자 ${username}의 권한 변경 중 오류 발생:`, error);
      }
    }
    fetchData();
    setSelectedUsers([]);
  };

  const handleBlock = async () => {
    for (const username of selectedUsers) {
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
      } catch (error) {
        console.error(`사용자 ${username} 차단 중 오류 발생:`, error);
      }
    }
    fetchData();
    setSelectedUsers([]);
  };

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
        onRowSelectionChange={(selectedRows) => {
          setSelectedUsers(selectedRows.map((row) => row.original.username));
        }}
        searchInput={
          <div className="flex items-center space-x-2">
            <Input
              placeholder="학번 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleSearch}>검색</Button>
          </div>
        }
      />
      {selectedUsers.length > 0 && (
        <div className="flex items-center space-x-2 mt-4">
          <Button onClick={() => handleRoleChange("MASTER")}>
            Master 권한 부여
          </Button>
          <Button onClick={() => handleRoleChange("ADMIN")}>
            Admin 권한 부여
          </Button>
          <Button onClick={() => handleRoleChange("STUDENT")}>
            Student 권한 부여
          </Button>
          <Button onClick={handleBlock}>차단</Button>
        </div>
      )}
    </div>
  );
}
