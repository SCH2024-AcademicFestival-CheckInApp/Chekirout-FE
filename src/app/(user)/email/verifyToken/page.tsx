"use client";

import { useRouter } from 'next/navigation'; 
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function VerifyTokenPage() {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-email?token=${token}`)
        .then((response) => {
          setVerificationStatus('인증 성공');
          setTimeout(() => {
            router.push('/signup?emailVerified=true');
          }, 1000);
        })
        .catch((error) => {
          console.error(error);
          setVerificationStatus('인증 실패');
        });
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      {verificationStatus === '인증 성공' ? (
        <p className="text-green-500 text-2xl">이메일 인증 성공! 회원가입 페이지로 이동합니다...</p>
      ) : verificationStatus === '인증 실패' ? (
        <p className="text-red-500 text-2xl">인증에 실패했습니다. 다시 시도해주세요.</p>
      ) : (
        <p className="text-gray-500 text-2xl">이메일 인증 중입니다...</p>
      )}
    </div>
  );
}
