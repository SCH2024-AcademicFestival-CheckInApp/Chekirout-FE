import React, { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import QRScannerModal from './QRScannerModal';
import { handleQRScan } from '@/lib/qrScanHandler';
import { getCurrentPosition } from '@/lib/geolocation';
import { participateInProgram } from '../api/programApi';
import StatusModal from './StatusModal';
import { useRouter } from 'next/router';

const FloatingQRButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const mounted = React.useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
      if (isModalOpen) {
        handleCloseModal();
      }
    };
  }, []);

  const handleCloseModal = async () => {
    try {
      setIsModalOpen(false);
      setStatus(null);
      setIsLoading(false);

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const streams = await navigator.mediaDevices.enumerateDevices();
        streams.forEach(async (device) => {
          if (device.kind === 'videoinput') {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } });
            stream.getTracks().forEach(track => track.stop());
          }
        });
      }
    } catch (error) {
      console.error('Error cleaning up camera resources:', error);
    }
  };

  const handleScan = async (result: string) => {
    if (!mounted.current) return;

    try {
      setIsLoading(true);
      const programId = handleQRScan(result);

      if (!mounted.current) return;
      setStatus('위치 정보 획득 중...');
      const position = await getCurrentPosition();

      if (!mounted.current) return;
      setStatus('프로그램 참여 중...');
      const token = localStorage.getItem('accessToken');

      const message = await participateInProgram(programId, position, token);
      if (mounted.current) {
        setStatus(message);
      }
    } catch (error) {
      if (mounted.current) {
        setStatus(error instanceof Error ? error.message : '오류가 발생했습니다.');
      }
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      if (isModalOpen) {
        handleCloseModal();
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [isModalOpen, router]);

  return (
    <>
      <FloatingButton onClick={() => setIsModalOpen(true)} />
      <QRScannerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onScan={handleScan}
      />
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      <StatusModal status={status} onClose={() => mounted.current && setStatus(null)} />
    </>
  );
};

const FloatingButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="fixed z-[100] bottom-0 right-0 z-40 w-full max-w-[480px] mx-auto left-0">
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