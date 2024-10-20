"use client"

import { useEffect, useState, useTransition } from 'react';
import { verifyEmail } from '@/app/actions/verifyEmail';

export default function VerifyTokenPage() {
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleVerifyEmail = (token: string) => {
    startTransition(async () => {
      try {
        const response = await verifyEmail(token);
        setVerificationStatus('인증 성공');
      } catch (error) {
        setVerificationStatus('인증 실패');
      }
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      handleVerifyEmail(token);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="bg-white p-8 rounded-xl  max-w-md w-full">
        {isPending ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">이메일 인증 중입니다...</p>
          </div>
        ) : verificationStatus === '인증 성공' ? (
          <div className="text-center">
            <svg className="w-16 h-16 text-[#235698] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">인증 성공!</h2>
            <p className="text-lg text-gray-600 mb-6">이메일 인증이 성공적으로 완료되었습니다.</p>
            <button
              onClick={() => window.location.href = '/signin'}
              className="w-full px-6 py-3 bg-[#235698] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              회원가입 페이지로 돌아가기
            </button>
          </div>
        ) : (
          <div className="text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">인증 실패</h2>
            <p className="text-lg text-gray-600 mb-6">인증에 실패했습니다. 다시 시도해주세요.</p>
            <button
              onClick={() => window.location.href = '/signin'}
              className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              회원가입 페이지로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
