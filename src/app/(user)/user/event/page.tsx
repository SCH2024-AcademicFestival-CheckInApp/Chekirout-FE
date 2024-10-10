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
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/login");
    } else {
      fetchPrograms();
    }
  }, [router]);

  const fetchPrograms = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  const participateInProgram = async () => {
    if (!selectedProgram) return;
    setIsLoading(true);
    setIsParticipating(true);
    setErrorMessage(null);

    try {
      // 현재 위치 가져오기
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const participationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date().toISOString()
      };

      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/programs/${selectedProgram.id}/participate`,
        participationData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      alert('프로그램 참여가 완료되었습니다.');
      closeModal();
    } catch (error) {
      console.error('Error participating in program:', error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.error || '프로그램 참여에 실패했습니다.');
      } else {
        setErrorMessage('프로그램 참여에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsParticipating(false);
      setIsLoading(false);
    }
  };

  const openModal = (program: Program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProgram(null);
    setIsModalOpen(false);
    setErrorMessage(null);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen flex flex-col p-6 bg-gray-100 my-12">
      <h1 className="text-xl font-bold text-black mb-6">프로그램 일정</h1>
      <div className="flex flex-col gap-5">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-xl shadow-sm p-5 transition-all duration-300 hover:shadow-lg border border-indigo-100" onClick={() => openModal(program)}>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-md font-semibold text-black">{program.name}</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {program.categoryName}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{program.description}</p>
            <div className="text-xs text-gray-800 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(program.startTimestamp)} - {formatDate(program.endTimestamp)}
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{selectedProgram.name}</h3>
            <p className="text-gray-600 mb-4">{selectedProgram.description}</p>
            <p className="text-sm text-gray-500 mb-4">
              {formatDate(selectedProgram.startTimestamp)} - {formatDate(selectedProgram.endTimestamp)}
            </p>
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold"></strong>
                <span className="block sm:inline"> {errorMessage}</span>
              </div>
            )}
            <div className="flex justify-end">
              <button 
                className="px-4 py-2 bg-gray-200 rounded mr-2"
                onClick={closeModal}
              >
                {errorMessage ? '닫기' : '취소'}
              </button>
              {!errorMessage && (
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
                  onClick={participateInProgram}
                  disabled={isParticipating}
                >
                  {isParticipating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      처리 중...
                    </>
                  ) : '참여하기'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}