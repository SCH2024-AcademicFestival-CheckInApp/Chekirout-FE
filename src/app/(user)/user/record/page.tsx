"use client";

import { useParticipationRecords } from '@/hooks/useParticipationRecords';
import { setupAxiosInterceptors } from '@/lib/axiosInterceptor';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CalendarCheck, Medal } from 'lucide-react';

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

    const formatDateTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <main className="w-full min-h-screen bg-gray-100 pt-[76px] pb-20">
            <div className="px-6 py-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">참여 내역</h1>
                <p className="text-sm text-gray-500 mb-4">참여한 프로그램 내역을 모아보세요</p>
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
                ) : data?.participationRecords.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <CalendarCheck className="w-10 h-10 text-[#235698]" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">앗, 아직 참여한 기록이 없어요!</h3>
                        <p className="text-sm text-gray-500 text-center">프로그램에 참여하면 여기에 기록이 나타나요.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {data?.participationRecords.map((record, index) => (
                            <div 
                                key={index} 
                                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center"
                            >
                                <div className="w-14 h-14 bg-[#235698]/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                    <CalendarCheck className="w-8 h-8 text-[#235698]" />
                                </div>
                                <div className="flex-1">
                                    <span className="inline-block px-2 py-0.5 bg-[#235698]/10 text-[#235698] rounded-full text-xs font-medium mb-1">
                                        {record.categoryName}
                                    </span>
                                    <h2 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                                        {record.programName}
                                    </h2>
                                    <div className="text-xs text-gray-500">
                                        {formatDateTime(record.participationTime)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}