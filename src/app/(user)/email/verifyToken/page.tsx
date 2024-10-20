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
    <div>
      {isPending ? (
        <p>이메일 인증 중입니다...</p>
      ) : verificationStatus === '인증 성공' ? (
        <p>이메일 인증이 성공했습니다!</p>
      ) : (
        <p>인증에 실패했습니다. 다시 시도해주세요.</p>
      )}
    </div>
  );
}
