"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // useSearchParams 추가
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField, PasswordField, SelectField } from "@/components/FormField";
import { departments } from "@/constants/constants";
import { SigninSchema, SigninFormData } from "@/schemas/signinSchema";
import { useDebounce } from "@/hooks/useDebounce";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 여부
  const router = useRouter();
  const searchParams = useSearchParams(); // 쿼리 파라미터를 사용하기 위한 Hook
  
  const form = useForm<SigninFormData>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      username: "",
      department: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const debouncedUsername = useDebounce(form.watch("username"), 1000);
  const debouncedEmail = useDebounce(form.watch("email"), 1000);
  const debouncedPassword = useDebounce(form.watch("password"), 500);
  const debouncedConfirmPassword = useDebounce(form.watch("confirmPassword"), 500);

  // 쿼리 파라미터 확인하여 이메일 인증 상태 설정
  useEffect(() => {
    const emailVerified = searchParams.get("emailVerified");
    if (emailVerified === "true") {
      setIsEmailVerified(true);
    }
  }, [searchParams]);

  const validateUsername = useCallback(async (username: string) => {
    if (!username) {
      setUsernameError(null);
      return;
    }
    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/validate-username`,
        {
          params: { username },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setUsernameError(null);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { data } = error.response;
        setUsernameError(data.error || "학번 확인 중 오류가 발생했습니다.");
      } else {
        setUsernameError("학번 확인 중 오류가 발생했습니다.");
      }
    }
  }, []);

  const validateEmail = useCallback(async (email: string) => {
    if (!email) {
      setEmailError(null);
      return;
    }
    try {
      const encodedEmail = encodeURIComponent(email);
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/validate-email?email=${encodedEmail}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setEmailError(null);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setEmailError(error.response.data);
      } else {
        setEmailError("이메일 확인 중 오류가 발생했습니다.");
      }
    }
  }, []);

  const validatePassword = useCallback((password: string) => {
    if (password.length < 6) {
      setPasswordError("비밀번호는 최소 6자 이상이어야 합니다.");
    } else {
      setPasswordError(null);
    }
  }, []);

  const validateConfirmPassword = useCallback((password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmPasswordError(null);
    }
  }, []);

  useEffect(() => {
    validateUsername(debouncedUsername);
  }, [debouncedUsername, validateUsername]);

  useEffect(() => {
    validateEmail(debouncedEmail);
  }, [debouncedEmail, validateEmail]);

  useEffect(() => {
    validatePassword(debouncedPassword);
  }, [debouncedPassword, validatePassword]);

  useEffect(() => {
    validateConfirmPassword(debouncedPassword, debouncedConfirmPassword);
  }, [debouncedPassword, debouncedConfirmPassword, validateConfirmPassword]);

  const handleEmailVerification = async () => {
    const email = form.getValues("email");
    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      return;
    }

    try {
      const encodedEmail = encodeURIComponent(email);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/checkEmail?email=${encodedEmail}`;

      const response = await axios.post(url);

      setIsEmailVerificationSent(true);
      setEmailError(null);
      console.log("인증 이메일이 발송되었습니다.");
    } catch (error) {
      setEmailError("이메일 인증 요청 중 오류가 발생했습니다.");
    }
  };

  async function onSubmit(data: SigninFormData) {
    setIsLoading(true);
    console.log("제출 데이터:", data); 
    try {
      const selectedDepartment = departments.find((dept) => dept.value === data.department);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/signup`,
        {
          username: data.username,
          department: selectedDepartment ? selectedDepartment.value : "",
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );

      if (response.status === 200) {
        console.log("회원가입이 성공적으로 완료되었습니다.");
        alert("회원가입이 성공적으로 완료되었습니다.");
        router.push("/login");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="w-[480px] h-screen flex flex-col items-center bg-white overflow-y-auto">
      <div className="text-center pt-[100px] mb-10">
        <div className="text-5xl font-black text-[#235698]">회원가입</div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[328px] space-y-6 mb-10">
          <TextField control={form.control} name="username" label="학번" placeholder="학번을 입력하세요" error={usernameError} />
          {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}

          <SelectField control={form.control} name="department" label="학과" options={departments} placeholder="학과를 선택하세요" />
          <TextField control={form.control} name="name" label="이름" placeholder="이름을 입력하세요" />

          {!isEmailVerified && (
            <div className="flex flex-col space-y-2">
              <div className="flex items-end space-x-2">
                <div className="flex-grow">
                  <TextField control={form.control} name="email" label="이메일" placeholder="이메일" error={emailError} />
                </div>
                <Button type="button" onClick={handleEmailVerification} className="h-10 px-5 bg-[#235698] text-white font-semibold rounded-lg" disabled={isEmailVerificationSent || !!emailError}>
                  {isEmailVerificationSent ? "발송됨" : "인증"}
                </Button>
              </div>
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            </div>
          )}

           <TextField control={form.control} name="phone" label="휴대폰 번호" placeholder="휴대폰 번호를 입력하세요" />

          <PasswordField control={form.control} name="password" label="비밀번호" placeholder="비밀번호를 입력하세요" error={passwordError} />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

          <PasswordField control={form.control} name="confirmPassword" label="비밀번호 확인" placeholder="비밀번호를 다시 입력하세요" error={confirmPasswordError} />
          {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}

          <Button type="submit" className="w-full h-11 bg-[#235698] text-white font-semibold rounded-lg" disabled={isLoading || !!usernameError || !!emailError || !!passwordError || !!confirmPasswordError || !isEmailVerified}>
            {isLoading ? "처리 중..." : "회원가입"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
