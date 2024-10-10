import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/api/auth';
import { LoginFormData } from '@/schemas/loginSchema';

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await login(data.username, data.password);
      if (response.status === 200) {
        console.log("로그인 성공");
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        router.push("/home");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      console.log("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
}