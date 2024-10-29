import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScan }) => {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (isOpen && !scanning) {
      startScanning();
    }
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isOpen]);

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;

      // 스캐너 컨테이너 크기 가져오기
      const container = document.getElementById('reader');
      const width = container?.clientWidth || 250;
      const qrboxSize = Math.floor(width * 0.7);  // 컨테이너 너비의 70%

      const config = {
        fps: 10,
        qrbox: {
          width: qrboxSize,
          height: qrboxSize
        },
        aspectRatio: 1.0
      };

      await scanner.start(
        { facingMode: 'environment' },
        config,
        onScanSuccess,
        onScanFailure
      );
      setScanning(true);
      console.log('QR 스캐너가 성공적으로 시작되었습니다');
    } catch (error) {
      console.error('스캐너 시작 실패:', error);
      alert('카메라를 시작할 수 없습니다. 카메라 권한을 확인해주세요.');
    }
  };

  const onScanSuccess = (decodedText: string) => {
    console.log('QR 코드 스캔 성공:', decodedText);
    onScan(decodedText);
    onClose();
  };

  const onScanFailure = (error: string) => {
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-full max-w-[90vw] mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">QR 코드 스캔하기</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div 
          id="reader" 
          className="w-full aspect-square"
          style={{
            maxWidth: '100%',
            maxHeight: '70vh'
          }}
        ></div>
      </div>
    </div>
  );
};

export default QRScannerModal;