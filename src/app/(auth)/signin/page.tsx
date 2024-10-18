"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField, PasswordField, SelectField } from "@/components/FormField";
import { departments } from "@/constants/constants";
import { SigninSchema, SigninFormData } from "@/schemas/signinSchema";
import { useDebounce } from "@/hooks/useDebounce";

export default function SignupPage() {
  // 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // 라우터 참조
  const router = useRouter();

  // 폼 설정
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

  // useDebounce 훅 사용
  const debouncedUsername = useDebounce(form.watch("username"), 1000);
  const debouncedEmail = useDebounce(form.watch("email"), 1000);

  // 학번 유효성 검사 함수
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
        if (typeof data === "object" && "error" in data) {
          // 객체 형태의 에러 응답 처리
          setUsernameError(data.error);
        } else if (typeof data === "string") {
          // 문자열 형태의 에러 응답 처리
          setUsernameError(data);
        } else {
          // 알 수 없는 형식의 에러 응답
          setUsernameError("학번 확인 중 알 수 없는 오류가 발생했습니다.");
        }
      } else {
        // 네트워크 오류 등 기타 오류
        setUsernameError("학번 확인 중 오류가 발생했습니다.");
      }
    }
  }, []);

  // 이메일 유효성 검사 함수
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
        const errorData = error.response.data;
        setEmailError(errorData);
      } else {
        console.error("이메일 유효성 검사 오류:", error);
        setEmailError("이메일 확인 중 오류가 발생했습니다.");
      }
    }
  }, []);

  // useEffect를 사용하여 디바운스된 값이 변경될 때마다 유효성 검사 실행
  useEffect(() => {
    validateUsername(debouncedUsername);
  }, [debouncedUsername, validateUsername]);

  useEffect(() => {
    validateEmail(debouncedEmail);
  }, [debouncedEmail, validateEmail]);

  // 이메일 인증 요청 처리
  const handleEmailVerification = async () => {
    const email = form.getValues("email");
    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      return;
    }

    try {
      const encodedEmail = encodeURIComponent(email);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/checkEmail?email=${encodedEmail}`;
      console.log("요청 주소:", url);

      const response = await axios.post(url);
      console.log("응답:", response);

      setIsEmailVerificationSent(true);
      setEmailError(null);
      console.log("인증 이메일이 발송되었습니다.");
    } catch (error) {
      console.error("이메일 인증 요청 오류:", error);
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        switch (errorData.code) {
          case 5005:
            setEmailError("인증 메일이 발송되었습니다. 메일을 확인해주세요.");
            setIsEmailVerificationSent(false);
            break;
          case 9999:
            setEmailError(
              "서버 에러가 발생하였습니다. 관리자에게 문의해 주세요."
            );
            setIsEmailVerificationSent(false);
            break;
          default:
            setEmailError(
              errorData.error || "이메일 인증 요청 중 오류가 발생했습니다."
            );
            setIsEmailVerificationSent(false);
        }
      } else {
        setEmailError("이메일 인증 요청 중 오류가 발생했습니다.");
        setIsEmailVerificationSent(false);
      }
    }
  };

  // 회원가입 제출 처리
  async function onSubmit(data: SigninFormData) {
    setIsLoading(true);
    try {
      const selectedDepartment = departments.find(
        (dept) => dept.value === data.department
      );
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
        console.log("이메일 인증으로 넘어갑니다.");
        router.push("/login");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      console.log("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  // 렌더링
  return (
    <main className="w-[480px] h-screen flex flex-col items-center bg-white overflow-y-auto">
      <div className="text-center pt-[100px] mb-10">
        <div className="text-5xl font-black text-[#235698]">회원가입</div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[328px] space-y-6 mb-10">
          <TextField
            control={form.control}
            name="username"
            label="학번"
            placeholder="학번을 입력하세요"
            error={usernameError}
          />
          {usernameError && (
            <p className="text-red-500 text-sm">{usernameError}</p>
          )}
          <SelectField
            control={form.control}
            name="department"
            label="학과"
            options={departments}
            placeholder="학과를 선택하세요"
          />
          <TextField
            control={form.control}
            name="name"
            label="이름"
            placeholder="이름을 입력하세요"
          />
          <div className="flex flex-col space-y-2">
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <TextField
                  control={form.control}
                  name="email"
                  label="이메일"
                  placeholder="이메일"
                  error={emailError}
                />
              </div>
              <Button
                type="button"
                onClick={handleEmailVerification}
                className="h-10 px-5 bg-[#235698] text-white font-semibold rounded-lg whitespace-nowrap"
                disabled={isEmailVerificationSent || !!emailError}>
                {isEmailVerificationSent ? "발송됨" : "인증"}
              </Button>
            </div>
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>
          <PasswordField
            control={form.control}
            name="password"
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
          />
          <PasswordField
            control={form.control}
            name="confirmPassword"
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력하세요"
          />
          <Button
            type="submit"
            className="w-full h-11 bg-[#235698] text-white font-semibold rounded-lg"
            disabled={isLoading || !!usernameError}>
            {isLoading ? "처리 중..." : "회원가입"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
