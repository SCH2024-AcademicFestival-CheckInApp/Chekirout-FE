import { useState, useEffect } from 'react';

interface StatusModalProps {
  status: string | null;
  onClose: () => void;
  isLoading?: boolean;
}

const StatusModal: React.FC<StatusModalProps> = ({ status, onClose, isLoading = false }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!status && !isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {isLoading || !showContent ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="text-white mt-4">로딩 중...</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg max-w-xs w-full">
          <p className="text-center text-base">{status}</p>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="mt-6 w-[90%] bg-[#235698] text-white p-1.5 rounded hover:bg-blue-600 text-sm"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusModal;