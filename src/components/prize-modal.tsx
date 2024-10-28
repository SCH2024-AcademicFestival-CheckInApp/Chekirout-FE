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

interface PrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prizeData: PrizeData) => void;
  initialData?: PrizeData;
  mode: "add" | "edit";
}

export interface PrizeData {
  prizeId?: number;
  prizeName: string;
  prizeClaimType: string;
}

export function PrizeModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: PrizeModalProps) {
  const [prizeData, setPrizeData] = useState<PrizeData>({
    prizeId: initialData?.prizeId || undefined,
    prizeName: initialData?.prizeName || "",
    prizeClaimType: initialData?.prizeClaimType || "SINGLE_CLAIM",
  });

  useEffect(() => {
    if (initialData) {
      setPrizeData(initialData);
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit(prizeData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "경품 추가" : "경품 수정"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prizeId" className="text-right">
              경품 ID
            </Label>
            <Input
              id="prizeId"
              value={prizeData.prizeId || ""}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prizeName" className="text-right">
              경품 이름
            </Label>
            <Input
              id="prizeName"
              value={prizeData.prizeName}
              onChange={(e) =>
                setPrizeData({ ...prizeData, prizeName: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prizeClaimType" className="text-right">
              수령 유형
            </Label>
            <Select
              onValueChange={(value) =>
                setPrizeData({ ...prizeData, prizeClaimType: value })
              }
              defaultValue={prizeData.prizeClaimType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="수령 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE_CLAIM">단일 수령</SelectItem>
                <SelectItem value="MULTIPLE_CLAIM">다중 수령</SelectItem>
              </SelectContent>
            </Select>
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
