import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import QRScannerModal from './QRScannerModal';
import { getCurrentPosition } from '@/lib/geolocation';

const FloatingQRButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleScan = async (result: string) => {
    // console.log('QR 코드 스캔 결과:', result); 
    try {
      const url = new URL(result);
      const programId = url.searchParams.get('programId');

      if (!url.pathname.includes('/check-in') || !programId) {
        throw new Error('유효하지 않은 QR 코드입니다.');
      }

      setStatus('위치 정보 획득 중...');
      const position = await getCurrentPosition();

      setStatus('프로그램 참여 중...');
      const token = localStorage.getItem('accessToken');

      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date().toISOString(),
        token: token,
      };

      const response = await fetch(`/api/programs/${programId}/participate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({
          ...locationData,
        }),
      }); 
      const data = await response.json();

      if (response.ok) {
        setStatus(data.message || '프로그램 참여가 완료되었습니다.');
      } else {
        throw new Error(data.error || '프로그램 참여에 실패했습니다.');
      }
    } catch (error) {
      // console.error('오류 발생:', error); 
      setStatus(error instanceof Error ? error.message : '오류가 발생했습니다.');
    }
  };

  return (
    <>
      <div className="fixed bottom-0 right-0 z-40 w-full max-w-[480px] mx-auto left-0">
        <div className="relative w-full h-full">
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute right-4 bottom-16 bg-[#235698] text-white rounded-full p-4 shadow-lg hover:bg-blue-800 transition-colors duration-300"
            aria-label="QR 코드 스캔하기"
          >
            <QrCode size={28} />
          </button>
        </div>
      </div>
      <QRScannerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setStatus(null);
        }}
        onScan={handleScan}
      />
      {status && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-xs w-full">
            <p className="text-center text-base ">{status}</p>
            <div className="flex justify-center">
              <button
                onClick={() => setStatus(null)}
                className="mt-6 w-[90%] bg-[#235698] text-white p-1.5 rounded hover:bg-blue-600 text-sm"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingQRButton;
