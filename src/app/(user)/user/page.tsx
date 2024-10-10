"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Stamp = ({ size = 48 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <rect width="55" height="55" fill="url(#pattern0_61_208)"/>
        <defs>
            <pattern id="pattern0_61_208" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlinkHref="#image0_61_208" transform="scale(0.0104167)"/>
            </pattern>
            <image id="image0_61_208" width="96" height="96" xlinkHref="data:image/png;base64,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"/>
        </defs>
    </svg>
);

const EmptyStamp = ({ size = 43 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="27.5" cy="27.5" r="25.5" fill="white" />
    </svg>
);

export default function UserPage() {
    const router = useRouter();
    const [hoveredStamp, setHoveredStamp] = useState<number | null>(null);
    
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            router.push("/login");
        }
    }, [router]);
    
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
                    <div className="bg-blue-50 rounded-t-lg p-4 relative">
                        <div className="flex justify-between items-center">
                            {stamps.map((stamp) => (
                                <div 
                                key={stamp.id} 
                                className="relative"
                                onMouseEnter={() => setHoveredStamp(stamp.id)}
                                onMouseLeave={() => setHoveredStamp(null)}
                                onTouchStart={() => setHoveredStamp(stamp.id)}
                                onTouchEnd={() => setHoveredStamp(null)}
                            >
                                {stamp.completed ? <Stamp /> : <EmptyStamp />}
                                    {stamp.completed && hoveredStamp === stamp.id && (
                                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full text-[10px] text-gray-600 whitespace-nowrap">
                                            {stamp.info}
                                        </div>
                                    )}
                            </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-[#CFD9E6] rounded-b-lg p-3 text-center" />
                    <div className="text-center font-bold text-xl mt-8">
                        🎉 &nbsp; 현재 <span className="text-blue-900">62</span>명이 참여중이에요!
                    </div>
                </div>
            </div>

            <div className="my-4 flex items-center">
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