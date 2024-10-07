"use client";

import Image from 'next/image';

export default function UserRecordPage() {
    // 임시 데이터
    const records = [
        { id: 1, title: '전문가 특강', subtitle: '컴퓨터소프트웨어공학과 OO 특강', date: '2024.11.05 14:27' },
        { id: 2, title: '전문가 특강', subtitle: '컴퓨터소프트웨어공학과 OO 특강', date: '2024.11.05 14:27' },
        { id: 3, title: '전문가 특강', subtitle: '컴퓨터소프트웨어공학과 OO 특강', date: '2024.11.05 14:27' },
        { id: 4, title: '전문가 특강', subtitle: '컴퓨터소프트웨어공학과 OO 특강', date: '2024.11.05 14:27' },
    ];

    return (
        <main className="w-full min-h-screen flex flex-col p-6">
            <div className="flex items-center p-4">
                <div className="text-xl font-bold">🏷️ &nbsp; 참여 내역</div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {records.map((record) => (
                    <div 
                        key={record.id} 
                        className="bg-[#F8FAFC] rounded-lg p-4 flex justify-between items-center shadow-sm"
                    >
                        <div>
                            <div className="text-lg font-semibold text-[#235698] mb-2">{record.title}</div>
                            <div className="text-xs text-gray-600">{record.subtitle}</div>
                            <div className="text-xs text-gray-500 mt-1">{record.date}</div>
                        </div>
                        <div className="w-16 h-16 relative">
                            <Image
                                src="/sch-stamp.png"  
                                alt="SCH Stamp"
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}