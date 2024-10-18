"use client";

import { useParticipationRecords } from '@/hooks/useParticipationRecords';
import { setupAxiosInterceptors } from '@/lib/axiosInterceptor';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserRecordPage() {
    const router = useRouter();
    const { data, isLoading, error } = useParticipationRecords();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            localStorage.removeItem("accessToken");
            router.push("/login");
        } 
        setupAxiosInterceptors(router);
    }, [router]);

    return (
        <main className="w-full min-h-screen flex flex-col p-6 mt-12">
            <div className="flex items-center py-4">
                <div className="text-xl font-bold">🏷️ &nbsp; 참여 내역</div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
                {isLoading ? (
                    <div className="text-center">로딩 중...</div>
                ) : error ? (
                    <div className="text-center text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>
                ) : data?.participationRecords.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-sm">
                        <svg className="w-24 h-24 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <p className="text-lg font-semibold text-gray-700">앗, 아직 참여한 기록이 없어요!</p>
                        <p className="mt-2 text-sm text-gray-500">프로그램에 참여하면 여기에 기록이 나타납니다.</p>
                    </div>
                ) : (
                    data?.participationRecords.map((record, index) => (
                        <div 
                            key={index} 
                            className="w-full h-[120px] rounded-lg flex items-center relative"
                            style={{
                                backgroundImage: "url('/assets/ticket.svg')",
                                backgroundSize: '100% 100%',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center'
                            }}
                        >
                            <div className="flex-1 p-4">
                                <div className="text-lg font-semibold text-[#235698]">{record.categoryName}</div>
                                <div className="text-xs text-gray-600 mt-1">{record.programName}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(record.participationTime).toLocaleString('ko-KR')}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}