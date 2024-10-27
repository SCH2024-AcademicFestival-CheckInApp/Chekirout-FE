"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
 Card,
 CardContent,
} from "@/components/ui/card"
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
           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#004098]"></div>
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
       <main className="w-full min-h-screen flex flex-col bg-gray-100 p-4 mt-[60px] mb-[64px]">
           <div className="flex items-center justify-between mb-2">
               <div className="flex flex-col">
                   <h2 className="text-lg font-bold text-[#004098]">스탬프</h2>
               </div>
               <Button
                   variant="ghost"
                   size="sm"
                   onClick={handleRefresh}
                   disabled={isRefreshing}
                   className="p-2 hover:bg-gray-100 rounded-full"
               >
                   <RefreshCw 
                       className={`h-4 w-4 text-[#004098] ${isRefreshing ? 'animate-spin' : ''}`}
                   />
               </Button>
           </div>

           <Card className="mb-8 border-0 rounded-2xl  bg-white shadow-sm">
                <CardContent className="p-6">
                    <div className="bg-white rounded-xl relative">
                        <div className="flex justify-between items-center relative mb-8">
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
                                            ${isCompleted ? 'scale-110 hover:scale-125' : 'scale-100'}
                                            ${hoveredStamp === index ? 'z-10' : 'z-0'}
                                        `}>
                                            {isCompleted ? (
                                                <div className="absolute inset-0 rounded-full transform scale-125" />
                                            ) : (
                                                <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
                                            )}
                                            <div className="relative">
                                                {isCompleted ? <Stamp /> : <EmptyStamp />}
                                            </div>
                                        </div>

                                        {stamp && hoveredStamp === index && (
                                            <div className="absolute z-[200] w-max" style={{
                                                bottom: '-80px',
                                                left: '60%',
                                                transform: 'translateX(-50%)'
                                            }}>
                                                <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-50">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-[#004098] font-bold text-sm tracking-tight">
                                                            {stamp.categoryName}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#004098]/20" />
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
                                                    </div>
                                                </div>
                                                <div className="absolute -top-2 left-1/2 w-2.5 h-2.5 bg-white border-t border-l border-gray-50 transform rotate-45 -translate-x-1/2 shadow-[-3px_-3px_5px_rgba(0,0,0,0.02)]" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="my-6">
                            <div className="flex justify-between items-center mb-3">
                                {completedStamps === totalStamps ? (
                                    <span className="text-sm font-semibold text-[#004098]">
                                        🎉 경품 추첨 대상자
                                    </span>
                                ) : (
                                    <span className="text-sm font-medium text-gray-600">
                                        남은 스탬프 {totalStamps - completedStamps}개
                                    </span>
                                )}
                                <span className="text-base font-bold text-[#004098]">
                                    {completedStamps}/{totalStamps}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-500 ease-out ${
                                        completedStamps === totalStamps
                                            ? 'bg-[#004098]'
                                            : 'bg-[#004098]'
                                    }`}
                                    style={{ width: `${(completedStamps / totalStamps) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            {stampCard === null ? (
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <p className="text-gray-600 text-sm font-medium">
                                        프로그램에 참여해 스탬프를 모아보세요!
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <p className="text-gray-800 text-sm font-medium">
                                        현재 <span className="text-[#004098] font-bold">{completedStamps}개</span>의 스탬프를 모았어요!
                                        {completedStamps === totalStamps && (
                                            <span className="block mt-2 text-xs text-[#004098] font-medium">
                                                축하합니다! 모든 스탬프를 획득하셨어요!
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

           <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-bold text-[#004098]">실시간 학과 순위</h2>
           </div>

           <Card className="bg-white border-0 mb-6 shadow-sm rounded-2xl">
                <CardContent className="p-4">
                    {departmentRanking.map((dept, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border-b last:border-b-0">
                            <div className="flex items-center">
                                <div className={`w-6 mr-3 font-bold ${
                                    index === 0 ? 'text-[#004098]' :
                                    index === 1 ? 'text-[#0052C1]' :
                                    index === 2 ? 'text-[#0065EA]' :
                                    'text-gray-400'
                                }`}>
                                    {index + 1}
                                </div>
                                <div className='text-gray-800 font-medium'>{getDepartmentName(dept.department)}</div>
                            </div>
                            <div className="text-[#004098] font-semibold">{dept.stampCardCount}명</div>
                        </div>
                    ))}
                </CardContent>
            </Card>

           <div className="text-center bg-white rounded-2xl p-6 mb-4 shadow-sm">
              <p className="font-medium text-gray-800">
                 현재 <span className="text-[#004098] font-bold">{totalParticipants}명</span>이 참여중이에요!
              </p>
           </div>
       </main>
   );
}