"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useCallback, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField, PasswordField, SelectField } from "@/components/FormField";
import { departments } from "@/constants/constants";
import { SigninSchema, SigninFormData } from "@/schemas/signinSchema";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import EmailVerificationCheck from "@/components/EmailVerificationCheck";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const router = useRouter();
  
  const form = useForm<SigninFormData>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      username: "",
      department: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      role: "STUDENT",
    },
  });

  const debouncedUsername = useDebounce(form.watch("username"), 1000);
  const debouncedEmail = useDebounce(form.watch("email"), 1000);
  const debouncedPassword = useDebounce(form.watch("password"), 500);
  const debouncedConfirmPassword = useDebounce(form.watch("confirmPassword"), 500);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    const storedDepartment = localStorage.getItem("department") || "";
    const storedName = localStorage.getItem("name") || "";
    const storedEmail = localStorage.getItem("email") || "";

    form.setValue("username", storedUsername);
    form.setValue("department", storedDepartment);
    form.setValue("name", storedName);
    form.setValue("email", storedEmail);
  }, []);

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

  useEffect(() => {
    const subscription = form.watch((values) => {
      localStorage.setItem("username", values.username || "");
      localStorage.setItem("department", values.department || "");
      localStorage.setItem("name", values.name || "");
      localStorage.setItem("email", values.email || "");
      localStorage.setItem("phone", values.phone || "");
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const savedStartTime = localStorage.getItem("emailVerificationStartTime");
    if (savedStartTime) {
      const elapsedTime = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
      const remainingTime = 300 - elapsedTime;
      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
        setIsEmailVerificationSent(true);
      } else {
        localStorage.removeItem("emailVerificationStartTime");
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => (prev ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = () => {
    setIsEmailVerificationSent(false);
    setTimeLeft(null);
    localStorage.removeItem("emailVerificationStartTime");
  };

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
      
      const currentTime = Date.now();
      localStorage.setItem("emailVerificationStartTime", currentTime.toString()); // 시작 시간 저장
      setTimeLeft(300); 
    } catch (error) {
      setEmailError("이메일 인증 요청 중 오류가 발생했습니다.");
    }
  };

  async function onSubmit(data: SigninFormData) {
    setIsLoading(true);
    try {
      console.log("회원가입 시작:", data);

      const requestBody = {
        username: data.username,
        department: data.department,
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
      };
      console.log("요청 데이터:", requestBody);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/signup`,
        requestBody
      );

      console.log("서버 응답:", response);

      if (response.status === 200) {
        console.log("회원가입 성공:", response.data);
        alert("회원가입이 성공적으로 완료되었습니다.");

        form.reset();
        localStorage.removeItem("username");
        localStorage.removeItem("department");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("phone");

        localStorage.removeItem("emailVerificationStartTime");
        setIsEmailVerificationSent(false);
        setIsEmailVerified(false);
        setTimeLeft(null);
        router.push("/login");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      if (axios.isAxiosError(error)) {
        console.error("에러 상태:", error.response?.status);
        console.error("에러 데이터:", error.response?.data);
      }
    } finally {
      setIsLoading(false);
      console.log("회원가입 프로세스 종료");
    }
  }

  return (
    <main className="w-[480px] h-screen flex flex-col items-center bg-white overflow-y-auto">
      <Suspense fallback={null}>
        <EmailVerificationCheck setIsEmailVerified={setIsEmailVerified} />
      </Suspense>
      <div className="text-center pt-[60px] mb-6">
        <div className="text-4xl font-black text-[#235698]">회원가입</div>
      </div>
      <div className=" text-sm text-gray-600 mb-6">
        이미 가입하셨나요?{" "}
        <Link href="/login" className="text-[#235698] font-semibold hover:underline">
          로그인
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[328px] space-y-6 mb-10">
          <TextField control={form.control} name="username" label="학번" placeholder="학번을 입력하세요" />
          {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}

          <SelectField control={form.control} name="department" label="학과" options={departments} placeholder="학과를 선택하세요" />
          <TextField control={form.control} name="name" label="이름" placeholder="이름을 입력하세요" />

          <div className="flex flex-col space-y-2">
              <div className="flex items-end space-x-2">
                <div className="flex-grow">
                  <TextField control={form.control} name="email" label="순천향대학교 웹메일" placeholder="user@sch.ac.kr" />
                </div>
                <Button type="button" onClick={handleEmailVerification} className="h-10 px-5 bg-[#235698] text-white font-semibold rounded-lg" disabled={isEmailVerificationSent || !!emailError}>
                  {isEmailVerificationSent ? "발송됨" : "인증"}
                </Button>
              </div>
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
              {isEmailVerified ? (
                  <p className="text-green-600 text-sm">이메일 인증이 완료되었습니다.</p>
                ) : (
                  timeLeft !== null && (
                    <div className="flex flex-col p-2 bg-blue-50 rounded-md border border-blue-200">
                      {timeLeft > 0 ? (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-blue-600">
                            인증 링크 만료까지: <span className="font-semibold">{`${Math.floor(timeLeft / 60)}분 ${timeLeft % 60}초`}</span>
                          </p>
                          <Link 
                            href="https://mail.sch.ac.kr" 
                            target="_blank" 
                            className="text-sm text-blue-500 hover:text-blue-700 transition-colors duration-200 flex items-center"
                          >
                            <span>웹메일 확인하기</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-red-500 text-sm">인증 링크가 만료되었습니다.</p>
                          <button onClick={handleResend} className="text-blue-500 text-sm">재전송</button>
                        </div>
                      )}
                    </div>
                  )
                )}
            </div>

           <TextField control={form.control} name="phone" label="휴대폰 번호" placeholder="휴대폰 번호를 입력하세요" />

          <PasswordField control={form.control} name="password" label="비밀번호" placeholder="비밀번호를 입력하세요" />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

          <PasswordField control={form.control} name="confirmPassword" label="비밀번호 확인" placeholder="비밀번호를 다시 입력하세요" />
          {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}

          <Button type="submit"  className="w-full h-11 bg-[#235698] text-white font-semibold rounded-lg" disabled={isLoading || !!usernameError || !!emailError || !!passwordError || !!confirmPasswordError || !isEmailVerified}>
            {isLoading ? "처리 중..." : "회원가입"}
          </Button>
        </form>
      </Form>
    </main>
  );
}