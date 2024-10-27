'use client';

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function EmailVerificationCheck({ setIsEmailVerified }: { setIsEmailVerified: (value: boolean) => void }) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const emailVerified = searchParams.get("emailVerified");
    if (emailVerified === "true") {
      setIsEmailVerified(true);
    }
  }, [searchParams, setIsEmailVerified]);

  return null;
}