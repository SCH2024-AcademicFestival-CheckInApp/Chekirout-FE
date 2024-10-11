"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useStampCard } from '@/hooks/useStampCard';
import { EmptyStamp, Stamp } from "@/components/Stamp";

export default function UserPage() {
    const departments = [
      { id: 1, name: '컴퓨터소프트웨어공학과', participants: 216 },
      { id: 2, name: '컴퓨터소프트웨어공학과', participants: 216 },
      { id: 3, name: '컴퓨터소프트웨어공학과', participants: 216 },
      { id: 4, name: '컴퓨터소프트웨어공학과', participants: 216 },
      { id: 5, name: '컴퓨터소프트웨어공학과', participants: 216 },
    ];
    const router = useRouter();
    const [hoveredStamp, setHoveredStamp] = useState<number | null>(null);
    const { data: stampCard, isLoading, error } = useStampCard();
    
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            router.push("/login");
        }
    }, [router]);

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#235698]"></div>
        </div>
    );
    if (error) return <div>에러가 발생했습니다: {error.message}</div>;

    const totalStamps = 5; 
    const completedStamps = stampCard?.stampCount ?? 0;

    return (
        <main className="w-full min-h-screen flex flex-col p-6 mt-12">
            <div className="m-4 flex items-center">
                <span className="text-xl mr-2">🕹️</span>
                <h2 className="text-xl font-bold">스탬프</h2>
            </div>

            <Card className="mb-10 border-0 shadow-none">
                <CardContent className="p-4">
                    <div className="bg-blue-50 rounded-t-lg p-4 relative">
                        <div className="flex justify-between items-center">
                            {[...Array(totalStamps)].map((_, index) => {
                                const stamp = stampCard?.stamps?.[index];
                                return (
                                    <div 
                                        key={index}
                                        className="relative"
                                        onMouseEnter={() => setHoveredStamp(index)}
                                        onMouseLeave={() => setHoveredStamp(null)}
                                        onTouchStart={() => setHoveredStamp(index)}
                                        onTouchEnd={() => setHoveredStamp(null)}
                                    >
                                        {index < completedStamps ? <Stamp /> : <EmptyStamp />}
                                        {stamp && hoveredStamp === index && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="absolute flex flex-col items-center -bottom-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full text-[10px] text-gray-600 whitespace-nowrap border border-[#235698]">
                                                            <div>{stamp.categoryName}</div>
                                                            <div>{new Date(stamp.timestamp).toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short' }).replace(/\s/g, ' ').replace(',', '')}</div>
                                                        </div>
                                                    </TooltipTrigger>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="bg-[#CFD9E6] rounded-b-lg p-3 text-center" />
                    <div className="text-center font-bold text-lg mt-8">
                        {stampCard === null ? (
                            "프로그램에 참여해 스탬프를 모아보세요!"
                        ) : (
                            <>🎉 &nbsp; 현재 <span className="text-blue-900">{completedStamps}</span>개의 스탬프를 모았어요!</>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="m-4 flex items-center">
                <span className="text-xl mr-2">🏆</span>
                <h2 className="text-xl font-bold">학과 랭킹</h2>
            </div>

            <Card className="bg-gray-50 border-0 m-4">
                <CardContent className="px-6 py-4">
                    {departments.map((dept, index) => (
                        <div key={dept.id} className="flex justify-between items-center p-2">
                            <div className="flex items-center py-2">
                                <div className="mr-6 text-sm text-blue-800">{index + 1}</div>
                                <div className='text-sm text-gray-600'>{dept.name}</div>
                            </div>
                            <div className="text-sm text-gray-600">{dept.participants}명</div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <div className="text-center font-bold text-lg mt-4">
               🎉 &nbsp; 현재 <span className="text-blue-900">62</span>명이 참여중이에요!
            </div>
        </main>
    );
}