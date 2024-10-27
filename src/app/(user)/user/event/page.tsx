"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CalendarCheck, Clock } from 'lucide-react';
import { setupAxiosInterceptors } from '@/lib/axiosInterceptor';

interface Program {
  id: string;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  startTimestamp: string;
  endTimestamp: string;
  notificationYn: boolean;
}

export default function ProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      localStorage.removeItem("accessToken");
      router.push("/login");
    } else {
      setupAxiosInterceptors(router);
      fetchPrograms();
    }
  }, [router]);

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/programs`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
  };

  const groupProgramsByDate = () => {
    const grouped = programs.reduce((acc, program) => {
      const { date } = formatDate(program.startTimestamp);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(program);
      return acc;
    }, {} as Record<string, Program[]>);

    // Sort programs by time within each date
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => 
        new Date(a.startTimestamp).getTime() - new Date(b.startTimestamp).getTime()
      );
    });

    return grouped;
  };

  return (
    <main className="w-full min-h-screen bg-gray-100 pt-[76px] pb-20">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">프로그램 일정</h1>
        <p className="text-sm text-gray-500 mb-4">학술제의 모든 프로그램 일정을 확인하세요</p>
      </div>

      <div className="px-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#235698]"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-gray-600">데이터를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CalendarCheck className="w-10 h-10 text-[#235698]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">등록된 프로그램이 없습니다</h3>
            <p className="text-sm text-gray-500 text-center">곧 새로운 프로그램이 등록될 예정입니다.</p>
          </div>
        ) : (
          Object.entries(groupProgramsByDate()).map(([date, datePrograms]) => (
            <div key={date} className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#235698] rounded-full flex items-center justify-center mr-3">
                  <CalendarCheck className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#235698]">{date}</h2>
              </div>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-4">
                  {datePrograms.map((program) => {
                    const { time } = formatDate(program.startTimestamp);
                    return (
                      <div 
                        key={program.id}
                        className="relative pl-12 pr-4"
                      >
                        <div className="absolute left-4 top-4 w-3 h-3 rounded-full bg-[#235698] z-10"></div>
                        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Clock className="w-4 h-4 mr-1" />
                            {time}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="inline-block px-2 py-0.5 bg-[#235698]/10 text-[#235698] rounded-full text-xs font-medium mb-1">
                                {program.categoryName}
                              </span>
                              <h3 className="font-bold text-gray-900">{program.name}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}