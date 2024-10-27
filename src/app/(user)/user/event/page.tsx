"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/login");
    } else {
      fetchPrograms();
    }
  }, [router]);

  const fetchPrograms = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/programs`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', { 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      <main className="w-full min-h-screen bg-gray-100 pt-[76px] pb-20">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">프로그램 일정</h1>
          <p className="text-sm text-gray-500 mb-4">학술제의 모든 프로그램 일정을 확인하세요</p>
        </div>
        <div className="px-6 flex flex-col gap-4">
          {programs.map((program) => (
            <div 
              key={program.id} 
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-300 active:scale-[0.98] hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-[#235698]/10 text-[#235698] rounded-full text-xs font-medium mb-2">
                    {program.categoryName}
                  </span>
                  <h2 className="text-base font-bold text-gray-900 leading-snug">
                    {program.name}
                  </h2>
                </div>
                {/* <button className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button> */}
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {program.description}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2 text-[#235698]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {formatDate(program.startTimestamp)} - {formatDate(program.endTimestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}