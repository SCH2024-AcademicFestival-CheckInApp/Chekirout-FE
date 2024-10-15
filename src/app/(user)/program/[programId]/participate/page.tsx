"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentPosition } from '@/lib/geolocation';
import { participateInProgram } from '@/api/programApi';

const ProgramParticipationPage = ({ params }: { params: { programId: string } }) => {
  const { programId } = params;
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const participate = async () => {
      try {
        setIsLoading(true);
        setStatus('위치 정보 획득 중...');
        
        const position = await getCurrentPosition();
        
        setStatus('프로그램 참여 중...');
        const token = localStorage.getItem('accessToken');
        const message = await participateInProgram(programId, position, token);
        setStatus(message);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : '오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    participate();
  }, [programId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isLoading ? (
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      ) : (
        <p className="text-center text-lg">{status}</p>
      )}
      <button onClick={() => router.back()} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        돌아가기
      </button>
    </div>
  );
};

export default ProgramParticipationPage;
