import React from 'react';
import Link from 'next/link';
import { QrCode } from 'lucide-react'; 

const FloatingQRButton: React.FC = () => {
  return (
    <Link href="#" passHref>
      <div className="fixed bottom-0 right-0 z-50 w-full max-w-[480px] mx-auto left-0">
        <div className="relative w-full h-full">
          <button
            className="absolute z-[100] right-4 bottom-16 bg-[#235698] text-white rounded-full p-4 shadow-lg hover:bg-blue-800 transition-colors duration-300"
            aria-label="QR 코드 스캔"
          >
            <QrCode size={28} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default FloatingQRButton;