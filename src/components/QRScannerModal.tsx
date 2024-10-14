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
    // console.log('QRScannerModal: isOpen changed', isOpen);
    if (isOpen && !scanning) {
      startScanning();
    }
    return () => {
      if (scannerRef.current) {
        // console.log('QRScannerModal: Stopping scanner');
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isOpen]);

  const startScanning = async () => {
    // console.log('QRScannerModal: Starting scanner'); 
    try {
      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        onScanFailure
      );
      setScanning(true);
      console.log('QRScannerModal: Scanner started successfully'); // 로그 추가
    } catch (error) {
      console.error('Failed to start scanner:', error);
      alert('카메라를 시작할 수 없습니다. 카메라 권한을 확인해주세요.');
    }
  };

  const onScanSuccess = (decodedText: string) => {
    console.log('QRScannerModal: QR code scanned successfully', decodedText); // 로그 추가
    onScan(decodedText);
    onClose();
  };

  const onScanFailure = (error: string) => {
    // console.error('QRScannerModal: QR code scanning failed', error);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">QR 코드 스캔하기</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div id="reader" className="w-full h-64"></div>
      </div>
    </div>
  );
};

export default QRScannerModal;
