"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Prize, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PrizeData, PrizeModal } from "@/components/prize-modal";
import { PrizeAlert } from "@/components/PrizeAlert";

async function getData(): Promise<Prize[]> {
  try {
    let accessToken = localStorage.getItem("accessToken");
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
    console.error("경품 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
}

export default function PrizesManagePage() {
  const [data, setData] = useState<Prize[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrizes, setSelectedPrizes] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getData();
      console.log("API 응답:", response);
      setData(response);
      setError(null);
    } catch (err) {
      console.error("데이터 로딩 중 오류 발생:", err);
      setError("데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPrize = () => {
    setModalMode("add");
    setEditingPrize(null);
    setIsModalOpen(true);
  };

  const handleEditPrizes = () => {
    if (selectedPrizes.length !== 1) {
      alert("하나의 경품만 선택해주세요.");
      return;
    }
    const prizeToEdit = data.find(
      (prize) => prize.prizeId === selectedPrizes[0]
    );
    if (prizeToEdit) {
      setModalMode("edit");
      setEditingPrize(prizeToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDeletePrizes = async () => {
    if (confirm("선택한 경품을 삭제하시겠습니까?")) {
      try {
        for (const prizeId of selectedPrizes) {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/prizes/${prizeId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
        }
        await fetchData();
        setSelectedPrizes([]);
      } catch (error) {
        console.error("경품 삭제 중 오류 발생:", error);
        alert("경품 삭제에 실패했습니다.");
      }
    }
  };

  const handleModalSubmit = async (prizeData: PrizeData) => {
    try {
      if (modalMode === "add") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/prizes`,
          prizeData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      } else {
        if (!prizeData.prizeId) {
          throw new Error("경품 ID가 없습니다.");
        }
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/prizes/${prizeData.prizeId}`,
          prizeData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      }
      await fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("경품 저장 중 오류 발생:", error);
      alert("경품 저장에 실패했습니다.");
    }
  };

  const onRowSelectionModelChange = useCallback(
    (selectedRows: any) => {
      const selectedPrizeIds = selectedRows
        .map((rowIndex: number) => data[rowIndex]?.prizeId)
        .filter(Boolean);
      setSelectedPrizes(selectedPrizeIds);
    },
    [data]
  );

  if (error) {
    return <div className="container mx-auto py-10 text-red-500">{error}</div>;
  }

  console.log("렌더링 시 데이터:", data);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">경품 관리</h1>
      <PrizeAlert />
      {isLoading ? (
        <div>로딩 중...</div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={data}
            onRowSelectionModelChange={onRowSelectionModelChange}
            searchInput={
              <div className="flex justify-end w-full items-center space-x-2">
                {selectedPrizes.length > 0 && (
                  <>
                    <Button onClick={handleEditPrizes}>수정</Button>
                    <Button onClick={handleDeletePrizes} variant="destructive">
                      삭제
                    </Button>
                  </>
                )}
                <Button onClick={handleAddPrize}>
                  <PlusCircle className="mr-2 h-4 w-4" /> 경품 추가
                </Button>
              </div>
            }
          />
          <PrizeModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            initialData={
              editingPrize
                ? {
                    prizeId: editingPrize.prizeId,
                    prizeName: editingPrize.prizeName,
                    prizeClaimType: editingPrize.prizeClaimType,
                  }
                : undefined
            }
            mode={modalMode}
          />
        </>
      )}
    </div>
  );
}
