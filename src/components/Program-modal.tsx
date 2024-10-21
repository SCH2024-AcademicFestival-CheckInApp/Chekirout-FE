import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (programData: ProgramData) => void;
  initialData?: ProgramData;
  mode: "add" | "edit";
  categories: { id: number; name: string }[];
}

export interface ProgramData {
  id?: number;
  name: string;
  description: string;
  categoryId: number;
  startTimestamp: string;
  endTimestamp: string;
  notificationYn: boolean;
}

const initialProgramData: ProgramData = {
  id: undefined,
  name: "",
  description: "",
  categoryId: 0,
  startTimestamp: "",
  endTimestamp: "",
  notificationYn: false,
};

export function ProgramModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  categories,
}: ProgramModalProps) {
  const [programData, setProgramData] =
    useState<ProgramData>(initialProgramData);

  useEffect(() => {
    if (mode === "add") {
      setProgramData(initialProgramData);
    } else if (mode === "edit" && initialData) {
      setProgramData({
        ...initialData,
        startTimestamp: initialData.startTimestamp
          ? new Date(initialData.startTimestamp).toISOString().slice(0, 16)
          : "",
        endTimestamp: initialData.endTimestamp
          ? new Date(initialData.endTimestamp).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [mode, initialData, isOpen]);

  const handleSubmit = () => {
    const submittedData = {
      ...programData,
      startTimestamp: new Date(programData.startTimestamp).toISOString(),
      endTimestamp: new Date(programData.endTimestamp).toISOString(),
    };
    onSubmit(submittedData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "프로그램 추가" : "프로그램 수정"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {mode === "edit" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id" className="text-right">
                프로그램 ID
              </Label>
              <Input
                id="id"
                value={programData.id || ""}
                className="col-span-3"
                disabled
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              프로그램 이름
            </Label>
            <Input
              id="name"
              value={programData.name}
              onChange={(e) =>
                setProgramData({ ...programData, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              설명
            </Label>
            <Input
              id="description"
              value={programData.description}
              onChange={(e) =>
                setProgramData({ ...programData, description: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoryId" className="text-right">
              카테고리
            </Label>
            <Select
              onValueChange={(value) =>
                setProgramData({ ...programData, categoryId: Number(value) })
              }
              defaultValue={programData.categoryId.toString()}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTimestamp" className="text-right">
              시작 시간
            </Label>
            <Input
              id="startTimestamp"
              type="datetime-local"
              value={programData.startTimestamp}
              onChange={(e) =>
                setProgramData({
                  ...programData,
                  startTimestamp: e.target.value,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTimestamp" className="text-right">
              종료 시간
            </Label>
            <Input
              id="endTimestamp"
              type="datetime-local"
              value={programData.endTimestamp}
              onChange={(e) =>
                setProgramData({ ...programData, endTimestamp: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notificationYn" className="text-right">
              알림 여부
            </Label>
            <Checkbox
              id="notificationYn"
              checked={programData.notificationYn}
              onCheckedChange={(checked) =>
                setProgramData({
                  ...programData,
                  notificationYn: checked as boolean,
                })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button type="button" onClick={handleSubmit}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
