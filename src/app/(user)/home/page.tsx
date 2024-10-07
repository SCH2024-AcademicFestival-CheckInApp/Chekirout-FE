"use client";

import { CheckCircle } from "lucide-react";
import { useState } from "react";

const Stamp = ({ completed, size = 32 }: { completed: boolean; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill={completed ? "#235698" : "#E5E7EB"} />
        <path d="M22.72 12.72a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.97 2.97 5.97-5.97a.75.75 0 0 1 1.06 0z" fill="white" />
    </svg>
);

export default function HomePage() {
    const [hoveredStamp, setHoveredStamp] = useState<number | null>(null);
    
    const stamps = [
        { id: 1, completed: true, info: "전문가 특강" },
        { id: 2, completed: true, info: "전문가 특강" },
        { id: 3, completed: true, info: "전문가 특강" },
        { id: 4, completed: false, info: "전문가 특강" },
        { id: 5, completed: false, info: "전문가 특강" },
    ];
    // 임시 데이터
    const departments = [
        { id: 1, name: '컴퓨터소프트웨어공학과', participants: 216 },
        { id: 2, name: '컴퓨터소프트웨어공학과', participants: 216 },
        { id: 3, name: '컴퓨터소프트웨어공학과', participants: 216 },
        { id: 4, name: '컴퓨터소프트웨어공학과', participants: 216 },
        { id: 5, name: '컴퓨터소프트웨어공학과', participants: 216 },
    ];

    return (
        <main className="w-full min-h-screen flex flex-col p-6">
            <div className="mb-4 flex items-center">
                <span className="text-md mr-2">🕹️</span>
                <h2 className="text-lg font-bold">스탬프</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="p-4">
                    <div className="bg-blue-50 rounded-lg p-4 relative">
                        <div className="flex justify-between items-center mb-8">
                            {stamps.map((stamp) => (
                                <div 
                                key={stamp.id} 
                                className="relative"
                                onMouseEnter={() => setHoveredStamp(stamp.id)}
                                onMouseLeave={() => setHoveredStamp(null)}
                                onTouchStart={() => setHoveredStamp(stamp.id)}
                                onTouchEnd={() => setHoveredStamp(null)}
                            >
                                <Stamp completed={stamp.completed} />
                                    {hoveredStamp === stamp.id && (
                                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full text-[10px] text-gray-600 whitespace-nowrap">
                                            {stamp.info}
                                        </div>
                                    )}
                            </div>
                            ))}
                        </div>
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-100 px-3 py-1 rounded-full text-xs text-blue-600">
                            전문가 특강 11.05 14:21
                        </div>
                    </div>
                    <div className="text-center font-bold text-xl mt-8">
                        🎉 &nbsp; 현재 <span className="text-blue-900">62</span>명이 참여중이에요!
                    </div>
                </div>
            </div>

            <div className="mb-4 flex items-center">
                <span className="text-sm mr-2">🏆</span>
                <h2 className="text-lg font-bold">학과 랭킹</h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
                {departments.map((dept, index) => (
                    <div key={dept.id} className="flex justify-between items-center p-2">
                        <div className="flex items-center py-2">
                            <span className="text-sm mr-4 text-blue-800 w-4">{index + 1}</span>
                            <div className='text-sm text-gray-600'>{dept.name}</div>
                        </div>
                        <div className="text-sm text-gray-600">{dept.participants}명</div>
                    </div>
                ))}
            </div>
        </main>
    );
}