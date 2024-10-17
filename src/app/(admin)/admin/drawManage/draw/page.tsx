"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Gift, Trophy } from "lucide-react";
import axios from "axios";

interface Prize {
  prizeId: number;
  prizeName: string;
}

interface Winner {
  PrizeWinnerId: number;
  winnerName: string;
  studentId: string;
  prizeId: number;
  prizeName: string;
  prizeClaimedAt: string;
}

interface DrawResult {
  prizeId: number;
  prizeName: string;
  winners: Winner[];
}

export default function DrawManagePage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [selectedPrizes, setSelectedPrizes] = useState<number[]>([]);
  const [numberOfWinners, setNumberOfWinners] = useState<number>();
  const [drawResults, setDrawResults] = useState<DrawResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPrizes();
  }, []);

  const fetchPrizes = async () => {
    setIsLoading(true);
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
      setPrizes(response.data);
      setError(null);
    } catch (error) {
      console.error("경품 목록을 가져오는 중 오류 발생:", error);
      setError("경품 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrizeSelection = (prizeId: number) => {
    setSelectedPrizes((prev) =>
      prev.includes(prizeId)
        ? prev.filter((id) => id !== prizeId)
        : [...prev, prizeId]
    );
  };

  const handleDraw = async () => {
    setError(null);
    setDrawResults([]);
    setIsLoading(true);

    for (const prizeId of selectedPrizes) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("인증 토큰이 없습니다.");
        }

        // POST 요청으로 추첨 실행
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/prize-draws/draw?prizeId=${prizeId}&numberOfWinners=${numberOfWinners}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // GET 요청으로 당첨자 목록 조회
        const response = await axios.get<Winner[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/prize-draws/${prizeId}/winners`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.length > 0) {
          setDrawResults((prev) => [
            ...prev,
            {
              prizeId: prizeId,
              prizeName: response.data[0].prizeName,
              winners: response.data,
            },
          ]);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            setError("추첨 대상자가 충분하지 않습니다.");
          } else if (error.response?.status === 404) {
            setError("선택한 경품이 없습니다.");
          } else {
            setError("추첨 중 오류가 발생했습니다.");
          }
        }
        console.error("추첨 중 오류 발생:", error);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">경품 추첨</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <div className="mb-5">
            <label htmlFor="numberOfWinners" className="block mb-2">
              추첨 인원 수
            </label>
            <Input
              id="numberOfWinners"
              type="number"
              min="1"
              value={numberOfWinners}
              placeholder="추첨 인원 수를 입력하세요"
              onChange={(e) => setNumberOfWinners(Number(e.target.value))}
              className="w-full"
            />
          </div>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            onClick={handleDraw}
            disabled={selectedPrizes.length === 0 || isLoading}
            className="w-full">
            {isLoading ? "추첨 중..." : "추첨 시작"}
          </Button>
          <Alert className="mt-6">
            <Trophy className="h-4 w-4" />
            <AlertTitle>당첨자 목록</AlertTitle>
            <AlertDescription>
              {drawResults.map((result, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-semibold">{result.prizeName}</h3>
                  <ul>
                    {result.winners.map((winner, winnerIndex) => (
                      <li key={winnerIndex}>
                        {winner.winnerName} ({winner.studentId})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </AlertDescription>
          </Alert>
        </div>
        <div className="w-full md:w-1/2">
          <div className="mb-2 invisible">.</div>
          <Alert>
            <Gift className="h-4 w-4" />
            <AlertTitle>경품 목록</AlertTitle>
            <AlertDescription>
              {prizes.map((prize) => (
                <div
                  key={prize.prizeId}
                  className="mt-5 flex items-center mb-2">
                  <Checkbox
                    id={`prize-${prize.prizeId}`}
                    checked={selectedPrizes.includes(prize.prizeId)}
                    onCheckedChange={() => handlePrizeSelection(prize.prizeId)}
                  />
                  <label htmlFor={`prize-${prize.prizeId}`} className="ml-2">
                    {prize.prizeName}
                  </label>
                </div>
              ))}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
