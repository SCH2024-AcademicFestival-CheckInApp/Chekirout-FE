"use client";

import Image from 'next/image';
import { CheckCircle } from "lucide-react";

export default function HomePage() {
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
            <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-2">
                            <CheckCircle className="text-[#235698]" size={24} />
                            <CheckCircle className="text-[#235698]" size={24} />
                            <CheckCircle className="text-[#235698]" size={24} />
                        </div>
                        <span className="text-xs text-gray-500">2024.1.16 12:21</span>
                    </div>
                    <div className="text-center text-lg font-bold text-[#235698]">
                        🎉 현재 62명이 참여중이에요!
                    </div>
                </div>
            </div>

            <div className="mb-4 flex items-center">
                <span className="text-2xl mr-2">🏆</span>
                <h2 className="text-xl font-bold">학과 랭킹</h2>
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