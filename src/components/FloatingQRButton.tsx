import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import QRScannerModal from './QRScannerModal';
import { handleQRScan } from '@/lib/qrScanHandler';
import { getCurrentPosition } from '@/lib/geolocation';
import { participateInProgram } from '../api/programApi';
import StatusModal from './StatusModal';

const FloatingQRButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleScan = async (result: string) => {
    try {
      const programId = handleQRScan(result);
      
      setStatus('위치 정보 획득 중...');
      const position = await getCurrentPosition();

      setStatus('프로그램 참여 중...');
      const token = localStorage.getItem('accessToken');

      const message = await participateInProgram(programId, position, token);
      setStatus(message);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '오류가 발생했습니다.');
    }
  };

  return (
    <>
      <FloatingButton onClick={() => setIsModalOpen(true)} />
      <QRScannerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setStatus(null);
        }}
        onScan={handleScan}
      />
      <StatusModal status={status} onClose={() => setStatus(null)} />
    </>
  );
};

const FloatingButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="fixed bottom-0 right-0 z-40 w-full max-w-[480px] mx-auto left-0">
    <div className="relative w-full h-full">
      <button
        onClick={onClick}
        className="absolute right-4 bottom-16 bg-[#235698] text-white rounded-full p-4 shadow-lg hover:bg-blue-800 transition-colors duration-300"
        aria-label="QR 코드 스캔하기"
      >
        <QrCode size={28} />
      </button>
    </div>
  </div>
);

export default FloatingQRButton;