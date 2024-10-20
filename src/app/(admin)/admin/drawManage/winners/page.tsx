"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DataTable } from "@/components/ui/data-table";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Winner, columns } from "./columns";
import { Switch } from "@/components/ui/switch";

interface Prize {
  prizeId: number;
  prizeName: string;
}

async function getWinners(
  searchTerm: string = "",
  prizeId: number | null = null
): Promise<Winner[]> {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("인증 토큰이 없습니다.");
    }

    let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/prize-draws/winners`;
    if (searchTerm) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/prize-draws/winners/${searchTerm}`;
    } else if (prizeId) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/prize-draws/${prizeId}/winners`;
    }

    const response = await axios.get<Winner[]>(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("당첨자 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
}

async function getPrizes(): Promise<Prize[]> {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await axios.get<Prize[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/prizes`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("경품 목록을 가져오는 중 오류 발생:", error);
    throw error;
  }
}

async function togglePrizeClaim(prizeWinnerId: number): Promise<void> {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("인증 토큰이 없습니다.");
    }

    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/prize-draws/confirm?prizeWinnerId=${prizeWinnerId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    console.error("경품 수령 상태 변경 중 오류 발생:", error);
    throw error;
  }
}

export default function WinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrize, setSelectedPrize] = useState<number | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const winnersData = await getWinners(debouncedSearchTerm, selectedPrize);
      setWinners(winnersData);
      setError(null);
    } catch (err) {
      console.error("데이터 로딩 중 오류 발생:", err);
      setError("데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, selectedPrize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    getPrizes().then(setPrizes).catch(console.error);
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  const handleReset = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedPrize(null);
  };

  const handleTogglePrizeClaim = async (prizeWinnerId: number) => {
    try {
      await togglePrizeClaim(prizeWinnerId);
      fetchData();
    } catch (error) {
      console.error("경품 수령 상태 변경 중 오류 발생:", error);
    }
  };

  const columnsWithActions = columns.map((column) => {
    if (column.id === "prizeClaimedAt") {
      return {
        ...column,
        cell: ({ row }: { row: any }) => (
          <Switch
            checked={!!row.original.prizeClaimedAt}
            onCheckedChange={() =>
              handleTogglePrizeClaim(row.original.PrizeWinnerId)
            }
          />
        ),
      };
    }
    return column;
  });

  if (error) {
    return <div className="container mx-auto py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">당첨자 조회</h1>
      <div className="flex items-center space-x-2 mb-4">
        <Input
          placeholder="학번 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={selectedPrize || ""}
          onChange={(e) =>
            setSelectedPrize(e.target.value ? Number(e.target.value) : null)
          }
          className="border border-gray-300 rounded-md p-2">
          <option value="">모든 경품</option>
          {prizes.map((prize) => (
            <option key={prize.prizeId} value={prize.prizeId}>
              {prize.prizeName}
            </option>
          ))}
        </select>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <DataTable
        columns={columnsWithActions}
        data={winners}
        hideColumns={true}
      />
    </div>
  );
}
