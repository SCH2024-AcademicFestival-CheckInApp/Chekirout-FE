interface StatusModalProps {
    status: string | null;
    onClose: () => void;
  }
  
  const StatusModal: React.FC<StatusModalProps> = ({ status, onClose }) => {
    if (!status) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
      </div>
    );
  };

  export default StatusModal;