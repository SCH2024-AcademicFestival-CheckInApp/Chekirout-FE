"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { User, columns } from "./columns";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { departmentMapping } from "./columns";

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
  department: string
): Promise<ApiResponse> {
  try {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("인증 토큰이 없습니다.");
    }

    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users?page=${page}&size=${size}`;
    if (department && department !== "") {
      url += `&department=${department}`;
    }
    if (searchTerm) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${searchTerm}`;
    }

    const response = await axios.get<ApiResponse>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    let content: User[];
    if (searchTerm) {
      // 검색 결과가 단일 사용자인 경우 배열로 변환
      content = (
        Array.isArray(response.data) ? response.data : [response.data]
      ) as User[];
    } else {
      content = response.data.content;
    }

    // 응답 데이터를 변환하여 'id' 필드 추가
    const transformedData = content.map((user) => ({
      ...user,
      id: user.username, // 'username'을 'id'로 사용
    }));

    return {
      content: transformedData,
      totalElements: searchTerm
        ? transformedData.length
        : response.data.totalElements,
      totalPages: searchTerm ? 1 : response.data.totalPages,
      size: searchTerm ? transformedData.length : response.data.size,
      number: searchTerm ? 0 : response.data.number,
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
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const router = useRouter();

  const fetchData = useCallback(
    async (search: string = "") => {
      setIsLoading(true);
      try {
        const response = await getData(
          page,
          pageSize,
          search,
          selectedDepartment
        );
        setData(response.content);
        setTotalPages(response.totalPages);
        setError(null);
      } catch (err) {
        console.error("데이터 로딩 중 오류 발생:", err);
        setData([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    },
    [page, pageSize, selectedDepartment]
  );

  useEffect(() => {
    fetchData(searchTerm);
  }, [fetchData, searchTerm, selectedDepartment]);

  const handleSearch = () => {
    fetchData(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedDepartment("");
    setPage(0); // 페이지를 첫 페이지로 리셋
    fetchData(""); // 빈 문자열로 검색하여 전체 리스트를 가져옴
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${username}/{}`,
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

  const onRowSelectionModelChange = useCallback(
    (selectedRows: any[]) => {
      setSelectedUsers(
        selectedRows.map((rowId) => {
          const row = data.find((user) => user.id === rowId);
          return row ? row.username : "";
        })
      );
    },
    [data]
  );

  if (error) {
    return <div className="container mx-auto py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data} // 데이터가 비��있으면 DataTable 컴포넌트가 자동으로 "No results" 메시지를 표시합니다.
        pagination={{
          pageIndex: page,
          pageSize: pageSize,
          pageCount: totalPages,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
        }}
        onRowSelectionModelChange={onRowSelectionModelChange}
        searchInput={
          <div className="flex items-center space-x-2">
            <Input
              placeholder="학번 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setPage(0); // 학과 변경 시 첫 페이지로 리셋
              }}
              className="border border-gray-300 rounded-md p-2">
              <option value="">모든 학과</option>
              {Object.entries(departmentMapping).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
            <Button onClick={handleSearch}>검색</Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
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
