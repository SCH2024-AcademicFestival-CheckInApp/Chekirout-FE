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
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <main className="w-full min-h-screen flex flex-col p-6 bg-gray-100 my-12">
      <h1 className="text-xl font-bold text-black mb-6">프로그램 일정</h1>
      <div className="flex flex-col gap-5">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-xl shadow-sm p-5 transition-all duration-300 hover:shadow-lg border border-indigo-100">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-black">{program.name}</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">
                {program.categoryName}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{program.description}</p>
            <div className="text-xs text-gray-800 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(program.startTimestamp)} - {formatDate(program.endTimestamp)}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}