"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DataTable } from "@/components/ui/data-table";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Program, columns } from "./columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Plus, Pencil, Trash } from "lucide-react";
import { ProgramModal, ProgramData } from "@/components/Program-modal";

interface Category {
  id: number;
  name: string;
}

async function getPrograms(categories: Category[]): Promise<Program[]> {
  try {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/programs`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!Array.isArray(response.data)) {
      throw new Error("서버에서 예상치 못한 응답을 받았습니다.");
    }

    return response.data.map((program: any) => {
      const category = categories.find((c) => c.id === program.categoryId);
      return {
        id: program.id,
        categoryId: program.categoryId || 0,
        name: program.name || "",
        description: program.description || "",
        startTimestamp: program.startTimestamp || "",
        endTimestamp: program.endTimestamp || "",
        notificationYn: program.notificationYn || true,
        categoryName: category ? category.name : "알 수 없음",
      };
    });
  } catch (error) {
    console.error("프로그램 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await axios.get<Category[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/categories`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("카테고리 데이터를 가져오는 중 오류 발생:", error);
    throw error;
  }
}

export default function ProgramManagePage() {
  const [data, setData] = useState<Program[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPrograms, setSelectedPrograms] = useState<number[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const categoriesData = await getCategories();
      const programsData = await getPrograms(categoriesData);
      setData(programsData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error("데이터 로딩 중 오류 발생:", err);
      setError("데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    setSelectedCategory("");
  };

  const handleAddProgram = () => {
    setModalMode("add");
    setEditingProgram(null);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    if (selectedPrograms.length !== 1) {
      alert("하나의 프로그램만 선택해주세요.");
      return;
    }
    const programToEdit = data.find(
      (program) => program.id === selectedPrograms[0]
    );
    if (programToEdit) {
      setModalMode("edit");
      setEditingProgram(programToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (confirm("선택한 프로그램을 삭제하시겠습니까?")) {
      try {
        for (const programId of selectedPrograms) {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/programs/${programId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
        }
        await fetchData();
        setSelectedPrograms([]); // 선택된 프로그램 초기화
      } catch (error) {
        console.error("프로그램 삭제 중 오류 발생:", error);
        alert("프로그램 삭제에 실패했습니다.");
      }
    }
  };

  const handleModalSubmit = async (programData: ProgramData) => {
    try {
      if (modalMode === "add") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/programs`,
          programData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      } else {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/programs/${programData.id}`,
          programData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      }
      await fetchData();
      setIsModalOpen(false);
      setSelectedPrograms([]); // 선택된 프로그램 초기화
    } catch (error) {
      console.error("프로그램 저장 중 오류 발생:", error);
      alert("프로그램 저장에 실패했습니다.");
    }
  };

  const onRowSelectionModelChange = useCallback(
    (selectedRows: any) => {
      console.log("Selected rows:", selectedRows);
      const selectedProgramIds = selectedRows
        .map((rowIndex: number) => {
          if (data[rowIndex]) {
            console.log("Selected program:", data[rowIndex].id);
            return data[rowIndex].id;
          }
          console.log("Program not found for index:", rowIndex);
          return null;
        })
        .filter((id: number | null) => id !== null);

      setSelectedPrograms(selectedProgramIds);
    },
    [data]
  );

  const filteredData = data.filter((program) => {
    const matchesSearch = program.name
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" ||
      program.categoryId.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (error) {
    return <div className="container mx-auto py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">프로그램 관리</h1>
      <DataTable
        columns={columns}
        data={filteredData}
        onRowSelectionModelChange={onRowSelectionModelChange}
        selectedRows={selectedPrograms}
        searchInput={
          <div className="flex items-center space-x-2 justify-between">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="프로그램 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md p-2">
                <option value="">모든 카테고리</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleAddProgram}>
                <Plus className="h-4 w-4 mr-2" />
                프로그램 추가
              </Button>
              {selectedPrograms.length > 0 && (
                <>
                  <Button onClick={handleEdit} variant="outline">
                    <Pencil className="h-4 w-4 mr-2" />
                    프로그램 수정
                  </Button>
                  <Button onClick={handleDelete} variant="destructive">
                    <Trash className="h-4 w-4 mr-2" />
                    프로그램 삭제
                  </Button>
                </>
              )}
            </div>
          </div>
        }
      />
      <ProgramModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingProgram}
        mode={modalMode}
        categories={categories}
      />
    </div>
  );
}
