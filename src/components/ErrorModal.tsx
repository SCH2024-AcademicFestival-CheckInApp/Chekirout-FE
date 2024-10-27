import { useState, useEffect } from 'react';
import { ErrorAction } from '@/types/error';

interface ErrorModalProps {
  message: string | null;
  actions: ErrorAction[];
  isLoading?: boolean;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ 
  message, 
  actions, 
  isLoading = false 
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message && !isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {isLoading || !showContent ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="text-white mt-4">처리 중...</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
          <p className="text-center text-base whitespace-pre-line mb-6">
            {message}
          </p>
          <div className="space-y-2">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`w-full py-2 px-4 rounded font-semibold text-sm transition-colors ${
                  action.style === 'secondary'
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : action.style === 'danger'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-[#235698] text-white hover:bg-blue-600'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorModal;