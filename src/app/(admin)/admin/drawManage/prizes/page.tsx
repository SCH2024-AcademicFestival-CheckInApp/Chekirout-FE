"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Prize, columns } from "./columns.tsx";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ApiResponse {
  content: Prize[];
  totalElements: number;
  totalPages: number;
  size: number;
}

async function getData(): Promise<ApiResponse> {
  try {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await axios.get<ApiResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/prizes`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("경품 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
}

export default function PrizesManagePage() {
  const [data, setData] = useState<Prize[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getData();
      setData(response.content);
      setError(null);
    } catch (err) {
      console.error("데이터 로딩 중 오류 발생:", err);
      setError("데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleAddPrize = () => {
    // 경품 추가 로직 구현
    console.log("경품 추가");
  };

  if (error) {
    return <div className="container mx-auto py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">경품 관리</h1>
        <Button onClick={handleAddPrize}>
          <PlusCircle className="mr-2 h-4 w-4" /> 경품 추가
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
