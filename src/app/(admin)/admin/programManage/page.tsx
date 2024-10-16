"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Program, columns } from "./columns";

async function getData(): Promise<Program[]> {
  try {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("인증 토큰이 없습니다.");
    }

    console.log(
      "인증 토큰이 존재합니다:",
      accessToken.substring(0, 10) + "..."
    );

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/programs`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("API 응답:", response.data);

    // 응답 데이터의 구조를 확인
    if (!Array.isArray(response.data)) {
      console.error("예상치 못한 응답 구조:", response.data);
      throw new Error("서버에서 예상치 못한 응답을 받았습니다.");
    }

    return response.data.map((program: any) => ({
      categoryId: program.categoryId || 0,
      name: program.name || "",
      description: program.description || "",
      startTimestamp: program.startTimestamp || "",
      endTimestamp: program.endTimestamp || "",
      notificationYn: program.notificationYn || true,
    }));
  } catch (error) {
    console.error("사용자 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
}

export default function ProgramManagePage() {
  const [data, setData] = useState<Program[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getData()
      .then((fetchedData) => {
        console.log("Fetched data:", fetchedData);
        setData(fetchedData);
      })
      .catch((err) => {
        console.error("데이터 로딩 중 오류 발생:", err);
        setError("데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
      });
  }, [router]);

  if (error) {
    return <div className="container mx-auto py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
