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
import { setupAxiosInterceptors } from "@/lib/axiosInterceptor";
import axios from "axios";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserPage() {
   const router = useRouter();
   const [hoveredStamp, setHoveredStamp] = useState<number | null>(null);
   const { data: stampCard, isLoading, error } = useStampCard();
   const [departmentRanking, setDepartmentRanking] = useState<Array<{ department: string; stampCardCount: number }>>([]);
   const [totalParticipants, setTotalParticipants] = useState(0);
   const [isRefreshing, setIsRefreshing] = useState(false);
   
   const fetchDepartmentRanking = async () => {
     try {
       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/stamp-cards/department-cards-ranking`);
       setDepartmentRanking(response.data);
       setTotalParticipants(response.data.reduce((sum: number, dept: { stampCardCount: number }) => sum + dept.stampCardCount, 0));
     } catch (error) {
       console.error("Failed to fetch department ranking:", error);
     }
   };

   useEffect(() => {
     const accessToken = localStorage.getItem("accessToken");
     if (!accessToken) {
         localStorage.removeItem("accessToken");
         router.push("/login");
     } 
     setupAxiosInterceptors(router);
     fetchDepartmentRanking();
   }, [router]);

   const handleRefresh = async () => {
       setIsRefreshing(true);
       try {
           await Promise.all([
               fetchDepartmentRanking(),
               window.location.reload()
           ]);
       } catch (error) {
           console.error("Failed to refresh data:", error);
       } finally {
           setIsRefreshing(false);
       }
   };
 
   if (isLoading) return (
       <div className="flex justify-center items-center h-screen">
           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#235698]"></div>
       </div>
   );
   if (error) return (
       <div className="flex justify-center items-center h-screen">
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
               <strong className="font-bold">오류 발생!</strong>
               <span className="block sm:inline"> {error.message}</span>
           </div>
       </div>
   );

   const totalStamps = 5; 
   const completedStamps = stampCard?.stampCount ?? 0;

   const getDepartmentName = (dept: string) => {
       switch (dept) {
           case 'CSE': return '컴퓨터소프트웨어공학과';
           case 'IoT': return '사물인터넷학과';
           case 'MEDIT': return '의료IT공학과';
           case 'IP': return '정보보호학과';
           case 'AI_BIGDATA': return 'AI빅데이터학과';
           case 'METABUS': return '메타버스&게임학과';
           default: return dept;
       }
   };

   return (
       <main className="w-full min-h-screen flex flex-col p-6 mt-12 ">
           <div className="m-4 flex items-center justify-between">
               <div className="flex items-center">
                   <span className="text-xl mr-2">🕹️</span>
                   <h2 className="text-xl font-bold">스탬프</h2>
               </div>
               <Button
                   variant="ghost"
                   size="sm"
                   onClick={handleRefresh}
                   disabled={isRefreshing}
                   className="p-2 hover:bg-gray-100 rounded-full"
               >
                   <RefreshCw 
                       className={`h-5 w-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`}
                   />
               </Button>
           </div>

           <Card className="mb-10 border-0 shadow-none rounded-2xl overflow-hidden ">
                <CardContent className="p-4 ">
                    <div className="bg-blue-50  rounded-2xl py-8 px-6 shadow-inner relative">
    
                        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 rounded-2xl" />
                        
                        <div className="flex justify-between items-center relative">
                            {[...Array(totalStamps)].map((_, index) => {
                                const stamp = stampCard?.stamps?.[index];
                                const isCompleted = index < completedStamps;
                                return (
                                    <div 
                                        key={index}
                                        className="relative group"
                                        onMouseEnter={() => setHoveredStamp(index)}
                                        onMouseLeave={() => setHoveredStamp(null)}
                                        onTouchStart={() => setHoveredStamp(index)}
                                        onTouchEnd={() => setHoveredStamp(null)}
                                    >
                                        <div className={`
                                            relative transform transition-all duration-300 ease-out
                                            ${isCompleted ? 'scale-100 hover:scale-110' : 'scale-95'}
                                            ${hoveredStamp === index ? 'z-10' : 'z-0'}
                                        `}>

                                            {isCompleted && (
                                                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-md transform scale-110" />
                                            )}
        
                                            <div className="relative">
                                                {isCompleted ? <Stamp /> : <EmptyStamp />}
                                            </div>
                                        </div>

                                
                                        {stamp && hoveredStamp === index && (
                                            <div className="absolute z-20 w-max -bottom-24 left-1/2 transform -translate-x-1/2">
                                                <div className="bg-white px-6 py-3 rounded-xl shadow-lg  backdrop-blur-sm">
                                                    <div className="text-[#235698] font-semibold mb-1">
                                                        {stamp.categoryName}
                                                    </div>
                                                    <div className="text-gray-500 text-xs">
                                                        {new Date(stamp.timestamp).toLocaleString('ko-KR', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false,
                                                            weekday: 'short'
                                                        }).replace(/\s/g, ' ').replace(',', '')}
                                                    </div>
                                                </div>
                                                <div className="absolute -top-2 left-1/2 w-4 h-4 bg-white transform rotate-45 -translate-x-1/2 border-t border-l border-gray-100/50" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                
                    <div className="m-8 ">
                        <div className="flex justify-between items-center mb-2">
                            {completedStamps === totalStamps ? (
                                <span className="text-sm font-medium text-green-600">경품 추첨 대상자에요!</span>
                            ) : (
                                <span className="text-sm font-medium text-gray-600">경품 추첨까지 {totalStamps - completedStamps}개 남았어요!</span>
                            )}
                            <span className="text-sm font-bold text-[#235698]">
                                {completedStamps}/{totalStamps}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ease-in-out ${
                                    completedStamps === totalStamps
                                        ? 'bg-green-500'
                                        : 'bg-gradient-to-r from-[#235698] to-[#4782d3]'
                                }`}
                                style={{ width: `${(completedStamps / totalStamps) * 100}%` }}
                            />
                        </div>
                    </div>

            
                    <div className="mt-10 ">
                        {stampCard === null ? (
                            <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl p-6 backdrop-blur-sm">
                                <p className="text-[#235698] font-semibold text-center">
                                    프로그램에 참여해 스탬프를 모아보세요! ✨
                                </p>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-[#235698] font-semibold text-center">
                                    🎉 &nbsp;현재 <span className="text-blue-900 font-bold text-lg">{completedStamps}</span>개의 스탬프를 모았어요!
                                    {completedStamps === totalStamps && (
                                        <span className="block mt-2 text-sm bg-blue-100/50 rounded-lg py-2">
                                            축하합니다! 모든 스탬프를 획득하셨어요! 
                                        </span>
                                    )}
                                </p>
                            </div>
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
                    {departmentRanking.map((dept, index) => (
                        <div key={index} className="flex justify-between items-center p-2">
                            <div className="flex items-center py-2">
                                <div className="mr-6 text-sm text-blue-800">{index + 1}</div>
                                <div className='text-sm text-gray-600'>{getDepartmentName(dept.department)}</div>
                            </div>
                            <div className="text-sm text-gray-600">{dept.stampCardCount}명</div>
                        </div>
                    ))}
                </CardContent>
            </Card>
           <div className="text-center bg-blue-50 rounded-lg p-4 mx-4 mb-16">
              <p className="font-bold text-lg text-gray-800 ">
                 현재 <span className="text-blue-600">{totalParticipants}</span>명이 참여중이에요!
              </p>
           </div>
       </main>
   );
}