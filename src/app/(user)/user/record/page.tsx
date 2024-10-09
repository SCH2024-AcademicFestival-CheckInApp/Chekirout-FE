"use client";

export default function UserRecordPage() {
    const records = [
        { id: 1, title: '전문가 특강', subtitle: '컴퓨터소프트웨어공학과 OO 특강', date: '2024.11.05 14:27' },
        { id: 2, title: '전문가 특강', subtitle: '컴퓨터소프트웨어공학과 OO 특강', date: '2024.11.05 14:27' },
        { id: 3, title: '전문가 특강', subtitle: '컴퓨터소프트웨어공학과 OO 특강', date: '2024.11.05 14:27' },
        { id: 4, title: '전문가 특강', subtitle: '컴퓨터소프트웨어공학과 OO 특강', date: '2024.11.05 14:27' },
    ];

    return (
        <main className="w-full min-h-screen flex flex-col p-6 pt-11">

            <div className="flex items-center py-4">
                <div className="text-xl font-bold">🏷️ &nbsp; 참여 내역</div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
                {records.map((record) => (
                    <div 
                        key={record.id} 
                        className="w-full h-[120px] rounded-lg flex items-center relative"
                        style={{
                            backgroundImage: "url('/assets/ticket.svg')",
                            backgroundSize: '100% 100%',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="flex-1 p-4">
                            <div className="text-lg font-semibold text-[#235698]">{record.title}</div>
                            <div className="text-xs text-gray-600 mt-1">{record.subtitle}</div>
                            <div className="text-xs text-gray-500 mt-1">{record.date}</div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}